# VERDICT — AI Agent Rules & Conventions
# Last Updated: 2025-03-11
# Status: ACTIVE — All rules are mandatory

---

## 🔴 GOLDEN RULES (NEVER BREAK THESE)

1. **NEVER delete, overwrite, or refactor working code** unless explicitly asked
2. **NEVER use placeholder, mock, lorem ipsum, or hardcoded data** in any page or component that should be dynamic
3. **NEVER leave non-functional UI** — every button, link, form, and interaction must work end-to-end
4. **NEVER expose secrets, API keys, or database credentials** in frontend code
5. **NEVER use `any` type in TypeScript** — always define proper interfaces/types
6. **NEVER use `console.log` for error handling** — use proper try-catch, toasts, and error states
7. **NEVER break existing functionality** when adding new features — test regression
8. **NEVER use inline styles** — use Tailwind CSS classes only
9. **NEVER skip form validation** — validate both client-side AND server-side
10. **NEVER commit without verifying** the page renders without errors

---

## 📂 PROJECT STRUCTURE RULES

### File Organization

```
src/
├── app/
│   ├── (pages)/              # Each route gets its own folder
│   │   ├── page.tsx          # Page component (default export)
│   │   └── loading.tsx       # Loading skeleton (if needed)
│   ├── api/                  # API routes
│   │   └── [resource]/
│   │       └── route.ts      # GET, POST, PATCH, DELETE handlers
│   └── layout.tsx            # Root layout
├── components/               # Reusable components
│   ├── layout/               # MainLayout, Sidebar, Header
│   ├── ui/                   # Buttons, Modals, Inputs, Cards
│   └── features/             # GlobalSearch, AIChatbot, etc.
├── lib/
│   ├── db/
│   │   ├── schema.ts         # Drizzle schema (ALL tables)
│   │   ├── index.ts          # DB connection (Neon)
│   │   └── seed.ts           # Seed data (if extracted)
│   ├── auth/
│   │   └── authOptions.ts    # NextAuth config
│   ├── types.ts              # All TypeScript interfaces
│   └── utils.ts              # Helper functions
└── styles/
    └── globals.css           # Tailwind + custom newsprint styles
```

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Page files | `page.tsx` (Next.js App Router) | `app/cases/page.tsx` |
| API routes | `route.ts` | `app/api/cases/route.ts` |
| Components | PascalCase | `GlobalSearch.tsx` |
| Utility functions | camelCase | `formatCaseId()` |
| Database tables | snake_case | `calendar_events` |
| Database columns | snake_case | `case_ref`, `user_id` |
| TypeScript interfaces | PascalCase, descriptive | `Case`, `Document`, `TimeEntry` |
| CSS classes | Tailwind utility-first | `className="bg-newsprint text-ink"` |
| API responses | camelCase JSON keys | `{ caseId, userName }` |
| Environment variables | SCREAMING_SNAKE_CASE | `DATABASE_URL` |

---

## 🎨 DESIGN SYSTEM RULES — "NEWSPRINT / EDITORIAL"

### Mandatory Visual Rules

1. **Zero border-radius** — `rounded-none` on EVERYTHING. No rounded corners anywhere.
   ```tsx
   // ✅ Correct
   <div className="border border-ink/20 rounded-none">
   // ❌ Wrong
   <div className="border border-ink/20 rounded-lg">
   ```

2. **Color tokens only** — never use raw hex/rgb values
   ```tsx
   // ✅ Correct
   className="bg-newsprint text-ink border-ink/20"
   // ❌ Wrong
   className="bg-white text-black border-gray-300"
   ```

### Color Palette Reference

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `newsprint` | `#F9F9F7` | `#111111` | Backgrounds |
| `ink` | `#111111` | `#F0F0EE` | Text, borders |
| `neutral` | `#737373` | `#999999` | Secondary text |
| `accent` | `#CC0000` | `#FF4444` | Alerts, destructive |

### Typography Hierarchy

- **Page titles:** `font-serif text-3xl font-bold tracking-tight`
- **Section headers:** `font-serif text-xl font-bold uppercase tracking-wide`
- **Body text:** `font-sans text-sm`
- **Labels/badges:** `font-mono text-xs uppercase tracking-widest`
- **Data/numbers:** `font-mono`

