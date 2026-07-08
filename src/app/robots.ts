import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL || "https://example.com";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
