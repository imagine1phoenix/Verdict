import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const [found] = await db
            .select()
            .from(cases)
            .where(eq(cases.caseId, id));

        if (!found) {
            return NextResponse.json({ error: "Case not found" }, { status: 404 });
        }

        return NextResponse.json(found);
    } catch (error) {
        console.error("GET /api/cases/[id] error:", error);
        return NextResponse.json({ error: "Failed to fetch case" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const [updated] = await db
            .update(cases)
            .set({ ...body, updatedAt: new Date() })
            .where(eq(cases.caseId, id))
            .returning();

        if (!updated) {
            return NextResponse.json({ error: "Case not found" }, { status: 404 });
        }

        const session = await getServerSession(authOptions);
        if (session && session.user) {
            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "update",
                resourceType: "case",
                resourceId: updated.id,
                resourceName: updated.name,
                details: body,
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/cases/[id] error:", error);
        return NextResponse.json({ error: "Failed to update case" }, { status: 500 });
    }
}
