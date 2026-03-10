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
