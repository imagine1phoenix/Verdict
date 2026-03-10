import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { evidence } from "@/lib/schema";
import { eq, ilike, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const caseRef = searchParams.get("case_ref");
        const type = searchParams.get("type");
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        const conditions = [];
        if (caseRef) conditions.push(eq(evidence.caseRef, caseRef));
        if (type) conditions.push(eq(evidence.type, type));
        if (status) conditions.push(eq(evidence.status, status));
        if (search) conditions.push(ilike(evidence.title, `%${search}%`));

        const results = conditions.length > 0
            ? await db.select().from(evidence).where(and(...conditions)).orderBy(desc(evidence.createdAt))
            : await db.select().from(evidence).orderBy(desc(evidence.createdAt));

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/evidence error:", error);
        return NextResponse.json({ error: "Failed to fetch evidence" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.title || !body.type || !body.evidenceId) {
            return NextResponse.json({ error: "Title, type, and evidenceId are required" }, { status: 400 });
        }
        const [created] = await db.insert(evidence).values({
            evidenceId: body.evidenceId,
            caseRef: body.caseRef || null,
            title: body.title,
            type: body.type,
            status: body.status || "collected",
            collectedBy: body.collectedBy || null,
            collectedDate: body.collectedDate || null,
            chainOfCustody: body.chainOfCustody || [],
            storageLocation: body.storageLocation || null,
            fileUrl: body.fileUrl || null,
            description: body.description || null,
            tags: body.tags || [],
            metadata: body.metadata || {},
        }).returning();
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("POST /api/evidence error:", error);
        return NextResponse.json({ error: "Failed to create evidence" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) {
            return NextResponse.json({ error: "Evidence ID is required" }, { status: 400 });
        }
        const { id, ...updates } = body;
        updates.updatedAt = new Date();
        const [updated] = await db.update(evidence).set(updates).where(eq(evidence.id, id)).returning();
        if (!updated) {
            return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/evidence error:", error);
        return NextResponse.json({ error: "Failed to update evidence" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Evidence ID is required" }, { status: 400 });
        }
        const [deleted] = await db.delete(evidence).where(eq(evidence.id, Number(id))).returning();
        if (!deleted) {
            return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Evidence deleted" });
    } catch (error) {
        console.error("DELETE /api/evidence error:", error);
        return NextResponse.json({ error: "Failed to delete evidence" }, { status: 500 });
    }
}
