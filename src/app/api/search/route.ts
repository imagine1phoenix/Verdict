import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases, calendarEvents, users } from "@/lib/schema";
import { ilike, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q")?.trim();

        if (!q || q.length < 2) {
            return NextResponse.json([]);
        }

        const pattern = `%${q}%`;

        const [matchedCases, matchedEvents, matchedUsers] = await Promise.all([
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
        ]);

        const results = [
            ...matchedCases.map((c) => ({ category: "cases" as const, title: c.name, subtitle: `${c.caseId} · ${c.type} · ${c.status}` })),
            ...matchedEvents.map((e) => ({ category: "events" as const, title: e.title, subtitle: `${e.date} · ${e.type}` })),
            ...matchedUsers.map((u) => ({ category: "users" as const, title: u.name, subtitle: `${u.role} · ${u.email}` })),
        ];

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/search error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
