import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases, events, activities, users, calendarEvents, teamMessages, tasks, timeEntries } from "@/lib/schema";

const seedCases = [
    {
        caseId: "VDT-2024-001",
        name: "Sharma v. State of Maharashtra",
        type: "Criminal Defense",
        status: "discovery",
        lead: "Adv. Prit",
        priority: "High",
        nextDate: "Feb 28",
        billing: { total: "₹4,20,000", billed: "₹2,80,000", outstanding: "₹1,40,000", hours: 64 },
        court: "High Court — Maharashtra",
        judge: "Hon. Justice R. Deshmukh",
        filed: "Jan 15, 2024",
        team: [
            { name: "Adv. Prit Thacker", role: "Lead Counsel" },
            { name: "Adv. Meera Shah", role: "Associate" },
            { name: "Ravi Kumar", role: "Paralegal" },
        ],
        timeline: [
            { date: "Jan 15", event: "Case Filed", done: true },
            { date: "Jan 22", event: "First Hearing", done: true },
            { date: "Feb 10", event: "Discovery Begins", done: true },
            { date: "Feb 28", event: "Evidence Submission Deadline", done: false },
            { date: "Mar 15", event: "Pre-Trial Conference", done: false },
            { date: "Apr 5", event: "Trial Date", done: false },
        ],
        documents: [
            { name: "Charge Sheet.pdf", tag: "Filing", checkedOut: false, updated: "Feb 15" },
            { name: "Defense Brief_v3.docx", tag: "Brief", checkedOut: true, updated: "Today" },
            { name: "Witness Statement — Rajan.pdf", tag: "Evidence", checkedOut: false, updated: "Feb 20" },
            { name: "Bail Application.docx", tag: "Filing", checkedOut: false, updated: "Jan 22" },
        ],
        relatedCases: [
            { caseId: "VDT-2023-089", name: "State v. Patel (Similar Facts)", relevance: "87%" },
            { caseId: "VDT-2023-041", name: "Sharma Family — Property Dispute", relevance: "62%" },
        ],
    },
    {
        caseId: "VDT-2024-002", name: "Nexus Inc. Patent Dispute", type: "IP Litigation", status: "motion",
        lead: "Adv. Meera", priority: "High", nextDate: "Mar 5",
        billing: { total: "₹8,50,000", billed: "₹5,00,000", outstanding: "₹3,50,000", hours: 120 },
        court: "High Court — Delhi", judge: "Hon. Justice S. Kapoor", filed: "Dec 1, 2023",
        team: [{ name: "Adv. Meera Shah", role: "Lead Counsel" }], timeline: [], documents: [], relatedCases: [],
    },
    {
        caseId: "VDT-2024-003", name: "Horizon Corp Acquisition", type: "Corporate / M&A", status: "discovery",
        lead: "Adv. Prit", priority: "Medium", nextDate: "Mar 12",
        billing: { total: "₹12,00,000", billed: "₹8,00,000", outstanding: "₹4,00,000", hours: 200 },
        court: "NCLT — Mumbai", judge: "Hon. Member P. Rao", filed: "Nov 15, 2023",
        team: [{ name: "Adv. Prit Thacker", role: "Lead Counsel" }], timeline: [], documents: [], relatedCases: [],
    },
    {
        caseId: "VDT-2024-004", name: "DEF Corp Defense", type: "Commercial Dispute", status: "trial",
        lead: "Adv. Rohan", priority: "High", nextDate: "Feb 26",
        billing: { total: "₹6,75,000", billed: "₹4,00,000", outstanding: "₹2,75,000", hours: 90 },
        court: "District Court — Mumbai", judge: "Hon. Judge M. Verma", filed: "Oct 20, 2023",
        team: [{ name: "Adv. Rohan Iyer", role: "Lead Counsel" }], timeline: [], documents: [], relatedCases: [],
    },
    {
        caseId: "VDT-2024-005", name: "Gupta Family Estate", type: "Family Law", status: "intake",
        lead: "Adv. Priya", priority: "Medium", nextDate: "Mar 20",
        billing: { total: "₹1,50,000", billed: "₹50,000", outstanding: "₹1,00,000", hours: 15 },
        court: "Family Court — Mumbai", judge: "TBD", filed: "Feb 1, 2024",
        team: [{ name: "Adv. Priya Desai", role: "Lead Counsel" }], timeline: [], documents: [], relatedCases: [],
    },
    {
        caseId: "VDT-2024-006", name: "CloudNet Data Breach", type: "Privacy / DPDP", status: "discovery",
        lead: "Adv. Meera", priority: "Critical", nextDate: "Mar 1",
        billing: { total: "₹3,20,000", billed: "₹1,20,000", outstanding: "₹2,00,000", hours: 40 },
        court: "High Court — Karnataka", judge: "Hon. Justice K. Naik", filed: "Jan 10, 2024",
        team: [{ name: "Adv. Meera Shah", role: "Lead Counsel" }], timeline: [], documents: [], relatedCases: [],
    },
];

