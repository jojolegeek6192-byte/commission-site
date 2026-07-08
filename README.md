# JojoLeGeek — Roblox Commission Website

A production-ready Next.js 15 site for taking Roblox building/GFX/systems
commissions, with a 2-account admin dashboard (Owner + Manager) and instant
Discord notifications on every new order.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** — dark, premium design system, `#00FF88` accent
- **Prisma** — SQLite locally, Postgres in production (one env var change)
- **NextAuth v5** — credentials auth, exactly 2 hardcoded accounts, no sign-up
- **Zod + React Hook Form** — validated commission form
- **Vercel Blob** — secure reference-image uploads
- **Framer Motion / Lucide** — animation & icons

## Quick start (local dev)

```bash
npm install
cp .env.example .env
# edit .env: set OWNER_USERNAME/PASSWORD, MANAGER_USERNAME/PASSWORD,
# NEXTAUTH_SECRET (openssl rand -base64 32), and DISCORD_WEBHOOK_URL
npx prisma db push
npm run dev
```

Visit `http://localhost:3000`. Admin login is at `/login`.

> File uploads require a Vercel Blob token even locally. Either create a Blob
> store on Vercel and run `vercel env pull .env.local`, or temporarily leave
> uploads untested locally — they'll work once deployed. See DEPLOYMENT.md.

## Project structure

```
src/
  app/
    page.tsx                 # Home
    order/page.tsx           # Commission submission form
    order/success/page.tsx   # Confirmation page
    commissions/page.tsx     # Portfolio w/ filter+search+modal
    graphics/page.tsx        # GFX portfolio
    clients/page.tsx         # Client logos/reviews
    contact/page.tsx         # Contact form + Discord link
    login/page.tsx           # Owner/Manager login
    dashboard/               # Protected admin area
      page.tsx               # Overview + stats
      commissions/           # List + detail/edit + delete
      clients/page.tsx       # Owner-only client list
    api/
      auth/[...nextauth]/    # NextAuth handler
      commissions/           # POST (public submit) + GET (list, protected)
      commissions/[id]/      # PATCH (update/status) + DELETE (owner only)
      upload/                # Vercel Blob file upload
  lib/
    auth.ts                  # NextAuth config, 2 hardcoded accounts
    prisma.ts                # Prisma client singleton
    notify.ts                # Discord webhook + optional email
    validations.ts           # Zod schemas, shared labels
  middleware.ts               # Protects /dashboard, owner-only sub-routes
prisma/schema.prisma          # Commission / Client / Portfolio / Testimonial
```

## Admin accounts

There is **no registration page** anywhere in this app. The only two accounts
that can ever log in are defined entirely by environment variables:

```
OWNER_USERNAME / OWNER_PASSWORD
MANAGER_USERNAME / MANAGER_PASSWORD
```

Passwords are hashed and compared server-side with bcrypt; plaintext never
reaches the client. Change these values any time by updating your env vars
and redeploying — no database migration needed.

**Owner** can view/edit/delete any commission, change status, and access the
client list. **Manager** can view all commissions, submit on a client's
behalf (via the same order form, or add a "create" flow in the dashboard),
and edit commissions that are still `PENDING`/`UNDER_REVIEW`.

## Notifications

Every commission submission POSTs to `/api/commissions`, which:

1. Validates and saves it to the database.
2. Fires a Discord embed to `DISCORD_WEBHOOK_URL` (client, budget, deadline,
   urgent flag) — this is instant, works on your phone via the Discord app,
   and requires zero extra setup beyond pasting a webhook URL.
3. Optionally emails `NOTIFY_EMAIL_TO` via Resend if `RESEND_API_KEY` is set.

Browser/push notifications aren't included by default since they require a
persistent connection or a push-subscription flow tied to a specific device
— Discord's webhook already gets you an instant phone notification with no
extra moving parts. If you want native browser push too, see the note in
DEPLOYMENT.md.

## Deployment

See **DEPLOYMENT.md** for the exact, no-improvisation steps: push to GitHub,
import to Vercel, set env vars, deploy.