### Dividers

- **Major section divider:** `border-t-4 border-ink`
- **Standard divider:** `border-t border-ink/20`
- Never use colored dividers

### Images

Grayscale by default, color on hover:
```tsx
className="grayscale hover:grayscale-0 transition-all duration-500"
```

### Buttons

```tsx
// Primary
className="bg-ink text-newsprint font-mono text-xs uppercase tracking-widest px-4 py-2 hover:bg-ink/80 transition-colors"

// Secondary / Ghost
className="border border-ink/30 text-ink font-mono text-xs uppercase tracking-widest px-4 py-2 hover:bg-ink/5 transition-colors"

// Destructive
className="bg-accent text-white font-mono text-xs uppercase tracking-widest px-4 py-2 hover:bg-accent/80 transition-colors"
```

### Inputs

```tsx
className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none placeholder:text-neutral/50"
```

### Cards

```tsx
className="border border-ink/20 bg-newsprint p-4 hover:border-ink/40 transition-colors"
// NO shadows, NO rounded corners
```

### Toasts (react-hot-toast)

```tsx
toast.success('DOCUMENT CREATED', {
  style: {
    background: '#111111',
    color: '#F9F9F7',
    fontFamily: 'monospace',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    borderRadius: '0',
  }
});
```

### Status Badges

```tsx
// Use border + text, not filled backgrounds
className="border border-ink/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"

// Status-specific colors:
// Active/Open:       border-green-600 text-green-700
// Pending/Review:    border-yellow-600 text-yellow-700
// Closed/Done:       border-ink/30 text-neutral
// Critical/Urgent:   border-accent text-accent
```

### Modals / Dialogs

```tsx
// Backdrop
className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50"

// Modal container
className="bg-newsprint border border-ink/30 p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
// NO rounded corners, NO shadows
```

### Tables

```tsx
// Table header
className="border-b-2 border-ink font-mono text-[10px] uppercase tracking-widest text-neutral"

// Table rows
className="border-b border-ink/10 hover:bg-ink/5 transition-colors"
```

### Empty States

```tsx
<div className="text-center py-16">
  <LucideIcon className="mx-auto h-8 w-8 text-neutral/40 mb-3" />
  <p className="font-mono text-xs uppercase tracking-widest text-neutral">
    No documents found
  </p>
</div>
```

### Loading Skeletons

```tsx
// Use ink/10 bg with pulse animation — no rounded corners
className="h-4 w-32 bg-ink/10 animate-pulse"
```

---

## 🗄️ DATABASE RULES (Drizzle ORM + Neon)

### Schema Rules

- Every table MUST have `id: serial('id').primaryKey()`
- Every table MUST have `created_at: timestamp('created_at').defaultNow()`
- Tables with mutable data MUST have `updated_at: timestamp('updated_at').defaultNow()`
- Use `text()` for unbounded strings, `varchar(n)` for constrained values
- Use **JSONB** for flexible/nested data (arrays, objects)
- Foreign keys must specify `onDelete` behavior (`CASCADE` or `SET NULL`)
- Boolean columns default to `false` unless logically otherwise
- Store monetary values in **paise** (integer) — ₹350.50 = `35050`
- Store hours in **cents** (integer) — 3.5 hours = `350`
- All IDs follow patterns: cases=`VDT-YYYY-NNN`, evidence=`EVD-YYYY-NNN`
- **NEVER use raw SQL** — always use Drizzle query builder
- All schema changes go through `drizzle-kit push`

### Query Patterns

```typescript
// ✅ Standard list query with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = db.select().from(tableName);

    if (status) {
      query = query.where(eq(tableName.status, status));
    }
    if (search) {
      query = query.where(ilike(tableName.title, `%${search}%`));
    }

    const results = await query;
    return NextResponse.json(results);
  } catch (error) {
    console.error('GET /api/resource error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// ✅ Standard create
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    const [created] = await db.insert(tableName).values(body).returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('POST /api/resource error:', error);
    return NextResponse.json(
      { error: 'Failed to create' },
      { status: 500 }
    );
  }
}
```

---

## 🔌 API ROUTE RULES

### Response Format

