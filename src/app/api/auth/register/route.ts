import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        // Validate inputs
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()));

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const [newUser] = await db
            .insert(users)
            .values({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                provider: "credentials",
                role: "member",
                avatar: "",
                isActive: true,
            })
            .returning();

        await logAudit({
            userId: newUser.id,
            userName: newUser.name,
            userEmail: newUser.email,
            action: "register",
            resourceType: "user",
            resourceId: newUser.id,
            resourceName: newUser.email,
            details: { provider: "credentials" },
        });

        return NextResponse.json(
            {
                message: "Account created successfully",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
