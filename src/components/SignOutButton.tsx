"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-red-400"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
