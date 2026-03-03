"use client";

import { useState, useEffect, useCallback } from "react";
import {
    FolderOpen, Users, CalendarDays, DollarSign, Link2, ArrowRight,
    Clock, CheckCircle, AlertTriangle, Gavel, FileText, Tag,
    ChevronRight, Plus, Search, Eye, Upload, Lock, Unlock
} from "lucide-react";
import { toast } from "react-hot-toast";

/* ─── Types ─── */

type PipelineStatus = "intake" | "discovery" | "motion" | "trial" | "closed";

interface CaseItem {
    _id: string;
    caseId: string;
    name: string;
    type: string;
    status: PipelineStatus;
    lead: string;
    priority: string;
    nextDate: string;
    billing: { total: string; billed: string; outstanding: string; hours: number };
    court?: string;
    judge?: string;
    filed?: string;
    team?: { name: string; role: string }[];
    timeline?: { date: string; event: string; done: boolean }[];
    documents?: { name: string; tag: string; checkedOut: boolean; updated: string }[];
    relatedCases?: { caseId: string; name: string; relevance: string }[];
}

const pipelineStages: { id: PipelineStatus; label: string }[] = [
    { id: "intake", label: "Intake" },
    { id: "discovery", label: "Discovery" },
    { id: "motion", label: "Motions" },
    { id: "trial", label: "Trial Prep" },
    { id: "closed", label: "Closed" },
];

/* ─── Fallback mock data ─── */
const fallbackCases: CaseItem[] = [
    { _id: "1", caseId: "VDT-2024-001", name: "Sharma v. State of Maharashtra", type: "Criminal Defense", status: "discovery", lead: "Adv. Prit", priority: "High", nextDate: "Feb 28", billing: { total: "₹4,20,000", billed: "₹2,80,000", outstanding: "₹1,40,000", hours: 64 }, court: "High Court — Maharashtra", judge: "Hon. Justice R. Deshmukh", filed: "Jan 15, 2024", team: [{ name: "Adv. Prit Thacker", role: "Lead Counsel" }, { name: "Adv. Meera Shah", role: "Associate" }, { name: "Ravi Kumar", role: "Paralegal" }], timeline: [{ date: "Jan 15", event: "Case Filed", done: true }, { date: "Jan 22", event: "First Hearing", done: true }, { date: "Feb 10", event: "Discovery Begins", done: true }, { date: "Feb 28", event: "Evidence Submission Deadline", done: false }, { date: "Mar 15", event: "Pre-Trial Conference", done: false }, { date: "Apr 5", event: "Trial Date", done: false }], documents: [{ name: "Charge Sheet.pdf", tag: "Filing", checkedOut: false, updated: "Feb 15" }, { name: "Defense Brief_v3.docx", tag: "Brief", checkedOut: true, updated: "Today" }, { name: "Witness Statement — Rajan.pdf", tag: "Evidence", checkedOut: false, updated: "Feb 20" }, { name: "Bail Application.docx", tag: "Filing", checkedOut: false, updated: "Jan 22" }], relatedCases: [{ caseId: "VDT-2023-089", name: "State v. Patel (Similar Facts)", relevance: "87%" }, { caseId: "VDT-2023-041", name: "Sharma Family — Property Dispute", relevance: "62%" }] },
    { _id: "2", caseId: "VDT-2024-002", name: "Nexus Inc. Patent Dispute", type: "IP Litigation", status: "motion", lead: "Adv. Meera", priority: "High", nextDate: "Mar 5", billing: { total: "₹8,50,000", billed: "₹5,00,000", outstanding: "₹3,50,000", hours: 120 } },
    { _id: "3", caseId: "VDT-2024-003", name: "Horizon Corp Acquisition", type: "Corporate / M&A", status: "discovery", lead: "Adv. Prit", priority: "Medium", nextDate: "Mar 12", billing: { total: "₹12,00,000", billed: "₹8,00,000", outstanding: "₹4,00,000", hours: 200 } },
    { _id: "4", caseId: "VDT-2024-004", name: "DEF Corp Defense", type: "Commercial Dispute", status: "trial", lead: "Adv. Rohan", priority: "High", nextDate: "Feb 26", billing: { total: "₹6,75,000", billed: "₹4,00,000", outstanding: "₹2,75,000", hours: 90 } },
    { _id: "5", caseId: "VDT-2024-005", name: "Gupta Family Estate", type: "Family Law", status: "intake", lead: "Adv. Priya", priority: "Medium", nextDate: "Mar 20", billing: { total: "₹1,50,000", billed: "₹50,000", outstanding: "₹1,00,000", hours: 15 } },
    { _id: "6", caseId: "VDT-2024-006", name: "CloudNet Data Breach", type: "Privacy / DPDP", status: "discovery", lead: "Adv. Meera", priority: "Critical", nextDate: "Mar 1", billing: { total: "₹3,20,000", billed: "₹1,20,000", outstanding: "₹2,00,000", hours: 40 } },
];

