import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { knowledgeArticles } from "@/lib/schema";
import { eq, ilike, and, desc, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");

        const conditions = [];
        if (category) conditions.push(eq(knowledgeArticles.category, category));
        if (search) {
            conditions.push(
                or(
                    ilike(knowledgeArticles.title, `%${search}%`),
                    ilike(knowledgeArticles.content, `%${search}%`),
                    sql`${knowledgeArticles.tags}::text ILIKE ${'%' + search + '%'}`
                )!
            );
        }

        const results = conditions.length > 0
            ? await db.select().from(knowledgeArticles).where(and(...conditions)).orderBy(desc(knowledgeArticles.createdAt))
            : await db.select().from(knowledgeArticles).orderBy(desc(knowledgeArticles.createdAt));

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/knowledge error:", error);
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.title || !body.category) {
            return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
        }
        const [created] = await db.insert(knowledgeArticles).values({
            title: body.title,
            category: body.category,
            content: body.content || null,
            summary: body.summary || null,
            author: body.author || null,
            tags: body.tags || [],
            references: body.references || [],
            views: 0,
            isPinned: body.isPinned || false,
        }).returning();
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("POST /api/knowledge error:", error);
        return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { searchParams } = new URL(req.url);
        const viewOnly = searchParams.get("view") === "true";

        if (!body.id) {
            return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
        }

        if (viewOnly) {
            const [updated] = await db
                .update(knowledgeArticles)
                .set({ views: sql`${knowledgeArticles.views} + 1` })
                .where(eq(knowledgeArticles.id, body.id))
                .returning();
            return NextResponse.json(updated);
        }

        const { id, ...updates } = body;
        updates.updatedAt = new Date();
        const [updated] = await db.update(knowledgeArticles).set(updates).where(eq(knowledgeArticles.id, id)).returning();
        if (!updated) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/knowledge error:", error);
        return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
        }
        const [deleted] = await db.delete(knowledgeArticles).where(eq(knowledgeArticles.id, Number(id))).returning();
        if (!deleted) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Article deleted" });
    } catch (error) {
        console.error("DELETE /api/knowledge error:", error);
        return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
    }
}
