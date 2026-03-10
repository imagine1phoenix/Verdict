import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calendarEvents } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const result = await db
            .select()
            .from(calendarEvents)
            .orderBy(calendarEvents.date, calendarEvents.time);
        return NextResponse.json(result);
    } catch (error) {
        console.error("GET /api/events error:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.title || !body.type || !body.date || !body.time || !body.lawyer) {
            return NextResponse.json({ error: "title, type, date, time, and lawyer are required" }, { status: 400 });
        }

        const [newEvent] = await db
            .insert(calendarEvents)
            .values({
                title: body.title,
                type: body.type,
                date: body.date,
                time: body.time,
                lawyer: body.lawyer,
                caseRef: body.caseRef || null,
                location: body.location || null,
                conflict: body.conflict || false,
                recurring: body.recurring || false,
            })
            .returning();

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error("POST /api/events error:", error);
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

        await db.delete(calendarEvents).where(eq(calendarEvents.id, parseInt(id)));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/events error:", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}