const seedEvents = [
    { day: "Today", event: "Deposition Review", time: "2:00 PM", type: "Deposition" },
    { day: "Tomorrow", event: "Mock Trial — Smith v. Jones", time: "10:00 AM", type: "Trial" },
    { day: "Wed", event: "Client Briefing — Horizon Corp", time: "3:30 PM", type: "Meeting" },
    { day: "Thu", event: "Evidence Review Deadline", time: "EOD", type: "Deadline" },
    { day: "Fri", event: "Settlement Negotiation", time: "11:00 AM", type: "Negotiation" },
];

const seedActivities = [
    { user: "Adv. Prit", action: "edited case brief", target: "Sharma v. State", time: "10m ago" },
    { user: "System", action: "Mock trial completed", target: "Smith v. Jones — 82% win", time: "1h ago" },
    { user: "Adv. Meera", action: "added new evidence", target: "Nexus IP Dispute", time: "3h ago" },
    { user: "System", action: "Document scan finished", target: "MSA_v3.docx — 2 risks", time: "5h ago" },
    { user: "Adv. Prit", action: "scheduled hearing", target: "DEF Corp Defense", time: "1d ago" },
];

const seedUsers = [
    { name: "Adv. Prit Thacker", email: "prit@verdictlaw.in", password: "password123", role: "Senior Partner", avatar: "PT", status: "online" as const, activeCases: 4, hoursThisWeek: 32, viewing: "Sharma v. State — Defense Brief", provider: "credentials" as const },
    { name: "Adv. Meera Shah", email: "meera@verdictlaw.in", password: "password123", role: "Associate", avatar: "MS", status: "online" as const, activeCases: 3, hoursThisWeek: 28, viewing: "Nexus IP — Patent Claims", provider: "credentials" as const },
    { name: "Ravi Kumar", email: "ravi@verdictlaw.in", password: "password123", role: "Paralegal", avatar: "RK", status: "online" as const, activeCases: 2, hoursThisWeek: 40, viewing: "Evidence Vault — Bates Indexing", provider: "credentials" as const },
    { name: "Adv. Rohan Iyer", email: "rohan@verdictlaw.in", password: "password123", role: "Associate", avatar: "RI", status: "away" as const, activeCases: 2, hoursThisWeek: 20, viewing: null, provider: "credentials" as const },
    { name: "Adv. Priya Desai", email: "priya@verdictlaw.in", password: "password123", role: "Associate", avatar: "PD", status: "offline" as const, activeCases: 1, hoursThisWeek: 15, viewing: null, provider: "credentials" as const },
];

// ─── New seed data for Phase 1 tables ────────────────────────────────────────