/* ─── Component ─── */

export default function CasesPage() {
    const [activeStage, setActiveStage] = useState<PipelineStatus | "all">("all");
    const [selectedCase, setSelectedCase] = useState<string | null>(null);
    const [cases, setCases] = useState<CaseItem[]>(fallbackCases);
    const [selectedDetail, setSelectedDetail] = useState<CaseItem | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch cases from API
    const fetchCases = useCallback(() => {
        const query = activeStage !== "all" ? `?status=${activeStage}` : "";
        fetch(`/api/cases${query}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setCases(data);
                }
            })
            .catch(() => { /* use fallback */ })
            .finally(() => setLoading(false));
    }, [activeStage]);

    useEffect(() => {
        fetchCases();
    }, [fetchCases]);

    // Fetch single case detail
    useEffect(() => {
        if (!selectedCase) {
            setSelectedDetail(null);
            return;
        }

        // First check if we already have detail in the list
        const fromList = cases.find((c) => c.caseId === selectedCase);
        if (fromList?.team?.length) {
            setSelectedDetail(fromList);
            return;
        }

        fetch(`/api/cases/${selectedCase}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) setSelectedDetail(data);
                else setSelectedDetail(fromList || null);
            })
            .catch(() => setSelectedDetail(fromList || null));
    }, [selectedCase, cases]);

    const filteredCases = activeStage === "all"
        ? cases
        : cases.filter(c => c.status === activeStage);

    // Compute pipeline counts
    const pipelineCounts: Record<string, number> = {};
    pipelineStages.forEach((s) => {
        pipelineCounts[s.id] = cases.filter((c) => c.status === s.id).length;
    });

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col">

            {/* ── Header ── */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink tracking-tight mb-1">Case Management</h1>
                        <p className="text-sm font-sans text-neutral">Track, manage, and collaborate on all active and closed cases.</p>
                    </div>
                    <button onClick={() => toast("NEW CASE WIZARD...")} className="flex items-center px-4 py-2 bg-ink text-newsprint hover:bg-ink/90 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider shrink-0">
                        <Plus className="w-3 h-3 mr-1.5" strokeWidth={1.5} /> New Case
                    </button>
                </div>
            </div>

            {/* ── Pipeline View ── */}
            <div className="flex border border-ink mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveStage("all")}
                    className={`flex-1 min-w-[80px] py-3 text-center font-sans text-[10px] font-bold uppercase tracking-wider transition-colors border-r border-ink whitespace-nowrap ${activeStage === "all" ? 'bg-ink text-newsprint' : 'text-neutral hover:bg-ink/5'}`}
                >
                    All ({cases.length})
                </button>
                {pipelineStages.map((stage, i) => (
                    <button
                        key={stage.id}
                        onClick={() => setActiveStage(stage.id)}
                        className={`flex-1 min-w-[80px] py-3 text-center font-sans text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${i < pipelineStages.length - 1 ? 'border-r border-ink' : ''} ${activeStage === stage.id ? 'bg-ink text-newsprint' : 'text-neutral hover:bg-ink/5'}`}
                    >
                        {stage.label} ({pipelineCounts[stage.id] || 0})
                    </button>
                ))}
            </div>

            {/* ── Case List ── */}
            <div className="border border-ink mb-6">
                <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Cases</span>
                    <div className="flex items-center">
                        <Search className="w-3.5 h-3.5 text-neutral mr-2" strokeWidth={1.5} />
                        <input placeholder="SEARCH CASES..." className="bg-transparent text-[10px] font-mono outline-none text-ink placeholder:text-neutral/50 placeholder:uppercase w-32" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-ink bg-ink/[0.03]">
                                <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Case ID</th>
                                <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Matter</th>
                                <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Type</th>
                                <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Lead</th>
                                <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Priority</th>
                                <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Next Date</th>
                                <th className="text-right px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Billing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCases.map((c) => (
                                <tr
                                    key={c.caseId}
                                    onClick={() => setSelectedCase(c.caseId)}
                                    className={`border-b border-ink/10 cursor-pointer transition-colors ${selectedCase === c.caseId ? 'bg-ink/5' : 'hover:bg-ink/[0.03]'}`}
                                >
                                    <td className="px-4 py-2.5 font-mono text-[10px] font-bold text-ink">{c.caseId}</td>
                                    <td className="px-4 py-2.5 font-sans text-xs font-semibold text-ink">{c.name}</td>
                                    <td className="px-4 py-2.5 text-[9px] font-mono text-neutral uppercase">{c.type}</td>
                                    <td className="px-4 py-2.5 text-[10px] font-sans text-neutral">{c.lead}</td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className={`text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 ${c.priority === 'Critical' ? 'bg-accent text-newsprint' : c.priority === 'High' ? 'bg-ink text-newsprint' : 'border border-ink/30 text-neutral'}`}>
                                            {c.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-[10px] font-mono text-ink">{c.nextDate}</td>
                                    <td className="px-4 py-2.5 text-right font-mono text-[10px] font-bold text-ink">{c.billing?.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Case Detail (when selected) ── */}
            {selectedDetail && (
                <div className="space-y-6">

                    {/* Case Overview Card */}
                    <div className="border border-ink">
                        <div className="section-inverted px-4 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div>
                                <h2 className="font-serif text-xl font-bold text-newsprint">{selectedDetail.name}</h2>
                                <p className="text-[10px] font-mono text-neutral mt-1">
                                    {selectedDetail.caseId} · {selectedDetail.type} · {selectedDetail.court} · Judge: {selectedDetail.judge}
                                </p>
                            </div>
                            <span className="text-[9px] font-sans font-bold bg-accent text-newsprint px-2.5 py-1 uppercase tracking-wider shrink-0">
                                {selectedDetail.status} Phase
                            </span>
                        </div>
                    </div>

                    {/* Team + Timeline + Billing */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 border border-ink">

                        {/* Team */}
                        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center">
                                <Users className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Team</span>
                            </div>
                            <div className="divide-y divide-ink/10">
                                {(selectedDetail.team || []).map((m, i) => (
                                    <div key={i} className="px-4 py-2.5 flex items-center">
                                        <div className="w-7 h-7 bg-ink text-newsprint flex items-center justify-center font-mono text-[10px] font-bold mr-3 shrink-0">
                                            {m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-sans text-[11px] font-bold text-ink">{m.name}</p>
                                            <p className="text-[9px] font-mono text-neutral uppercase">{m.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Key Dates Timeline */}
                        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center">
                                <CalendarDays className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Key Dates</span>
                            </div>
                            <div className="p-4 space-y-2">
                                {(selectedDetail.timeline || []).map((t, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 shrink-0 ${t.done ? 'bg-ink' : 'border border-ink'}`} />
                                        <span className="font-mono text-[10px] text-neutral w-12 shrink-0">{t.date}</span>
                                        <span className={`font-sans text-[11px] ${t.done ? 'text-neutral line-through' : 'text-ink font-semibold'}`}>{t.event}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Billing */}
                        <div className="flex flex-col">
                            <div className="h-9 border-b border-ink px-4 flex items-center">
                                <DollarSign className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Billing Summary</span>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest">Total</span>
                                    <p className="font-mono text-2xl font-bold text-ink mt-1">{selectedDetail.billing?.total}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest">Billed</span>
                                        <p className="font-mono text-sm font-bold text-ink">{selectedDetail.billing?.billed}</p>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest">Outstanding</span>
                                        <p className="font-mono text-sm font-bold text-accent">{selectedDetail.billing?.outstanding}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest">Hours Logged</span>
                                    <p className="font-mono text-sm font-bold text-ink">{selectedDetail.billing?.hours}h</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents + Related Cases */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 border border-ink">

                        {/* Document Management */}
                        <div className="lg:col-span-2 flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink flex items-center">
                                    <FileText className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />
                                    Case Documents
                                </span>
                                <button onClick={() => toast("UPLOAD DOCUMENT...")} className="text-[9px] font-sans font-bold bg-ink text-newsprint px-2 py-0.5 uppercase hover:bg-ink/90 transition-colors flex items-center">
                                    <Upload className="w-3 h-3 mr-1" strokeWidth={1.5} />Upload
                                </button>
                            </div>
                            <div className="divide-y divide-ink/10">
                                {(selectedDetail.documents || []).map((doc, i) => (
                                    <div key={i} className="flex items-center px-4 py-2.5 hover:bg-ink/[0.03] transition-colors cursor-pointer group">
                                        <FileText className="w-3.5 h-3.5 text-neutral mr-3 group-hover:text-ink transition-colors" strokeWidth={1.5} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-mono text-[11px] text-ink truncate">{doc.name}</p>
                                            <p className="text-[9px] font-mono text-neutral mt-0.5">Updated {doc.updated}</p>
                                        </div>
                                        <span className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1.5 py-0.5 text-neutral mr-3">{doc.tag}</span>
                                        {doc.checkedOut ? (
                                            <Lock className="w-3 h-3 text-accent" strokeWidth={1.5} />
                                        ) : (
                                            <Unlock className="w-3 h-3 text-neutral" strokeWidth={1.5} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Related Cases */}
                        <div className="flex flex-col">
                            <div className="h-9 border-b border-ink px-4 flex items-center">
                                <Link2 className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Related Cases</span>
                            </div>
                            <div className="divide-y divide-ink/10">
                                {(selectedDetail.relatedCases || []).map((rc, i) => (
                                    <div key={i} className="px-4 py-3 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                                        <p className="font-mono text-[10px] text-neutral">{rc.caseId}</p>
                                        <p className="font-sans text-[11px] font-semibold text-ink mt-0.5">{rc.name}</p>
                                        <p className="text-[9px] font-mono text-neutral mt-1">AI Relevance: <span className="font-bold text-ink">{rc.relevance}</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
