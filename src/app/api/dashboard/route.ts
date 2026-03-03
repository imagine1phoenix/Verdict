import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Case from "@/models/Case";
import Event from "@/models/Event";
import Activity from "@/models/Activity";

export async function GET() {
    try {
        await connectDB();

        const [cases, events, activities] = await Promise.all([
            Case.find().lean(),
            Event.find().sort({ createdAt: -1 }).lean(),
            Activity.find().sort({ createdAt: -1 }).limit(10).lean(),
        ]);

        // Compute stats
        const activeCases = cases.filter((c) => c.status !== "closed").length;
        const upcomingHearings = events.filter((e) => e.type === "Trial" || e.type === "Deposition").length;
        const recentTrials = cases.filter((c) => c.status === "trial").length;

        // Gather recent documents from cases
        const recentDocuments = cases
            .flatMap((c) =>
                (c.documents || []).map((d: { name: string; tag: string; updated: string }) => ({
                    name: d.name,
                    type: d.tag,
                    updated: d.updated,
                }))
            )
            .slice(0, 4);

        const stats = [
            { title: "Active Cases", value: String(activeCases) },
            { title: "Upcoming Hearings", value: String(upcomingHearings) },
            { title: "Recent Trials", value: String(recentTrials) },
            { title: "Prediction Accuracy", value: "94.2%" },
        ];

        return NextResponse.json({
            stats,
            events,
            activities,
            recentDocuments,
        });
    } catch (error) {
        console.error("GET /api/dashboard error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
    }
}
