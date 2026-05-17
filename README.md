# Levefy

Lose weight without impossible diets. A premium healthy-lifestyle SaaS built with Next.js 15, Supabase Auth, Neon PostgreSQL, and Prisma.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 18, Tailwind CSS |
| Auth | Supabase Auth (Google OAuth + email/password + forgot password) |
| Database | Neon PostgreSQL (serverless) |
| ORM | Prisma 5 |
| Deployment | Render (standalone output) |

---

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd levefy
npm install
```

### 2. Create Supabase project

1. Go to https://app.supabase.com and create a new project.
2. In **Settings → API**, copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. In **Authentication → Providers**, enable **Google** and follow the OAuth setup wizard.
4. In **Authentication → URL Configuration**, add:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth/callback`

### 3. Create Neon database

1. Go to https://console.neon.tech and create a project.
2. From **Connection Details**, copy:
   - **Pooled** connection string → `DATABASE_URL` (append `&pgbouncer=true&connection_limit=1`)
   - **Direct** connection string → `DIRECT_URL`

### 4. Configure environment

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 5. Run migrations

```bash
npx prisma migrate deploy
# or for dev (creates migration file):
npx prisma migrate dev --name init
```

### 6. Start the app

```bash
npm run dev
```

Open http://localhost:3000

---

## Database Models

- **User** — mirrors Supabase auth user; `id` = Supabase auth UUID
- **Recipe** — app-managed recipes
- **Challenge** — 21-day challenge definitions
- **Progress** — weight + completed-day logs, linked to User

---

## Auth Flow

```
User → Login page
       ├─ Email/password → Supabase signIn → syncCurrentUser() → /dashboard
       ├─ Google OAuth   → Supabase OAuth  → /auth/callback   → /dashboard
       └─ Forgot password → reset email   → /auth/callback?next=/profile
```

`syncUserToDatabase()` upserts the Supabase user into the Prisma `users` table so that `User.id === supabase_auth_user.id`.

---

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Prisma generate + Next.js build |
| `npm run db:migrate` | Deploy pending migrations (production) |
| `npm run db:generate` | Re-generate Prisma client |
| `npm run db:push` | Push schema without a migration file (dev only) |

---

## Deployment (Render)

1. Push to GitHub.
2. Create a **Web Service** on Render pointing to your repo — `render.yaml` is pre-configured.
3. Add all env vars from `.env.example` in the Render dashboard under **Environment**.
4. Add your Render URL to Supabase **Authentication → URL Configuration → Redirect URLs**:
   `https://your-app.onrender.com/auth/callback`

---

## Environment Variables

See `.env.example` for the full annotated list.
