import { db } from "@/lib/db";
import { auditLogs, users } from "@/lib/schema";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

type AuditLogInput = {
    userId: number;
    userName?: string;
    userEmail?: string;
    action: string;
    resourceType: string;
    resourceId?: number;
    resourceName?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
};

export async function logAudit({
    userId,
    userName,
    userEmail,
    action,
    resourceType,
    resourceId,
    resourceName,
    details,
    ipAddress,
    userAgent,
}: AuditLogInput) {
    try {
        await db.insert(auditLogs).values({
            userId,
            userName,
            userEmail,
            action,
            resourceType,
            resourceId,
            resourceName,
            details,
            ipAddress,
            userAgent,
        });
    } catch (error) {
        console.error("Failed to write audit log:", error);
    }
}

export async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw { status: 401, message: "Unauthorized" };
    }
    if (session.user.role !== "admin") {
        throw { status: 403, message: "Forbidden — Admin access required" };
    }
    return session;
}