```typescript
// Success
return NextResponse.json(data, { status: 200 });
return NextResponse.json(created, { status: 201 });

// Client Error
return NextResponse.json({ error: 'Descriptive message' }, { status: 400 });
return NextResponse.json({ error: 'Not found' }, { status: 404 });

// Server Error
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
```

### Rules

- Every route handler MUST be wrapped in `try-catch`
- Every route MUST validate required fields before DB operations
- DELETE operations MUST verify the record exists before deleting
- PATCH operations MUST use `.returning()` to send back updated data
- GET list endpoints MUST support filtering via query params
- GET list endpoints SHOULD support `?search=` via `ILIKE`
- Never return raw database errors to the client
- Always use `NextRequest` and `NextResponse` (not legacy `req`/`res`)
- Log errors with `console.error` (server-side only) for debugging

### HTTP Methods per Route

| Operation | Method | URL Pattern | Body |
|---|---|---|---|
| List all | GET | `/api/resource` | — |
| Get one | GET | `/api/resource/[id]` | — |
| Create | POST | `/api/resource` | JSON body |
| Update | PATCH | `/api/resource/[id]` or `body.id` | JSON body |
| Delete | DELETE | `/api/resource/[id]` or `?id=` | — |

---

## ⚛️ REACT / NEXT.JS RULES

### Component Rules

- All page components are Server Components by default
- Add `'use client'` ONLY when using: `useState`, `useEffect`, `onClick`, `onChange`, `useRouter`, `useSession`, or browser APIs
- Fetch data with `fetch()` in `useEffect` for client components
- Use loading states for ALL async data
- Use error boundaries / error states for ALL API calls

### Data Fetching Pattern (Client Components)

```typescript
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PageName() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch('/api/resource');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError('Failed to load data');
      toast.error('FAILED TO LOAD DATA');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (data.length === 0) return <EmptyState />;

  return (/* render data */);
}
```

### Form Submission Pattern

```typescript
const [submitting, setSubmitting] = useState(false);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  // Client-side validation
  if (!formData.title.trim()) {
    toast.error('TITLE IS REQUIRED');
    return;
  }

  try {
    setSubmitting(true);
    const res = await fetch('/api/resource', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create');
    }

    const created = await res.json();
    setData(prev => [created, ...prev]);
    setShowModal(false);
    resetForm();
    toast.success('CREATED SUCCESSFULLY');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'SOMETHING WENT WRONG';
    toast.error(message.toUpperCase());
  } finally {
    setSubmitting(false);
  }
}
```

### Delete Confirmation Pattern

```typescript
async function handleDelete(id: number, name: string) {
  if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;

  try {
    const res = await fetch(`/api/resource/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    setData(prev => prev.filter(item => item.id !== id));
    toast.success('DELETED SUCCESSFULLY');
  } catch {
    toast.error('FAILED TO DELETE');
  }
}
```

---

## 🔐 AUTHENTICATION RULES

- Use `useSession()` from `next-auth/react` for client-side auth checks
- Use `getServerSession()` for server-side/API route auth checks
- Protected API routes MUST verify session before processing
- User-specific data MUST filter by `session.user.id`
- Admin-only operations MUST check `session.user.role`
- Never trust client-sent user IDs — always use session
- Password changes MUST hash with `bcryptjs` before storing
- Login history MUST be recorded on every authentication

### Protected API Route Pattern

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... proceed with authenticated logic
}
```

---

## 🇮🇳 DOMAIN-SPECIFIC RULES (Indian Legal Context)

- **Currency:** Always ₹ (Indian Rupees) — `₹1,50,000` format (Indian numbering)
- **Date format in UI:** `DD MMM YYYY` (e.g., 15 Jan 2025)
- **Date format in DB:** `YYYY-MM-DD`
- **Court names:** Use real Indian courts
  - Supreme Court of India
  - Bombay High Court / Delhi High Court / etc.
  - City Civil Court, Mumbai / Ahmedabad / etc.
  - Sessions Court, District Court, Tribunal, etc.
