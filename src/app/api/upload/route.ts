import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

// Public endpoint used by the order form to upload reference images before
// the commission itself is submitted. Files are stored in Vercel Blob
// (works out of the box on Vercel's serverless/edge runtime, unlike writing
// to the local filesystem which is read-only in production).
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PNG, JPEG, WEBP or GIF images are allowed" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const safeName = `references/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;

  try {
    const blob = await put(safeName, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (err) {
    console.error("[upload] failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
