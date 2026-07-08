"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { statusLabels, formatMoney, type commissionStatuses, type currencies } from "@/lib/validations";

type Commission = {
  id: string;
  projectName: string;
  discordUser: string;
  amount: number;
  currency: (typeof currencies)[number];
  status: (typeof commissionStatuses)[number];
  urgent: boolean;
  deadline: string;
};

type ViewMode = "month" | "week" | "day";

// Color legend: Green = Completed, Yellow = In Progress, Red = Urgent,
// Gray = Not Started, Blue = Waiting For Payment. Paid gets its own teal
// dot so it's distinguishable from Completed; Cancelled fades to muted gray.
function dotColor(c: Commission) {
  if (c.urgent && c.status !== "COMPLETED" && c.status !== "CANCELLED") return "bg-red-500";
  switch (c.status) {
    case "NOT_STARTED":
      return "bg-zinc-400";
    case "IN_PROGRESS":
      return "bg-amber-400";
    case "WAITING_FOR_PAYMENT":
      return "bg-blue-400";
    case "PAID":
      return "bg-teal-400";
    case "COMPLETED":
      return "bg-emerald-400";
    case "CANCELLED":
      return "bg-zinc-700";
  }
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState(new Date());

  useEffect(() => {
    fetch("/api/commissions")
      .then((r) => r.json())
      .then((d) => setCommissions(d.commissions || []))
      .finally(() => setLoading(false));
  }, []);

  const byDeadline = useMemo(() => {
    return (date: Date) => commissions.filter((c) => sameDay(new Date(c.deadline), date));
  }, [commissions]);

  function navigate(delta: number) {
    const next = new Date(cursor);
    if (view === "month") next.setMonth(cursor.getMonth() + delta);
    if (view === "week") next.setDate(cursor.getDate() + delta * 7);
    if (view === "day") next.setDate(cursor.getDate() + delta);
    setCursor(next);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Calendar</h1>
          <p className="mt-1 text-sm text-zinc-500">Deadlines, active work, and workload at a glance.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-full border border-white/15 p-1">
            {(["month", "week", "day"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-3 py-1 text-xs capitalize transition ${
                  view === v ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => navigate(-1)} className="rounded-full border border-white/15 p-2 hover:border-white/40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setCursor(new Date())} className="rounded-full border border-white/15 px-3 py-1.5 text-xs hover:border-white/40">
              Today
            </button>
            <button onClick={() => navigate(1)} className="rounded-full border border-white/15 p-2 hover:border-white/40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
        <Legend color="bg-zinc-400" label="Not Started" />
        <Legend color="bg-amber-400" label="In Progress" />
        <Legend color="bg-blue-400" label="Waiting For Payment" />
        <Legend color="bg-teal-400" label="Paid" />
        <Legend color="bg-emerald-400" label="Completed" />
        <Legend color="bg-red-500" label="Urgent" />
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : view === "month" ? (
        <MonthView cursor={cursor} byDeadline={byDeadline} />
      ) : view === "week" ? (
        <WeekView cursor={cursor} byDeadline={byDeadline} />
      ) : (
        <DayView cursor={cursor} byDeadline={byDeadline} />
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function MonthView({
  cursor,
  byDeadline,
}: {
  cursor: Date;
  byDeadline: (d: Date) => Commission[];
}) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells: (Date | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="mt-6">
      <p className="mb-3 font-display text-lg font-semibold">
        {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="bg-bg-soft px-2 py-2 text-center text-xs text-zinc-500">
            {d}
          </div>
        ))}
        {cells.map((date, i) => {
          const items = date ? byDeadline(date) : [];
          const isToday = date && sameDay(date, today);
          return (
            <div key={i} className="min-h-[92px] bg-bg-card p-2 sm:min-h-[110px]">
              {date && (
                <>
                  <p className={`text-xs ${isToday ? "font-bold text-white" : "text-zinc-500"}`}>
                    {date.getDate()}
                  </p>
                  <div className="mt-1.5 space-y-1">
                    {items.slice(0, 3).map((c) => (
                      <Link
                        key={c.id}
                        href={`/dashboard/commissions/${c.id}`}
                        className="flex items-center gap-1.5 truncate rounded px-1 py-0.5 text-[11px] text-zinc-300 hover:bg-white/5"
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor(c)}`} />
                        <span className="truncate">{c.projectName}</span>
                      </Link>
                    ))}
                    {items.length > 3 && (
                      <p className="px-1 text-[11px] text-zinc-600">+{items.length - 3} more</p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  cursor,
  byDeadline,
}: {
  cursor: Date;
  byDeadline: (d: Date) => Commission[];
}) {
  const start = new Date(cursor);
  start.setDate(cursor.getDate() - cursor.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const today = new Date();

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-7">
      {days.map((date) => {
        const items = byDeadline(date);
        const isToday = sameDay(date, today);
        return (
          <div key={date.toISOString()} className="glass rounded-2xl p-4">
            <p className={`text-xs ${isToday ? "font-bold text-white" : "text-zinc-500"}`}>
              {date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
            </p>
            <div className="mt-3 space-y-2">
              {items.length === 0 && <p className="text-xs text-zinc-600">Nothing due</p>}
              {items.map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/commissions/${c.id}`}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-2 py-1.5 text-xs hover:border-white/30"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor(c)}`} />
                  <span className="truncate">{c.projectName}</span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayView({
  cursor,
  byDeadline,
}: {
  cursor: Date;
  byDeadline: (d: Date) => Commission[];
}) {
  const items = byDeadline(cursor);

  return (
    <div className="mt-6">
      <p className="mb-4 font-display text-lg font-semibold">
        {cursor.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </p>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-10 text-center text-zinc-500">
          Nothing due on this day.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/commissions/${c.id}`}
              className="glass flex items-center justify-between rounded-2xl p-4 hover:border-white/30"
            >
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor(c)}`} />
                <div>
                  <p className="font-medium">{c.projectName}</p>
                  <p className="text-xs text-zinc-500">
                    {c.discordUser} · {statusLabels[c.status]}
                    {c.urgent ? " · Urgent" : ""}
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-400">{formatMoney(c.amount, c.currency)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
