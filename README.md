# FrangLish Study App

A full-stack English learning tracker for professional students in a Senior course. Built with React + Vite + TypeScript, Tailwind CSS v4, and Supabase.

## Features

- **Dashboard** — streak, hours, grammar progress, upcoming sessions
- **Gramática** — topic tracker by phase, status cycling, notes, Sesame prompts
- **Lecciones** — full lesson detail: explanation, formula, examples, written practice, timer
- **Contenidos** — course map filtered by module and status
- **Calendario** — monthly calendar, create/complete events
- **Journal** — reflection entries per session with confidence rating
- **Sesame** — speaking session log with prompt library
- **Lectura** — reading log with vocabulary and structure hunt
- **Horas** — bar, pie, line charts + 16-week heatmap
- **Rutina** — suggested weekly study schedule

---

## Local setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd franglish
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Copy your **Project URL** and **anon public key** from Settings → API

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the Supabase SQL files

In the Supabase dashboard → SQL Editor, run in this order:

1. `supabase/schema.sql` — creates all 13 tables
2. `supabase/policies.sql` — enables RLS and creates policies
3. `supabase/seed.sql` — inserts all 25 grammar topics with full lesson content

### 5. Enable email auth

Supabase dashboard → Authentication → Providers → Email → Enable

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), create an account, and start studying.

---

## Database schema overview

| Table | Purpose |
|---|---|
| `modules` | Course modules 1–5 |
| `grammar_phases` | 5 grammar phases |
| `grammar_topics` | 25 topics with full lesson JSON |
| `grammar_topic_modules` | Many-to-many topics ↔ modules |
| `grammar_lessons` | (Reserved for future per-row lesson data) |
| `profiles` | Auto-created user profile on signup |
| `user_topic_progress` | Status, confidence, notes per topic per user |
| `study_sessions` | Logged study sessions with duration and category |
| `calendar_events` | Planned study events |
| `journal_entries` | Reflection entries |
| `sesame_sessions` | Sesame speaking practice logs |
| `reading_logs` | Book reading sessions |
| `weekly_reviews` | (Reserved for weekly review feature) |

---

## Deploy to Vercel

1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project from GitHub
3. Set environment variables in Vercel dashboard (same as `.env`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Vite and uses `npm run build`

The free Vercel Hobby plan is sufficient for personal use.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styles | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | Lucide React |
| Charts | Recharts |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Hosting | Vercel / Netlify (free tier) |

---

## Project structure

```
src/
  types/          # TypeScript interfaces matching Supabase schema
  lib/            # constants, date utils, streak calc, supabase client
  services/       # CRUD functions per entity
  hooks/          # React hooks wrapping services
  components/
    ui/            # Reusable UI primitives (Card, Badge, Field, Toast...)
    layout/        # Sidebar with navigation
  pages/          # One file per section of the app
  App.tsx         # Root: auth guard, tab routing, global state
supabase/
  schema.sql      # Full database schema
  policies.sql    # RLS policies
  seed.sql        # 25 grammar topics with lesson content
```
