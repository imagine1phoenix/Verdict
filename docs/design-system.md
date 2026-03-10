# VERDICT — Newsprint Editorial Design System

## Philosophy

Inspired by broadsheet newspapers: dense information, sharp typography,
zero ornamentation. Every pixel must serve a purpose.

---

## Color Tokens

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `newsprint` | `#F9F9F7` | `#111111` | Backgrounds |
| `ink` | `#111111` | `#F0F0EE` | Text, borders |
| `neutral` | `#737373` | `#999999` | Secondary text |
| `accent` | `#CC0000` | `#FF4444` | Alerts, destructive |

---

## Typography Scale

| Usage | Classes | Font |
|-------|---------|------|
| Page titles | `font-serif text-3xl font-bold tracking-tight` | Times New Roman |
| Section headers | `font-serif text-xl font-bold uppercase tracking-wide` | Times New Roman |
| Body text | `font-sans text-sm` | Inter |
| Labels / badges | `font-mono text-xs uppercase tracking-widest` | JetBrains Mono |
| Data / numbers | `font-mono` | JetBrains Mono |
| Captions | `font-mono text-[10px] uppercase text-neutral` | JetBrains Mono |

---

## Component Library

### Buttons

```tsx
// Primary
<button className="bg-ink text-newsprint font-mono text-xs uppercase tracking-widest px-4 py-2 hover:bg-ink/80 transition-colors">
  Action
</button>

// Secondary / Ghost
<button className="border border-ink/30 text-ink font-mono text-xs uppercase tracking-widest px-4 py-2 hover:bg-ink/5 transition-colors">
  Cancel
</button>

// Destructive
<button className="bg-accent text-white font-mono text-xs uppercase tracking-widest px-4 py-2 hover:bg-accent/80 transition-colors">
  Delete
</button>
```

### Inputs

```tsx
<input className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none placeholder:text-neutral/50" />
```

### Cards

```tsx
<div className="border border-ink/20 bg-newsprint p-4 hover:border-ink/40 transition-colors">
  {/* NO shadows, NO rounded corners */}
</div>
```

### Modals

```tsx
{/* Backdrop */}
<div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50" />
{/* Container */}
<div className="bg-newsprint border border-ink/30 p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
  {/* NO rounded corners, NO shadows */}
</div>
```

### Tables

```tsx
{/* Header */}
<th className="border-b-2 border-ink font-mono text-[10px] uppercase tracking-widest text-neutral" />
{/* Row */}
<tr className="border-b border-ink/10 hover:bg-ink/5 transition-colors" />
```

### Status Badges

```tsx
{/* Base */}
<span className="border border-ink/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest" />

{/* Variants */}
{/* Active:   border-green-600 text-green-700 */}
{/* Pending:  border-yellow-600 text-yellow-700 */}
{/* Closed:   border-ink/30 text-neutral */}
{/* Critical: border-accent text-accent */}
```

### Empty States

```tsx
<div className="text-center py-16">
  <Icon className="mx-auto h-8 w-8 text-neutral/40 mb-3" strokeWidth={1.5} />
  <p className="font-mono text-xs uppercase tracking-widest text-neutral">
    No items found
  </p>
</div>
```

### Loading Skeletons

```tsx
<div className="h-4 w-32 bg-ink/10 animate-pulse" />
{/* No rounded corners */}
```

---

## Animation Guidelines

- Use Framer Motion sparingly
- **Preferred:** fade-in (`opacity: 0→1`, 200ms)
- **Preferred:** slide-up (`y: 10→0`, 200ms)
- Never use bounce, spin, or playful animations
- Page transitions: subtle fade only

---

## Iconography

- **Library:** Lucide React only
- **Stroke width:** `1.5`
- **Sizes:** `16px` (nav), `20px` (headers), `32px` (empty states)

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| `border border-ink/20` | `shadow-lg rounded-xl` |
| `bg-newsprint text-ink` | `bg-white text-gray-900` |
| `font-mono text-xs uppercase` | `text-sm text-blue-600` |
| Grayscale images | Color-saturated images |
| Sharp corners everywhere | `rounded-lg` anywhere |
| Subtle transitions | Bounce / spring animations |
