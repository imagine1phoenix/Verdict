import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { requireAdmin, logAudit } from "@/lib/audit";
import { desc, eq, or, ilike, and, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
    try {
        await requireAdmin();
        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search");
        const role = searchParams.get("role");
        const status = searchParams.get("status");

        const conditions = [];

        if (search) {
            conditions.push(or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)));
        }

        if (role && role !== "All") {
            conditions.push(eq(users.role, role));
        }

        if (status && status !== "All") {
            conditions.push(eq(users.isActive, status === "Active"));
        }

        const data = await db
            .select()
            .from(users)
            .where(conditions.length ? and(...conditions) : undefined)
            .orderBy(desc(users.createdAt));

        // Do not return password hashes
        const sanitizedUsers = data.map(({ password, ...rest }) => rest);

        return NextResponse.json(sanitizedUsers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: error.status || 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await requireAdmin();
        const body = await req.json();

        const { name, email, password, role = "member", isActive = true } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await db.insert(users).values({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            isActive,
            provider: "credentials",
            status: "offline",
        }).returning();

        // Ensure we don't leak password
        const { password: _, ...sanitizedUser } = newUser;

        await logAudit({
            userId: Number(session.user.id),
            userName: session.user.name as string,
            userEmail: session.user.email as string,
            action: "create",
            resourceType: "user",
            resourceId: newUser.id,
            resourceName: newUser.email,
            details: { name: newUser.name, role: newUser.role, provider: newUser.provider },
        });

        return NextResponse.json(sanitizedUser, { status: 201 });
    } catch (error: any) {
        if (error.code === '23505') { // unique_violation
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || "Failed to create user" }, { status: error.status || 500 });
    }
}
