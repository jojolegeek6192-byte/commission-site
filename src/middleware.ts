import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Uses the edge-safe config only — no bcrypt, no Credentials provider —
// so this runs cleanly on the Edge Runtime. It can still read/verify the
// session cookie because that only needs the jwt/session callbacks, not
// the login logic itself.
const { auth } = NextAuth(authConfig);

const OWNER_ONLY_PREFIXES = ["/dashboard/settings", "/dashboard/clients/manage"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isDashboard = pathname.startsWith("/dashboard");
  if (!isDashboard) return NextResponse.next();

  const session = req.auth;
  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (session.user as any).role as "OWNER" | "MANAGER";
  const isOwnerOnlyRoute = OWNER_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
  if (isOwnerOnlyRoute && role !== "OWNER") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
