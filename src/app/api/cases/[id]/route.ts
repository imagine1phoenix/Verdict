import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases } from "@/lib/schema";
import { eq } from "drizzle-orm";

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

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/cases/[id] error:", error);
        return NextResponse.json({ error: "Failed to update case" }, { status: 500 });
    }
}
