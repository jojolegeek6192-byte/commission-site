import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const siteUrl = process.env.NEXTAUTH_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JojoLeGeek — Roblox Building Commissions",
    template: "%s · JojoLeGeek",
  },
  description:
    "Roblox builder credited with work on games totaling 50M+ visits. Maps, models, and complete games available for commission.",
  openGraph: {
    title: "JojoLeGeek — Roblox Building Commissions",
    description:
      "Roblox builder credited with work on games totaling 50M+ visits. Maps, models, and complete games available for commission.",
    url: siteUrl,
    siteName: "JojoLeGeek",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JojoLeGeek — Roblox Building Commissions",
    description: "Roblox builder credited with work on games totaling 50M+ visits.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="font-display antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
