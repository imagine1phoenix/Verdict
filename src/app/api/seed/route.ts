import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases, events, activities, users } from "@/lib/schema";

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
        caseId: "VDT-2024-002",
        name: "Nexus Inc. Patent Dispute",
        type: "IP Litigation",
        status: "motion",
        lead: "Adv. Meera",
        priority: "High",
        nextDate: "Mar 5",
        billing: { total: "₹8,50,000", billed: "₹5,00,000", outstanding: "₹3,50,000", hours: 120 },
        court: "High Court — Delhi",
        judge: "Hon. Justice S. Kapoor",
        filed: "Dec 1, 2023",
        team: [{ name: "Adv. Meera Shah", role: "Lead Counsel" }],
        timeline: [],
        documents: [],
        relatedCases: [],
    },
    {
        caseId: "VDT-2024-003",
        name: "Horizon Corp Acquisition",
        type: "Corporate / M&A",
        status: "discovery",
        lead: "Adv. Prit",
        priority: "Medium",
        nextDate: "Mar 12",
        billing: { total: "₹12,00,000", billed: "₹8,00,000", outstanding: "₹4,00,000", hours: 200 },
        court: "NCLT — Mumbai",
        judge: "Hon. Member P. Rao",
        filed: "Nov 15, 2023",
        team: [{ name: "Adv. Prit Thacker", role: "Lead Counsel" }],
        timeline: [],
        documents: [],
        relatedCases: [],
    },
    {
        caseId: "VDT-2024-004",
        name: "DEF Corp Defense",
        type: "Commercial Dispute",
        status: "trial",
        lead: "Adv. Rohan",
        priority: "High",
        nextDate: "Feb 26",
        billing: { total: "₹6,75,000", billed: "₹4,00,000", outstanding: "₹2,75,000", hours: 90 },
        court: "District Court — Mumbai",
        judge: "Hon. Judge M. Verma",
        filed: "Oct 20, 2023",
        team: [{ name: "Adv. Rohan Iyer", role: "Lead Counsel" }],
        timeline: [],
        documents: [],
        relatedCases: [],
    },
    {
        caseId: "VDT-2024-005",
        name: "Gupta Family Estate",
        type: "Family Law",
        status: "intake",
        lead: "Adv. Priya",
        priority: "Medium",
        nextDate: "Mar 20",
        billing: { total: "₹1,50,000", billed: "₹50,000", outstanding: "₹1,00,000", hours: 15 },
        court: "Family Court — Mumbai",
        judge: "TBD",
        filed: "Feb 1, 2024",
        team: [{ name: "Adv. Priya Desai", role: "Lead Counsel" }],
        timeline: [],
        documents: [],
        relatedCases: [],
    },
    {
        caseId: "VDT-2024-006",
        name: "CloudNet Data Breach",
        type: "Privacy / DPDP",
        status: "discovery",
        lead: "Adv. Meera",
        priority: "Critical",
        nextDate: "Mar 1",
        billing: { total: "₹3,20,000", billed: "₹1,20,000", outstanding: "₹2,00,000", hours: 40 },
        court: "High Court — Karnataka",
        judge: "Hon. Justice K. Naik",
        filed: "Jan 10, 2024",
        team: [{ name: "Adv. Meera Shah", role: "Lead Counsel" }],
        timeline: [],
        documents: [],
        relatedCases: [],
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

export async function POST() {
    try {
        // Clear existing data
        await Promise.all([
            db.delete(cases),
            db.delete(events),
            db.delete(activities),
            db.delete(users),
        ]);

        // Insert seed data
        await Promise.all([
            db.insert(cases).values(seedCases),
            db.insert(events).values(seedEvents),
            db.insert(activities).values(seedActivities),
            db.insert(users).values(seedUsers),
        ]);

        return NextResponse.json({
            message: "Database seeded successfully",
            counts: {
                cases: seedCases.length,
                events: seedEvents.length,
                activities: seedActivities.length,
                users: seedUsers.length,
            },
        });
    } catch (error) {
        console.error("POST /api/seed error:", error);
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
    }
}
