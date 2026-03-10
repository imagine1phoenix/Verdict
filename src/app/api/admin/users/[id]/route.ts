import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, loginHistory, auditLogs, cases } from "@/lib/schema";
import { requireAdmin, logAudit } from "@/lib/audit";
import { eq, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
        const p = await params;
        const id = parseInt(p.id);

        if (isNaN(id)) return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

        const [user] = await db.select().from(users).where(eq(users.id, id));
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const logins = await db.select().from(loginHistory).where(eq(loginHistory.userId, id)).orderBy(desc(loginHistory.timestamp)).limit(20);
        const audits = await db.select().from(auditLogs).where(eq(auditLogs.userId, id)).orderBy(desc(auditLogs.createdAt)).limit(20);

        const { password, ...sanitizedUser } = user;

        return NextResponse.json({ ...sanitizedUser, loginHistory: logins, recentActivity: audits });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch user" }, { status: error.status || 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await requireAdmin();
        const p = await params;
        const id = parseInt(p.id);

        if (isNaN(id)) return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

        const body = await req.json();

        // Find existing user to validate rules
        const [existing] = await db.select().from(users).where(eq(users.id, id));
        if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const updateData: any = {};

        // Admin self-protection rules
        if (Number(session.user.id) === id) {
            if (body.role && body.role !== 'admin') {
                return NextResponse.json({ error: "You cannot demote yourself from admin." }, { status: 403 });
            }
            if (body.isActive !== undefined && body.isActive === false) {
                return NextResponse.json({ error: "You cannot deactivate yourself." }, { status: 403 });
            }
        }

        // If changing role from admin, ensure there's at least one other admin
        if (existing.role === 'admin' && body.role && body.role !== 'admin') {
            const adminCount = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'admin'));
            if (Number(adminCount[0].count) <= 1) {
                return NextResponse.json({ error: "Cannot demote the last remaining admin." }, { status: 403 });
            }
        }

        if (body.name !== undefined) updateData.name = body.name;
        if (body.email !== undefined) updateData.email = body.email.toLowerCase();
        if (body.role !== undefined) updateData.role = body.role;
        if (body.isActive !== undefined) updateData.isActive = body.isActive;
        if (body.avatar !== undefined) updateData.avatar = body.avatar;

        if (body.password) {
            updateData.password = await bcrypt.hash(body.password, 10);
            updateData.provider = "credentials"; // In case they were google
        }

        const [updatedUser] = await db.update(users).set({ ...updateData, updatedAt: new Date() }).where(eq(users.id, id)).returning();

        await logAudit({
            userId: Number(session.user.id),
            userName: session.user.name as string,
            userEmail: session.user.email as string,
            action: body.role !== existing.role ? "role_change" : "update",
            resourceType: "user",
            resourceId: updatedUser.id,
            resourceName: updatedUser.email,
            details: { old: existing, new: updatedUser },
        });

        const { password, ...sanitizedUser } = updatedUser;
        return NextResponse.json(sanitizedUser);
    } catch (error: any) {
        if (error.code === '23505') { // unique_violation
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || "Failed to update user" }, { status: error.status || 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await requireAdmin();
        const p = await params;
        const id = parseInt(p.id);

        if (isNaN(id)) return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

        if (Number(session.user.id) === id) {
            return NextResponse.json({ error: "You cannot delete yourself." }, { status: 403 });
        }

        const [existing] = await db.select().from(users).where(eq(users.id, id));
        if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });

        if (existing.role === 'admin') {
            const adminCount = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'admin'));
            if (Number(adminCount[0].count) <= 1) {
                return NextResponse.json({ error: "Cannot delete the last remaining admin." }, { status: 403 });
            }
        }

        // Perform soft delete by setting active to false. Hard deletes should be done manually if needed to prevent foreign key issues
        const [updated] = await db.update(users).set({ isActive: false, updatedAt: new Date() }).where(eq(users.id, id)).returning();

        await logAudit({
            userId: Number(session.user.id),
            userName: session.user.name as string,
            userEmail: session.user.email as string,
            action: "delete",
            resourceType: "user",
            resourceId: existing.id,
            resourceName: existing.email,
            details: { type: "soft_delete", email: existing.email },
        });

        return NextResponse.json({ message: "User soft-deleted successfully", user: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: error.status || 500 });
    }
}
