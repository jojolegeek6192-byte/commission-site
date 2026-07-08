import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "OWNER") redirect("/dashboard");

  const clients = await prisma.client.findMany({
    include: { _count: { select: { commissions: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Clients</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Clients are created automatically when you link a commission to one, or manually below.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Discord</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Commissions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-t border-white/5">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-zinc-400">{c.discordUser || "—"}</td>
                <td className="px-4 py-3 text-zinc-400">{c.email || "—"}</td>
                <td className="px-4 py-3 text-zinc-400">{c._count.commissions}</td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-zinc-500">
                  <Users2 className="mx-auto mb-2 h-6 w-6 opacity-40" />
                  No clients recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
