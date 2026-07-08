"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Hammer, LogIn } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <Hammer className="h-5 w-5" />
          JojoLeGeek
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors hover:text-white ${
                pathname === l.href ? "text-white" : "text-zinc-400"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <LogIn className="h-3.5 w-3.5" />
            Login
          </Link>
          <Link
            href="/order"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Order Now
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-zinc-400 hover:text-white">
                {l.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Link>
            <Link
              href="/order"
              onClick={() => setOpen(false)}
              className="rounded-full bg-white px-5 py-2 text-center text-sm font-semibold text-black"
            >
              Order Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