const seedCalendarEvents = [
    { title: "Sharma v. State — Evidence Submission Deadline", type: "deadline", date: "2024-02-28", time: "17:00", lawyer: "Adv. Prit", caseRef: "VDT-2024-001", location: "High Court — Maharashtra" },
    { title: "Sharma v. State — Pre-Trial Conference", type: "hearing", date: "2024-03-15", time: "10:30", lawyer: "Adv. Prit", caseRef: "VDT-2024-001", location: "High Court — Maharashtra" },
    { title: "Nexus Inc. — Motion Hearing", type: "hearing", date: "2024-03-05", time: "11:00", lawyer: "Adv. Meera", caseRef: "VDT-2024-002", location: "High Court — Delhi" },
    { title: "Horizon Corp — Board Meeting", type: "meeting", date: "2024-03-12", time: "14:00", lawyer: "Adv. Prit", caseRef: "VDT-2024-003", location: "NCLT — Mumbai" },
    { title: "DEF Corp — Cross-Examination", type: "hearing", date: "2024-02-26", time: "10:00", lawyer: "Adv. Rohan", caseRef: "VDT-2024-004", location: "District Court — Mumbai", conflict: true },
    { title: "CloudNet — Deposition of CTO", type: "deposition", date: "2024-03-01", time: "15:00", lawyer: "Adv. Meera", caseRef: "VDT-2024-006", location: "High Court — Karnataka" },
    { title: "Weekly Team Standup", type: "internal", date: "2024-03-04", time: "09:00", lawyer: "Adv. Prit", recurring: true },
    { title: "Mock Trial — Opening Statements", type: "mock-trial", date: "2024-03-08", time: "10:00", lawyer: "Adv. Meera", location: "Moot Court Room B" },
    { title: "Client Onboarding — GreenTech", type: "meeting", date: "2024-03-10", time: "11:00", lawyer: "Adv. Priya" },
    { title: "Limitation Period — Singh v. ACC Ltd", type: "limitation", date: "2024-03-20", time: "23:59", lawyer: "Adv. Rohan" },
    { title: "Patent Filing Deadline — US-2021-0342", type: "deadline", date: "2024-03-07", time: "17:00", lawyer: "Adv. Meera", caseRef: "VDT-2024-002" },
    { title: "Gupta Estate — Initial Consultation", type: "meeting", date: "2024-03-20", time: "10:00", lawyer: "Adv. Priya", caseRef: "VDT-2024-005", location: "Family Court — Mumbai" },
];

const seedMessages = [
    { userName: "Adv. Prit", text: "Team, the Sharma evidence deadline is on Feb 28. Let's sync today on what's pending.", thread: "General" },
    { userName: "Adv. Meera", text: "I've uploaded the patent analysis for Nexus. @Ravi can you index the Bates numbers?", thread: "General" },
    { userName: "Ravi Kumar", text: "On it. Should be done by EOD.", thread: "General" },
    { userName: "Adv. Prit", text: "The mock trial scores are looking good. 82% prediction accuracy this month.", thread: "General" },
    { userName: "Adv. Rohan", text: "DEF Corp cross-examination prep is underway. Need witness list from Meera.", thread: "General" },
    { userName: "Adv. Meera", text: "Sent. Check the Evidence Vault — I added 3 new exhibits.", thread: "General" },
    { userName: "Adv. Prit", text: "Horizon Corp MSA: the indemnity clause needs a cap on consequential damages.", thread: "Sharma v. State" },
    { userName: "Adv. Meera", text: "Agreed. I'll update the clause library template.", thread: "Sharma v. State" },
    { userName: "Adv. Priya", text: "Gupta family intake is complete. Filing today.", thread: "General" },
];

