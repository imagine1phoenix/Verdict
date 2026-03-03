"use client";

import { useState, useEffect } from "react";
import { Scale, FileCheck2, TrendingUp, Clock, Gavel, FileWarning, ArrowRight, CalendarDays, FileText, Users, Activity } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import CollaborationIndicators from "@/components/CollaborationIndicators";
import PinnedAndRecent from "@/components/PinnedAndRecent";

const statIcons = [Scale, CalendarDays, Gavel, TrendingUp];

// Fallback mock data
const fallbackStats = [
    { title: "Active Cases", value: "12" },
    { title: "Upcoming Hearings", value: "3" },
    { title: "Recent Trials", value: "5" },
    { title: "Prediction Accuracy", value: "94.2%" },
];

const fallbackEvents = [
    { day: "Today", event: "Deposition Review", time: "2:00 PM", type: "Deposition" },
    { day: "Tomorrow", event: "Mock Trial — Smith v. Jones", time: "10:00 AM", type: "Trial" },
    { day: "Wed", event: "Client Briefing — Horizon Corp", time: "3:30 PM", type: "Meeting" },
    { day: "Thu", event: "Evidence Review Deadline", time: "EOD", type: "Deadline" },
    { day: "Fri", event: "Settlement Negotiation", time: "11:00 AM", type: "Negotiation" },
];

const fallbackDocuments = [
    { name: "Brief_v3.docx", type: "Brief", updated: "2h ago" },
    { name: "Evidence_22.pdf", type: "Evidence", updated: "5h ago" },
    { name: "Contract_Review.docx", type: "Contract", updated: "1d ago" },
    { name: "Deposition_Notes.pdf", type: "Notes", updated: "2d ago" },
];

const fallbackActivity = [
    { user: "Adv. Prit", action: "edited case brief", target: "Sharma v. State", time: "10m ago" },
    { user: "System", action: "Mock trial completed", target: "Smith v. Jones — 82% win", time: "1h ago" },
    { user: "Adv. Meera", action: "added new evidence", target: "Nexus IP Dispute", time: "3h ago" },
    { user: "System", action: "Document scan finished", target: "MSA_v3.docx — 2 risks", time: "5h ago" },
    { user: "Adv. Prit", action: "scheduled hearing", target: "DEF Corp Defense", time: "1d ago" },
];

export default function Home() {
    const router = useRouter();
    const [stats, setStats] = useState(fallbackStats);
    const [calendarEvents, setCalendarEvents] = useState(fallbackEvents);
    const [recentDocuments, setRecentDocuments] = useState(fallbackDocuments);
    const [activityFeed, setActivityFeed] = useState(fallbackActivity);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    if (data.stats?.length) setStats(data.stats);
                    if (data.events?.length) setCalendarEvents(data.events);
                    if (data.recentDocuments?.length) setRecentDocuments(data.recentDocuments);
                    if (data.activities?.length) setActivityFeed(data.activities);
                }
            })
            .catch(() => { /* use fallback data */ })
            .finally(() => setLoading(false));
    }, []);

    const handleInvite = () => {
        toast.success("INVITATION LINK COPIED");
    };

    const handleNewMockTrial = () => {
        router.push("/mock-trials");
    };

    return (
        <div className="flex flex-col pb-12">

            {/* Newspaper Masthead Area */}
            <div className="border-b-[4px] border-ink pb-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="flex-1">
                        <h1 className="font-serif text-2xl md:text-4xl font-bold text-ink tracking-tight">Dashboard</h1>
                        <p className="drop-cap text-sm text-neutral font-sans mt-3 leading-relaxed max-w-xl">
                            Welcome back, Adv. Prit. Here is your firm&apos;s AI intelligence summary for today&apos;s edition. All case analytics and document scans are current as of this morning.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                        <button onClick={handleInvite} className="flex items-center px-4 py-2 border border-ink bg-transparent text-ink hover:bg-ink/5 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider">
                            Invite Colleague
                            <ArrowRight className="w-3 h-3 ml-2" strokeWidth={1.5} />
                        </button>
                        <button onClick={handleNewMockTrial} className="flex items-center px-4 py-2 bg-ink text-newsprint hover:bg-ink/90 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider">
                            New Mock Trial
                            <Scale className="w-3 h-3 ml-2" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 border border-ink mb-6">
                {stats.map((stat, i) => {
                    const Icon = statIcons[i] || Scale;
                    return (
                        <div key={i} className={`p-4 flex flex-col hover:bg-ink/5 transition-colors cursor-pointer ${i < stats.length - 1 ? 'border-r border-ink' : ''} ${i < 2 ? 'border-b md:border-b-0 border-ink' : ''}`}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-neutral">{stat.title}</span>
                                <Icon className="w-3.5 h-3.5 text-ink" strokeWidth={1.5} />
                            </div>
                            <span className={`text-2xl font-mono font-bold tracking-tighter text-ink ${loading ? 'animate-pulse bg-ink/10 w-16 h-8' : ''}`}>
                                {loading ? '' : stat.value}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* AI Insights — full width */}
            <AIInsightsPanel />

            {/* Calendar + Collaboration side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                    <div className="border border-ink">
                        <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                            <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink flex items-center">
                                <CalendarDays className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />
                                Today&apos;s Schedule
                            </span>
                            <span className="text-[9px] font-mono text-neutral uppercase">{calendarEvents.length} events</span>
                        </div>
                        <div className="divide-y divide-ink/10">
                            {calendarEvents.map((event, i) => (
                                <div key={i} className="flex flex-wrap md:flex-nowrap items-center px-4 py-2.5 hover:bg-ink/[0.03] transition-colors cursor-pointer gap-y-1">
                                    <span className="font-mono text-[10px] font-bold text-neutral w-16 md:w-20 shrink-0 uppercase">
                                        {event.day}
                                    </span>
                                    <span className="font-sans text-xs font-semibold text-ink flex-1 min-w-0">{event.event}</span>
                                    <span className="text-[9px] font-mono text-neutral uppercase mr-3">{event.time}</span>
                                    <span className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1.5 py-0.5 text-neutral shrink-0">{event.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <CollaborationIndicators />
            </div>

            {/* Recent Documents + Activity Feed — full width */}
            <div className="grid grid-cols-1 lg:grid-cols-3 border border-ink">

                {/* Recent Documents — 2/3 */}
                <div className="lg:col-span-2 flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <FileText className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Recent Documents</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {recentDocuments.map((doc, i) => (
                            <div key={i} className="flex items-center px-4 py-3 hover:bg-ink/[0.03] transition-colors cursor-pointer group">
                                <FileText className="w-4 h-4 text-neutral mr-3 group-hover:text-ink transition-colors" strokeWidth={1.5} />
                                <span className="font-mono text-xs text-ink flex-1">{doc.name}</span>
                                <span className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1.5 py-0.5 text-neutral mr-3">{doc.type}</span>
                                <span className="text-[9px] font-mono text-neutral uppercase">{doc.updated}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Feed — 1/3 */}
                <div className="flex flex-col">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <Activity className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Activity Feed</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {activityFeed.map((item, i) => (
                            <div key={i} className="px-4 py-2.5 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                                <p className="text-[11px] font-sans text-ink leading-snug">
                                    <span className="font-bold">{item.user}</span>
                                    {" "}<span className="text-neutral">{item.action}</span>
                                </p>
                                <p className="text-[10px] font-mono text-neutral mt-0.5">{item.target}</p>
                                <p className="text-[9px] font-mono text-neutral/60 mt-0.5 uppercase">{item.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pinned & Recent Items */}
            <PinnedAndRecent />

        </div>
    );
}
