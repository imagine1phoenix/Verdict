"use client";

import { useState } from "react";
import {
    Archive, Search, Tag, Eye, Shield, Hash, Lock, FileText,
    Upload, Filter, Calendar, Users, Link2, Brain, CheckCircle,
    AlertTriangle, ChevronRight, Download
} from "lucide-react";
import { toast } from "react-hot-toast";

/* ─── Mock Data ─── */

type EvidenceCategory = "all" | "physical" | "digital" | "testimonial" | "documentary";

const categories: { id: EvidenceCategory; label: string; count: number }[] = [
    { id: "all", label: "All", count: 18 },
    { id: "physical", label: "Physical", count: 3 },
    { id: "digital", label: "Digital", count: 7 },
    { id: "testimonial", label: "Testimonial", count: 4 },
    { id: "documentary", label: "Documentary", count: 4 },
];

const evidenceItems = [
    { id: "EV-001", bates: "VDT_001-005", name: "CCTV Footage — Main Entrance", category: "digital" as EvidenceCategory, case: "Sharma v. State", source: "Police Station", date: "Jan 18", relevance: 94, admissible: true, tags: ["Video", "Chain Verified"] },
    { id: "EV-002", bates: "VDT_006-008", name: "Fingerprint Analysis Report", category: "physical" as EvidenceCategory, case: "Sharma v. State", source: "Forensic Lab", date: "Jan 25", relevance: 88, admissible: true, tags: ["Forensic", "Expert Report"] },
    { id: "EV-003", bates: "VDT_009-015", name: "Witness Statement — Rajan Kumar", category: "testimonial" as EvidenceCategory, case: "Sharma v. State", source: "Deposition", date: "Feb 5", relevance: 76, admissible: true, tags: ["Witness", "Key"] },
    { id: "EV-004", bates: "VDT_016-022", name: "Patent Filing US-2021-0342", category: "documentary" as EvidenceCategory, case: "Nexus IP Dispute", source: "USPTO", date: "Nov 10", relevance: 97, admissible: true, tags: ["Patent", "Primary"] },
    { id: "EV-005", bates: "VDT_023-030", name: "Email Chain — CEO to CTO", category: "digital" as EvidenceCategory, case: "Nexus IP Dispute", source: "E-Discovery", date: "Feb 12", relevance: 82, admissible: false, tags: ["Email", "Privilege Review"] },
    { id: "EV-006", bates: "VDT_031-033", name: "Expert Deposition — Dr. Mehta", category: "testimonial" as EvidenceCategory, case: "Sharma v. State", source: "Court Reporter", date: "Feb 18", relevance: 91, admissible: true, tags: ["Expert", "Medical"] },
    { id: "EV-007", bates: "VDT_034-040", name: "Server Access Logs", category: "digital" as EvidenceCategory, case: "CloudNet Breach", source: "IT Forensics", date: "Feb 8", relevance: 95, admissible: true, tags: ["Digital Forensic", "Critical"] },
    { id: "EV-008", bates: "VDT_041-045", name: "Merger Agreement Draft v2", category: "documentary" as EvidenceCategory, case: "Horizon Corp", source: "Client", date: "Jan 30", relevance: 70, admissible: true, tags: ["Contract", "Draft"] },
];

const accessLogs = [
    { user: "Adv. Prit", action: "Viewed", item: "CCTV Footage", time: "10m ago" },
    { user: "Adv. Meera", action: "Downloaded", item: "Patent Filing", time: "1h ago" },
    { user: "Ravi (Paralegal)", action: "Tagged", item: "Email Chain", time: "3h ago" },
    { user: "Adv. Rohan", action: "Viewed", item: "Expert Deposition", time: "5h ago" },
];

const chainOfCustody = [
    { step: "Collected", by: "Officer Desai", date: "Jan 18, 2024", location: "Andheri Police Station" },
    { step: "Received", by: "Forensic Lab", date: "Jan 20, 2024", location: "Mumbai FSL" },
    { step: "Analyzed", by: "Dr. Patil", date: "Jan 24, 2024", location: "Mumbai FSL" },
    { step: "Filed", by: "Adv. Prit", date: "Feb 1, 2024", location: "Verdict.AI Vault" },
];

/* ─── Component ─── */

