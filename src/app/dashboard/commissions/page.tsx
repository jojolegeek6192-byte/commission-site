"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { commissionStatuses, statusLabels, formatMoney, type currencies } from "@/lib/validations";

type Commission = {
  id: string;
  projectName: string;
  discordUser: string;
  amount: number;
  currency: (typeof currencies)[number];
  status: (typeof commissionStatuses)[number];
  urgent: boolean;
  deadline: string;
  createdAt: string;
};

export default function CommissionsListPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [urgentOnly, setUrgentOnly] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (urgentOnly) params.set("urgent", "true");
    const res = await fetch(`/api/commissions?${params.toString()}`);
    const data = await res.json();
    setCommissions(data.commissions || []);
    setLoading(false);
  }, [q, status, urgentOnly]);

  useEffect(() => {
    const t = setTimeout(fetchData, 250); // debounce search
    return () => clearTimeout(t);
  }, [fetchData]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold">Commissions</h1>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by project or client…"
            className="input pl-9"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input sm:w-56">
          <option value="">All statuses</option>
          {commissionStatuses.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 whitespace-nowrap text-sm text-zinc-400">
          <input
            type="checkbox"
            checked={urgentOnly}
            onChange={(e) => setUrgentOnly(e.target.checked)}
            className="h-4 w-4 accent-white"
          />
          Urgent only
        </label>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-bg-soft text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Urgent</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => (
                <tr key={c.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/commissions/${c.id}`} className="hover:underline">
                      {c.projectName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{c.discordUser}</td>
                  <td className="px-4 py-3 text-zinc-400">{formatMoney(c.amount, c.currency)}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(c.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3">
                    {c.urgent ? <span className="text-red-400">Yes</span> : "—"}
                  </td>
                </tr>
              ))}
              {commissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                    No commissions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
