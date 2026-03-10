import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { systemSettings } from "@/lib/schema";
import { requireAdmin, logAudit } from "@/lib/audit";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const data = await db.select().from(systemSettings);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch settings" }, { status: error.status || 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await requireAdmin();
        const body = await req.json();
        const { key, value, description, category, label } = body;

        if (!key || value === undefined) {
            return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
        }

        const [existing] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));

        if (existing) {
            const [updated] = await db.update(systemSettings).set({
                value,
                description: description !== undefined ? description : existing.description,
                updatedBy: Number(session.user.id),
                updatedAt: new Date()
            }).where(eq(systemSettings.key, key)).returning();

            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "update",
                resourceType: "settings",
                resourceId: updated.id,
                resourceName: updated.label,
                details: { old: existing.value, new: updated.value },
            });

            return NextResponse.json(updated);
        } else {
            const [created] = await db.insert(systemSettings).values({
                key,
                value,
                description: description || null,
                category: category || "general",
                label: label || key,
                updatedBy: Number(session.user.id)
            }).returning();

            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "create",
                resourceType: "settings",
                resourceId: created.id,
                resourceName: created.label,
                details: created,
            });

            return NextResponse.json(created);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to save setting" }, { status: error.status || 500 });
    }
}

export async function PATCH(req: Request) {
    return POST(req); // Route patch to POST since POST handles upsert logic above
}

export async function DELETE(req: Request) {
    try {
        const session = await requireAdmin();
        const { searchParams } = new URL(req.url);
        const key = searchParams.get("key");

        if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 });

        const [existing] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
        if (!existing) return NextResponse.json({ error: "Setting not found" }, { status: 404 });

        await db.delete(systemSettings).where(eq(systemSettings.key, key));

        await logAudit({
            userId: Number(session.user.id),
            userName: session.user.name as string,
            userEmail: session.user.email as string,
            action: "delete",
            resourceType: "settings",
            resourceId: existing.id,
            resourceName: existing.label,
            details: existing,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete setting" }, { status: error.status || 500 });
    }
}