export default function EvidencePage() {
    const [activeCategory, setActiveCategory] = useState<EvidenceCategory>("all");
    const [selectedEvidence, setSelectedEvidence] = useState<string | null>("EV-001");

    const filtered = activeCategory === "all"
        ? evidenceItems
        : evidenceItems.filter(e => e.category === activeCategory);

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col">

            {/* ── Header ── */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center">
                            <Archive className="w-6 h-6 mr-3" strokeWidth={1.5} />
                            Evidence Vault
                        </h1>
                        <p className="text-sm font-sans text-neutral">Secure, categorized evidence storage with AI tagging, chain of custody, and admissibility checking.</p>
                    </div>
                    <button onClick={() => toast("UPLOAD EVIDENCE...")} className="flex items-center px-4 py-2 bg-ink text-newsprint hover:bg-ink/90 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider shrink-0">
                        <Upload className="w-3 h-3 mr-1.5" strokeWidth={1.5} /> Add Evidence
                    </button>
                </div>
            </div>

            {/* ── Search Bar ── */}
            <div className="border border-ink mb-6 flex items-center px-4">
                <Search className="w-4 h-4 text-neutral mr-3" strokeWidth={1.5} />
                <input
                    placeholder="FULL-TEXT SEARCH ACROSS ALL EVIDENCE..."
                    className="flex-1 py-3 bg-transparent font-mono text-xs text-ink outline-none placeholder:text-neutral/50 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-wider"
                />
                <button className="text-[9px] font-sans font-bold border border-ink px-3 py-1.5 text-ink uppercase hover:bg-ink/5 transition-colors flex items-center">
                    <Filter className="w-3 h-3 mr-1" strokeWidth={1.5} />Filters
                </button>
            </div>

            {/* ── Category Tabs ── */}
            <div className="flex border border-ink mb-6">
                {categories.map((cat, i) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-1 py-2.5 text-center font-sans text-[10px] font-bold uppercase tracking-wider transition-colors ${i < categories.length - 1 ? 'border-r border-ink' : ''} ${activeCategory === cat.id ? 'bg-ink text-newsprint' : 'text-neutral hover:bg-ink/5'}`}
                    >
                        {cat.label} ({cat.count})
                    </button>
                ))}
            </div>

            {/* ── Evidence List ── */}
            <div className="border border-ink mb-6">
                <div className="h-9 border-b border-ink px-4 flex items-center">
                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Evidence Items</span>
                    <span className="ml-auto font-mono text-[9px] text-neutral">{filtered.length} items · Bates: VDT_001 — VDT_045</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-ink bg-ink/[0.03]">
                                <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Bates #</th>
                                <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Evidence</th>
                                <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Case</th>
                                <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Source</th>
                                <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Relevance</th>
                                <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Admissible</th>
                                <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Tags</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((e) => (
                                <tr
                                    key={e.id}
                                    onClick={() => setSelectedEvidence(e.id)}
                                    className={`border-b border-ink/10 cursor-pointer transition-colors ${selectedEvidence === e.id ? 'bg-ink/5' : 'hover:bg-ink/[0.03]'}`}
                                >
                                    <td className="px-4 py-2.5 font-mono text-[10px] font-bold text-ink">{e.bates}</td>
                                    <td className="px-4 py-2.5 font-sans text-[11px] font-semibold text-ink">{e.name}</td>
                                    <td className="px-4 py-2.5 text-[9px] font-mono text-neutral">{e.case}</td>
                                    <td className="px-4 py-2.5 text-[10px] font-mono text-neutral">{e.source}</td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className={`font-mono text-[10px] font-bold ${e.relevance >= 90 ? 'text-ink' : e.relevance >= 75 ? 'text-neutral' : 'text-neutral/50'}`}>
                                            {e.relevance}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        {e.admissible ? (
                                            <CheckCircle className="w-3.5 h-3.5 text-ink mx-auto" strokeWidth={1.5} />
                                        ) : (
                                            <AlertTriangle className="w-3.5 h-3.5 text-accent mx-auto" strokeWidth={1.5} />
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex gap-1 flex-wrap">
                                            {e.tags.map(tag => (
                                                <span key={tag} className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1 py-0.5 text-neutral">{tag}</span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Detail Panels: Chain of Custody + Access Logs + Relationship Map ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 border border-ink">

                {/* Chain of Custody */}
                <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center section-inverted">
                        <Shield className="w-3.5 h-3.5 mr-2 text-newsprint" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">Chain of Custody</span>
                    </div>
                    <div className="p-4 space-y-3">
                        {chainOfCustody.map((c, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                    <div className={`w-3 h-3 ${i === chainOfCustody.length - 1 ? 'bg-ink' : 'border border-ink'}`} />
                                    {i < chainOfCustody.length - 1 && <div className="w-px h-8 bg-ink/20" />}
                                </div>
                                <div>
                                    <p className="font-sans text-[10px] font-bold text-ink uppercase">{c.step}</p>
                                    <p className="text-[9px] font-mono text-neutral">{c.by} · {c.date}</p>
                                    <p className="text-[9px] font-mono text-neutral/60">{c.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Access Logs */}
                <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <Eye className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Access Logs</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {accessLogs.map((log, i) => (
                            <div key={i} className="px-4 py-2.5 hover:bg-ink/[0.03] transition-colors">
                                <p className="text-[11px] font-sans text-ink">
                                    <span className="font-bold">{log.user}</span>{" "}
                                    <span className="text-neutral">{log.action}</span>
                                </p>
                                <p className="text-[10px] font-mono text-neutral mt-0.5">{log.item}</p>
                                <p className="text-[9px] font-mono text-neutral/60 uppercase mt-0.5">{log.time}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Evidence Graph placeholder */}
                <div className="flex flex-col">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <Link2 className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Relationships</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[200px]">
                        <Brain className="w-12 h-12 text-neutral/20 mb-3" strokeWidth={1} />
                        <p className="font-serif text-sm text-neutral text-center">Evidence Relationship Graph</p>
                        <p className="text-[9px] font-mono text-neutral/50 mt-1 uppercase text-center">Interactive visual mapping of<br />evidence connections & relevance</p>
                        <button onClick={() => toast("GENERATING RELATIONSHIP GRAPH...")} className="mt-4 text-[9px] font-sans font-bold bg-ink text-newsprint px-3 py-1.5 uppercase tracking-wider hover:bg-ink/90 transition-colors">
                            Generate Graph
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
