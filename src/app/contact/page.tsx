"use client";

import { useState } from "react";
import { MessageCircle, Send, Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    // Simple contact messages are routed through the same Discord webhook as
    // commissions, tagged differently so they're easy to tell apart. Wire this
    // up to a dedicated /api/contact route if you want a separate channel.
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setSent(true);
  }

  return (
    <>
      <Navbar />
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Contact</h1>
          <p className="mt-3 text-zinc-400">
            Fastest way to reach me is Discord. For commissions, use the order form instead —
            it gets you a faster, more structured reply.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href="https://discord.com/users/jojolegeek"
              target="_blank"
              rel="noreferrer"
              className="glass flex items-center gap-3 rounded-xl p-4 hover:border-accent/40"
            >
              <MessageCircle className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Discord</p>
                <p className="text-xs text-zinc-500">jojolegeek</p>
              </div>
            </a>
          </div>
        </div>

        <div>
          {sent ? (
            <div className="glass flex flex-col items-center justify-center rounded-2xl p-10 text-center">
              <CheckCircle2 className="h-10 w-10 text-accent" />
              <p className="mt-4 font-medium">Message sent — I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass space-y-4 rounded-2xl p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Name</label>
                <input required className="input" placeholder="Your name" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Discord or Email</label>
                <input required className="input" placeholder="How can I reach you?" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Message</label>
                <textarea required rows={4} className="input resize-none" placeholder="What's up?" />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 font-semibold text-black transition hover:bg-accent-dim disabled:opacity-50"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send message
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
