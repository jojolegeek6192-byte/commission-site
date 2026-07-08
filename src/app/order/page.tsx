"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { commissionFormSchema, currencies, currencyLabels, currencySymbols, type CommissionFormValues } from "@/lib/validations";

export default function OrderPage() {
  const router = useRouter();
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionFormSchema),
    defaultValues: { urgent: false, referenceUrls: [], currency: "EUR" },
  });

  const urgent = watch("urgent");
  const selectedCurrency = watch("currency");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (images.length + files.length > 6) {
      setUploadError("Max 6 reference images.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    try {
      const uploaded: { url: string; name: string }[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        uploaded.push({ url: data.url, name: file.name });
      }
      const next = [...images, ...uploaded];
      setImages(next);
      setValue("referenceUrls", next.map((i) => i.url));
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    const next = images.filter((i) => i.url !== url);
    setImages(next);
    setValue("referenceUrls", next.map((i) => i.url));
  }

  async function onSubmit(values: CommissionFormValues) {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      router.push("/order/success");
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Submit a Commission</h1>
        <p className="mt-3 text-zinc-400">
          Fill out as much detail as you can — it helps me scope your project accurately.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          <Field label="Discord Username" error={errors.discordUser?.message}>
            <input
              {...register("discordUser")}
              placeholder="yourname"
              className="input"
            />
          </Field>

          <Field label="Project Name" error={errors.projectName?.message}>
            <input
              {...register("projectName")}
              placeholder="e.g. Tycoon lobby map"
              className="input"
            />
          </Field>

          <Field label="Commission Description" error={errors.description?.message}>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="What do you need built? Scope, style references, technical requirements…"
              className="input resize-none"
            />
          </Field>

          <Field label="Deadline" error={errors.deadline?.message}>
            <input type="date" {...register("deadline")} className="input" />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Amount" error={errors.amount?.message}>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                  {currencySymbols[selectedCurrency ?? "EUR"]}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  {...register("amount")}
                  placeholder="50"
                  className="input pl-9"
                />
              </div>
            </Field>

            <Field label="Currency" error={errors.currency?.message}>
              <select {...register("currency")} className="input">
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {currencyLabels[c]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-bg-card p-4">
            <input
              id="urgent"
              type="checkbox"
              {...register("urgent")}
              className="h-4 w-4 accent-accent"
            />
            <label htmlFor="urgent" className="flex items-center gap-2 text-sm text-zinc-300">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              This is urgent
            </label>
            {urgent && (
              <span className="ml-auto rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                I'll be notified immediately
              </span>
            )}
          </div>

          <Field label="References (optional, up to 6 images)" error={uploadError ?? undefined}>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-bg-card p-8 text-sm text-zinc-400 hover:border-accent/50">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
              <span>{uploading ? "Uploading…" : "Click to upload images"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
                disabled={uploading}
              />
            </label>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {images.map((img) => (
                  <div key={img.url} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(img.url)}
                      className="absolute right-1 top-1 rounded-full bg-black/70 p-1 opacity-0 transition group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <Field label="Additional Notes (optional)" error={errors.notes?.message}>
            <textarea {...register("notes")} rows={3} className="input resize-none" />
          </Field>

          {submitError && (
            <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting || uploading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 font-semibold text-black transition hover:bg-accent-dim disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Commission
          </button>
        </form>
      </section>
      <Footer />
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
