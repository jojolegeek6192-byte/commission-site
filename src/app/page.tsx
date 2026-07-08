"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Blocks, ShieldCheck, Sparkles, Timer, Hammer } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { label: "Visits Across Games", value: "50M+", highlight: true },
  { label: "Commissions Delivered", value: "80+" },
  { label: "Years Building on Roblox", value: "3+" },
  { label: "Peak Concurrent Players", value: "2,000+" },
];

const reasons = [
  {
    icon: Blocks,
    title: "Shipped, not just pretty",
    body: "Every build is judged by whether it survives contact with real players — not just how it looks in a portfolio shot.",
  },
  {
    icon: Timer,
    title: "Clear deadlines, no ghosting",
    body: "You get a realistic timeline up front and status updates as the project moves.",
  },
  {
    icon: ShieldCheck,
    title: "Credited, professional work",
    body: "Credits on games totaling 50M+ visits — I build the way I'd want a contractor to build for me.",
  },
];

const heroWords =
  "I am JojoLeGeek—a Roblox builder credited with work on games totaling over 50 million visits. I create maps, models, and complete games available for commission.".split(
    " "
  );

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const wordVariant = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-grid-glow px-6 pb-24 pt-24 md:pt-36">
        <div className="mx-auto max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs text-zinc-400"
          >
            Currently accepting new commissions
          </motion.span>

          <motion.h1
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap justify-center gap-x-2 gap-y-1 font-display text-3xl font-bold leading-[1.15] tracking-tight md:text-5xl"
          >
            {heroWords.map((word, i) => (
              <motion.span key={i} variants={wordVariant}>
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/order"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-black transition-colors hover:bg-zinc-200"
              >
                Submit a Commission
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 px-7 py-3 font-semibold text-white transition-colors hover:border-white/50"
              >
                Get in touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="border-y border-white/10 bg-bg-soft px-6 py-16"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 text-center md:grid-cols-4">
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp}>
              <p
                className={`font-display font-bold tracking-tight ${
                  s.highlight ? "text-4xl text-white md:text-5xl" : "text-2xl text-white md:text-3xl"
                }`}
              >
                {s.value}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* SERVICES */}
      <section className="px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15">
            <Hammer className="h-6 w-6" />
          </div>
          <h2 className="mt-8 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Construction, GFX &amp; Systems
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
            Maps, Worlds, Tools, Events, Models... Everything is possible with me.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3"
        >
          {reasons.map((r) => (
            <motion.div
              key={r.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass rounded-2xl p-7"
            >
              <r.icon className="h-6 w-6 text-white" />
              <h3 className="mt-5 font-display text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{r.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 px-6 py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-bg-soft p-12 text-center"
        >
          <Sparkles className="mx-auto h-6 w-6 text-zinc-500" />
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Got a project in mind?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-400">
            Tell me about it — I'll get back to you fast, usually within a day.
          </p>
          <motion.div
            className="mt-8 inline-block"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              Submit a Commission
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
