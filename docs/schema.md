# VERDICT — Database Schema Reference

## Entity Relationship Diagram

```
users ──< login_history     (1:N, CASCADE)
users ──< team_messages     (1:N, SET NULL)
users ──< time_entries      (1:N, SET NULL)
cases (standalone)
events (standalone — dashboard)
activities (standalone — dashboard)
calendar_events (standalone)
tasks (standalone)
```

## Table Definitions

### users — 18 columns
| Column | Type | Constraints |
|--------|------|------------|
| `id` | serial | PK |
| `name` | text | NOT NULL |
| `email` | varchar(255) | UNIQUE, NOT NULL |
| `password` | text | Nullable (null for OAuth) |
| `role` | varchar(100) | Default: `"member"` |
| `avatar` | text | Default: `""` |
| `status` | varchar(20) | `online`/`away`/`offline`, Default: `"offline"` |
| `active_cases` | integer | Default: 0 |
| `hours_this_week` | integer | Default: 0 |
| `viewing` | text | Nullable |
| `provider` | varchar(20) | `credentials`/`google`, Default: `"credentials"` |
| `login_count` | integer | Default: 0 |
| `last_login_at` | timestamp | Nullable |
| `last_seen_at` | timestamp | Nullable |
| `is_active` | boolean | Default: true |
| `created_at` | timestamp | Default: now() |
| `updated_at` | timestamp | Default: now() |

### login_history — 6 columns
| Column | Type | Constraints |
|--------|------|------------|
| `id` | serial | PK |
| `user_id` | integer | FK → users (CASCADE) |
| `method` | varchar(20) | `credentials`/`google` |
| `ip_address` | text | Nullable |
| `user_agent` | text | Nullable |
| `timestamp` | timestamp | Default: now() |

### cases — 16 columns
| Column | Type | Constraints |
|--------|------|------------|
| `id` | serial | PK |
| `case_id` | varchar(50) | UNIQUE (VDT-YYYY-NNN) |
| `name` | text | NOT NULL |
| `type` | varchar(100) | NOT NULL |
| `status` | varchar(20) | `intake`/`discovery`/`motion`/`trial`/`closed` |
| `lead` | text | NOT NULL |
| `priority` | varchar(20) | Default: `"Medium"` |
| `next_date` | text | Nullable |
| `billing` | JSONB | `{total, billed, outstanding, hours}` |
| `court` | text | Nullable |
| `judge` | text | Nullable |
| `filed` | text | Nullable |
| `team` | JSONB | Array of team members |
| `timeline` | JSONB | Array of timeline entries |
| `documents` | JSONB | Array of documents |
| `related_cases` | JSONB | Array of related cases |

### events — 5 columns (Dashboard)
| Column | Type | Constraints |
|--------|------|------------|
| `id` | serial | PK |
| `day` | text | NOT NULL |
| `event` | text | NOT NULL |
| `time` | text | NOT NULL |
| `type` | varchar(50) | NOT NULL |

### activities — 5 columns (Dashboard)
| Column | Type | Constraints |
|--------|------|------------|
| `id` | serial | PK |
| `user` | text | NOT NULL |
| `action` | text | NOT NULL |
| `target` | text | NOT NULL |
| `time` | text | NOT NULL |

### calendar_events — 10 columns
| Column | Type | Constraints |
|--------|------|------------|
| `id` | serial | PK |
| `title` | text | NOT NULL |
| `type` | varchar(30) | `hearing`/`meeting`/`mock-trial`/`deadline`/`deposition`/`internal`/`reminder`/`limitation` |
| `date` | varchar(10) | YYYY-MM-DD |
| `time` | text | NOT NULL |
| `lawyer` | text | NOT NULL |
| `case_ref` | text | Nullable |
| `location` | text | Nullable |
| `conflict` | boolean | Default: false |
| `recurring` | boolean | Default: false |

### team_messages — 5 columns
| Column | Type | Constraints |
|--------|------|------------|
| `id` | serial | PK |
| `user_id` | integer | FK → users (SET NULL) |
| `user_name` | text | NOT NULL |
| `text` | text | NOT NULL |
| `thread` | varchar(100) | Default: `"General"` |

### tasks — 8 columns
| Column | Type | Constraints |
|--------|------|------------|
| `id` | serial | PK |
| `title` | text | NOT NULL |
| `assignee` | text | NOT NULL |
| `case_ref` | text | Nullable |
| `status` | varchar(20) | `todo`/`in-progress`/`review`/`done` |
| `priority` | varchar(20) | Default: `"Medium"` |
| `due` | text | Nullable |

### time_entries — 8 columns
| Column | Type | Constraints |
|--------|------|------------|
| `id` | serial | PK |
| `user_id` | integer | FK → users (SET NULL) |
| `lawyer` | text | NOT NULL |
| `case_ref` | text | NOT NULL |
| `activity` | text | NOT NULL |
| `hours_cents` | integer | Stored as cents (350 = 3.50h) |
| `billable` | boolean | Default: true |
| `date` | varchar(10) | YYYY-MM-DD |

## Migration Commands

```bash
# Push schema changes to Neon
npx drizzle-kit push

# Generate migration files
npx drizzle-kit generate

# View Drizzle Studio (GUI)
npx drizzle-kit studio
```
