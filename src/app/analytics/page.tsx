"use client";

import { useState } from "react";
import {
    BarChart3, Star, FileText, Download
} from "lucide-react";
import {
    BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { toast } from "react-hot-toast";

/* ─── Mock Data ─── */

type Tab = "performance" | "cases" | "trials" | "billing" | "satisfaction" | "evidence" | "reports";

const lawyerPerformance = [
    { name: "Adv. Prit", casesWon: 18, casesLost: 3, settled: 5, winRate: "69%", avgTrialScore: 84, billableHours: 1420 },
    { name: "Adv. Meera", casesWon: 14, casesLost: 4, settled: 8, winRate: "54%", avgTrialScore: 79, billableHours: 1280 },
    { name: "Adv. Rohan", casesWon: 10, casesLost: 5, settled: 4, winRate: "53%", avgTrialScore: 72, billableHours: 1100 },
    { name: "Adv. Priya", casesWon: 6, casesLost: 2, settled: 3, winRate: "55%", avgTrialScore: 76, billableHours: 980 },
];

const caseOutcomes = [
    { month: "Sep", won: 5, lost: 1, settled: 2 },
    { month: "Oct", won: 7, lost: 2, settled: 3 },
    { month: "Nov", won: 6, lost: 3, settled: 1 },
    { month: "Dec", won: 8, lost: 1, settled: 4 },
    { month: "Jan", won: 10, lost: 2, settled: 3 },
    { month: "Feb", won: 9, lost: 1, settled: 5 },
];

const mockTrialImprovement = [
    { month: "Sep", accuracy: 68, avgScore: 71 },
    { month: "Oct", accuracy: 72, avgScore: 74 },
    { month: "Nov", accuracy: 70, avgScore: 72 },
    { month: "Dec", accuracy: 76, avgScore: 78 },
    { month: "Jan", accuracy: 82, avgScore: 81 },
    { month: "Feb", accuracy: 88, avgScore: 85 },
];

const billingData = [
    { month: "Sep", billed: 850, collected: 720, outstanding: 130 },
    { month: "Oct", billed: 920, collected: 810, outstanding: 110 },
    { month: "Nov", billed: 780, collected: 660, outstanding: 120 },
    { month: "Dec", billed: 1100, collected: 980, outstanding: 120 },
    { month: "Jan", billed: 1050, collected: 920, outstanding: 130 },
    { month: "Feb", billed: 960, collected: 800, outstanding: 160 },
];

const satisfactionScores = [
    { client: "TechCorp Inc.", score: 4.8, cases: 3, feedback: "Excellent strategic advice, very responsive." },
    { client: "Horizon Corp", score: 4.5, cases: 2, feedback: "Strong M&A expertise. Minor delay on final docs." },
    { client: "Sharma Family", score: 4.9, cases: 1, feedback: "Outstanding dedication to our case." },
    { client: "CloudNet Ltd.", score: 4.2, cases: 1, feedback: "Good privacy knowledge. Would like more updates." },
    { client: "Nexus Inc.", score: 4.6, cases: 2, feedback: "Thorough IP analysis. Well-prepared filings." },
];

const evidenceStats = [
    { category: "Digital", count: 245, utilized: 189, rate: "77%" },
    { category: "Documentary", count: 178, utilized: 156, rate: "88%" },
    { category: "Testimonial", count: 62, utilized: 58, rate: "94%" },
    { category: "Physical", count: 34, utilized: 28, rate: "82%" },
];

const caseTypePie = [
    { name: "Criminal", value: 25 },
    { name: "Civil", value: 20 },
    { name: "Corporate", value: 30 },
    { name: "IP", value: 15 },
    { name: "Family", value: 10 },
];
const PIE_FILLS = ["#111111", "#555555", "#888888", "#AAAAAA", "#DDDDDD"];

/* ─── Component ─── */

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("performance");

    const tabs: { id: Tab; label: string }[] = [
        { id: "performance", label: "Lawyers" },
        { id: "cases", label: "Cases" },
        { id: "trials", label: "Mock Trials" },
        { id: "billing", label: "Billing" },
        { id: "satisfaction", label: "Clients" },
        { id: "evidence", label: "Evidence" },
        { id: "reports", label: "Reports" },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col">

            {/* ── Header ── */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center">
                            <BarChart3 className="w-6 h-6 mr-3" strokeWidth={1.5} />
                            Analytics & Reporting
                        </h1>
                        <p className="text-sm font-sans text-neutral">Firm performance, case outcomes, billing, and client satisfaction analytics.</p>
                    </div>
                    <button onClick={() => toast("EXPORTING ANALYTICS REPORT...")} className="flex items-center px-4 py-2 border border-ink text-ink hover:bg-ink/5 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider shrink-0">
                        <Download className="w-3 h-3 mr-1.5" strokeWidth={1.5} /> Export
                    </button>
                </div>
            </div>

            {/* ── Tab Navigation ── */}
            <div className="flex flex-wrap border border-ink mb-6">
                {tabs.map((tab, i) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 text-center font-sans text-[10px] font-bold uppercase tracking-wider transition-colors ${i < tabs.length - 1 ? 'border-r border-ink' : ''} ${activeTab === tab.id ? 'bg-ink text-newsprint' : 'text-ink hover:bg-ink/5'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ═══ PERFORMANCE ═══ */}
            {activeTab === "performance" && (
                <div className="space-y-6">
                    <div className="border border-ink">
                        <div className="h-9 border-b border-ink px-4 flex items-center">
                            <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Lawyer Performance Metrics</span>
                        </div>
                        <table className="w-full">
                            <thead><tr className="border-b border-ink bg-ink/[0.03]">
                                <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Lawyer</th>
                                <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Won</th>
                                <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Lost</th>
                                <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Settled</th>
                                <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Win Rate</th>
                                <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Trial Score</th>
                                <th className="text-right px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Billable Hrs</th>
                            </tr></thead>
                            <tbody>
                                {lawyerPerformance.map((l, i) => (
                                    <tr key={i} className="border-b border-ink/10 hover:bg-ink/[0.03] transition-colors">
                                        <td className="px-4 py-2.5 font-sans text-xs font-bold text-ink">{l.name}</td>
                                        <td className="px-4 py-2.5 text-center font-mono text-[11px] font-bold text-ink">{l.casesWon}</td>
                                        <td className="px-4 py-2.5 text-center font-mono text-[11px] text-accent">{l.casesLost}</td>
                                        <td className="px-4 py-2.5 text-center font-mono text-[11px] text-neutral">{l.settled}</td>
                                        <td className="px-4 py-2.5 text-center font-mono text-[11px] font-bold text-ink">{l.winRate}</td>
                                        <td className="px-4 py-2.5 text-center font-mono text-[11px] text-ink">{l.avgTrialScore}/100</td>
                                        <td className="px-4 py-2.5 text-right font-mono text-[11px] font-bold text-ink">{l.billableHours.toLocaleString()}h</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ═══ CASES ═══ */}
            {activeTab === "cases" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 border border-ink">
                    <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-ink flex flex-col">
                        <div className="h-9 border-b border-ink px-4 flex items-center">
                            <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Case Outcomes Over Time</span>
                        </div>
                        <div className="p-4 h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={caseOutcomes} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#737373', fontFamily: 'JetBrains Mono' }} stroke="#111" />
                                    <YAxis tick={{ fontSize: 9, fill: '#737373', fontFamily: 'JetBrains Mono' }} stroke="#111" />
                                    <Bar dataKey="won" fill="#111111" />
                                    <Bar dataKey="lost" fill="#CC0000" />
                                    <Bar dataKey="settled" fill="#AAAAAA" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="px-4 pb-3 flex gap-4 text-[9px] font-sans font-bold uppercase tracking-wider text-neutral">
                            <span className="flex items-center"><span className="w-2 h-2 bg-ink mr-1.5" />Won</span>
                            <span className="flex items-center"><span className="w-2 h-2 bg-accent mr-1.5" />Lost</span>
                            <span className="flex items-center"><span className="w-2 h-2 bg-neutral/50 mr-1.5" />Settled</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="h-9 border-b border-ink px-4 flex items-center">
                            <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">By Type</span>
                        </div>
                        <div className="p-4 h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={caseTypePie} cx="50%" cy="50%" outerRadius={65} dataKey="value" stroke="#F9F9F7" strokeWidth={2}>
                                        {caseTypePie.map((_, i) => <Cell key={i} fill={PIE_FILLS[i]} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="px-4 pb-3 grid grid-cols-2 gap-1">
                            {caseTypePie.map((d, i) => (
                                <span key={i} className="flex items-center text-[8px] font-sans font-bold text-neutral uppercase tracking-wider">
                                    <span className="w-2 h-2 mr-1.5 shrink-0" style={{ background: PIE_FILLS[i] }} />{d.name} ({d.value}%)
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ MOCK TRIALS ═══ */}
            {activeTab === "trials" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Mock Trial Improvement Trends</span>
                    </div>
                    <div className="p-4 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockTrialImprovement} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#737373', fontFamily: 'JetBrains Mono' }} stroke="#111" />
                                <YAxis tick={{ fontSize: 9, fill: '#737373', fontFamily: 'JetBrains Mono' }} stroke="#111" domain={[60, 100]} />
                                <Area type="monotone" dataKey="accuracy" stroke="#111111" strokeWidth={1.5} fill="#111111" fillOpacity={0.08} />
                                <Area type="monotone" dataKey="avgScore" stroke="#CC0000" strokeWidth={1.5} fill="#CC0000" fillOpacity={0.05} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="px-4 pb-3 flex gap-4 text-[9px] font-sans font-bold uppercase tracking-wider text-neutral">
                        <span className="flex items-center"><span className="w-2 h-2 bg-ink mr-1.5" />Prediction Accuracy</span>
                        <span className="flex items-center"><span className="w-2 h-2 bg-accent mr-1.5" />Avg Performance Score</span>
                    </div>
                </div>
            )}

            {/* ═══ BILLING ═══ */}
            {activeTab === "billing" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-3 border border-ink">
                        <div className="p-4 text-center border-r border-ink">
                            <span className="font-mono text-2xl font-bold text-ink block">₹56.6L</span>
                            <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-wider">Total Billed</span>
                        </div>
                        <div className="p-4 text-center border-r border-ink">
                            <span className="font-mono text-2xl font-bold text-ink block">₹48.9L</span>
                            <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-wider">Collected</span>
                        </div>
                        <div className="p-4 text-center">
                            <span className="font-mono text-2xl font-bold text-accent block">₹7.7L</span>
                            <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-wider">Outstanding</span>
                        </div>
                    </div>
                    <div className="border border-ink">
                        <div className="h-9 border-b border-ink px-4 flex items-center">
                            <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Billing Trends (₹ thousands)</span>
                        </div>
                        <div className="p-4 h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={billingData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#737373', fontFamily: 'JetBrains Mono' }} stroke="#111" />
                                    <YAxis tick={{ fontSize: 9, fill: '#737373', fontFamily: 'JetBrains Mono' }} stroke="#111" />
                                    <Bar dataKey="billed" fill="#111111" />
                                    <Bar dataKey="collected" fill="#888888" />
                                    <Bar dataKey="outstanding" fill="#CC0000" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ SATISFACTION ═══ */}
            {activeTab === "satisfaction" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <Star className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Client Satisfaction Scores</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {satisfactionScores.map((c, i) => (
                            <div key={i} className="px-4 py-3 hover:bg-ink/[0.03] transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-sans text-xs font-bold text-ink">{c.client}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm font-bold text-ink">{c.score}</span>
                                        <span className="text-[9px] font-mono text-neutral">/ 5.0</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mb-1.5">
                                    <div className="flex-1 h-1.5 bg-ink/10">
                                        <div className="h-full bg-ink" style={{ width: `${(c.score / 5) * 100}%` }} />
                                    </div>
                                    <span className="text-[9px] font-mono text-neutral shrink-0">{c.cases} cases</span>
                                </div>
                                <p className="font-serif text-[11px] text-neutral italic">&ldquo;{c.feedback}&rdquo;</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══ EVIDENCE ═══ */}
            {activeTab === "evidence" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Evidence Utilization Stats</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {evidenceStats.map((e, i) => (
                            <div key={i} className="px-4 py-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-sans text-xs font-bold text-ink">{e.category}</span>
                                    <span className="font-mono text-sm font-bold text-ink">{e.rate}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-ink/10">
                                        <div className="h-full bg-ink" style={{ width: e.rate }} />
                                    </div>
                                    <span className="text-[9px] font-mono text-neutral shrink-0">{e.utilized} / {e.count} items</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══ REPORTS ═══ */}
            {activeTab === "reports" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center section-inverted">
                        <FileText className="w-3.5 h-3.5 mr-2 text-newsprint" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">Custom Report Builder</span>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Report Type</label>
                            <select className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink cursor-pointer">
                                <option>Firm Performance Summary</option>
                                <option>Case Outcome Analysis</option>
                                <option>Billing & Revenue Report</option>
                                <option>Mock Trial Trends</option>
                                <option>Client Satisfaction Report</option>
                                <option>Evidence Utilization Report</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Date From</label>
                                <input type="date" className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Date To</label>
                                <input type="date" className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Lawyers</label>
                            <select className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink cursor-pointer">
                                <option>All Lawyers</option>
                                <option>Adv. Prit</option>
                                <option>Adv. Meera</option>
                                <option>Adv. Rohan</option>
                                <option>Adv. Priya</option>
                            </select>
                        </div>
                        <button onClick={() => toast("GENERATING REPORT...")} className="w-full py-2.5 bg-ink text-newsprint font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-ink/90 transition-colors">
                            Generate Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
