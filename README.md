# Verdict

**Verdict** is an AI-powered legal intelligence platform built for modern law firms. It provides end-to-end case management, team collaboration, calendar scheduling, and an admin dashboard — all wrapped in a clean, editorial newsprint design system.

> Built with Next.js 15, TypeScript, Drizzle ORM, Neon PostgreSQL, and NextAuth.

---

## Features

### ✅ Phase 1 — Complete
- **Authentication** — Credentials login + Google OAuth via NextAuth.js
- **Dashboard** — Real-time executive summary: active cases, upcoming events, recent activity, AI insights
- **Case Management** — Kanban pipeline (Intake → Discovery → Motions → Trial → Closed) with full CRUD
- **Calendar** — 5 view modes: Day, Week, Month, Agenda, and Timeline
- **Team Collaboration** — Threaded chat, kanban task boards, and billable time tracking
- **Global Search** — `⌘K` command palette for cross-entity search (cases, events, users)
- **User Settings** — Profile editing and preferences
- **Admin Dashboard** — User management, audit logs, announcements, system settings, data export
- **Dark Mode** — Full light/dark theme support
- **Responsive Layout** — Mobile-first with collapsible sidebar drawer
- **Route Protection** — Middleware-based auth with public/protected/admin route tiers

### 🔄 Phase 2 — In Progress
Documents, Evidence Vault, Knowledge Base, Mock Trials, Proofreading, Analytics, Notification system, extended AI Insights

### 📋 Phase 3 — Planned
Real AI integration (OpenAI/Anthropic), cloud file storage, email notifications (Resend), PDF generation, RBAC, mobile app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 3 + custom newsprint design tokens |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Auth | NextAuth.js 4 (JWT, Google OAuth, Credentials) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Database | [Neon](https://neon.tech) (serverless PostgreSQL) |
| Themes | next-themes |
| Toasts | react-hot-toast |
| Bundler | Turbopack (dev) |
| Linting | ESLint 9 |
| Containers | Docker + docker-compose |

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** 9+
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)
- *(Optional)* Google OAuth credentials for social login

### 1. Clone & Install

```bash
git clone https://github.com/imagine1phoenix/Verdict.git
cd Verdict
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# NextAuth
NEXTAUTH_URL=http://localhost:3000
# generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 3. Set Up the Database

Push the Drizzle schema to your Neon database:

```bash
npx drizzle-kit push
```

*(Optional)* Open Drizzle Studio to browse your database:

```bash
npx drizzle-kit studio
```

### 4. Seed Sample Data (Optional)

Start the dev server first, then seed the database with 70+ sample records:

```bash
curl -X POST http://localhost:3000/api/seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack HMR |
| `npm run build` | Compile and build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint code quality checks |
| `npx drizzle-kit push` | Apply schema changes to the database |
| `npx drizzle-kit generate` | Generate migration files |
| `npx drizzle-kit studio` | Open Drizzle Studio GUI |

---

## Docker

### Build & Run

```bash
docker build -t verdict .
docker run -p 3000:3000 \
  -e DATABASE_URL=your-neon-url \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  verdict
```

### Docker Compose (Local Dev)

```bash
docker-compose up
```

The Dockerfile uses a 3-stage build (deps → builder → runner) based on Node 20 Alpine for a minimal production image.

---

## Project Structure

```
Verdict/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── page.tsx            # Dashboard (home)
│   │   ├── cases/              # Case pipeline view
│   │   ├── calendar/           # 5-view calendar
│   │   ├── team/               # Team collaboration hub
│   │   ├── admin/              # Admin dashboard (protected)
│   │   └── api/                # REST API endpoints (26 routes)
│   ├── components/             # Reusable React components
│   │   ├── layout/             # Sidebar, Header, MainLayout
│   │   ├── GlobalSearch.tsx    # ⌘K command palette
│   │   ├── AIChatbot.tsx       # Floating AI assistant widget
│   │   └── AIInsightsPanel.tsx # AI insight cards
│   └── lib/                    # Core utilities
│       ├── db.ts               # Neon database connection (lazy)
│       ├── schema.ts           # Drizzle ORM schema (12 tables)
│       ├── auth.ts             # NextAuth configuration
│       └── audit.ts            # Audit logging utilities
├── docs/                       # Extended documentation
│   ├── api-reference.md        # Full API endpoint specs
│   ├── architecture.md         # System design & data flow
│   ├── schema.md               # Database table definitions
│   ├── design-system.md        # Visual design tokens
│   ├── env-example.md          # Environment variable reference
│   ├── roadmap.md              # Feature roadmap by phase
│   ├── changelog.md            # Version history
│   └── seed-data.md            # Seed data structure
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Local dev orchestration
├── drizzle.config.ts           # Drizzle ORM configuration
├── middleware.ts               # Route protection middleware
├── tailwind.config.ts          # Design tokens & theme
└── rules.md                    # Development conventions & guidelines
```

---

## Database Schema

The application uses 12 PostgreSQL tables managed by Drizzle ORM:

| Table | Purpose |
|---|---|
| `users` | User profiles, roles, OAuth tracking |
| `login_history` | Login audit trail |
| `cases` | Case records with JSONB team/timeline/billing |
| `calendar_events` | Hearings, meetings, deadlines |
| `team_messages` | Threaded team chat |
| `tasks` | Kanban tasks (todo → in-progress → review → done) |
| `time_entries` | Billable hours logging |
| `activities` | Dashboard activity feed |
| `audit_logs` | Admin action audit trail |
| `system_settings` | Key-value system configuration |
| `announcements` | Role-targeted announcements |
| `events` | Legacy dashboard events |

---

## API Overview

The REST API lives under `/api/`. Key endpoint groups:

- **`/api/auth/*`** — Login, registration, OAuth callbacks
- **`/api/cases/*`** — Cases CRUD + pipeline management
- **`/api/events/*`** — Calendar event management
- **`/api/team/*`** — Messages, tasks, time entries
- **`/api/dashboard`** — Aggregated dashboard data
- **`/api/search`** — Global cross-entity search
- **`/api/users`** — User profiles
- **`/api/admin/*`** — Admin-only: users, audit logs, announcements, settings, stats, export
- **`/api/seed`** — Database seeding with sample data

For the full API specification, see [`docs/api-reference.md`](docs/api-reference.md).

---

## Design System

Verdict uses a strict **newsprint / editorial** aesthetic:

- **Zero border radius** — no rounded corners anywhere
- **Colors:** `newsprint` (#F9F9F7), `ink` (#111111), `neutral` (#737373), `accent` (#CC0000)
- **Typography:** Times New Roman / Georgia for headlines; Inter / Helvetica for body; JetBrains Mono / Courier for data
- **No shadows** — borders only for depth

See [`docs/design-system.md`](docs/design-system.md) for the complete specification.

---

## Documentation

Full documentation is available in the [`docs/`](docs/) directory:

| File | Description |
|---|---|
| [`api-reference.md`](docs/api-reference.md) | Complete API endpoint reference |
| [`architecture.md`](docs/architecture.md) | System architecture and data flow |
| [`schema.md`](docs/schema.md) | Database schema definitions |
| [`design-system.md`](docs/design-system.md) | Design tokens and UI rules |
| [`env-example.md`](docs/env-example.md) | Environment variable setup |
| [`roadmap.md`](docs/roadmap.md) | Feature roadmap by phase |
| [`changelog.md`](docs/changelog.md) | Version history |
| [`seed-data.md`](docs/seed-data.md) | Seed data structure |

Development conventions and anti-patterns are documented in [`rules.md`](rules.md).

---

## License

This project is not yet licensed. All rights reserved by the repository owner.
