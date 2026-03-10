import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/schema";
import { requireAdmin } from "@/lib/audit";
import { desc, eq, and, ilike, or, gte, lte, sql } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        await requireAdmin();
        const { searchParams } = new URL(req.url);

        const action = searchParams.get("action");
        const resourceType = searchParams.get("resourceType");
        const userId = searchParams.get("userId");
        const search = searchParams.get("search");
        const fromDate = searchParams.get("from");
        const toDate = searchParams.get("to");

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = (page - 1) * limit;

        const conditions = [];

        if (action && action !== "All") conditions.push(eq(auditLogs.action, action));
        if (resourceType && resourceType !== "All") conditions.push(eq(auditLogs.resourceType, resourceType));
        if (userId) conditions.push(eq(auditLogs.userId, parseInt(userId)));
        if (search) {
            conditions.push(or(
                ilike(auditLogs.resourceName, `%${search}%`),
                ilike(auditLogs.userName, `%${search}%`),
                ilike(auditLogs.userEmail, `%${search}%`)
            ));
        }
        if (fromDate) conditions.push(gte(auditLogs.createdAt, new Date(fromDate)));
        if (toDate) conditions.push(lte(auditLogs.createdAt, new Date(toDate + "T23:59:59.999Z")));

        const whereClause = conditions.length ? and(...conditions) : undefined;

        const data = await db
            .select()
            .from(auditLogs)
            .where(whereClause)
            .orderBy(desc(auditLogs.createdAt))
            .limit(limit)
            .offset(offset);

        // Get total count for pagination
        const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(auditLogs)
            .where(whereClause);

        return NextResponse.json({
            data,
            pagination: {
                total: Number(count),
                page,
                limit,
                totalPages: Math.ceil(Number(count) / limit)
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch audit logs" }, { status: error.status || 500 });
    }
}
