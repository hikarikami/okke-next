# Deployment Guide

Stack: SvelteKit + Turso (cloud SQLite) + Vercel

---

## 1. Local Development

```bash
npm install
npm run db:push          # creates local.db and applies schema
npx tsx src/lib/server/db/seed.ts   # optional: seed sample data
npm run dev
```

`.env` is already configured for local — no changes needed.

---

## 2. Turso Database (Production)

### Install Turso CLI

```bash
# macOS / Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (PowerShell)
winget install chiselstrike.turso
```

### Create the database

```bash
turso auth login
turso db create okke-next
turso db show okke-next            # copy the libsql:// URL
turso db tokens create okke-next   # copy the auth token
```

Save both values — you'll need them for the next steps.

### Push schema to Turso

```bash
# Windows PowerShell
$env:DATABASE_URL="libsql://okke-next-<username>.turso.io"
$env:DATABASE_AUTH_TOKEN="your-token-here"
npm run db:push
```

> For future schema changes, run `npm run db:push` the same way.

---

## 3. Vercel Deployment

### Option A — Vercel Dashboard (recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Vercel auto-detects SvelteKit — no build config needed
4. Add environment variables (see below) before deploying

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

---

## 4. Environment Variables

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `libsql://okke-next-<username>.turso.io` |
| `DATABASE_AUTH_TOKEN` | your Turso auth token |
| `BETTER_AUTH_SECRET` | 32-char random secret (see below) |
| `ORIGIN` | `https://your-app.vercel.app` |

### Generate a secure `BETTER_AUTH_SECRET`

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 5. Deploy

```bash
git add -A
git commit -m "ready for production"
git push
```

Vercel auto-deploys on every push to `main`. First deploy takes ~1 minute.

---

## Checklist

- [ ] `turso db create okke-next`
- [ ] `npm run db:push` with Turso env vars set
- [ ] 4 env vars added in Vercel dashboard
- [ ] Push to Git → Vercel deploys automatically

---

## Ongoing Schema Changes

Whenever you update `src/lib/server/db/schema.ts`:

```bash
# Apply to local
npm run db:push

# Apply to Turso (production)
$env:DATABASE_URL="libsql://okke-next-<username>.turso.io"
$env:DATABASE_AUTH_TOKEN="your-token-here"
npm run db:push
```
