import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases, events, activities } from "@/lib/schema";
import { desc, ne } from "drizzle-orm";

export async function GET() {
    try {
        const [allCases, allEvents, allActivities] = await Promise.all([
            db.select().from(cases),
            db.select().from(events).orderBy(desc(events.createdAt)),
            db.select().from(activities).orderBy(desc(activities.createdAt)).limit(10),
        ]);

        // Compute stats
        const activeCases = allCases.filter((c) => c.status !== "closed").length;
        const upcomingHearings = allEvents.filter((e) => e.type === "Trial" || e.type === "Deposition").length;
        const recentTrials = allCases.filter((c) => c.status === "trial").length;

        // Gather recent documents from cases
        const recentDocuments = allCases
            .flatMap((c) =>
                (c.documents as { name: string; tag: string; updated: string }[] || []).map((d) => ({
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
            events: allEvents,
            activities: allActivities,
            recentDocuments,
        });
    } catch (error) {
        console.error("GET /api/dashboard error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
    }
}
