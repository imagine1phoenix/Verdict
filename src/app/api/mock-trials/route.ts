import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mockTrials } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const caseRef = searchParams.get("case_ref");

        const conditions = [];
        if (status) conditions.push(eq(mockTrials.status, status));
        if (caseRef) conditions.push(eq(mockTrials.caseRef, caseRef));

        const results = conditions.length > 0
            ? await db.select().from(mockTrials).where(and(...conditions)).orderBy(desc(mockTrials.createdAt))
            : await db.select().from(mockTrials).orderBy(desc(mockTrials.createdAt));

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/mock-trials error:", error);
        return NextResponse.json({ error: "Failed to fetch mock trials" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.title || !body.date) {
            return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
        }
        const [created] = await db.insert(mockTrials).values({
            title: body.title,
            caseRef: body.caseRef || null,
            status: body.status || "scheduled",
            date: body.date,
            time: body.time || null,
            location: body.location || null,
            presiding: body.presiding || null,
            team: body.team || [],
            witnesses: body.witnesses || [],
            notes: body.notes || null,
            outcome: body.outcome || null,
            recordings: body.recordings || [],
            score: body.score || null,
            feedback: body.feedback || [],
        }).returning();

        const session = await getServerSession(authOptions);
        if (session && session.user) {
            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "create",
                resourceType: "mock_trial",
                resourceId: created.id,
                resourceName: created.title,
                details: created,
            });
        }

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("POST /api/mock-trials error:", error);
        return NextResponse.json({ error: "Failed to create mock trial" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) {
            return NextResponse.json({ error: "Mock trial ID is required" }, { status: 400 });
        }
        const { id, ...updates } = body;
        updates.updatedAt = new Date();
        const [updated] = await db.update(mockTrials).set(updates).where(eq(mockTrials.id, id)).returning();
        if (!updated) {
            return NextResponse.json({ error: "Mock trial not found" }, { status: 404 });
        }

        const session = await getServerSession(authOptions);
        if (session && session.user) {
            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "update",
                resourceType: "mock_trial",
                resourceId: updated.id,
                resourceName: updated.title,
                details: updates,
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/mock-trials error:", error);
        return NextResponse.json({ error: "Failed to update mock trial" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Mock trial ID is required" }, { status: 400 });
        }
        const [deleted] = await db.delete(mockTrials).where(eq(mockTrials.id, Number(id))).returning();
        if (!deleted) {
            return NextResponse.json({ error: "Mock trial not found" }, { status: 404 });
        }

        const session = await getServerSession(authOptions);
        if (session && session.user) {
            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "delete",
                resourceType: "mock_trial",
                resourceId: Number(id),
                resourceName: `Mock Trial ID ${id}`,
                details: { deletedId: id },
            });
        }

        return NextResponse.json({ message: "Mock trial deleted" });
    } catch (error) {
        console.error("DELETE /api/mock-trials error:", error);
        return NextResponse.json({ error: "Failed to delete mock trial" }, { status: 500 });
    }
}
