import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { timeEntries } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const result = await db.select().from(timeEntries).orderBy(desc(timeEntries.createdAt));
        return NextResponse.json(
            result.map((e) => ({ ...e, hours: e.hours / 100 })) // convert cents back to decimal
        );
    } catch (error) {
        console.error("GET /api/team/time error:", error);
        return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.lawyer || !body.caseRef || !body.activity || body.hours == null) {
            return NextResponse.json({ error: "lawyer, caseRef, activity, hours are required" }, { status: 400 });
        }

        const [entry] = await db
            .insert(timeEntries)
            .values({
                userId: body.userId || null,
                lawyer: body.lawyer,
                caseRef: body.caseRef,
                activity: body.activity,
                hours: Math.round(body.hours * 100), // store as cents
                billable: body.billable !== false,
                date: body.date || new Date().toISOString().slice(0, 10),
            })
            .returning();

        return NextResponse.json({ ...entry, hours: entry.hours / 100 }, { status: 201 });
    } catch (error) {
        console.error("POST /api/team/time error:", error);
        return NextResponse.json({ error: "Failed to create time entry" }, { status: 500 });
    }
}
