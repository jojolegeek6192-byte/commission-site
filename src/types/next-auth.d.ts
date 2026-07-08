import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "OWNER" | "MANAGER";
    } & DefaultSession["user"];
  }
  interface User {
    role: "OWNER" | "MANAGER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "OWNER" | "MANAGER";
  }
}
