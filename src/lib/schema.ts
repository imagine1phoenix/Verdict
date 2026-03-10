import { pgTable, serial, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password"), // null for Google OAuth users
    role: varchar("role", { length: 100 }).default("member").notNull(),
    avatar: text("avatar").default(""),
    status: varchar("status", { length: 20 }).default("offline").notNull(),
    activeCases: integer("active_cases").default(0).notNull(),
    hoursThisWeek: integer("hours_this_week").default(0).notNull(),
    viewing: text("viewing"),
    provider: varchar("provider", { length: 20 }).default("credentials").notNull(),
    loginCount: integer("login_count").default(0).notNull(),
    lastLoginAt: timestamp("last_login_at"),
    lastSeenAt: timestamp("last_seen_at"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Login History ───────────────────────────────────────────────────────────

export const loginHistory = pgTable("login_history", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    method: varchar("method", { length: 20 }).notNull(), // "credentials" | "google"
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// ─── Cases ───────────────────────────────────────────────────────────────────

export const cases = pgTable("cases", {
    id: serial("id").primaryKey(),
    caseId: varchar("case_id", { length: 50 }).notNull().unique(),
    name: text("name").notNull(),
    type: varchar("type", { length: 100 }).notNull(),
    status: varchar("status", { length: 20 }).notNull(), // intake, discovery, motion, trial, closed
    lead: text("lead").notNull(),
    priority: varchar("priority", { length: 20 }).default("Medium").notNull(),
    nextDate: text("next_date"),
    billing: jsonb("billing").default({}).notNull(),
    court: text("court"),
    judge: text("judge"),
    filed: text("filed"),
    team: jsonb("team").default([]).notNull(),
    timeline: jsonb("timeline").default([]).notNull(),
    documents: jsonb("documents").default([]).notNull(),
    relatedCases: jsonb("related_cases").default([]).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Events ──────────────────────────────────────────────────────────────────

export const events = pgTable("events", {
    id: serial("id").primaryKey(),
    day: text("day").notNull(),
    event: text("event").notNull(),
    time: text("time").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Activities ──────────────────────────────────────────────────────────────

export const activities = pgTable("activities", {
    id: serial("id").primaryKey(),
    user: text("user").notNull(),
    action: text("action").notNull(),
    target: text("target").notNull(),
    time: text("time").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Calendar Events ─────────────────────────────────────────────────────────

export const calendarEvents = pgTable("calendar_events", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    type: varchar("type", { length: 30 }).notNull(), // hearing, meeting, mock-trial, deadline, deposition, internal, reminder, limitation
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
    time: text("time").notNull(),
    lawyer: text("lawyer").notNull(),
    caseRef: text("case_ref"), // optional case ID reference
    location: text("location"),
    conflict: boolean("conflict").default(false).notNull(),
    recurring: boolean("recurring").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Team Messages ───────────────────────────────────────────────────────────

export const teamMessages = pgTable("team_messages", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    userName: text("user_name").notNull(),
    text: text("text").notNull(),
    thread: varchar("thread", { length: 100 }).default("General").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Tasks ───────────────────────────────────────────────────────────────────

export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    assignee: text("assignee").notNull(),
    caseRef: text("case_ref"),
    status: varchar("status", { length: 20 }).default("todo").notNull(), // todo, in-progress, review, done
    priority: varchar("priority", { length: 20 }).default("Medium").notNull(),
    due: text("due"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Time Entries ────────────────────────────────────────────────────────────

export const timeEntries = pgTable("time_entries", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    lawyer: text("lawyer").notNull(),
    caseRef: text("case_ref").notNull(),
    activity: text("activity").notNull(),
    hours: integer("hours_cents").notNull(), // stored as cents (350 = 3.50h)
    billable: boolean("billable").default(true).notNull(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Documents ───────────────────────────────────────────────────────────────

export const documents = pgTable("documents", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    caseRef: text("case_ref"),
    category: varchar("category", { length: 50 }).notNull(), // pleading, contract, evidence, correspondence, brief, motion, memo, other
    status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, review, approved, filed, archived
    uploadedBy: integer("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    uploadedByName: text("uploaded_by_name"),
    fileUrl: text("file_url"),
    fileType: varchar("file_type", { length: 20 }), // pdf, docx, xlsx, img, other
    fileSize: integer("file_size"), // bytes
    version: integer("version").default(1).notNull(),
    tags: jsonb("tags").default([]).notNull(),
    metadata: jsonb("metadata").default({}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Mock Trials ─────────────────────────────────────────────────────────────

export const mockTrials = pgTable("mock_trials", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    caseRef: text("case_ref"),
    status: varchar("status", { length: 20 }).default("scheduled").notNull(), // scheduled, in-progress, completed, cancelled
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
    time: text("time"),
    location: text("location"),
    presiding: text("presiding"),
    team: jsonb("team").default([]).notNull(), // [{name, role}]
    witnesses: jsonb("witnesses").default([]).notNull(), // [{name, type, status}]
    notes: text("notes"),
    outcome: text("outcome"),
    recordings: jsonb("recordings").default([]).notNull(), // [{url, label, duration}]
    score: jsonb("score"), // {persuasion, preparation, evidence_handling, overall}
    feedback: jsonb("feedback").default([]).notNull(), // [{from, comment, rating}]
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Proofreading Jobs ───────────────────────────────────────────────────────

export const proofreadingJobs = pgTable("proofreading_jobs", {
    id: serial("id").primaryKey(),
    documentId: integer("document_id").references(() => documents.id, { onDelete: "set null" }),
    documentTitle: text("document_title"),
    submittedBy: integer("submitted_by").references(() => users.id, { onDelete: "set null" }),
    submittedByName: text("submitted_by_name"),
    status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, in-progress, completed, revision-needed
    priority: varchar("priority", { length: 20 }).default("Medium").notNull(),
    assignedTo: text("assigned_to"),
    originalText: text("original_text"),
    correctedText: text("corrected_text"),
    comments: jsonb("comments").default([]).notNull(), // [{author, text, position, resolved}]
    issuesFound: integer("issues_found").default(0).notNull(),
    dueDate: text("due_date"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Evidence ────────────────────────────────────────────────────────────────

export const evidence = pgTable("evidence", {
    id: serial("id").primaryKey(),
    evidenceId: varchar("evidence_id", { length: 50 }).notNull().unique(), // EVD-YYYY-NNN
    caseRef: text("case_ref"),
    title: text("title").notNull(),
    type: varchar("type", { length: 30 }).notNull(), // physical, digital, documentary, testimonial, forensic
    status: varchar("status", { length: 20 }).default("collected").notNull(), // collected, processing, verified, admitted, challenged, excluded
    collectedBy: text("collected_by"),
    collectedDate: varchar("collected_date", { length: 10 }),
    chainOfCustody: jsonb("chain_of_custody").default([]).notNull(), // [{handler, action, date, location, notes}]
    storageLocation: text("storage_location"),
    fileUrl: text("file_url"),
    description: text("description"),
    tags: jsonb("tags").default([]).notNull(),
    metadata: jsonb("metadata").default({}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Knowledge Articles ──────────────────────────────────────────────────────

export const knowledgeArticles = pgTable("knowledge_articles", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    category: varchar("category", { length: 50 }).notNull(), // case-law, statute, procedure, template, guide, precedent, internal-memo
    content: text("content"), // full body — markdown supported
    summary: text("summary"),
    author: text("author"),
    tags: jsonb("tags").default([]).notNull(),
    references: jsonb("references").default([]).notNull(), // [{title, url, type}]
    views: integer("views").default(0).notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Past Trials ─────────────────────────────────────────────────────────────

export const pastTrials = pgTable("past_trials", {
    id: serial("id").primaryKey(),
    caseRef: text("case_ref"),
    caseName: text("case_name").notNull(),
    court: text("court"),
    judge: text("judge"),
    verdict: varchar("verdict", { length: 20 }).notNull(), // won, lost, settled, dismissed, mistrial
    dateConcluded: varchar("date_concluded", { length: 10 }),
    durationDays: integer("duration_days"),
    leadAttorney: text("lead_attorney"),
    team: jsonb("team").default([]).notNull(),
    summary: text("summary"),
    keyArguments: jsonb("key_arguments").default([]).notNull(), // array of strings
    opposingCounsel: text("opposing_counsel"),
    lessonsLearned: text("lessons_learned"),
    documents: jsonb("documents").default([]).notNull(), // [{title, url}]
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Analytics Snapshots ─────────────────────────────────────────────────────

export const analyticsSnapshots = pgTable("analytics_snapshots", {
    id: serial("id").primaryKey(),
    period: varchar("period", { length: 20 }).notNull(), // daily, weekly, monthly, quarterly, yearly
    date: varchar("date", { length: 10 }).notNull(),
    metrics: jsonb("metrics").default({}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Admin Tables ────────────────────────────────────────────────────────────

export const auditLogs = pgTable("audit_logs", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    userName: text("user_name"),
    userEmail: text("user_email"),
    action: varchar("action", { length: 50 }).notNull(),
    resourceType: varchar("resource_type", { length: 50 }).notNull(),
    resourceId: integer("resource_id"),
    resourceName: text("resource_name"),
    details: jsonb("details"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const systemSettings = pgTable("system_settings", {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: jsonb("value").notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    label: text("label").notNull(),
    description: text("description"),
    updatedBy: integer("updated_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    type: varchar("type", { length: 20 }).notNull(),
    authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
    authorName: text("author_name"),
    isActive: boolean("is_active").default(true).notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    expiresAt: timestamp("expires_at"),
    targetRoles: jsonb("target_roles").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
