# AtlasGym

A simple, modern gym management dashboard for **personal gym use only**.

Manage members, subscriptions, payments, and attendance from one clean dark-themed dashboard.

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Auth:** Simple admin login (JWT cookie session)
- **Deploy:** Vercel-ready

## Features

- Dashboard with stats (members, subscriptions, revenue)
- Members CRUD with photo URL, phone, search
- Subscriptions (monthly/quarterly/yearly) + renewals
- Payments history + revenue summary
- Attendance check-in + history
- Dark responsive UI with sidebar

---

## Quick Start

### 1. Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Supabase](https://supabase.com/) free account
- [Vercel](https://vercel.com/) account (for deployment)

### 2. Clone & Install

```bash
cd atlasgym
npm install
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run:
   - `supabase/schema.sql` (creates all tables)
   - `supabase/seed.sql` (demo members & data)
3. Copy your API keys from **Project Settings → API**

### 4. Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
AUTH_SECRET=any-random-string-at-least-32-chars-long
```

### 5. Create Admin User

Start the dev server, then create your admin account:

```bash
npm run dev
```

In another terminal:

```bash
curl -X POST http://localhost:3000/api/auth/setup
```

Default credentials:
- **Email:** `admin@atlasgym.com`
- **Password:** `admin123`

> Change your password after first login by updating the hash in Supabase.

### 6. Open the App

Visit [http://localhost:3000](http://localhost:3000) and sign in.

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Protected pages
│   │   ├── dashboard/
│   │   ├── members/
│   │   ├── subscriptions/
│   │   ├── payments/
│   │   └── attendance/
│   ├── api/             # API routes
│   └── login/
├── components/
│   ├── ui/              # shadcn components
│   └── layout/          # Sidebar, header
└── lib/
    ├── auth.ts          # Session & login
    ├── supabase.ts      # DB client
    └── types.ts         # TypeScript types
supabase/
├── schema.sql           # Database tables
└── seed.sql             # Demo data
```

---

## Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables (same as `.env.local`)
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

---

## Database Tables

| Table          | Description                    |
|----------------|--------------------------------|
| `users`        | Admin login accounts           |
| `members`      | Gym members                    |
| `subscriptions`| Subscription records           |
| `payments`     | Payment history                |
| `attendance`   | Check-in records               |

---

## API Routes

| Method | Route                    | Description          |
|--------|--------------------------|----------------------|
| POST   | `/api/auth/login`        | Admin login          |
| POST   | `/api/auth/logout`       | Logout               |
| POST   | `/api/auth/setup`        | Create first admin   |
| GET    | `/api/dashboard/stats`   | Dashboard stats      |
| GET/POST | `/api/members`         | List / add members   |
| PUT/DELETE | `/api/members/[id]`  | Update / delete      |
| GET/POST | `/api/subscriptions` | List / renew         |
| GET/POST | `/api/payments`      | History / add        |
| GET/POST | `/api/attendance`    | History / check-in   |

---

## Customization Tips

- **Monthly price:** Edit default `300` in members/subscriptions forms
- **Currency:** Change `MAD` in `src/lib/utils.ts` → `formatCurrency`
- **Plans:** Edit plan options in member & subscription dialogs
- **Colors:** Edit CSS variables in `src/app/globals.css`

---

## License

Personal use only. Built for AtlasGym.
