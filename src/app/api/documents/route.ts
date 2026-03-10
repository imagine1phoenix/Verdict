import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { documents } from "@/lib/schema";
import { eq, ilike, and, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const caseRef = searchParams.get("case_ref");
        const category = searchParams.get("category");
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        const conditions = [];
        if (caseRef) conditions.push(eq(documents.caseRef, caseRef));
        if (category) conditions.push(eq(documents.category, category));
        if (status) conditions.push(eq(documents.status, status));
        if (search) conditions.push(ilike(documents.title, `%${search}%`));

        const results = conditions.length > 0
            ? await db.select().from(documents).where(and(...conditions)).orderBy(desc(documents.createdAt))
            : await db.select().from(documents).orderBy(desc(documents.createdAt));

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/documents error:", error);
        return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.title || !body.category) {
            return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
        }
        const [created] = await db.insert(documents).values({
            title: body.title,
            caseRef: body.caseRef || null,
            category: body.category,
            status: body.status || "draft",
            uploadedBy: body.uploadedBy || null,
            uploadedByName: body.uploadedByName || null,
            fileUrl: body.fileUrl || null,
            fileType: body.fileType || null,
            fileSize: body.fileSize || null,
            version: body.version || 1,
            tags: body.tags || [],
            metadata: body.metadata || {},
        }).returning();

        const session = await getServerSession(authOptions);
        if (session && session.user) {
            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "create",
                resourceType: "document",
                resourceId: created.id,
                resourceName: created.title,
                details: created,
            });
        }

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("POST /api/documents error:", error);
        return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) {
            return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
        }
        const { id, ...updates } = body;
        updates.updatedAt = new Date();
        const [updated] = await db.update(documents).set(updates).where(eq(documents.id, id)).returning();
        if (!updated) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        const session = await getServerSession(authOptions);
        if (session && session.user) {
            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "update",
                resourceType: "document",
                resourceId: updated.id,
                resourceName: updated.title,
                details: updates,
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/documents error:", error);
        return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
        }
        const [deleted] = await db.delete(documents).where(eq(documents.id, Number(id))).returning();
        if (!deleted) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        const session = await getServerSession(authOptions);
        if (session && session.user) {
            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "delete",
                resourceType: "document",
                resourceId: Number(id),
                resourceName: `Document ID ${id}`,
                details: { deletedId: id },
            });
        }

        return NextResponse.json({ message: "Document deleted" });
    } catch (error) {
        console.error("DELETE /api/documents error:", error);
        return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    }
}