const seedTasks = [
    { title: "Upload remaining evidence exhibits", assignee: "Ravi Kumar", caseRef: "VDT-2024-001", status: "in-progress", priority: "High", due: "Feb 27" },
    { title: "Draft cross-examination outline", assignee: "Adv. Prit", caseRef: "VDT-2024-001", status: "todo", priority: "High", due: "Mar 10" },
    { title: "Review patent claims analysis", assignee: "Adv. Meera", caseRef: "VDT-2024-002", status: "review", priority: "Medium", due: "Mar 3" },
    { title: "Prepare motion to dismiss brief", assignee: "Adv. Rohan", caseRef: "VDT-2024-004", status: "todo", priority: "High", due: "Feb 25" },
    { title: "Index Bates numbers — Nexus exhibits", assignee: "Ravi Kumar", caseRef: "VDT-2024-002", status: "in-progress", priority: "Medium", due: "Mar 1" },
    { title: "Update indemnity clause — Horizon MSA", assignee: "Adv. Meera", caseRef: "VDT-2024-003", status: "todo", priority: "Low", due: "Mar 15" },
    { title: "Complete client onboarding — GreenTech", assignee: "Adv. Priya", status: "done", priority: "Medium", due: "Mar 1" },
    { title: "DPDP Act compliance review", assignee: "Adv. Meera", caseRef: "VDT-2024-006", status: "in-progress", priority: "Critical", due: "Mar 5" },
];

const seedTimeEntries = [
    { lawyer: "Adv. Prit", caseRef: "VDT-2024-001", activity: "Case brief drafting", hours: 350, billable: true, date: "2024-02-22" },
    { lawyer: "Adv. Prit", caseRef: "VDT-2024-003", activity: "MSA clause review", hours: 200, billable: true, date: "2024-02-22" },
    { lawyer: "Adv. Meera", caseRef: "VDT-2024-002", activity: "Patent analysis", hours: 475, billable: true, date: "2024-02-22" },
    { lawyer: "Adv. Meera", caseRef: "VDT-2024-006", activity: "DPDP compliance research", hours: 300, billable: true, date: "2024-02-21" },
    { lawyer: "Ravi Kumar", caseRef: "VDT-2024-001", activity: "Evidence indexing", hours: 600, billable: false, date: "2024-02-22" },
    { lawyer: "Adv. Rohan", caseRef: "VDT-2024-004", activity: "Cross-examination prep", hours: 250, billable: true, date: "2024-02-22" },
    { lawyer: "Adv. Priya", caseRef: "VDT-2024-005", activity: "Client consultation", hours: 150, billable: true, date: "2024-02-22" },
    { lawyer: "Adv. Prit", caseRef: "VDT-2024-001", activity: "Witness deposition review", hours: 400, billable: true, date: "2024-02-21" },
];

export async function POST() {
    try {
        // Clear existing data — children first
        await db.delete(timeEntries);
        await db.delete(tasks);
        await db.delete(teamMessages);
        await db.delete(calendarEvents);
        await db.delete(activities);
        await db.delete(events);
        await db.delete(cases);
        // loginHistory references users, clear it before users
        const { loginHistory } = await import("@/lib/schema");
        await db.delete(loginHistory);
        await db.delete(users);

        // Insert seed data
        await db.insert(users).values(seedUsers);
        await Promise.all([
            db.insert(cases).values(seedCases),
            db.insert(events).values(seedEvents),
            db.insert(activities).values(seedActivities),
            db.insert(calendarEvents).values(seedCalendarEvents),
            db.insert(teamMessages).values(seedMessages),
            db.insert(tasks).values(seedTasks),
            db.insert(timeEntries).values(seedTimeEntries),
        ]);

        return NextResponse.json({
            message: "Database seeded successfully",
            counts: {
                users: seedUsers.length,
                cases: seedCases.length,
                events: seedEvents.length,
                activities: seedActivities.length,
                calendarEvents: seedCalendarEvents.length,
                messages: seedMessages.length,
                tasks: seedTasks.length,
                timeEntries: seedTimeEntries.length,
            },
        });
    } catch (error) {
        console.error("POST /api/seed error:", error);
        return NextResponse.json({ error: "Failed to seed database", detail: String(error) }, { status: 500 });
    }
}
