# Deployment Guide (Vercel)

Follow these steps in order. No code changes needed at any point.

## 1. Push to GitHub

```bash
cd roblox-commission-site
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 2. Create a Postgres database

Pick one (all free-tier friendly):

- **Vercel Postgres** — Vercel dashboard → your project (after step 3) →
  Storage tab → Create Database → Postgres. It auto-injects `DATABASE_URL`.
- **Neon** (neon.tech) or **Supabase** — create a project, copy the
  connection string, paste it as `DATABASE_URL` in step 4.

Then open `prisma/schema.prisma` and switch the datasource provider:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

Commit that one-line change before deploying.

## 3. Import the project into Vercel

1. Go to vercel.com → **Add New → Project** → import your GitHub repo.
2. Framework preset: Next.js (auto-detected). Leave build settings default —
   `npm run build` already runs `prisma generate` for you.

## 4. Set environment variables

In the Vercel project → **Settings → Environment Variables**, add everything
from `.env.example`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | From step 2 |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` locally |
| `NEXTAUTH_URL` | Your production URL, e.g. `https://yoursite.vercel.app` |
| `OWNER_USERNAME` / `OWNER_PASSWORD` | Pick your own |
| `MANAGER_USERNAME` / `MANAGER_PASSWORD` | Pick your own |
| `DISCORD_WEBHOOK_URL` | Discord → Server Settings → Integrations → Webhooks → New Webhook → Copy URL |
| `BLOB_READ_WRITE_TOKEN` | Vercel project → Storage → Create Database → Blob (auto-fills this var) |
| `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` | Optional — leave blank to skip email notifications |

## 5. Push the database schema

After the first deploy succeeds, run once (locally, pointed at prod DB, or
via Vercel's built-in shell):

```bash
npx prisma db push
```

This creates all tables in your production Postgres database. You only need
to do this once, and again after any future schema change.

## 6. Deploy

Click **Deploy** (or just push to `main` — Vercel auto-deploys on push).
That's it — the site is live, the order form saves to Postgres, image
uploads go to Vercel Blob, and every new commission pings your Discord.

## Getting instant notifications on your phone

Discord already gives you this for free: install the Discord mobile app,
join/open the server your webhook posts to, and turn on notifications for
that channel. You'll get a push notification within seconds of any
commission being submitted — no extra setup, no push-subscription flow.

If you'd rather have true browser push notifications (a notification even
when Discord isn't open), that requires a service worker + the Web Push API
and a device-specific subscription stored per-browser. It's a reasonable v2
addition but intentionally left out here so the current build stays exactly
as specified: zero extra services to configure after deploy.

## Updating the two admin passwords later

Just change `OWNER_PASSWORD` / `MANAGER_PASSWORD` in Vercel's environment
variables and redeploy (or use "Redeploy" without changing code — env var
changes require a redeploy to take effect). No database change needed.
