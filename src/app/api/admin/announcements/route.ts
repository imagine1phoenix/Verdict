import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { announcements } from "@/lib/schema";
import { requireAdmin, logAudit } from "@/lib/audit";
import { desc, eq, or, ilike } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get('active') === 'true';

        let data;
        if (activeOnly) {
            data = await db.select().from(announcements).where(eq(announcements.isActive, true)).orderBy(desc(announcements.isPinned), desc(announcements.createdAt));
        } else {
            data = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch announcements" }, { status: error.status || 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await requireAdmin();
        const body = await req.json();

        const { title, content, type, targetRoles = ["all"], isPinned = false, isActive = true, expiresAt } = body;

        if (!title || !content || !type) {
            return NextResponse.json({ error: "Title, content, and type are required" }, { status: 400 });
        }

        const [newAnnouncement] = await db.insert(announcements).values({
            title,
            content,
            type,
            targetRoles,
            isPinned,
            isActive,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            authorId: Number(session.user.id),
            authorName: session.user.name as string,
        }).returning();

        await logAudit({
            userId: Number(session.user.id),
            userName: session.user.name as string,
            userEmail: session.user.email as string,
            action: "create",
            resourceType: "announcement",
            resourceId: newAnnouncement.id,
            resourceName: newAnnouncement.title,
            details: newAnnouncement,
        });

        return NextResponse.json(newAnnouncement, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to create announcement" }, { status: error.status || 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await requireAdmin();
        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get("id") || "");

        if (isNaN(id)) return NextResponse.json({ error: "Invalid announcement ID" }, { status: 400 });

        const body = await req.json();

        const [existing] = await db.select().from(announcements).where(eq(announcements.id, id));
        if (!existing) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });

        const updateData: any = { updatedAt: new Date() };

        if (body.title !== undefined) updateData.title = body.title;
        if (body.content !== undefined) updateData.content = body.content;
        if (body.type !== undefined) updateData.type = body.type;
        if (body.targetRoles !== undefined) updateData.targetRoles = body.targetRoles;
        if (body.isPinned !== undefined) updateData.isPinned = body.isPinned;
        if (body.isActive !== undefined) updateData.isActive = body.isActive;
        if (body.expiresAt !== undefined) updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

        const [updated] = await db.update(announcements).set(updateData).where(eq(announcements.id, id)).returning();

        await logAudit({
            userId: Number(session.user.id),
            userName: session.user.name as string,
            userEmail: session.user.email as string,
            action: "update",
            resourceType: "announcement",
            resourceId: updated.id,
            resourceName: updated.title,
            details: { old: existing, new: updated },
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update announcement" }, { status: error.status || 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await requireAdmin();
        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get("id") || "");

        if (isNaN(id)) return NextResponse.json({ error: "Invalid announcement ID" }, { status: 400 });

        const [existing] = await db.select().from(announcements).where(eq(announcements.id, id));
        if (!existing) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });

        await db.delete(announcements).where(eq(announcements.id, id));

        await logAudit({
            userId: Number(session.user.id),
            userName: session.user.name as string,
            userEmail: session.user.email as string,
            action: "delete",
            resourceType: "announcement",
            resourceId: existing.id,
            resourceName: existing.title,
            details: existing,
        });

        return NextResponse.json({ message: "Announcement deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete announcement" }, { status: error.status || 500 });
    }
}
