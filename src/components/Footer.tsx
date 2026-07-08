import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg-soft">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold tracking-tight">JojoLeGeek</p>
            <p className="mt-3 max-w-xs text-sm text-zinc-500">
              Roblox builder — maps, models, and complete games, available for commission.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-zinc-200">Get in touch</p>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/order" className="hover:text-white">Submit a commission</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-zinc-200">Admin</p>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/login" className="hover:text-white">Owner / Manager login</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-xs text-zinc-600">
          © {new Date().getFullYear()} JojoLeGeek. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
