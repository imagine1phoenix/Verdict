"use client";

import { useState } from "react";
import {
    Search, Filter, BookOpen, Star, TrendingUp, Landmark, History,
    FileText, Brain, Download, ChevronRight, Scale, Users, Calendar,
    Gavel, CheckCircle, X
} from "lucide-react";
import { toast } from "react-hot-toast";

/* ─── Mock Data ─── */

const caseTypes = ["All", "Criminal", "Civil", "Corporate", "IP", "Family", "Privacy"];
const outcomes = ["All", "Won", "Lost", "Settled"];
const years = ["All", "2024", "2023", "2022"];
const lawyers = ["All", "Adv. Prit", "Adv. Meera", "Adv. Rohan", "Adv. Priya"];

const pastTrials = [
    { id: "TX-2023-089", title: "State v. Patel", type: "Criminal", outcome: "Won", lawyer: "Adv. Prit", year: "2023", court: "High Court — Maharashtra", duration: "14 hearings", prediction: "72%", actual: "Won", similarity: null, lessons: "Strong timeline evidence was decisive. Prosecution struggled with chain of custody for physical evidence." },
    { id: "TX-2023-078", title: "Infosys v. TCS — IP Claim", type: "IP", outcome: "Settled", lawyer: "Adv. Meera", year: "2023", court: "Commercial Court — Bangalore", duration: "8 hearings", prediction: "58%", actual: "Settled", similarity: null, lessons: "Early settlement was optimal. Patent validity challenge would have been costly." },
    { id: "TX-2023-061", title: "Mehta Family Estate", type: "Family", outcome: "Won", lawyer: "Adv. Priya", year: "2023", court: "Family Court — Mumbai", duration: "6 hearings", prediction: "81%", actual: "Won", similarity: null, lessons: "DNA evidence and will attestation were key. Emotional arguments less effective with this judge." },
    { id: "TX-2023-044", title: "GreenTech Environmental Fine", type: "Civil", outcome: "Lost", lawyer: "Adv. Rohan", year: "2023", court: "NGT — Delhi", duration: "10 hearings", prediction: "35%", actual: "Lost", similarity: null, lessons: "Regulatory compliance documentation was incomplete. Need better audit trail processes." },
    { id: "TX-2024-012", title: "CloudSoft Service Dispute", type: "Corporate", outcome: "Won", lawyer: "Adv. Prit", year: "2024", court: "Arbitration (ICC)", duration: "4 sessions", prediction: "88%", actual: "Won", similarity: null, lessons: "Detailed SLA records proved crucial. Counter-claim strategy was effective." },
    { id: "TX-2022-156", title: "Kapoor v. Kapoor Divorce", type: "Family", outcome: "Settled", lawyer: "Adv. Priya", year: "2022", court: "Family Court — Delhi", duration: "12 hearings", prediction: "50%", actual: "Settled", similarity: null, lessons: "Mediation session on hearing 8 broke the deadlock. Earlier mediation recommended." },
    { id: "TX-2024-005", title: "DataLink Privacy Breach", type: "Privacy", outcome: "Won", lawyer: "Adv. Meera", year: "2024", court: "High Court — Karnataka", duration: "5 hearings", prediction: "76%", actual: "Won", similarity: null, lessons: "DPDP Act provisions were well-argued. Expert testimony on data flow was persuasive." },
    { id: "TX-2022-098", title: "RealCo Land Acquisition", type: "Civil", outcome: "Lost", lawyer: "Adv. Rohan", year: "2022", court: "District Court — Pune", duration: "18 hearings", prediction: "42%", actual: "Lost", similarity: null, lessons: "Title chain documentation had gaps. Revenue records cross-verification needed earlier." },
];

const precedents = [
    { citation: "AIR 2019 SC 1234", title: "K.S. Puttaswamy v. Union of India", relevance: "Privacy / Fundamental Rights", usedIn: 3 },
    { citation: "2020 SCC OnLine SC 742", title: "Vodafone v. Union of India", relevance: "Tax / International Arbitration", usedIn: 2 },
    { citation: "AIR 2017 SC 4161", title: "Shayara Bano v. Union of India", relevance: "Family Law / Constitutional", usedIn: 1 },
    { citation: "2023 SCC OnLine Del 456", title: "Novartis v. UOI", relevance: "IP / Patent Law", usedIn: 4 },
];

