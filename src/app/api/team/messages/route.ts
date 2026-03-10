import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teamMessages } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const thread = searchParams.get("thread");

        let result;
        if (thread && thread !== "General") {
            result = await db
                .select()
                .from(teamMessages)
                .where(eq(teamMessages.thread, thread))
                .orderBy(teamMessages.createdAt);
        } else {
            result = await db
                .select()
                .from(teamMessages)
                .orderBy(teamMessages.createdAt);
        }
        return NextResponse.json(result);
    } catch (error) {
        console.error("GET /api/team/messages error:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.text || !body.userName) {
            return NextResponse.json({ error: "text and userName are required" }, { status: 400 });
        }

        const [msg] = await db
            .insert(teamMessages)
            .values({
                userId: body.userId || null,
                userName: body.userName,
                text: body.text,
                thread: body.thread || "General",
            })
            .returning();

        const session = await getServerSession(authOptions);
        if (session && session.user) {
            await logAudit({
                userId: Number(session.user.id),
                userName: session.user.name as string,
                userEmail: session.user.email as string,
                action: "create",
                resourceType: "message",
                resourceId: msg.id,
                resourceName: `Message in ${msg.thread}`,
                details: { text: msg.text },
            });
        }

        return NextResponse.json(msg, { status: 201 });
    } catch (error) {
        console.error("POST /api/team/messages error:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
