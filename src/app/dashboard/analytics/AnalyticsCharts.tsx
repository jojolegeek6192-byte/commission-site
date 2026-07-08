"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Grayscale-only palette to stay on-brand (no blue/purple/colorful gradients).
const GRAYS = ["#ffffff", "#a1a1aa", "#525252", "#e4e4e7", "#71717a", "#27272a"];

const tooltipStyle = {
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  fontSize: 12,
  color: "#f4f4f5",
};

type Props = {
  ordersPerMonth: { month: string; orders: number }[];
  revenuePerMonth: { month: string; EUR: number; USD: number; ROBUX: number }[];
  revenueTrend: { month: string; EUR: number; USD: number; ROBUX: number }[];
  currencyDistribution: { name: string; value: number }[];
  statusDistribution: { name: string; value: number }[];
};

export default function AnalyticsCharts({
  ordersPerMonth,
  revenuePerMonth,
  revenueTrend,
  currencyDistribution,
  statusDistribution,
}: Props) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <ChartCard title="Orders Per Month" subtitle="Commissions created, last 12 months">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={ordersPerMonth}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="orders" stroke="#ffffff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Revenue Per Month" subtitle="Received revenue by currency">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenuePerMonth}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />
            <Bar dataKey="EUR" fill="#ffffff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="USD" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ROBUX" fill="#525252" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Currency Distribution" subtitle="Share of commissions by currency">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={currencyDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
            >
              {currencyDistribution.map((_, i) => (
                <Cell key={i} fill={GRAYS[i % GRAYS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Commission Status Distribution" subtitle="Where commissions stand right now">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={statusDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
            >
              {statusDistribution.map((_, i) => (
                <Cell key={i} fill={GRAYS[i % GRAYS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Revenue Trends"
        subtitle="Cumulative revenue over time, by currency"
        className="lg:col-span-2"
      >
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueTrend}>
            <defs>
              <linearGradient id="fillEUR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillUSD" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillROBUX" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#525252" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#525252" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />
            <Area type="monotone" dataKey="EUR" stroke="#ffffff" fill="url(#fillEUR)" strokeWidth={2} />
            <Area type="monotone" dataKey="USD" stroke="#a1a1aa" fill="url(#fillUSD)" strokeWidth={2} />
            <Area type="monotone" dataKey="ROBUX" stroke="#525252" fill="url(#fillROBUX)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <p className="font-display text-sm font-semibold">{title}</p>
      <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
