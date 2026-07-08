import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import { formatMoney, activeStatuses, paidStatuses } from "@/lib/validations";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const [total, active, urgent, pendingPayment, recent, revenueByCurrency] = await Promise.all([
    prisma.commission.count(),
    prisma.commission.count({ where: { status: { in: [...activeStatuses] } } }),
    prisma.commission.count({ where: { urgent: true, status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.commission.count({ where: { status: "WAITING_FOR_PAYMENT" } }),
    prisma.commission.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.commission.groupBy({
      by: ["currency"],
      where: { status: { in: [...paidStatuses] } },
      _sum: { amount: true },
    }),
  ]);

  const revenueMap = { EUR: 0, USD: 0, ROBUX: 0 } as Record<"EUR" | "USD" | "ROBUX", number>;
  for (const row of revenueByCurrency) {
    revenueMap[row.currency] = row._sum.amount ?? 0;
  }

  const topStats = [
    { label: "Total Orders", value: total },
    { label: "Active Orders", value: active },
    { label: "Urgent Orders", value: urgent },
    { label: "Pending Payments", value: pendingPayment },
  ];

  const revenueStats = [
    { label: "Total € Revenue", value: formatMoney(revenueMap.EUR, "EUR") },
    { label: "Total $ Revenue", value: formatMoney(revenueMap.USD, "USD") },
    { label: "Total Robux Revenue", value: formatMoney(revenueMap.ROBUX, "ROBUX") },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-zinc-500">A snapshot of your commission pipeline.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {topStats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {revenueStats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Recent commissions</h2>
        <Link
          href="/dashboard/commissions"
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
        >
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Urgent</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((c) => (
              <tr key={c.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/commissions/${c.id}`} className="hover:underline">
                    {c.projectName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-400">{c.discordUser}</td>
                <td className="px-4 py-3 text-zinc-400">{formatMoney(c.amount, c.currency)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3">
                  {c.urgent ? <span className="text-red-400">Yes</span> : "—"}
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  No commissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
