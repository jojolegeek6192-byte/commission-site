import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import CommissionDetailClient from "./CommissionDetailClient";

export const dynamic = "force-dynamic";

export default async function CommissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, commission] = await Promise.all([
    auth(),
    prisma.commission.findUnique({ where: { id } }),
  ]);

  if (!commission) notFound();

  const role = (session?.user as any)?.role as "OWNER" | "MANAGER";

  return (
    <CommissionDetailClient
      commission={{
        ...commission,
        deadline: commission.deadline.toISOString(),
        createdAt: commission.createdAt.toISOString(),
        referenceUrls: JSON.parse(commission.referenceUrls || "[]"),
      }}
      role={role}
    />
  );
}
