import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

// There is NO database of users and NO sign-up flow anywhere in this app.
// Exactly two accounts can ever exist, both defined via environment
// variables. Passwords are hashed in-memory at process start and compared
// with bcrypt so plaintext never touches a cookie, log, or client bundle.
//
// This file (with the Credentials provider + bcrypt) is Node.js-only and
// must only be imported from API routes / server components — never from
// middleware.ts. Middleware uses the edge-safe authConfig directly instead.

type AppUser = { id: string; name: string; role: "OWNER" | "MANAGER" };

function getAccounts() {
  const owner = {
    id: "owner",
    username: process.env.OWNER_USERNAME ?? "owner",
    passwordHash: bcrypt.hashSync(process.env.OWNER_PASSWORD ?? "changeme", 10),
    role: "OWNER" as const,
  };
  const manager = {
    id: "manager",
    username: process.env.MANAGER_USERNAME ?? "manager",
    passwordHash: bcrypt.hashSync(process.env.MANAGER_PASSWORD ?? "changeme", 10),
    role: "MANAGER" as const,
  };
  return [owner, manager];
}

// Very small in-memory rate limiter to slow down brute-force login attempts.
// Resets on redeploy/cold start — good enough as a first line of defense on
// top of the fact that there are only 2 possible usernames.
const attempts = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 5; // 5 attempts per minute per username
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!username || !password) return null;
        if (isRateLimited(username.toLowerCase())) return null;

        const accounts = getAccounts();
        const match = accounts.find(
          (a) => a.username.toLowerCase() === username.toLowerCase()
        );
        if (!match) return null;

        const valid = await bcrypt.compare(password, match.passwordHash);
        if (!valid) return null;

        const user: AppUser = { id: match.id, name: match.username, role: match.role };
        return user;
      },
    }),
  ],
});
