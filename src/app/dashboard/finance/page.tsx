import { prisma } from "@/lib/prisma";
import { formatMoney, potentialStatuses, paidStatuses, currencies } from "@/lib/validations";
import { Wallet, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

type CurrencyKey = (typeof currencies)[number];

function emptyMap(): Record<CurrencyKey, number> {
  return { EUR: 0, USD: 0, ROBUX: 0 };
}

async function sumByCurrency(where: any) {
  const rows = await prisma.commission.groupBy({
    by: ["currency"],
    where,
    _sum: { amount: true },
  });
  const map = emptyMap();
  for (const row of rows) map[row.currency] = row._sum.amount ?? 0;
  return map;
}

export default async function FinancePage() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [potential, completed, weekly, monthly, yearly, lifetime] = await Promise.all([
    sumByCurrency({ status: { in: [...potentialStatuses] } }),
    sumByCurrency({ status: { in: [...paidStatuses] } }),
    sumByCurrency({ status: { in: [...paidStatuses] }, updatedAt: { gte: startOfWeek } }),
    sumByCurrency({ status: { in: [...paidStatuses] }, updatedAt: { gte: startOfMonth } }),
    sumByCurrency({ status: { in: [...paidStatuses] }, updatedAt: { gte: startOfYear } }),
    sumByCurrency({ status: { in: [...paidStatuses] } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Finance</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Potential vs. received revenue, broken down by currency and period.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <RevenueCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Current Potential Revenue"
          subtitle="Total value of all active commissions (not yet paid)"
          values={potential}
        />
        <RevenueCard
          icon={<Wallet className="h-5 w-5" />}
          title="Completed Revenue"
          subtitle="Total earnings already received"
          values={completed}
        />
      </div>

      <h2 className="mt-12 font-display text-lg font-semibold">Revenue statistics</h2>
      <p className="mt-1 text-sm text-zinc-500">Received revenue over different time windows.</p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Period</th>
              {currencies.map((c) => (
                <th key={c} className="px-4 py-3">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <PeriodRow label="This week" values={weekly} />
            <PeriodRow label="This month" values={monthly} />
            <PeriodRow label="This year" values={yearly} />
            <PeriodRow label="Lifetime" values={lifetime} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RevenueCard({
  icon,
  title,
  subtitle,
  values,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  values: Record<CurrencyKey, number>;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 text-zinc-400">
        {icon}
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {currencies.map((c) => (
          <div key={c}>
            <p className="text-xl font-bold">{formatMoney(values[c], c)}</p>
            <p className="mt-1 text-xs text-zinc-500">{c}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PeriodRow({ label, values }: { label: string; values: Record<CurrencyKey, number> }) {
  return (
    <tr className="border-t border-white/10">
      <td className="px-4 py-3 font-medium">{label}</td>
      {currencies.map((c) => (
        <td key={c} className="px-4 py-3 text-zinc-400">
          {formatMoney(values[c], c)}
        </td>
      ))}
    </tr>
  );
}
