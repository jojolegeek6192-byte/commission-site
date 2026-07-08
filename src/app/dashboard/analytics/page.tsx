import { prisma } from "@/lib/prisma";
import { paidStatuses, statusLabels, commissionStatuses } from "@/lib/validations";
import AnalyticsCharts from "./AnalyticsCharts";

export const dynamic = "force-dynamic";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export default async function AnalyticsPage() {
  const commissions = await prisma.commission.findMany({
    select: { createdAt: true, updatedAt: true, amount: true, currency: true, status: true },
  });

  // Build the last 12 month buckets, oldest first.
  const now = new Date();
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthKey(d));
  }

  const ordersPerMonth = months.map((key) => ({
    month: monthLabel(key),
    orders: commissions.filter((c) => monthKey(c.createdAt) === key).length,
  }));

  const revenuePerMonth = months.map((key) => {
    const inMonth = commissions.filter(
      (c) => monthKey(c.updatedAt) === key && (paidStatuses as readonly string[]).includes(c.status)
    );
    return {
      month: monthLabel(key),
      EUR: inMonth.filter((c) => c.currency === "EUR").reduce((s, c) => s + c.amount, 0),
      USD: inMonth.filter((c) => c.currency === "USD").reduce((s, c) => s + c.amount, 0),
      ROBUX: inMonth.filter((c) => c.currency === "ROBUX").reduce((s, c) => s + c.amount, 0),
    };
  });

  // Cumulative revenue trend (running total), one series per currency.
  let runningEUR = 0;
  let runningUSD = 0;
  let runningROBUX = 0;
  const revenueTrend = revenuePerMonth.map((m) => {
    runningEUR += m.EUR;
    runningUSD += m.USD;
    runningROBUX += m.ROBUX;
    return { month: m.month, EUR: runningEUR, USD: runningUSD, ROBUX: runningROBUX };
  });

  const currencyCounts = { EUR: 0, USD: 0, ROBUX: 0 };
  for (const c of commissions) currencyCounts[c.currency]++;
  const currencyDistribution = (["EUR", "USD", "ROBUX"] as const)
    .map((c) => ({ name: c, value: currencyCounts[c] }))
    .filter((d) => d.value > 0);

  const statusCounts: Record<string, number> = {};
  for (const s of commissionStatuses) statusCounts[s] = 0;
  for (const c of commissions) statusCounts[c.status]++;
  const statusDistribution = commissionStatuses
    .map((s) => ({ name: statusLabels[s], value: statusCounts[s] }))
    .filter((d) => d.value > 0);

  const hasData = commissions.length > 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Analytics</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Order volume, revenue trends, and commission mix over the last 12 months.
      </p>

      {!hasData ? (
        <div className="mt-10 rounded-2xl border border-white/10 p-10 text-center text-zinc-500">
          Not enough data yet — charts will fill in as commissions come through.
        </div>
      ) : (
        <AnalyticsCharts
          ordersPerMonth={ordersPerMonth}
          revenuePerMonth={revenuePerMonth}
          revenueTrend={revenueTrend}
          currencyDistribution={currencyDistribution}
          statusDistribution={statusDistribution}
        />
      )}
    </div>
  );
}
