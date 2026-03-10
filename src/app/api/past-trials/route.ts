import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pastTrials } from "@/lib/schema";
import { eq, ilike, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const verdict = searchParams.get("verdict");
        const search = searchParams.get("search");

        const conditions = [];
        if (verdict) conditions.push(eq(pastTrials.verdict, verdict));
        if (search) conditions.push(ilike(pastTrials.caseName, `%${search}%`));

        const results = conditions.length > 0
            ? await db.select().from(pastTrials).where(and(...conditions)).orderBy(desc(pastTrials.createdAt))
            : await db.select().from(pastTrials).orderBy(desc(pastTrials.createdAt));

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/past-trials error:", error);
        return NextResponse.json({ error: "Failed to fetch past trials" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.caseName || !body.verdict) {
            return NextResponse.json({ error: "Case name and verdict are required" }, { status: 400 });
        }
        const [created] = await db.insert(pastTrials).values({
            caseRef: body.caseRef || null,
            caseName: body.caseName,
            court: body.court || null,
            judge: body.judge || null,
            verdict: body.verdict,
            dateConcluded: body.dateConcluded || null,
            durationDays: body.durationDays || null,
            leadAttorney: body.leadAttorney || null,
            team: body.team || [],
            summary: body.summary || null,
            keyArguments: body.keyArguments || [],
            opposingCounsel: body.opposingCounsel || null,
            lessonsLearned: body.lessonsLearned || null,
            documents: body.documents || [],
        }).returning();
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("POST /api/past-trials error:", error);
        return NextResponse.json({ error: "Failed to create past trial" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Past trial ID is required" }, { status: 400 });
        }
        const [deleted] = await db.delete(pastTrials).where(eq(pastTrials.id, Number(id))).returning();
        if (!deleted) {
            return NextResponse.json({ error: "Past trial not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Past trial deleted" });
    } catch (error) {
        console.error("DELETE /api/past-trials error:", error);
        return NextResponse.json({ error: "Failed to delete past trial" }, { status: 500 });
    }
}
