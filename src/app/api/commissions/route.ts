import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { commissionFormSchema } from "@/lib/validations";
import { notifyDiscord, notifyEmail } from "@/lib/notify";

// Extremely small in-memory limiter so the public form can't be spammed.
// Keyed by IP; resets every minute. Good enough for a single-instance/edge
// deploy; swap for Upstash Ratelimit if you outgrow it.
const submissions = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = submissions.get(ip);
  if (!entry || now > entry.resetAt) {
    submissions.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 3; // 3 submissions per minute per IP
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a minute." },
      { status: 429 }
    );
  }

  const json = await req.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = commissionFormSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const commission = await prisma.commission.create({
    data: {
      projectName: data.projectName,
      discordUser: data.discordUser,
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      deadline: new Date(data.deadline),
      urgent: data.urgent,
      notes: data.notes || null,
      referenceUrls: JSON.stringify(data.referenceUrls ?? []),
      status: "NOT_STARTED",
    },
  });

  // Fire notifications without blocking the response
  void notifyDiscord(commission);
  void notifyEmail(commission);

  return NextResponse.json({ id: commission.id }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") || undefined;
  const urgent = searchParams.get("urgent");
  const search = searchParams.get("q") || undefined;

  const commissions = await prisma.commission.findMany({
    where: {
      status: status ? (status as any) : undefined,
      urgent: urgent ? urgent === "true" : undefined,
      OR: search
        ? [
            { projectName: { contains: search } },
            { discordUser: { contains: search } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ commissions });
}
