import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        let result;
        if (status && status !== "all") {
            result = await db
                .select()
                .from(cases)
                .where(eq(cases.status, status))
                .orderBy(desc(cases.createdAt));
        } else {
            result = await db
                .select()
                .from(cases)
                .orderBy(desc(cases.createdAt));
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("GET /api/cases error:", error);
        return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const [newCase] = await db
            .insert(cases)
            .values({
                caseId: body.caseId,
                name: body.name,
                type: body.type,
                status: body.status,
                lead: body.lead,
                priority: body.priority || "Medium",
                nextDate: body.nextDate,
                billing: body.billing || {},
                court: body.court,
                judge: body.judge,
                filed: body.filed,
                team: body.team || [],
                timeline: body.timeline || [],
                documents: body.documents || [],
                relatedCases: body.relatedCases || [],
            })
            .returning();

        return NextResponse.json(newCase, { status: 201 });
    } catch (error) {
        console.error("POST /api/cases error:", error);
        return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
    }
}
