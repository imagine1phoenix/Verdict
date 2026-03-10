import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases, calendarEvents, users, documents, evidence, knowledgeArticles, mockTrials, pastTrials } from "@/lib/schema";
import { ilike, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q")?.trim();

        if (!q || q.length < 2) {
            return NextResponse.json([]);
        }

        const pattern = `%${q}%`;

        const [matchedCases, matchedEvents, matchedUsers, matchedDocs, matchedEvidence, matchedKnowledge, matchedTrials, matchedPastTrials] = await Promise.all([
            db
                .select({ id: cases.id, caseId: cases.caseId, name: cases.name, type: cases.type, status: cases.status })
                .from(cases)
                .where(or(ilike(cases.name, pattern), ilike(cases.caseId, pattern), ilike(cases.type, pattern)))
                .limit(5),
            db
                .select({ id: calendarEvents.id, title: calendarEvents.title, date: calendarEvents.date, type: calendarEvents.type })
                .from(calendarEvents)
                .where(or(ilike(calendarEvents.title, pattern), ilike(calendarEvents.caseRef, pattern)))
                .limit(5),
            db
                .select({ id: users.id, name: users.name, role: users.role, email: users.email })
                .from(users)
                .where(or(ilike(users.name, pattern), ilike(users.email, pattern)))
                .limit(5),
            db
                .select({ id: documents.id, title: documents.title, category: documents.category, status: documents.status })
                .from(documents)
                .where(or(ilike(documents.title, pattern), ilike(documents.category, pattern)))
                .limit(5),
            db
                .select({ id: evidence.id, evidenceId: evidence.evidenceId, title: evidence.title, type: evidence.type })
                .from(evidence)
                .where(or(ilike(evidence.title, pattern), ilike(evidence.evidenceId, pattern)))
                .limit(5),
            db
                .select({ id: knowledgeArticles.id, title: knowledgeArticles.title, category: knowledgeArticles.category })
                .from(knowledgeArticles)
                .where(or(ilike(knowledgeArticles.title, pattern), ilike(knowledgeArticles.category, pattern)))
                .limit(5),
            db
                .select({ id: mockTrials.id, title: mockTrials.title, status: mockTrials.status })
                .from(mockTrials)
                .where(ilike(mockTrials.title, pattern))
                .limit(5),
            db
                .select({ id: pastTrials.id, caseName: pastTrials.caseName, verdict: pastTrials.verdict, court: pastTrials.court })
                .from(pastTrials)
                .where(or(ilike(pastTrials.caseName, pattern), ilike(pastTrials.court, pattern)))
                .limit(5),
        ]);

        const results = [
            ...matchedCases.map((c) => ({ category: "cases" as const, title: c.name, subtitle: `${c.caseId} · ${c.type} · ${c.status}` })),
            ...matchedEvents.map((e) => ({ category: "events" as const, title: e.title, subtitle: `${e.date} · ${e.type}` })),
            ...matchedUsers.map((u) => ({ category: "users" as const, title: u.name, subtitle: `${u.role} · ${u.email}` })),
            ...matchedDocs.map((d) => ({ category: "documents" as const, title: d.title, subtitle: `${d.category} · ${d.status}` })),
            ...matchedEvidence.map((e) => ({ category: "evidence" as const, title: e.title, subtitle: `${e.evidenceId} · ${e.type}` })),
            ...matchedKnowledge.map((k) => ({ category: "knowledge" as const, title: k.title, subtitle: k.category })),
            ...matchedTrials.map((m) => ({ category: "mock-trials" as const, title: m.title, subtitle: `Mock Trial · ${m.status}` })),
            ...matchedPastTrials.map((p) => ({ category: "past-trials" as const, title: p.caseName, subtitle: `${p.verdict} · ${p.court || ""}` })),
        ];

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/search error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
