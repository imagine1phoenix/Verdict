import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const result = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                avatar: users.avatar,
                status: users.status,
                activeCases: users.activeCases,
                hoursThisWeek: users.hoursThisWeek,
                viewing: users.viewing,
                provider: users.provider,
                lastSeenAt: users.lastSeenAt,
            })
            .from(users);
        return NextResponse.json(result);
    } catch (error) {
        console.error("GET /api/users error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

        const allowedFields: Record<string, unknown> = {};
        if (body.name) allowedFields.name = body.name;
        if (body.role) allowedFields.role = body.role;
        if (body.avatar) allowedFields.avatar = body.avatar;
        if (body.status) allowedFields.status = body.status;
        if (body.viewing !== undefined) allowedFields.viewing = body.viewing;

        const [updated] = await db
            .update(users)
            .set({ ...allowedFields, updatedAt: new Date() })
            .where(eq(users.id, body.id))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                avatar: users.avatar,
                status: users.status,
            });

        if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/users error:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
