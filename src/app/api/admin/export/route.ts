import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, logAudit } from "@/lib/audit";
import { users, cases, auditLogs, systemSettings, documents, evidence, tasks, teamMessages, timeEntries, calendarEvents, mockTrials, pastTrials, knowledgeArticles, proofreadingJobs, announcements } from "@/lib/schema";

export async function GET(req: Request) {
    try {
        const session = await requireAdmin();

        // Run all queries in parallel to get full system state
        const [
            allUsers, allCases, allLogs, allSettings, allDocs, allEvidence,
            allTasks, allMessages, allTime, allEvents, allMockTrials,
            allPastTrials, allKnowledge, allProofreading, allAnnouncements
        ] = await Promise.all([
            db.select().from(users),
            db.select().from(cases),
            db.select().from(auditLogs),
            db.select().from(systemSettings),
            db.select().from(documents),
            db.select().from(evidence),
            db.select().from(tasks),
            db.select().from(teamMessages),
            db.select().from(timeEntries),
            db.select().from(calendarEvents),
            db.select().from(mockTrials),
            db.select().from(pastTrials),
            db.select().from(knowledgeArticles),
            db.select().from(proofreadingJobs),
            db.select().from(announcements),
        ]);

        const fullExport = {
            metadata: {
                exportedAt: new Date().toISOString(),
                exportedBy: session.user.email,
                version: "1.0",
            },
            data: {
                users: allUsers,
                cases: allCases,
                auditLogs: allLogs,
                systemSettings: allSettings,
                documents: allDocs,
                evidence: allEvidence,
                tasks: allTasks,
                teamMessages: allMessages,
                timeEntries: allTime,
                calendarEvents: allEvents,
                mockTrials: allMockTrials,
                pastTrials: allPastTrials,
                knowledgeArticles: allKnowledge,
                proofreadingJobs: allProofreading,
                announcements: allAnnouncements,
            }
        };

        await logAudit({
            userId: Number(session.user.id),
            userName: session.user.name as string,
            userEmail: session.user.email as string,
            action: "export",
            resourceType: "system",
            resourceName: `Full_System_Export.json`,
            details: { type: "full_database_dump" },
        });

        const jsonString = JSON.stringify(fullExport, null, 2);

        return new NextResponse(jsonString, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="verdict_system_export_${new Date().toISOString().split('T')[0]}.json"`,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to export data" }, { status: error.status || 500 });
    }
}
