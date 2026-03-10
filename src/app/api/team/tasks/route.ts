import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET() {
    try {
        const result = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
        return NextResponse.json(result);
    } catch (error) {
        console.error("GET /api/team/tasks error:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.title || !body.assignee) {
            return NextResponse.json({ error: "title and assignee are required" }, { status: 400 });
        }

        const [task] = await db
            .insert(tasks)
            .values({
                title: body.title,
                assignee: body.assignee,
                caseRef: body.caseRef || null,
                status: body.status || "todo",
                priority: body.priority || "Medium",
                due: body.due || null,
            })
            .returning();

        const session = await getServerSession(authOptions);
        if (session && session.user) {
            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "create",
                resourceType: "task",
                resourceId: task.id,
                resourceName: task.title,
                details: task,
            });
        }

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error("POST /api/team/tasks error:", error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

        const [updated] = await db
            .update(tasks)
            .set({ ...body, updatedAt: new Date(), id: undefined })
            .where(eq(tasks.id, body.id))
            .returning();

        if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 });
        const session = await getServerSession(authOptions);
        if (session && session.user) {
            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "update",
                resourceType: "task",
                resourceId: updated.id,
                resourceName: updated.title,
                details: body,
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/team/tasks error:", error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

        await db.delete(tasks).where(eq(tasks.id, parseInt(id)));
        const session = await getServerSession(authOptions);
        if (session && session.user) {
            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "delete",
                resourceType: "task",
                resourceId: parseInt(id),
                resourceName: `Task ID ${id}`,
                details: { deletedId: id },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/team/tasks error:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
