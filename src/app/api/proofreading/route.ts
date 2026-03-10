import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { proofreadingJobs } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const assignedTo = searchParams.get("assigned_to");

        const conditions = [];
        if (status) conditions.push(eq(proofreadingJobs.status, status));
        if (assignedTo) conditions.push(eq(proofreadingJobs.assignedTo, assignedTo));

        const results = conditions.length > 0
            ? await db.select().from(proofreadingJobs).where(and(...conditions)).orderBy(desc(proofreadingJobs.createdAt))
            : await db.select().from(proofreadingJobs).orderBy(desc(proofreadingJobs.createdAt));

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/proofreading error:", error);
        return NextResponse.json({ error: "Failed to fetch proofreading jobs" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.documentTitle) {
            return NextResponse.json({ error: "Document title is required" }, { status: 400 });
        }
        const [created] = await db.insert(proofreadingJobs).values({
            documentId: body.documentId || null,
            documentTitle: body.documentTitle,
            submittedBy: body.submittedBy || null,
            submittedByName: body.submittedByName || null,
            status: body.status || "pending",
            priority: body.priority || "Medium",
            assignedTo: body.assignedTo || null,
            originalText: body.originalText || null,
            correctedText: body.correctedText || null,
            comments: body.comments || [],
            issuesFound: body.issuesFound || 0,
            dueDate: body.dueDate || null,
        }).returning();
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("POST /api/proofreading error:", error);
        return NextResponse.json({ error: "Failed to create proofreading job" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
        }
        const { id, ...updates } = body;
        updates.updatedAt = new Date();
        if (updates.status === "completed") {
            updates.completedAt = new Date();
        }
        const [updated] = await db.update(proofreadingJobs).set(updates).where(eq(proofreadingJobs.id, id)).returning();
        if (!updated) {
            return NextResponse.json({ error: "Proofreading job not found" }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/proofreading error:", error);
        return NextResponse.json({ error: "Failed to update proofreading job" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
        }
        const [deleted] = await db.delete(proofreadingJobs).where(eq(proofreadingJobs.id, Number(id))).returning();
        if (!deleted) {
            return NextResponse.json({ error: "Proofreading job not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Proofreading job deleted" });
    } catch (error) {
        console.error("DELETE /api/proofreading error:", error);
        return NextResponse.json({ error: "Failed to delete proofreading job" }, { status: 500 });
    }
}
