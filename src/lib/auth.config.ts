import type { NextAuthConfig } from "next-auth";

// Edge-safe subset of the NextAuth config: NO providers, NO bcrypt here.
// This is imported by middleware.ts (which runs on the Edge Runtime and
// can't use Node.js-only crypto APIs). The full config with the Credentials
// provider lives in auth.ts and is only ever used in API routes / server
// components, which run on the Node.js runtime.
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [], // populated in auth.ts
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.name = (user as any).name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
