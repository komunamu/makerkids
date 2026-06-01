# MakerKids — 3D Printing & TinkerCAD Learning Platform

An 8-week summer learning platform for teenagers to learn 3D printing and TinkerCAD.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Backend/Auth | Supabase (Auth + PostgreSQL + Storage) |
| Hosting | Vercel (free tier) |

---

## Deployment Guide

### Step 1: Set up Supabase
1. Go to supabase.com → New project
2. SQL Editor → run `supabase/migrations/001_initial_schema.sql`
3. Authentication → Providers → enable Email + Google
4. Storage → create buckets: `homework-uploads` (private) and `project-photos` (public)
5. Settings → API → copy Project URL and Publishable key

### Step 2: Deploy to Vercel
1. Push this repo to GitHub
2. vercel.com → New Project → import repo
3. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
4. Deploy
5. Add your Vercel URL to Supabase → Auth → URL Configuration

### Step 3: Run locally
```bash
cp .env.local.example .env.local
# Fill in Supabase URL and publishable key
npm install
npm run dev
```

---

## Project Structure
```
app/
  page.tsx                  # Landing page
  auth/login/               # Login (email + Google)
  auth/register/            # Registration
  dashboard/                # Student home with progress
  weeks/                    # All 8 weeks + individual weeks
  lessons/[id]/             # Lesson with video + quiz
  projects/                 # Project gallery
  achievements/             # Badge collection
  admin/                    # Parent/admin dashboard
components/
  Nav.tsx                   # Navigation
  lesson/LessonContent.tsx  # Lesson viewer with completion
  lesson/QuizComponent.tsx  # Interactive quiz
lib/
  supabase/                 # Client + server Supabase setup
  types.ts                  # TypeScript types
  curriculum-data.ts        # All 8 weeks of lesson content
supabase/migrations/
  001_initial_schema.sql    # Full DB schema + RLS + seed data
```
