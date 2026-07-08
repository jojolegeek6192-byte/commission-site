import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Commission received" };

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="animate-float rounded-full bg-accent/10 p-5">
          <CheckCircle2 className="h-12 w-12 text-accent" />
        </div>
        <h1 className="mt-8 font-display text-3xl font-bold md:text-4xl">
          Commission received!
        </h1>
        <p className="mt-4 max-w-md text-zinc-400">
          Thanks for reaching out. I've been notified and will get back to you on Discord
          within a day, usually much sooner.
        </p>
        <Link
          href="/"
          className="mt-10 rounded-full border border-white/15 px-7 py-3 font-semibold text-white transition hover:border-accent hover:text-accent"
        >
          Back to home
        </Link>
      </section>
      <Footer />
    </>
  );
}
