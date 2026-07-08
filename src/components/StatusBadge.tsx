import { statusLabels, commissionStatuses } from "@/lib/validations";

// Matches the calendar color legend: Gray = Not Started, Yellow = In
// Progress, Blue = Waiting For Payment, Paid gets its own teal tone,
// Green = Completed, Cancelled = muted red.
const colors: Record<(typeof commissionStatuses)[number], string> = {
  NOT_STARTED: "bg-zinc-500/15 text-zinc-300",
  IN_PROGRESS: "bg-amber-500/15 text-amber-300",
  WAITING_FOR_PAYMENT: "bg-blue-500/15 text-blue-300",
  PAID: "bg-teal-500/15 text-teal-300",
  COMPLETED: "bg-emerald-500/15 text-emerald-300",
  CANCELLED: "bg-red-500/15 text-red-300",
};

export default function StatusBadge({
  status,
}: {
  status: (typeof commissionStatuses)[number];
}) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${colors[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