- **Case ID format:** `VDT-YYYY-NNN` (e.g., VDT-2024-001)
- **Evidence ID format:** `EVD-YYYY-NNN`
- **Legal roles:** Advocate, Senior Advocate, Junior Advocate, Paralegal, Clerk
- **Honorifics:** `Adv.` prefix for advocates (e.g., Adv. Prit Thacker)
- **Case styles:** `[Plaintiff] v. [Defendant]` or `State v. [Accused]`
- **Legal terms:** Use Indian legal terminology:
  - FIR (not police report)
  - Chargesheet (not indictment)
  - Bail (not bond)
  - Sections of IPC/BNS, CrPC/BNSS, CPC
  - Advocate (not Attorney, not Lawyer in formal contexts)

---

## 🛡️ SECURITY RULES

- All user inputs MUST be sanitized before database insertion
- Use parameterized queries (Drizzle handles this — NEVER use raw SQL)
- API routes MUST validate input types and lengths
- File uploads MUST validate file type and size
- CORS is handled by Next.js — don't add custom CORS unless needed
- Rate limiting: Add basic protection for auth routes (login, register)
- Never return password hashes in API responses
- Never log sensitive data (passwords, tokens, full credit cards)
- Environment variables: Use `.env.local` — never commit `.env` files

---

## 📱 RESPONSIVE DESIGN RULES

### Breakpoint Strategy

```
Mobile first → sm (640px) → md (768px) → lg (1024px) → xl (1280px)
```

### Layout Rules

- **Sidebar:** Hidden on mobile, slide-in drawer on mobile, always visible on `lg+`
- **Tables:** Horizontal scroll on mobile, or convert to card layout
- **Grid layouts:** 1 col mobile → 2 col tablet → 3-4 col desktop
- **Modals:** Full-screen on mobile, centered `max-w-lg` on desktop
- **Font sizes:** Minimum 12px on mobile (our `[10px]→12px` override handles this)

### Pattern

```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
```

---

## 🧩 ICON RULES (Lucide React)

- **ONLY** use icons from `lucide-react` — no other icon libraries
- Standard sizes:
  - Navigation/sidebar: `h-4 w-4`
  - Section headers: `h-5 w-5`
  - Empty states: `h-8 w-8`
  - Hero/large: `h-12 w-12`
- Always include `strokeWidth={1.5}` for consistency with newsprint aesthetic
- Color: `text-ink` or `text-neutral` — never colored unless status-specific

---

## 🚫 ANTI-PATTERNS — NEVER DO THESE

```typescript
// ❌ NEVER: Untyped state
const [data, setData] = useState<any>([]);

// ❌ NEVER: Missing error handling
const res = await fetch('/api/data');
const data = await res.json(); // What if res is 500?

// ❌ NEVER: Hardcoded data in a dynamic page
const cases = [
  { id: 1, name: "Example Case" }, // This is mock data!
];

// ❌ NEVER: Dead links
<a href="#">Click here</a>

// ❌ NEVER: Non-functional buttons
<button onClick={() => {}}>Submit</button>

// ❌ NEVER: Console.log as UX
catch (error) {
  console.log(error); // User sees nothing!
}

// ❌ NEVER: Inline styles
<div style={{ backgroundColor: 'white', borderRadius: '8px' }}>

// ❌ NEVER: Rounded corners
<div className="rounded-lg shadow-md"> // This breaks newsprint aesthetic

// ❌ NEVER: Raw color values
<div className="bg-white text-gray-900"> // Use tokens!

// ❌ NEVER: Unprotected mutations
// POST/PATCH/DELETE without session check in sensitive routes

// ❌ NEVER: Missing loading states
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData);
  // No loading indicator, no error handling
}, []);
```

---

## ✅ CHECKLIST BEFORE COMPLETING ANY TASK

Before marking any feature as "done", verify:

- [ ] No TypeScript errors (`npm run build` passes)
- [ ] No `any` types remaining
- [ ] All data comes from database/API (zero mock data)
- [ ] Loading state renders correctly
- [ ] Empty state renders correctly
- [ ] Error state renders correctly (disconnect DB to test)
- [ ] Forms validate before submitting
- [ ] Success/error toasts fire appropriately
- [ ] Mobile layout works (test at 375px width)
- [ ] Dark mode works (toggle and verify)
- [ ] All links navigate correctly
- [ ] Delete operations ask for confirmation
- [ ] No console warnings or errors in browser
- [ ] Newsprint aesthetic maintained (no rounded corners, correct fonts, correct colors)
