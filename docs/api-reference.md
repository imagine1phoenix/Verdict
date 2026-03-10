# VERDICT — API Reference

## Authentication

All mutating endpoints require a valid NextAuth session (JWT cookie).
Public endpoints: `/api/auth/*`, `/api/seed`.

---

## Auth

### POST /api/auth/register
Register a new user with credentials.

**Body:**
```json
{ "name": "Adv. Prit Thacker", "email": "prit@verdictlaw.in", "password": "securepass" }
```
**Response (201):** `{ id, name, email, role, createdAt }`
**Errors:** 400 (missing fields, email exists), 500

### GET/POST /api/auth/[...nextauth]
NextAuth handler — login, callback, session, signout.

---

## Cases

### GET /api/cases
List all cases. Supports `?status=`, `?search=`.

**Response (200):** `Case[]`

### POST /api/cases
Create a new case.

**Body:**
```json
{
  "caseId": "VDT-2024-007",
  "name": "Kapoor v. Singh",
  "type": "Civil Dispute",
  "status": "intake",
  "lead": "Adv. Prit Thacker",
  "priority": "High"
}
```
**Response (201):** `Case`

### GET /api/cases/[id]
Get a single case by numeric ID.

**Response (200):** `Case`
**Errors:** 404

### PATCH /api/cases/[id]
Update case fields.

**Body:** Partial `Case` fields
**Response (200):** Updated `Case`

### DELETE /api/cases/[id]
Delete a case.

**Response (200):** `{ message: "deleted" }`
**Errors:** 404

---

## Calendar Events

### GET /api/events
List all calendar events. Supports `?type=`, `?lawyer=`.

**Response (200):** `CalendarEvent[]`

### POST /api/events
Create a calendar event.

**Body:**
```json
{
  "title": "Bail Hearing — Sharma v. State",
  "type": "hearing",
  "date": "2024-03-15",
  "time": "10:30 AM",
  "lawyer": "Adv. Prit Thacker",
  "caseRef": "VDT-2024-001",
  "location": "Bombay High Court, Room 4"
}
```
**Response (201):** `CalendarEvent`

### DELETE /api/events
Delete by `?id=`. **Response (200):** `{ message: "deleted" }`

---

## Dashboard

### GET /api/dashboard
Returns dashboard data (events + activities).

**Response (200):**
```json
{ "events": Event[], "activities": Activity[] }
```

---

## Search

### GET /api/search
Global search across cases, events, users. Requires `?q=`.

**Response (200):**
```json
[
  { "type": "case", "id": 1, "title": "Sharma v. State", "subtitle": "VDT-2024-001 · Criminal Defense · discovery" },
  { "type": "event", "id": 5, "title": "Pre-Trial Conference", "subtitle": "2024-03-15 · hearing" },
  { "type": "user", "id": 1, "title": "Adv. Prit Thacker", "subtitle": "Senior Partner · online" }
]
```

---

## Team Messages

### GET /api/team/messages
List all messages. Supports `?thread=`.

**Response (200):** `TeamMessage[]`

### POST /api/team/messages
Send a message.

**Body:**
```json
{ "userName": "Adv. Prit", "text": "Evidence deadline is Friday.", "thread": "Sharma v. State" }
```
**Response (201):** `TeamMessage`

---

## Team Tasks

### GET /api/team/tasks
List all tasks. Supports `?status=`, `?assignee=`.

**Response (200):** `Task[]`

### POST /api/team/tasks
Create a task.

**Body:**
```json
{ "title": "Draft witness list", "assignee": "Adv. Meera Shah", "caseRef": "VDT-2024-001", "priority": "High", "due": "2024-03-20" }
```
**Response (201):** `Task`

### PATCH /api/team/tasks
Update task (status change, etc). Requires `body.id`.

**Body:** `{ "id": 1, "status": "in-progress" }`
**Response (200):** Updated `Task`

### DELETE /api/team/tasks
Delete by `?id=`. **Response (200):** `{ message: "deleted" }`

---

## Time Entries

### GET /api/team/time
List all time entries.

**Response (200):** `TimeEntry[]`

### POST /api/team/time
Log a time entry.

**Body:**
```json
{ "lawyer": "Adv. Prit Thacker", "caseRef": "VDT-2024-001", "activity": "Case research", "hours": 350, "billable": true, "date": "2024-03-10" }
```
**Response (201):** `TimeEntry`

---

## Users

### GET /api/users
List all active users.

**Response (200):** `User[]` (password field excluded)

### PATCH /api/users
Update user profile. Requires `body.id`.

**Body:** `{ "id": 1, "name": "Adv. Prit Thacker", "role": "Senior Partner" }`
**Response (200):** Updated `User`

---

## Seed

### POST /api/seed
Reset and seed all 8 tables with mock data.

**Response (200):**
```json
{
  "message": "Database seeded successfully",
  "counts": { "users": 5, "cases": 6, "events": 5, "activities": 5, "calendarEvents": 12, "messages": 9, "tasks": 8, "timeEntries": 8 }
}
```
