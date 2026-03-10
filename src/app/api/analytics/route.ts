import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases, pastTrials, timeEntries, users } from "@/lib/schema";
import { eq, sql, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        // ── Cases metrics ────────────────────────────────────────────────
        const allCases = await db.select().from(cases);
        const totalCases = allCases.length;
        const activeCases = allCases.filter(c => c.status !== "closed").length;
        const closedCases = allCases.filter(c => c.status === "closed").length;

        const casesByStatus: Record<string, number> = {};
        const casesByType: Record<string, number> = {};
        for (const c of allCases) {
            casesByStatus[c.status] = (casesByStatus[c.status] || 0) + 1;
            casesByType[c.type] = (casesByType[c.type] || 0) + 1;
        }

        // ── Past trials → win rate ──────────────────────────────────────
        const allTrials = await db.select().from(pastTrials);
        const totalTrials = allTrials.length;
        const wins = allTrials.filter(t => t.verdict === "won").length;
        const losses = allTrials.filter(t => t.verdict === "lost").length;
        const settled = allTrials.filter(t => t.verdict === "settled").length;
        const winRate = totalTrials > 0 ? Math.round((wins / totalTrials) * 100) : 0;

        // Lawyer performance from past trials
        const lawyerTrials: Record<string, { won: number; lost: number; settled: number; total: number }> = {};
        for (const t of allTrials) {
            const lawyer = t.leadAttorney || "Unknown";
            if (!lawyerTrials[lawyer]) lawyerTrials[lawyer] = { won: 0, lost: 0, settled: 0, total: 0 };
            lawyerTrials[lawyer].total++;
            if (t.verdict === "won") lawyerTrials[lawyer].won++;
            else if (t.verdict === "lost") lawyerTrials[lawyer].lost++;
            else if (t.verdict === "settled") lawyerTrials[lawyer].settled++;
        }

        const lawyerPerformance = Object.entries(lawyerTrials).map(([name, stats]) => ({
            name,
            casesWon: stats.won,
            casesLost: stats.lost,
            settled: stats.settled,
            winRate: stats.total > 0 ? `${Math.round((stats.won / stats.total) * 100)}%` : "0%",
        }));

        // ── Time entries → billing ──────────────────────────────────────
        const allTime = await db.select().from(timeEntries);
        const totalHoursCents = allTime.reduce((sum, t) => sum + t.hours, 0);
        const billableHoursCents = allTime.filter(t => t.billable).reduce((sum, t) => sum + t.hours, 0);
        const totalHours = totalHoursCents / 100;
        const billableHours = billableHoursCents / 100;
        const estimatedRevenue = Math.round(billableHours * 5000); // ₹5000/hr average

        // Monthly billing trend
        const monthlyBilling: Record<string, { billed: number; hours: number }> = {};
        for (const t of allTime) {
            const month = t.date.substring(0, 7); // YYYY-MM
            if (!monthlyBilling[month]) monthlyBilling[month] = { billed: 0, hours: 0 };
            monthlyBilling[month].hours += t.hours / 100;
            if (t.billable) monthlyBilling[month].billed += (t.hours / 100) * 5000;
        }

        const billingTrend = Object.entries(monthlyBilling)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, data]) => ({
                month,
                billed: Math.round(data.billed),
                hours: Math.round(data.hours * 100) / 100,
            }));

        // ── Team utilization ────────────────────────────────────────────
        const allUsers = await db.select().from(users);
        const teamUtilization = allUsers.map(u => ({
            name: u.name,
            activeCases: u.activeCases,
            hoursThisWeek: u.hoursThisWeek,
            status: u.status,
        }));

        // ── Case type distribution (for pie chart) ──────────────────────
        const caseTypePie = Object.entries(casesByType).map(([name, value]) => ({ name, value }));

        return NextResponse.json({
            overview: {
                totalCases,
                activeCases,
                closedCases,
                winRate,
                totalHours: Math.round(totalHours * 100) / 100,
                billableHours: Math.round(billableHours * 100) / 100,
                estimatedRevenue,
            },
            trialStats: {
                total: totalTrials,
                wins,
                losses,
                settled,
                winRate,
            },
            casesByStatus,
            casesByType,
            caseTypePie,
            lawyerPerformance,
            billingTrend,
            teamUtilization,
        });
    } catch (error) {
        console.error("GET /api/analytics error:", error);
        return NextResponse.json({ error: "Failed to compute analytics" }, { status: 500 });
    }
}
