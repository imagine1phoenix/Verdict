import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Case from "@/models/Case";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const found = await Case.findOne({ caseId: id }).lean();
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
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const updated = await Case.findOneAndUpdate(
            { caseId: id },
            { $set: body },
            { new: true, lean: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Case not found" }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/cases/[id] error:", error);
        return NextResponse.json({ error: "Failed to update case" }, { status: 500 });
    }
}
