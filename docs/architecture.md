# VERDICT — System Architecture

## High-Level Overview

```
Browser → Next.js App Router → API Routes → Drizzle ORM → Neon PostgreSQL
                                    ↕
                              NextAuth.js (JWT)
                                    ↕
                          Google OAuth / Credentials
```

## Request Flow

1. User navigates to page (e.g., `/cases`)
2. Client component mounts → `useEffect` calls `fetch('/api/cases')`
3. API route handler validates request
4. Drizzle ORM builds + executes SQL query against Neon
5. Data returned as JSON → component renders

## Authentication Flow

1. User submits credentials → NextAuth `CredentialsProvider`
2. `bcryptjs` compares password hash
3. JWT token generated (contains `id`, `name`, `email`, `picture`)
4. Token stored in HTTP-only cookie (`next-auth.session-token`)
5. Middleware checks cookie on every protected route
6. Session available via `useSession()` (client) or `getServerSession()` (server)

## Directory Map

```
src/
├── app/
│   ├── page.tsx                     # Dashboard (/)
│   ├── layout.tsx                   # Root layout (AuthProvider + MainLayout + Toaster)
│   ├── globals.css                  # Tailwind + newsprint custom styles
│   ├── error.tsx                    # Global error boundary
│   ├── login/page.tsx               # Login page
│   ├── register/page.tsx            # Registration page
│   ├── calendar/page.tsx            # Calendar (5 view modes)
│   ├── cases/page.tsx               # Cases pipeline
│   ├── team/page.tsx                # Team collaboration
│   ├── settings/page.tsx            # User settings
│   ├── documents/page.tsx           # Documents (Phase 2)
│   ├── mock-trials/page.tsx         # Mock trials (Phase 2)
│   ├── proofreading/page.tsx        # Proofreading (Phase 2)
│   ├── analytics/page.tsx           # Analytics (Phase 2)
│   ├── evidence/page.tsx            # Evidence vault (Phase 2)
│   ├── knowledge/page.tsx           # Knowledge base (Phase 2)
│   ├── past-trials/page.tsx         # Past trials (Phase 2)
│   └── api/
│       ├── auth/[...nextauth]/      # NextAuth handler
│       ├── auth/register/           # User registration
│       ├── cases/                   # Cases CRUD
│       ├── cases/[id]/              # Single case CRUD
│       ├── dashboard/               # Dashboard data
│       ├── events/                  # Calendar events CRUD
│       ├── search/                  # Global cross-entity search
│       ├── seed/                    # Database seeding
│       ├── team/messages/           # Team chat
│       ├── team/tasks/              # Kanban tasks
│       ├── team/time/               # Time tracking
│       └── users/                   # User management
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx           # Sidebar + Header + content wrapper
│   │   ├── Sidebar.tsx              # Navigation (11 items)
│   │   └── Header.tsx               # Search, alerts, profile, dark mode
│   ├── GlobalSearch.tsx             # ⌘K search modal
│   ├── CollaborationIndicators.tsx  # Online user status
│   ├── PinnedAndRecent.tsx          # Pinned items + recent activity
│   ├── AIInsightsPanel.tsx          # AI insights cards
│   ├── AIChatbot.tsx                # Floating chat widget
│   ├── KeyboardShortcuts.tsx        # Shortcut hints
│   ├── Breadcrumbs.tsx              # Route breadcrumbs
│   ├── AuthProvider.tsx             # NextAuth SessionProvider
│   └── ThemeProvider.tsx            # next-themes provider
├── lib/
│   ├── db.ts                        # Neon connection (lazy-initialized)
│   ├── schema.ts                    # Drizzle schema (8 tables)
│   └── auth.ts                      # NextAuth config
└── middleware.ts                     # Route protection
```

## Admin Navigation Structure

```text
VERDICT ADMIN
├── Overview (/admin)
├── User Management (/admin/users)
├── Audit Logs (/admin/audit-logs)
├── Announcements (/admin/announcements)
├── System Settings (/admin/settings)
└── Database (/admin/database)
```

## External Services

| Service | Purpose |
|---------|---------|
| **Neon PostgreSQL** | Primary database (serverless, connection pooling built-in) |
| **Google OAuth** | Social login via NextAuth |
| **Vercel** | Deployment platform |

## Performance Notes

- **Turbopack** for dev server (fast HMR)
- **JWT strategy** = no DB session lookups per request
- **Neon serverless** = connection pooling built-in
- **Lazy DB init** = `neon()` only called at runtime, not at build time
