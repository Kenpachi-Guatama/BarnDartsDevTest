# King Family Dart League

A mobile-optimized dart league website with admin portal, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

![Viking Logo](public/logo-preview.png)

## Features

### Public Site
- **Standings** - View league standings with W-L-T records, points, and winning percentages
- **Schedule** - See upcoming matches and past results
- **News** - Read league announcements
- **Documents** - Download league rules, schedules, and other documents

### Admin Portal
- Secure magic link authentication
- Manage seasons, teams, and locations
- Schedule matches and enter scores
- Post news and upload documents

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Magic Link)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/BarnDartsDevTest.git
cd BarnDartsDevTest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`
3. Go to **Storage** and create a bucket named `documents` (set to public)
4. Go to **Authentication > Providers** and ensure Email is enabled

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials (found in Project Settings > API):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 6. Set Up Admin Access

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Enter your email and click "Send Magic Link"
3. Check your email and click the link to sign in
4. In Supabase SQL Editor, run (replace email):

```sql
INSERT INTO admins (id, email, name)
SELECT id, email, 'Your Name'
FROM auth.users
WHERE email = 'your-email@example.com';
```

Now you can access the admin portal!

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── admin/              # Admin portal
│   ├── docs/               # Documents page
│   ├── news/               # News page
│   ├── schedule/           # Schedule page
│   └── page.tsx            # Standings (home)
├── components/             # React components
├── lib/                    # Utilities & Supabase clients
└── types/                  # TypeScript types
```

## Scoring System

- Each match consists of **3 games**
- Each game won = **1 point**
- Match scores are entered as games won by each team (0-3)
- Example: If Tyler wins 2 games and Syd wins 1 game, enter 2-1

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel project settings
4. Deploy!

### Environment Variables for Production

Set these in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Development

### Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Mock Data

The app includes mock data for development when Supabase is not configured. This allows you to see the UI without setting up the database.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

---

Built with ❤️ for the King Family Dart League
