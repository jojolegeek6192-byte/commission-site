"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Loader2, AlertTriangle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { commissionStatuses, statusLabels, formatMoney, type currencies } from "@/lib/validations";

type Props = {
  commission: {
    id: string;
    projectName: string;
    discordUser: string;
    description: string;
    amount: number;
    currency: (typeof currencies)[number];
    status: (typeof commissionStatuses)[number];
    urgent: boolean;
    notes: string | null;
    deadline: string;
    createdAt: string;
    referenceUrls: string[];
  };
  role: "OWNER" | "MANAGER";
};

export default function CommissionDetailClient({ commission, role }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(commission.status);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(next: (typeof commissionStatuses)[number]) {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/commissions/${commission.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to update status");
      return;
    }
    setStatus(next);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this commission permanently? This cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/commissions/${commission.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to delete");
      return;
    }
    router.push("/dashboard/commissions");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard/commissions"
        className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to commissions
      </Link>

      <div className="glass rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold">{commission.projectName}</h1>
              {commission.urgent && (
                <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs text-red-300">
                  <AlertTriangle className="h-3 w-3" /> Urgent
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Submitted {new Date(commission.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <Info label="Discord" value={commission.discordUser} />
          <Info label="Amount" value={formatMoney(commission.amount, commission.currency)} />
          <Info label="Deadline" value={new Date(commission.deadline).toLocaleDateString()} />
        </dl>

        <div className="mt-6">
          <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Description</p>
          <p className="whitespace-pre-wrap text-sm text-zinc-300">{commission.description}</p>
        </div>

        {commission.notes && (
          <div className="mt-6">
            <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Additional notes</p>
            <p className="whitespace-pre-wrap text-sm text-zinc-300">{commission.notes}</p>
          </div>
        )}

        {commission.referenceUrls.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">References</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {commission.referenceUrls.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="aspect-square overflow-hidden rounded-lg border border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">Update status</p>
          <div className="flex flex-wrap gap-2">
            {commissionStatuses.map((s) => (
              <button
                key={s}
                disabled={saving || s === status}
                onClick={() => updateStatus(s)}
                className={`rounded-full px-4 py-1.5 text-xs transition disabled:opacity-40 ${
                  s === status
                    ? "bg-white text-black"
                    : "border border-white/15 text-zinc-400 hover:border-white/40"
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>

        {role === "OWNER" && (
          <div className="mt-8 border-t border-white/10 pt-6">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete commission
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
