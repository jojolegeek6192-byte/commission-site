import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { commissionUpdateSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const parsed = commissionUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const role = (session.user as any).role as "OWNER" | "MANAGER";
  const data = parsed.data;

  // Managers may only update status-adjacent fields on pending commissions;
  // owners can edit anything at any time.
  if (role === "MANAGER") {
    const existing = await prisma.commission.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.status !== "NOT_STARTED" && existing.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "Managers can only edit commissions that are Not Started or In Progress" },
        { status: 403 }
      );
    }
  }

  const updated = await prisma.commission.update({
    where: { id },
    data: {
      ...(data.status && { status: data.status }),
      ...(data.projectName && { projectName: data.projectName }),
      ...(data.description && { description: data.description }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.currency && { currency: data.currency }),
      ...(data.deadline && { deadline: new Date(data.deadline) }),
      ...(data.urgent !== undefined && { urgent: data.urgent }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });

  return NextResponse.json({ commission: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = (session?.user as any)?.role as "OWNER" | "MANAGER" | undefined;

  if (!session?.user || role !== "OWNER") {
    return NextResponse.json(
      { error: "Only the owner can delete commissions" },
      { status: 403 }
    );
  }

  const { id } = await params;
  await prisma.commission.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
