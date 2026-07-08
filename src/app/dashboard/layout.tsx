import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LayoutDashboard, ListChecks, Users2, Hammer, Wallet, BarChart3, CalendarDays } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role as "OWNER" | "MANAGER";

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-bg-soft p-6 md:flex">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <Hammer className="h-5 w-5" />
          JojoLeGeek
        </Link>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          <NavLink href="/dashboard" icon={LayoutDashboard}>
            Overview
          </NavLink>
          <NavLink href="/dashboard/commissions" icon={ListChecks}>
            Commissions
          </NavLink>
          <NavLink href="/dashboard/finance" icon={Wallet}>
            Finance
          </NavLink>
          <NavLink href="/dashboard/analytics" icon={BarChart3}>
            Analytics
          </NavLink>
          <NavLink href="/dashboard/calendar" icon={CalendarDays}>
            Calendar
          </NavLink>
          {role === "OWNER" && (
            <NavLink href="/dashboard/clients" icon={Users2}>
              Clients
            </NavLink>
          )}
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>{session.user.name}</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-white">{role}</span>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