/* ─── Component ─── */

export default function PastTrialsPage() {
    const [filterType, setFilterType] = useState("All");
    const [filterOutcome, setFilterOutcome] = useState("All");
    const [filterYear, setFilterYear] = useState("All");
    const [filterLawyer, setFilterLawyer] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedTrial, setExpandedTrial] = useState<string | null>(null);

    const filtered = pastTrials.filter(t =>
        (filterType === "All" || t.type === filterType) &&
        (filterOutcome === "All" || t.outcome === filterOutcome) &&
        (filterYear === "All" || t.year === filterYear) &&
        (filterLawyer === "All" || t.lawyer === filterLawyer) &&
        (searchQuery === "" || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col">

            {/* ── Header ── */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center">
                            <History className="w-6 h-6 mr-3" strokeWidth={1.5} />
                            Past Trials Archive
                        </h1>
                        <p className="text-sm font-sans text-neutral">Searchable archive of all firm trials with AI-powered similar case finder and outcome analysis.</p>
                    </div>
                    <button onClick={() => toast("EXPORTING ARCHIVE REPORT...")} className="flex items-center px-4 py-2 border border-ink text-ink hover:bg-ink/5 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider shrink-0">
                        <Download className="w-3 h-3 mr-1.5" strokeWidth={1.5} /> Export Report
                    </button>
                </div>
            </div>

            {/* ── Search + Filters ── */}
            <div className="border border-ink mb-6">
                {/* Search */}
                <div className="flex items-center px-4 border-b border-ink">
                    <Search className="w-4 h-4 text-neutral mr-3" strokeWidth={1.5} />
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="SEARCH BY CASE NAME, ID, KEYWORD..."
                        className="flex-1 py-3 bg-transparent font-mono text-xs text-ink outline-none placeholder:text-neutral/50 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-wider"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-neutral hover:text-ink transition-colors">
                            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                    )}
                </div>
                {/* Filter Row */}
                <div className="grid grid-cols-2 md:grid-cols-4">
                    {[
                        { label: "Case Type", values: caseTypes, current: filterType, set: setFilterType },
                        { label: "Outcome", values: outcomes, current: filterOutcome, set: setFilterOutcome },
                        { label: "Year", values: years, current: filterYear, set: setFilterYear },
                        { label: "Lawyer", values: lawyers, current: filterLawyer, set: setFilterLawyer },
                    ].map((filter, i) => (
                        <div key={i} className={`p-3 ${i < 3 ? 'border-r border-ink' : ''}`}>
                            <label className="block text-[8px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-widest">{filter.label}</label>
                            <select
                                value={filter.current}
                                onChange={e => filter.set(e.target.value)}
                                className="w-full bg-transparent font-mono text-[11px] text-ink outline-none cursor-pointer border-b border-ink/30 py-1"
                            >
                                {filter.values.map(v => <option key={v}>{v}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-4 border border-ink mb-6">
                <div className="p-4 text-center border-r border-ink">
                    <span className="font-mono text-2xl font-bold text-ink block">{filtered.length}</span>
                    <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-wider">Total</span>
                </div>
                <div className="p-4 text-center border-r border-ink">
                    <span className="font-mono text-2xl font-bold text-ink block">{filtered.filter(t => t.outcome === "Won").length}</span>
                    <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-wider">Won</span>
                </div>
                <div className="p-4 text-center border-r border-ink">
                    <span className="font-mono text-2xl font-bold text-accent block">{filtered.filter(t => t.outcome === "Lost").length}</span>
                    <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-wider">Lost</span>
                </div>
                <div className="p-4 text-center">
                    <span className="font-mono text-2xl font-bold text-neutral block">{filtered.filter(t => t.outcome === "Settled").length}</span>
                    <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-wider">Settled</span>
                </div>
            </div>

            {/* ── Trial List ── */}
            <div className="border border-ink mb-6">
                <div className="h-9 border-b border-ink px-4 flex items-center">
                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Trial Records</span>
                </div>
                <div className="divide-y divide-ink/10">
                    {filtered.map((trial) => (
                        <div key={trial.id}>
                            <div
                                onClick={() => setExpandedTrial(expandedTrial === trial.id ? null : trial.id)}
                                className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${expandedTrial === trial.id ? 'bg-ink/5' : 'hover:bg-ink/[0.03]'}`}
                            >
                                <ChevronRight className={`w-3 h-3 text-neutral mr-3 shrink-0 transition-transform ${expandedTrial === trial.id ? 'rotate-90' : ''}`} strokeWidth={1.5} />
                                <span className="font-mono text-[10px] font-bold text-neutral w-24 shrink-0">{trial.id}</span>
                                <span className="font-sans text-xs font-semibold text-ink flex-1">{trial.title}</span>
                                <span className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1.5 py-0.5 text-neutral mr-3">{trial.type}</span>
                                <span className={`text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 mr-3 ${trial.outcome === 'Won' ? 'bg-ink text-newsprint' : trial.outcome === 'Lost' ? 'bg-accent text-newsprint' : 'border border-ink/30 text-neutral'}`}>
                                    {trial.outcome}
                                </span>
                                <span className="text-[9px] font-mono text-neutral">{trial.year}</span>
                            </div>

                            {/* Expanded Detail */}
                            {expandedTrial === trial.id && (
                                <div className="px-4 pb-4 pt-1 bg-ink/[0.02] border-t border-ink/10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                                        <div>
                                            <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest">Details</span>
                                            <p className="font-mono text-[10px] text-ink mt-1">{trial.court}</p>
                                            <p className="font-mono text-[10px] text-ink">{trial.duration}</p>
                                            <p className="font-mono text-[10px] text-ink">Lead: {trial.lawyer}</p>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest">AI Prediction vs Actual</span>
                                            <p className="font-mono text-[10px] text-ink mt-1">Predicted Win: <span className="font-bold">{trial.prediction}</span></p>
                                            <p className="font-mono text-[10px] text-ink">Actual: <span className="font-bold">{trial.actual}</span></p>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest">Lessons Learned</span>
                                            <p className="font-serif text-[11px] text-ink mt-1 leading-relaxed">{trial.lessons}</p>
                                        </div>
                                    </div>
                                    <div className="ml-6 mt-3 flex gap-2">
                                        <button onClick={() => toast("LOADING TRANSCRIPT...")} className="text-[9px] font-sans font-bold border border-ink px-2 py-1 text-ink uppercase hover:bg-ink/5 transition-colors flex items-center">
                                            <FileText className="w-3 h-3 mr-1" strokeWidth={1.5} />Transcript
                                        </button>
                                        <button onClick={() => toast("FINDING SIMILAR CASES...")} className="text-[9px] font-sans font-bold bg-ink text-newsprint px-2 py-1 uppercase hover:bg-ink/90 transition-colors flex items-center">
                                            <Brain className="w-3 h-3 mr-1" strokeWidth={1.5} />Find Similar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Precedent Library ── */}
            <div className="border border-ink">
                <div className="h-9 border-b border-ink px-4 flex items-center section-inverted">
                    <BookOpen className="w-3.5 h-3.5 mr-2 text-newsprint" strokeWidth={1.5} />
                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">Precedent Library</span>
                </div>
                <div className="divide-y divide-ink/10">
                    {precedents.map((p, i) => (
                        <div key={i} className="flex items-center px-4 py-3 hover:bg-ink/[0.03] transition-colors cursor-pointer group">
                            <div className="flex-1 min-w-0">
                                <p className="font-mono text-[10px] text-neutral">{p.citation}</p>
                                <p className="font-sans text-xs font-semibold text-ink mt-0.5">{p.title}</p>
                                <p className="text-[9px] font-mono text-neutral mt-0.5">{p.relevance} · Used in {p.usedIn} cases</p>
                            </div>
                            <button onClick={() => toast(`VIEWING ${p.citation}...`)} className="text-[9px] font-sans font-bold border border-ink px-2 py-0.5 text-ink uppercase opacity-0 group-hover:opacity-100 transition-all hover:bg-ink hover:text-newsprint">
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
