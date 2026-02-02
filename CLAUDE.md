# CLAUDE.md - AI Assistant Development Guide

This document provides essential context for AI assistants (like Claude) working with the King Family Dart League repository.

## Project Overview

**Name:** King Family Dart League
**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Supabase
**Purpose:** Mobile-optimized dart league website with admin portal
**Theme:** Dark mode with red accents, Viking-themed branding

## Key Features

### Public Site
- **Standings** (`/`) - League standings table with W-L-T, points, PCT
- **Schedule** (`/schedule`) - Match schedule and results
- **News** (`/news`) - League announcements
- **Docs** (`/docs`) - Downloadable league documents

### Admin Portal (`/admin`)
- Magic link authentication
- CRUD operations for seasons, teams, locations, matches, news, documents
- Protected routes via middleware

## Repository Structure

```
BarnDartsDevTest/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin portal pages
│   │   │   ├── auth/callback/  # Auth callback route
│   │   │   ├── documents/      # Document management
│   │   │   ├── locations/      # Location management
│   │   │   ├── login/          # Admin login
│   │   │   ├── matches/        # Match management & scoring
│   │   │   ├── news/           # News management
│   │   │   ├── seasons/        # Season management
│   │   │   └── teams/          # Team management
│   │   ├── docs/               # Public documents page
│   │   ├── news/               # Public news page
│   │   ├── schedule/           # Public schedule page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Standings (home page)
│   ├── components/
│   │   ├── admin/              # Admin-specific components
│   │   ├── docs/               # Document components
│   │   ├── layout/             # Layout components (Navigation)
│   │   ├── news/               # News components
│   │   ├── schedule/           # Schedule components
│   │   ├── standings/          # Standings components
│   │   └── ui/                 # Shared UI (Logo)
│   ├── lib/
│   │   ├── admin-actions.ts    # Server actions for CRUD
│   │   ├── data.ts             # Data fetching functions
│   │   ├── supabase.ts         # Browser Supabase client
│   │   └── supabase-server.ts  # Server Supabase client
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── middleware.ts           # Auth middleware
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
├── public/                     # Static assets
├── .env.local.example          # Environment variables template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Development
npm run dev          # Start dev server on localhost:3000

# Build
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Database Schema

### Tables
- **seasons** - League seasons (id, name, start_date, end_date, is_active)
- **teams** - Teams/players per season (id, name, season_id)
- **locations** - Match venues (id, name, address)
- **matches** - Match schedule & scores (home_team, away_team, scores 0-3)
- **news** - Announcements (title, content, is_published)
- **documents** - Uploaded files (title, file_url, file_name)
- **admins** - Admin users linked to Supabase auth

### Scoring System
- Each match has **3 games**
- Each game won = **1 point**
- Scores entered as games won (0-3 each, total must = 3)
- Standings show: P (played), W-L-T, F (games for), A (games against), PTS, PCT

### Views
- **team_standings** - Calculated standings with wins, losses, points

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_initial_schema.sql` in SQL Editor
3. Create a storage bucket named `documents` (public)
4. Enable Email auth with magic link in Authentication settings
5. Add admin user: Sign in, then run `supabase/setup-admin.sql`

## Code Conventions

### Component Structure
- Server Components by default (async, fetch data directly)
- Client Components only when needed ("use client" directive)
- Server Actions for mutations (`"use server"`)

### Styling
- Tailwind CSS utilities
- Dark theme colors: `#1a1a1a` (bg), `#2a2a2a` (cards), `#3a3a3a` (borders)
- Primary color: `red-500` / `red-600`
- Mobile-first responsive design

### Data Flow
1. Server Components fetch data via `lib/data.ts`
2. Client Components use Supabase client directly
3. Mutations use Server Actions in `lib/admin-actions.ts`
4. Revalidation via `revalidatePath()`

## Development Notes

### Mock Data
When Supabase is not configured, the app uses mock data defined in `lib/data.ts`. This allows UI development without a database.

### Admin Authentication
- Uses Supabase magic link (email-based)
- Middleware protects `/admin/*` routes except `/admin/login`
- Only users in `admins` table can access admin features (enforced via RLS)

### Adding New Admin Features
1. Add types to `src/types/index.ts`
2. Create server actions in `src/lib/admin-actions.ts`
3. Create admin page in `src/app/admin/[feature]/page.tsx`
4. Add navigation link in `AdminSidebar.tsx`

## Common Tasks

### Adding a New Season
1. Go to Admin > Seasons
2. Click "Add Season"
3. Enter name, dates, set active if current

### Entering Match Scores
1. Go to Admin > Matches
2. Click edit on the match
3. Enter games won by each team (must total 3)
4. Check "Match Completed"
5. Standings update automatically

### Adding News
1. Go to Admin > News
2. Click "Add Article"
3. Enter title and content
4. Check "Publish immediately" or save as draft

---

**Last Updated:** 2026-02-02
