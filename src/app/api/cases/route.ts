import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Case from "@/models/Case";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        const filter = status && status !== "all" ? { status } : {};
        const cases = await Case.find(filter).sort({ createdAt: -1 }).lean();

        return NextResponse.json(cases);
    } catch (error) {
        console.error("GET /api/cases error:", error);
        return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const newCase = await Case.create(body);

        return NextResponse.json(newCase, { status: 201 });
    } catch (error) {
        console.error("POST /api/cases error:", error);
        return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
    }
}
