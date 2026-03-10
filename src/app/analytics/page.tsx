"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Clock, Scale, Trophy, FileText, Target } from "lucide-react";
import { toast } from "react-hot-toast";

type Analytics = {
    overview: { totalCases: number; activeCases: number; closedCases: number; winRate: number; totalHours: number; billableHours: number; estimatedRevenue: number };
    trialStats: { total: number; wins: number; losses: number; settled: number; winRate: number };
    casesByStatus: Record<string, number>;
    casesByType: Record<string, number>;
    caseTypePie: { name: string; value: number }[];
    lawyerPerformance: { name: string; casesWon: number; casesLost: number; settled: number; winRate: string }[];
    billingTrend: { month: string; billed: number; hours: number }[];
    teamUtilization: { name: string | null; activeCases: number; hoursThisWeek: number; status: string | null }[];
};

export default function AnalyticsPage() {
    const [data, setData] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetch("/api/analytics").then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => { toast.error("FAILED TO LOAD"); setLoading(false); }); }, []);

    const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString("en-IN")}`;

    if (loading || !data) return <div className="max-w-6xl mx-auto pb-12"><div className="border-b-[4px] border-ink pb-5 mb-6"><div className="h-8 w-48 bg-ink/10 animate-pulse mb-2" /><div className="h-4 w-96 bg-ink/10 animate-pulse" /></div><div className="grid grid-cols-4 gap-3">{[1, 2, 3, 4].map(i => <div key={i} className="border border-ink/20 p-6"><div className="h-8 w-16 bg-ink/10 animate-pulse mb-2" /><div className="h-3 w-24 bg-ink/10 animate-pulse" /></div>)}</div></div>;

    const { overview: ov, trialStats: ts, casesByStatus: cs, casesByType: ct, lawyerPerformance: lp, billingTrend: bt, teamUtilization: tu } = data;

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center"><BarChart3 className="w-6 h-6 mr-3" strokeWidth={1.5} />Analytics</h1>
                <p className="text-sm font-sans text-neutral">Firm performance metrics — real-time from database</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-ink mb-6">
                {[{ label: "Total Cases", val: ov.totalCases, icon: FileText }, { label: "Active", val: ov.activeCases, icon: Target }, { label: "Win Rate", val: `${ov.winRate}%`, icon: Trophy }, { label: "Revenue (Est)", val: fmt(ov.estimatedRevenue), icon: TrendingUp }].map((c, i) => (
                    <div key={c.label} className={`py-5 px-4 text-center ${i < 3 ? "border-r border-ink" : ""}`}>
                        <c.icon className="w-5 h-5 mx-auto text-neutral mb-1" strokeWidth={1.5} />
                        <p className="font-mono text-2xl font-bold text-ink">{c.val}</p>
                        <p className="font-mono text-[9px] text-neutral uppercase tracking-widest">{c.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Trial Outcomes */}
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center section-inverted"><Scale className="w-3.5 h-3.5 mr-2 text-newsprint" strokeWidth={1.5} /><span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">Trial Outcomes</span></div>
                    <div className="p-4">
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {[{ l: "Total", v: ts.total }, { l: "Won", v: ts.wins }, { l: "Lost", v: ts.losses }, { l: "Settled", v: ts.settled }].map(s => (
                                <div key={s.l} className="text-center"><p className="font-mono text-xl font-bold text-ink">{s.v}</p><p className="font-mono text-[9px] text-neutral uppercase">{s.l}</p></div>
                            ))}
                        </div>
                        {ts.total > 0 && <div className="h-6 flex border border-ink/30">
                            <div className="bg-green-600" style={{ width: `${(ts.wins / ts.total) * 100}%` }} title={`Won: ${ts.wins}`} />
                            <div className="bg-yellow-500" style={{ width: `${(ts.settled / ts.total) * 100}%` }} title={`Settled: ${ts.settled}`} />
                            <div className="bg-red-500/70" style={{ width: `${(ts.losses / ts.total) * 100}%` }} title={`Lost: ${ts.losses}`} />
                        </div>}
                        <div className="flex gap-4 mt-2 justify-center">
                            {[{ l: "Won", c: "bg-green-600" }, { l: "Settled", c: "bg-yellow-500" }, { l: "Lost", c: "bg-red-500/70" }].map(x => (
                                <span key={x.l} className="flex items-center gap-1 font-mono text-[9px] text-neutral"><span className={`w-2 h-2 ${x.c}`} />{x.l}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cases by Type */}
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center"><FileText className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} /><span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Cases by Type</span></div>
                    <div className="p-4 space-y-2">
                        {Object.entries(ct).map(([type, count]) => {
                            const pct = ov.totalCases > 0 ? Math.round((count / ov.totalCases) * 100) : 0; return (
                                <div key={type} className="flex items-center gap-3">
                                    <span className="font-mono text-[10px] text-ink w-40 truncate">{type}</span>
                                    <div className="flex-1 h-4 border border-ink/20 relative"><div className="absolute inset-y-0 left-0 bg-ink/20" style={{ width: `${pct}%` }} /></div>
                                    <span className="font-mono text-[10px] font-bold text-ink w-8 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Lawyer Performance */}
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center"><Users className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} /><span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Lawyer Performance</span></div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="border-b border-ink bg-ink/[0.03]">
                                {["Lawyer", "Won", "Lost", "Settled", "Win Rate"].map(h => <th key={h} className="text-left px-3 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">{h}</th>)}
                            </tr></thead>
                            <tbody>{lp.map(l => <tr key={l.name} className="border-b border-ink/10">
                                <td className="px-3 py-2 font-sans text-[11px] font-bold text-ink">{l.name}</td>
                                <td className="px-3 py-2 font-mono text-[10px] text-green-700">{l.casesWon}</td>
                                <td className="px-3 py-2 font-mono text-[10px] text-accent">{l.casesLost}</td>
                                <td className="px-3 py-2 font-mono text-[10px] text-yellow-700">{l.settled}</td>
                                <td className="px-3 py-2 font-mono text-[10px] font-bold text-ink">{l.winRate}</td>
                            </tr>)}</tbody>
                        </table>
                    </div>
                </div>

                {/* Team Utilization */}
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center"><Clock className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} /><span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Team Utilization</span></div>
                    <div className="p-4 space-y-3">
                        {tu.map(u => <div key={u.name} className="flex items-center gap-3">
                            <span className="font-sans text-[11px] font-bold text-ink w-40 truncate">{u.name}</span>
                            <div className="flex-1">
                                <div className="h-3 border border-ink/20 relative"><div className="absolute inset-y-0 left-0 bg-ink/30" style={{ width: `${Math.min(100, (u.hoursThisWeek / 40) * 100)}%` }} /></div>
                            </div>
                            <span className="font-mono text-[10px] text-ink w-12 text-right">{u.hoursThisWeek}h</span>
                            <span className="font-mono text-[9px] text-neutral">{u.activeCases} cases</span>
                        </div>)}
                    </div>
                </div>
            </div>

            {/* Billing + Hours */}
            <div className="border border-ink mb-6">
                <div className="h-9 border-b border-ink px-4 flex items-center section-inverted"><TrendingUp className="w-3.5 h-3.5 mr-2 text-newsprint" strokeWidth={1.5} /><span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">Hours Summary</span></div>
                <div className="grid grid-cols-3 divide-x divide-ink/10 p-4">
                    <div className="text-center"><p className="font-mono text-2xl font-bold text-ink">{ov.totalHours}</p><p className="font-mono text-[9px] text-neutral uppercase">Total Hours</p></div>
                    <div className="text-center"><p className="font-mono text-2xl font-bold text-ink">{ov.billableHours}</p><p className="font-mono text-[9px] text-neutral uppercase">Billable</p></div>
                    <div className="text-center"><p className="font-mono text-2xl font-bold text-ink">{fmt(ov.estimatedRevenue)}</p><p className="font-mono text-[9px] text-neutral uppercase">Est. Revenue</p></div>
                </div>
            </div>

            {/* Cases by Status */}
            <div className="border border-ink">
                <div className="h-9 border-b border-ink px-4 flex items-center"><Target className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} /><span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Cases by Status</span></div>
                <div className="flex divide-x divide-ink/10 p-0">
                    {Object.entries(cs).map(([status, count]) => (
                        <div key={status} className="flex-1 py-4 text-center"><p className="font-mono text-lg font-bold text-ink">{count}</p><p className="font-mono text-[9px] text-neutral uppercase">{status}</p></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
