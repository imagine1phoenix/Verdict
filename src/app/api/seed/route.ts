import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
    cases, events, activities, users, calendarEvents, teamMessages, tasks, timeEntries,
    documents, mockTrials, proofreadingJobs, evidence, knowledgeArticles, pastTrials,
    loginHistory, analyticsSnapshots
} from "@/lib/schema";

// ─── Existing seed data ──────────────────────────────────────────────────────

const seedCases = [
    {
        caseId: "VDT-2024-001", name: "Sharma v. State of Maharashtra", type: "Criminal Defense", status: "discovery",
        lead: "Adv. Prit", priority: "High", nextDate: "Feb 28",
        billing: { total: "₹4,20,000", billed: "₹2,80,000", outstanding: "₹1,40,000", hours: 64 },
        court: "High Court — Maharashtra", judge: "Hon. Justice R. Deshmukh", filed: "Jan 15, 2024",
        team: [{ name: "Adv. Prit Thacker", role: "Lead Counsel" }, { name: "Adv. Meera Shah", role: "Associate" }, { name: "Ravi Kumar", role: "Paralegal" }],
        timeline: [{ date: "Jan 15", event: "Case Filed", done: true }, { date: "Jan 22", event: "First Hearing", done: true }, { date: "Feb 10", event: "Discovery Begins", done: true }, { date: "Feb 28", event: "Evidence Submission Deadline", done: false }, { date: "Mar 15", event: "Pre-Trial Conference", done: false }, { date: "Apr 5", event: "Trial Date", done: false }],
        documents: [{ name: "Charge Sheet.pdf", tag: "Filing", checkedOut: false, updated: "Feb 15" }, { name: "Defense Brief_v3.docx", tag: "Brief", checkedOut: true, updated: "Today" }, { name: "Witness Statement — Rajan.pdf", tag: "Evidence", checkedOut: false, updated: "Feb 20" }, { name: "Bail Application.docx", tag: "Filing", checkedOut: false, updated: "Jan 22" }],
        relatedCases: [{ caseId: "VDT-2023-089", name: "State v. Patel (Similar Facts)", relevance: "87%" }, { caseId: "VDT-2023-041", name: "Sharma Family — Property Dispute", relevance: "62%" }],
    },
    { caseId: "VDT-2024-002", name: "Nexus Inc. Patent Dispute", type: "IP Litigation", status: "motion", lead: "Adv. Meera", priority: "High", nextDate: "Mar 5", billing: { total: "₹8,50,000", billed: "₹5,00,000", outstanding: "₹3,50,000", hours: 120 }, court: "High Court — Delhi", judge: "Hon. Justice S. Kapoor", filed: "Dec 1, 2023", team: [{ name: "Adv. Meera Shah", role: "Lead Counsel" }], timeline: [], documents: [], relatedCases: [] },
    { caseId: "VDT-2024-003", name: "Horizon Corp Acquisition", type: "Corporate / M&A", status: "discovery", lead: "Adv. Prit", priority: "Medium", nextDate: "Mar 12", billing: { total: "₹12,00,000", billed: "₹8,00,000", outstanding: "₹4,00,000", hours: 200 }, court: "NCLT — Mumbai", judge: "Hon. Member P. Rao", filed: "Nov 15, 2023", team: [{ name: "Adv. Prit Thacker", role: "Lead Counsel" }], timeline: [], documents: [], relatedCases: [] },
    { caseId: "VDT-2024-004", name: "DEF Corp Defense", type: "Commercial Dispute", status: "trial", lead: "Adv. Rohan", priority: "High", nextDate: "Feb 26", billing: { total: "₹6,75,000", billed: "₹4,00,000", outstanding: "₹2,75,000", hours: 90 }, court: "District Court — Mumbai", judge: "Hon. Judge M. Verma", filed: "Oct 20, 2023", team: [{ name: "Adv. Rohan Iyer", role: "Lead Counsel" }], timeline: [], documents: [], relatedCases: [] },
    { caseId: "VDT-2024-005", name: "Gupta Family Estate", type: "Family Law", status: "intake", lead: "Adv. Priya", priority: "Medium", nextDate: "Mar 20", billing: { total: "₹1,50,000", billed: "₹50,000", outstanding: "₹1,00,000", hours: 15 }, court: "Family Court — Mumbai", judge: "TBD", filed: "Feb 1, 2024", team: [{ name: "Adv. Priya Desai", role: "Lead Counsel" }], timeline: [], documents: [], relatedCases: [] },
    { caseId: "VDT-2024-006", name: "CloudNet Data Breach", type: "Privacy / DPDP", status: "discovery", lead: "Adv. Meera", priority: "Critical", nextDate: "Mar 1", billing: { total: "₹3,20,000", billed: "₹1,20,000", outstanding: "₹2,00,000", hours: 40 }, court: "High Court — Karnataka", judge: "Hon. Justice K. Naik", filed: "Jan 10, 2024", team: [{ name: "Adv. Meera Shah", role: "Lead Counsel" }], timeline: [], documents: [], relatedCases: [] },
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

// ─── Phase 2 seed data ───────────────────────────────────────────────────────

const seedDocuments = [
    { title: "Charge Sheet — Sharma v. State", caseRef: "VDT-2024-001", category: "pleading", status: "filed", uploadedByName: "Adv. Prit Thacker", fileType: "pdf", fileSize: 245000, tags: ["criminal", "chargesheet", "maharashtra"], metadata: { pages: 24, court: "High Court — Maharashtra" } },
    { title: "Defense Brief v3", caseRef: "VDT-2024-001", category: "brief", status: "review", uploadedByName: "Adv. Prit Thacker", fileType: "docx", fileSize: 180000, tags: ["defense", "brief"], metadata: { pages: 18 } },
    { title: "Bail Application — Sharma", caseRef: "VDT-2024-001", category: "motion", status: "approved", uploadedByName: "Adv. Meera Shah", fileType: "pdf", fileSize: 98000, tags: ["bail", "criminal"], metadata: { pages: 8 } },
    { title: "Patent Claims Analysis — Nexus", caseRef: "VDT-2024-002", category: "correspondence", status: "approved", uploadedByName: "Adv. Meera Shah", fileType: "pdf", fileSize: 320000, tags: ["patent", "IP", "analysis"], metadata: { pages: 32 } },
    { title: "Motion to Dismiss — DEF Corp", caseRef: "VDT-2024-004", category: "motion", status: "draft", uploadedByName: "Adv. Rohan Iyer", fileType: "docx", fileSize: 156000, tags: ["motion", "dismiss", "commercial"], metadata: { pages: 14 } },
    { title: "MSA — Horizon Corp Acquisition", caseRef: "VDT-2024-003", category: "contract", status: "review", uploadedByName: "Adv. Prit Thacker", fileType: "docx", fileSize: 420000, tags: ["MSA", "M&A", "contract"], metadata: { pages: 45 } },
    { title: "DPDP Act Compliance Memo", caseRef: "VDT-2024-006", category: "memo", status: "draft", uploadedByName: "Adv. Meera Shah", fileType: "docx", fileSize: 78000, tags: ["DPDP", "compliance", "privacy"], metadata: { pages: 6 } },
    { title: "Witness Statement — Rajan Sharma", caseRef: "VDT-2024-001", category: "evidence", status: "filed", uploadedByName: "Ravi Kumar", fileType: "pdf", fileSize: 45000, tags: ["witness", "statement"], metadata: { pages: 4 } },
    { title: "Gupta Estate Will — Original", caseRef: "VDT-2024-005", category: "evidence", status: "approved", uploadedByName: "Adv. Priya Desai", fileType: "pdf", fileSize: 67000, tags: ["will", "estate", "original"], metadata: { pages: 5 } },
    { title: "Cross-Examination Notes — DEF Corp", caseRef: "VDT-2024-004", category: "brief", status: "draft", uploadedByName: "Adv. Rohan Iyer", fileType: "docx", fileSize: 92000, tags: ["cross-examination", "notes"], metadata: { pages: 10 } },
    { title: "Settlement Offer — CloudNet", caseRef: "VDT-2024-006", category: "correspondence", status: "review", uploadedByName: "Adv. Meera Shah", fileType: "pdf", fileSize: 34000, tags: ["settlement", "offer"], metadata: { pages: 3 } },
    { title: "Engagement Letter — GreenTech", category: "contract", status: "approved", uploadedByName: "Adv. Priya Desai", fileType: "pdf", fileSize: 56000, tags: ["engagement", "onboarding"], metadata: { pages: 4 } },
    { title: "Board Resolution — Horizon Corp", caseRef: "VDT-2024-003", category: "other", status: "filed", uploadedByName: "Adv. Prit Thacker", fileType: "pdf", fileSize: 28000, tags: ["resolution", "board"], metadata: { pages: 2 } },
    { title: "FIR Copy — Sharma Case", caseRef: "VDT-2024-001", category: "pleading", status: "filed", uploadedByName: "Ravi Kumar", fileType: "pdf", fileSize: 38000, tags: ["FIR", "criminal"], metadata: { pages: 3 } },
    { title: "Nexus Patent Filing — US-2021-0342", caseRef: "VDT-2024-002", category: "other", status: "filed", uploadedByName: "Adv. Meera Shah", fileType: "pdf", fileSize: 890000, tags: ["patent", "filing", "USPTO"], metadata: { pages: 68 } },
];

const seedMockTrials = [
    {
        title: "Sharma v. State — Full Trial Simulation", caseRef: "VDT-2024-001", status: "completed", date: "2024-02-15", time: "10:00 AM", location: "Moot Court Room A",
        presiding: "Ret. Justice A.P. Shah", team: [{ name: "Adv. Prit Thacker", role: "Lead Counsel" }, { name: "Adv. Meera Shah", role: "Cross-Examiner" }, { name: "Ravi Kumar", role: "Research Support" }],
        witnesses: [{ name: "Rajan Sharma (Instructed)", type: "Fact Witness", status: "Examined" }, { name: "Dr. Patil (Expert)", type: "Expert Witness", status: "Examined" }],
        notes: "Strong opening, but cross-examination pacing needs work. Judge noted weak rebuttal on forensic evidence.",
        outcome: "Jury verdict: 7-2 in favor — predicted win.",
        score: { persuasion: 78, preparation: 85, evidence_handling: 72, overall: 82 },
        feedback: [{ from: "Ret. Justice Shah", comment: "Opening was compelling. Strengthen the forensic rebuttal.", rating: 4 }, { from: "Adv. Meera", comment: "Cross-examination timing was good but could be more aggressive.", rating: 3 }],
    },
    {
        title: "DEF Corp — Cross-Examination Focus", caseRef: "VDT-2024-004", status: "scheduled", date: "2024-03-10", time: "2:00 PM", location: "Moot Court Room B",
        presiding: "Adv. Senior K.K. Venugopal", team: [{ name: "Adv. Rohan Iyer", role: "Lead Counsel" }, { name: "Adv. Prit Thacker", role: "Observer" }],
        witnesses: [{ name: "CFO — Vikram Mehta", type: "Hostile Witness", status: "Pending" }],
        notes: "Focus on financial discrepancy cross-examination techniques.",
    },
    {
        title: "Nexus IP — Opening/Closing Only", caseRef: "VDT-2024-002", status: "in-progress", date: "2024-02-28", time: "11:00 AM", location: "Conference Room 3",
        presiding: "Prof. R. Srinivasan", team: [{ name: "Adv. Meera Shah", role: "Lead Counsel" }],
        witnesses: [], notes: "Practice persuasive narrative for patent infringement arguments.",
    },
    {
        title: "CloudNet — Data Breach Liability", caseRef: "VDT-2024-006", status: "cancelled", date: "2024-02-20", time: "3:00 PM", location: "Moot Court Room A",
        presiding: "TBD", team: [{ name: "Adv. Meera Shah", role: "Lead Counsel" }],
        witnesses: [], notes: "Cancelled due to settlement negotiations.",
    },
];

const seedProofreadingJobs = [
    { documentTitle: "Defense Brief v3 — Sharma v. State", submittedByName: "Adv. Prit Thacker", status: "in-progress", priority: "High", assignedTo: "Ravi Kumar", originalText: "The accused, Mr. Rajan Sharma, has been charged under Section 302 of the Indian Penal Code...", issuesFound: 3, dueDate: "2024-02-27" },
    { documentTitle: "Patent Claims Analysis — Nexus", submittedByName: "Adv. Meera Shah", status: "completed", priority: "Medium", assignedTo: "Adv. Priya Desai", originalText: "The patent US-2021-0342 covers a method for distributed ledger consensus...", correctedText: "The patent US-2021-0342 covers a novel method for distributed ledger consensus...", issuesFound: 5, dueDate: "2024-02-25", completedAt: new Date("2024-02-24") },
    { documentTitle: "Motion to Dismiss — DEF Corp", submittedByName: "Adv. Rohan Iyer", status: "pending", priority: "High", originalText: "The plaintiff has failed to state a claim upon which relief can be granted...", issuesFound: 0, dueDate: "2024-03-01" },
    { documentTitle: "DPDP Act Compliance Memo", submittedByName: "Adv. Meera Shah", status: "revision-needed", priority: "Critical", assignedTo: "Adv. Prit Thacker", originalText: "Under Section 8 of the DPDP Act, 2023, every data fiduciary shall...", comments: [{ author: "Adv. Prit", text: "Section 8(3) citation is outdated — refer to latest gazette notification", position: 45, resolved: false }], issuesFound: 2, dueDate: "2024-03-02" },
    { documentTitle: "MSA — Horizon Corp Acquisition", submittedByName: "Adv. Prit Thacker", status: "in-progress", priority: "Medium", assignedTo: "Adv. Meera Shah", originalText: "This Master Service Agreement is entered into between Verdict Legal LLP and Horizon Corp...", issuesFound: 1, dueDate: "2024-03-10" },
    { documentTitle: "Engagement Letter — GreenTech", submittedByName: "Adv. Priya Desai", status: "completed", priority: "Low", assignedTo: "Ravi Kumar", originalText: "This letter confirms the engagement of Verdict Legal LLP to provide legal services...", correctedText: "This letter confirms the engagement of Verdict Legal LLP ('the Firm') to provide legal advisory services...", issuesFound: 2, dueDate: "2024-03-05", completedAt: new Date("2024-03-03") },
];

const seedEvidence = [
    { evidenceId: "EVD-2024-001", caseRef: "VDT-2024-001", title: "CCTV Footage — Andheri Station", type: "digital", status: "verified", collectedBy: "Ravi Kumar", collectedDate: "2024-01-18", chainOfCustody: [{ handler: "Ravi Kumar", action: "Collected from station CCTV room", date: "2024-01-18", location: "Andheri Station" }, { handler: "Dr. Patil", action: "Forensic analysis", date: "2024-01-24", location: "Mumbai FSL" }, { handler: "Adv. Prit", action: "Filed as exhibit", date: "2024-02-01", location: "High Court — Maharashtra" }], storageLocation: "Evidence Vault — Locker A-12", description: "CCTV footage from platform 3, 22:00-23:00 IST, showing movements of accused.", tags: ["CCTV", "digital", "station", "timeline"], metadata: { format: "MP4", duration: "60 min", resolution: "1080p" } },
    { evidenceId: "EVD-2024-002", caseRef: "VDT-2024-001", title: "Forensic Report — Blood Sample", type: "forensic", status: "admitted", collectedBy: "Mumbai FSL", collectedDate: "2024-01-20", chainOfCustody: [{ handler: "Mumbai Police", action: "Sample collected at crime scene", date: "2024-01-16", location: "Crime Scene — Bandra" }, { handler: "Mumbai FSL", action: "DNA analysis completed", date: "2024-01-20", location: "Mumbai FSL" }], storageLocation: "Evidence Vault — Cold Storage", description: "Forensic DNA analysis of blood sample recovered from scene. Comparison with accused.", tags: ["forensic", "DNA", "blood", "FSL"], metadata: { labRef: "FSL/MUM/2024/0342" } },
    { evidenceId: "EVD-2024-003", caseRef: "VDT-2024-002", title: "Patent Filing — US-2021-0342", type: "documentary", status: "verified", collectedBy: "Adv. Meera Shah", collectedDate: "2024-01-05", chainOfCustody: [{ handler: "Adv. Meera Shah", action: "Downloaded from USPTO", date: "2024-01-05", location: "Office" }], storageLocation: "Digital Vault", description: "Original patent filing by Nexus Inc. with 14 claims covering distributed ledger consensus.", tags: ["patent", "USPTO", "claims"], metadata: { claims: 14, pages: 68 } },
    { evidenceId: "EVD-2024-004", caseRef: "VDT-2024-002", title: "Prior Art — Chen et al. 2019", type: "documentary", status: "processing", collectedBy: "Adv. Meera Shah", collectedDate: "2024-02-10", chainOfCustody: [{ handler: "Adv. Meera Shah", action: "Retrieved from IEEE database", date: "2024-02-10", location: "Office" }], storageLocation: "Digital Vault", description: "Academic paper showing prior art for claims 3-7 of the Nexus patent.", tags: ["prior-art", "academic", "patent"], metadata: { journal: "IEEE Transactions", year: 2019 } },
    { evidenceId: "EVD-2024-005", caseRef: "VDT-2024-004", title: "Financial Audit Report — DEF Corp", type: "documentary", status: "challenged", collectedBy: "Adv. Rohan Iyer", collectedDate: "2024-01-25", chainOfCustody: [{ handler: "CAO — Vikram Mehta", action: "Provided during discovery", date: "2024-01-25", location: "DEF Corp HQ" }, { handler: "Adv. Rohan Iyer", action: "Review and flagging discrepancies", date: "2024-02-05", location: "Office" }], storageLocation: "Evidence Vault — Locker C-03", description: "Annual audit report showing ₹2.3 Cr discrepancy in Q3 accounts.", tags: ["financial", "audit", "discrepancy"], metadata: { auditor: "Deloitte India", period: "FY2023" } },
    { evidenceId: "EVD-2024-006", caseRef: "VDT-2024-004", title: "Email Thread — Internal Communications", type: "digital", status: "verified", collectedBy: "Ravi Kumar", collectedDate: "2024-02-01", chainOfCustody: [{ handler: "Ravi Kumar", action: "Extracted from server backup", date: "2024-02-01", location: "IT Department" }], storageLocation: "Digital Vault — Encrypted", description: "Internal email chain discussing Q3 financial adjustments between CFO and CEO.", tags: ["email", "communications", "internal"], metadata: { emails: 23, dateRange: "Aug-Oct 2023" } },
    { evidenceId: "EVD-2024-007", caseRef: "VDT-2024-006", title: "Server Access Logs — CloudNet", type: "digital", status: "collected", collectedBy: "Adv. Meera Shah", collectedDate: "2024-01-15", chainOfCustody: [{ handler: "CloudNet IT", action: "Logs extracted per court order", date: "2024-01-15", location: "CloudNet Data Center" }], storageLocation: "Digital Vault — Encrypted", description: "Server access logs from breach period (Dec 2023). Shows unauthorized access patterns.", tags: ["logs", "server", "breach", "cyber"], metadata: { entries: 45000, period: "Dec 1-31, 2023" } },
    { evidenceId: "EVD-2024-008", caseRef: "VDT-2024-003", title: "Merger Agreement Draft v2 — Horizon", type: "documentary", status: "verified", collectedBy: "Adv. Prit Thacker", collectedDate: "2024-01-30", chainOfCustody: [{ handler: "Adv. Prit Thacker", action: "Received from Horizon Corp legal team", date: "2024-01-30", location: "Office" }], storageLocation: "Evidence Vault — Locker B-07", description: "Draft merger agreement between Horizon Corp and target entity.", tags: ["merger", "agreement", "draft", "M&A"], metadata: { pages: 85, version: "v2.1" } },
    { evidenceId: "EVD-2024-009", caseRef: "VDT-2024-001", title: "Mobile Phone Records — Accused", type: "digital", status: "processing", collectedBy: "Mumbai Police", collectedDate: "2024-01-22", chainOfCustody: [{ handler: "Mumbai Police", action: "Seized under warrant", date: "2024-01-22", location: "Accused residence" }, { handler: "Mumbai FSL", action: "Data extraction in progress", date: "2024-02-05", location: "Mumbai FSL" }], storageLocation: "Evidence Vault — Digital Forensics", description: "Call records, SMS, and location data from accused's mobile device for Jan 15-16.", tags: ["mobile", "CDR", "location", "digital-forensics"], metadata: { device: "Samsung Galaxy S23", IMEI: "35XXXXXXX" } },
    { evidenceId: "EVD-2024-010", caseRef: "VDT-2024-005", title: "Original Will — Gupta Family", type: "documentary", status: "admitted", collectedBy: "Adv. Priya Desai", collectedDate: "2024-02-05", chainOfCustody: [{ handler: "Adv. Priya Desai", action: "Received from Gupta estate executor", date: "2024-02-05", location: "Client meeting" }, { handler: "Notary Public", action: "Verified authenticity", date: "2024-02-08", location: "Sub-Registrar Office — Pune" }], storageLocation: "Evidence Vault — Locker A-05", description: "Original registered will of Late Shri R.K. Gupta dated August 2019.", tags: ["will", "estate", "registered"], metadata: { registeredAt: "Sub-Registrar Pune", date: "2019-08-15" } },
];

const seedKnowledgeArticles = [
    { title: "Indian Contract Act, 1872 — Quick Reference", category: "statute", content: "# Indian Contract Act, 1872\n\n## Key Sections\n\n- **Section 2(h)**: Definition of Contract\n- **Section 10**: What agreements are contracts\n- **Section 23**: Unlawful consideration\n- **Section 56**: Doctrine of Frustration\n- **Section 73-75**: Consequences of breach\n\n## Recent Amendments\n\nNo major amendments in recent years. However, the interplay with the Consumer Protection Act, 2019 has created new interpretations.", summary: "Quick reference guide covering key sections of the Indian Contract Act", author: "Adv. Prit Thacker", tags: ["contract", "statute", "reference"], references: [{ title: "Contract Act Full Text", url: "https://legislative.gov.in", type: "statute" }], views: 42, isPinned: true },
    { title: "DPDP Act 2023 — Data Fiduciary Obligations", category: "statute", content: "# Digital Personal Data Protection Act, 2023\n\n## Section 8 — Obligations of Data Fiduciary\n\n1. Process personal data only for lawful purposes\n2. Maintain accuracy of data\n3. Implement security safeguards\n4. Notify Data Protection Board in case of breach\n\n## Penalties\n\n- Up to ₹250 Crore for significant data breaches\n- Up to ₹200 Crore for failure to notify", summary: "Comprehensive guide on data fiduciary obligations under DPDP Act 2023", author: "Adv. Meera Shah", tags: ["DPDP", "privacy", "data-protection", "2023"], references: [], views: 38 },
    { title: "Bail Application — Best Practices", category: "procedure", content: "# Drafting Effective Bail Applications\n\n## Checklist\n\n1. Personal details of accused\n2. FIR details and sections invoked\n3. Grounds for bail\n4. Surety details\n5. Previous bail history\n\n## Key Precedents\n\n- **Arnesh Kumar v. State of Bihar** (2014): Guidelines for arrest\n- **Siddharth v. State of UP** (2021): Bail is the rule, jail the exception", summary: "Step-by-step guide for drafting bail applications with precedents", author: "Adv. Prit Thacker", tags: ["bail", "criminal", "procedure", "checklist"], references: [{ title: "Arnesh Kumar v. State of Bihar", url: "https://indiankanoon.org/doc/145967", type: "case-law" }], views: 56, isPinned: true },
    { title: "Patent Validity Challenges — Section 3(d)", category: "case-law", content: "# Challenging Patent Validity under Section 3(d)\n\n## The Novartis Precedent\n\nIn **Novartis AG v. Union of India** (2013), the Supreme Court held that mere discovery of a new form of a known substance does not qualify as an invention unless it shows enhanced efficacy.\n\n## Application\n\nThis principle is critical in pharmaceutical patent disputes.", summary: "Analysis of Section 3(d) patent challenges following Novartis ruling", author: "Adv. Meera Shah", tags: ["patent", "pharma", "Section 3(d)", "Novartis"], references: [{ title: "Novartis v. UOI (2013)", url: "https://indiankanoon.org/doc/165776436", type: "case-law" }], views: 28 },
    { title: "Cross-Examination Techniques for Indian Courts", category: "guide", content: "# Effective Cross-Examination\n\n## The 10 Rules\n\n1. Never ask a question you don't know the answer to\n2. Use leading questions exclusively\n3. Control the witness — one fact per question\n4. Build to the final point incrementally\n5. Never argue with the witness\n6. Use documents to impeach\n7. End on a strong point\n8. Maintain eye contact with the judge\n9. Stay calm under redirects\n10. Know when to stop", summary: "10 rules for effective cross-examination in Indian courts", author: "Adv. Prit Thacker", tags: ["cross-examination", "trial", "technique", "advocacy"], references: [], views: 89, isPinned: true },
    { title: "MSA / Service Agreement Template", category: "template", content: "# Master Service Agreement\n\n## Standard Clauses\n\n1. **Scope of Services**\n2. **Term and Termination**\n3. **Fees and Payment**\n4. **Confidentiality**\n5. **Indemnification** (cap on consequential damages)\n6. **Limitation of Liability**\n7. **Dispute Resolution** (Arbitration, Mumbai seat)\n8. **Governing Law** (Indian law)\n\n## Notes\n\n- Always include a cap on consequential damages\n- Specify arbitration seat explicitly\n- Include DPDP Act compliance clause for tech agreements", summary: "Standard MSA template with Indian law clauses", author: "Adv. Prit Thacker", tags: ["template", "MSA", "contract", "corporate"], references: [], views: 34 },
    { title: "Evidence Admissibility — Indian Evidence Act", category: "procedure", content: "# Evidence Admissibility\n\n## Key Provisions\n\n- **Section 3**: Definitions (evidence, proved, disproved)\n- **Section 24-30**: Confessions\n- **Section 45**: Expert opinion\n- **Section 65B**: Electronic evidence (certificate required)\n\n## Section 65B Certificate\n\nAfter **Anvar P.V. v. P.K. Basheer** (2014), electronic evidence is inadmissible without a Section 65B certificate.", summary: "Guide to evidence admissibility with focus on Section 65B requirements", author: "Ravi Kumar", tags: ["evidence", "admissibility", "65B", "electronic"], references: [{ title: "Anvar v. Basheer (2014)", url: "https://indiankanoon.org/doc/187908968", type: "case-law" }], views: 45 },
    { title: "NCLT Filing Procedures — M&A", category: "procedure", content: "# NCLT Filing for Mergers & Acquisitions\n\n## Steps\n\n1. Board resolution approving the scheme\n2. File application under Sections 230-232 of Companies Act, 2013\n3. NCLT directs meetings of shareholders and creditors\n4. Obtain NOC from ROC and Official Liquidator\n5. NCLT sanctions the scheme\n6. File certified copy with ROC\n\n## Timeline\n\nTypical timeline: 6-12 months from filing to sanction.", summary: "Step-by-step NCLT filing procedures for mergers and acquisitions", author: "Adv. Prit Thacker", tags: ["NCLT", "M&A", "Companies Act", "merger", "procedure"], references: [], views: 22 },
];

const seedPastTrials = [
    { caseRef: "VDT-2023-089", caseName: "State v. Patel", court: "Sessions Court — Mumbai", judge: "Hon. Judge V. Kulkarni", verdict: "won", dateConcluded: "2023-12-15", durationDays: 145, leadAttorney: "Adv. Prit Thacker", team: [{ name: "Adv. Prit Thacker", role: "Lead" }, { name: "Adv. Meera Shah", role: "Associate" }], summary: "Successfully defended client against charges under IPC Section 420. Key argument centered on lack of mens rea and inconsistent prosecution witnesses.", keyArguments: ["Lack of mens rea established through documentary evidence", "Three prosecution witnesses gave inconsistent statements", "Chain of custody for digital evidence was compromised"], opposingCounsel: "APP Shri R.S. Desai", lessonsLearned: "Digital evidence chain of custody is increasingly scrutinized. Always challenge 65B certificates." },
    { caseRef: "VDT-2023-041", caseName: "Sharma Family — Property Dispute", court: "City Civil Court — Mumbai", judge: "Hon. Judge P. Inamdar", verdict: "settled", dateConcluded: "2023-10-20", durationDays: 210, leadAttorney: "Adv. Priya Desai", team: [{ name: "Adv. Priya Desai", role: "Lead" }], summary: "Property partition dispute among four siblings resolved through mediation. Settlement included division of 3 properties and monetary compensation.", keyArguments: ["Equal partition under Hindu Succession Act", "Mediation proved more cost-effective than litigation"], opposingCounsel: "Adv. K.K. Joshi", lessonsLearned: "Family disputes are best resolved through mediation. Court-referred mediation has high success rates." },
    { caseName: "TechGlobal v. InfoSys Solutions", court: "High Court — Delhi", judge: "Hon. Justice S. Muralidhar", verdict: "won", dateConcluded: "2023-08-30", durationDays: 320, leadAttorney: "Adv. Meera Shah", team: [{ name: "Adv. Meera Shah", role: "Lead" }, { name: "Ravi Kumar", role: "Paralegal" }], summary: "Software copyright infringement case. Established substantial similarity between codebases using expert testimony and code comparison tools.", keyArguments: ["Expert analysis showed 78% code similarity", "Access to source code was established through employment records", "Defendant's clean room defense was effectively rebutted"], opposingCounsel: "Adv. Senior A.M. Singhvi", lessonsLearned: "Technical expert testimony is crucial in software IP cases. Always prepare visual aids for the judge." },
    { caseName: "Municipal Corp v. Green Builders Pvt Ltd", court: "NCLT — Mumbai", judge: "Hon. Member R. Mohan", verdict: "lost", dateConcluded: "2023-11-05", durationDays: 180, leadAttorney: "Adv. Rohan Iyer", team: [{ name: "Adv. Rohan Iyer", role: "Lead" }], summary: "Construction regulatory compliance dispute. The tribunal held that the builder had obtained all necessary permissions and the municipal corporation's notice was procedurally flawed.", keyArguments: ["Argued procedural deficiency in municipal notice", "Show-cause notice was not served in accordance with MRTP Act"], opposingCounsel: "Municipal Standing Counsel", lessonsLearned: "Need stronger documentary evidence when challenging well-resourced government bodies. Timeline management is crucial." },
    { caseName: "Rajesh Kapoor v. HDFC Life Insurance", court: "District Consumer Forum — Pune", judge: "President Smt. S.V. Patil", verdict: "won", dateConcluded: "2024-01-10", durationDays: 95, leadAttorney: "Adv. Priya Desai", team: [{ name: "Adv. Priya Desai", role: "Lead" }], summary: "Insurance claim rejection case. Successfully argued that the insurer's rejection on grounds of 'non-disclosure' was unjustified as the condition was not material to the risk.", keyArguments: ["Non-disclosure was not material to the risk assessment", "Insurer's medical examination was inadequate", "Consumer Protection Act 2019 strengthened consumer rights"], opposingCounsel: "HDFC Legal Panel", lessonsLearned: "Consumer forums are increasingly consumer-friendly. Document all medical disclosures meticulously." },
    { caseName: "State v. Anil Deshmukh (Prevention of Corruption)", court: "Special CBI Court — Mumbai", judge: "Hon. Special Judge M. Gokhale", verdict: "dismissed", dateConcluded: "2023-09-25", durationDays: 365, leadAttorney: "Adv. Prit Thacker", team: [{ name: "Adv. Prit Thacker", role: "Lead" }, { name: "Adv. Rohan Iyer", role: "Associate" }, { name: "Ravi Kumar", role: "Paralegal" }], summary: "Prevention of Corruption Act case. Charges dismissed on grounds of insufficient evidence and procedural irregularities in the CBI investigation.", keyArguments: ["CBI investigation had procedural irregularities under Section 17A", "Trap proceedings were not conducted per established protocol", "Key prosecution witness turned hostile"], opposingCounsel: "CBI Special Public Prosecutor", lessonsLearned: "In corruption cases, procedural compliance by investigating agency is the first line of defense." },
];

// ─── Seed handler ────────────────────────────────────────────────────────────

export async function POST() {
    try {
        // Clear all data — children/dependents first
        await db.delete(analyticsSnapshots);
        await db.delete(proofreadingJobs);
        await db.delete(documents);
        await db.delete(evidence);
        await db.delete(knowledgeArticles);
        await db.delete(pastTrials);
        await db.delete(mockTrials);
        await db.delete(timeEntries);
        await db.delete(tasks);
        await db.delete(teamMessages);
        await db.delete(calendarEvents);
        await db.delete(activities);
        await db.delete(events);
        await db.delete(cases);
        await db.delete(loginHistory);
        await db.delete(users);

        // Insert users first (others may reference them)
        await db.insert(users).values(seedUsers);

        // Insert all other data in parallel
        await Promise.all([
            db.insert(cases).values(seedCases),
            db.insert(events).values(seedEvents),
            db.insert(activities).values(seedActivities),
            db.insert(calendarEvents).values(seedCalendarEvents),
            db.insert(teamMessages).values(seedMessages),
            db.insert(tasks).values(seedTasks),
            db.insert(timeEntries).values(seedTimeEntries),
            db.insert(documents).values(seedDocuments),
            db.insert(mockTrials).values(seedMockTrials),
            db.insert(proofreadingJobs).values(seedProofreadingJobs),
            db.insert(evidence).values(seedEvidence),
            db.insert(knowledgeArticles).values(seedKnowledgeArticles),
            db.insert(pastTrials).values(seedPastTrials),
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
                documents: seedDocuments.length,
                mockTrials: seedMockTrials.length,
                proofreadingJobs: seedProofreadingJobs.length,
                evidence: seedEvidence.length,
                knowledgeArticles: seedKnowledgeArticles.length,
                pastTrials: seedPastTrials.length,
            },
        });
    } catch (error) {
        console.error("POST /api/seed error:", error);
        return NextResponse.json({ error: "Failed to seed database", detail: String(error) }, { status: 500 });
    }
}
