"use client";

import { useState } from "react";
import {
    BookOpen, Search, FileText, Star, Download, ChevronRight,
    Landmark, GraduationCap, Scale, Globe, FolderOpen, Plus
} from "lucide-react";
import { toast } from "react-hot-toast";

/* ─── Mock Data ─── */

type Tab = "research" | "precedents" | "training" | "guides";

const researchLibrary = [
    { title: "Indian Contract Act, 1872 — Commentary", category: "Statutes", author: "Dr. R.K. Bangia", pages: 842, accessed: "12 times" },
    { title: "Code of Civil Procedure — Annotated", category: "Statutes", author: "C.K. Takwani", pages: 1240, accessed: "8 times" },
    { title: "Constitution of India — Art. 14–32 Analysis", category: "Constitutional", author: "M.P. Jain", pages: 320, accessed: "15 times" },
    { title: "DPDP Act 2023 — Compliance Guide", category: "Privacy", author: "Verdict.AI Team", pages: 45, accessed: "22 times" },
    { title: "Arbitration & Conciliation Act — Case Digest", category: "ADR", author: "O.P. Malhotra", pages: 560, accessed: "6 times" },
    { title: "IP Rights in India — Patent, Copyright, TM", category: "IP", author: "P. Narayanan", pages: 680, accessed: "10 times" },
];

const firmPrecedents = [
    { citation: "AIR 2019 SC 1234", title: "K.S. Puttaswamy v. Union of India", area: "Privacy / Fundamental Rights", outcome: "Landmark", timesUsed: 8, summary: "Right to privacy as fundamental right under Art. 21. Pivotal for data protection cases." },
    { citation: "2020 SCC OnLine SC 742", title: "Vodafone v. Union of India", area: "Tax / International", outcome: "Won", timesUsed: 5, summary: "Retrospective taxation invalid. Key for corporate tax disputes." },
    { citation: "2023 SCC OnLine Del 456", title: "Novartis v. UOI", area: "IP / Patent", outcome: "Lost", timesUsed: 7, summary: "Section 3(d) patentability standards. Critical for pharma IP." },
    { citation: "AIR 2018 SC 4321", title: "Navtej Singh Johar v. UOI", area: "Constitutional", outcome: "Landmark", timesUsed: 3, summary: "Decriminalization precedent. Used for equality arguments." },
    { citation: "(2022) 4 SCC 365", title: "Amazon v. Future Retail", area: "Corporate / Arbitration", outcome: "Won", timesUsed: 6, summary: "Emergency arbitrator orders enforceable. Key for M&A disputes." },
];

const trainingMaterials = [
    { title: "Cross-Examination Techniques", type: "Video Course", duration: "4h 30m", level: "Advanced", completed: 75 },
    { title: "Legal Writing for Indian Courts", type: "Workshop", duration: "2h", level: "Intermediate", completed: 100 },
    { title: "Drafting Effective Affidavits", type: "Guide", duration: "1h 15m", level: "Beginner", completed: 60 },
    { title: "Digital Evidence Handling", type: "Certification", duration: "6h", level: "Advanced", completed: 30 },
    { title: "Client Communication Best Practices", type: "Workshop", duration: "1h 30m", level: "All Levels", completed: 100 },
    { title: "DPDP Act Compliance Training", type: "Certification", duration: "3h", level: "Intermediate", completed: 45 },
];

const jurisdictionGuides = [
    { jurisdiction: "Maharashtra", courts: "HC Mumbai, District Courts", updated: "Feb 2024", rules: 42 },
    { jurisdiction: "Delhi", courts: "HC Delhi, District Courts, NCDRC", updated: "Jan 2024", rules: 38 },
    { jurisdiction: "Karnataka", courts: "HC Karnataka, Commercial Courts", updated: "Feb 2024", rules: 35 },
    { jurisdiction: "National", courts: "Supreme Court, NGT, NCLT", updated: "Feb 2024", rules: 56 },
];

/* ─── Component ─── */

export default function KnowledgePage() {
    const [activeTab, setActiveTab] = useState<Tab>("research");

    const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
        { id: "research", label: "Research Library", icon: BookOpen },
        { id: "precedents", label: "Firm Precedents", icon: Landmark },
        { id: "training", label: "Training", icon: GraduationCap },
        { id: "guides", label: "Jurisdiction Guides", icon: Globe },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col">

            {/* ── Header ── */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center">
                            <GraduationCap className="w-6 h-6 mr-3" strokeWidth={1.5} />
                            Knowledge Base
                        </h1>
                        <p className="text-sm font-sans text-neutral">Legal research library, firm precedents, training materials, and jurisdiction guides.</p>
                    </div>
                    <div className="flex border border-ink shrink-0">
                        {tabs.map((tab, i) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center ${i < tabs.length - 1 ? 'border-r border-ink' : ''} ${activeTab === tab.id ? 'bg-ink text-newsprint' : 'text-ink hover:bg-ink/5'}`}>
                                <tab.icon className="w-3 h-3 mr-1.5" strokeWidth={1.5} />{tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="border border-ink mb-6 flex items-center px-4">
                <Search className="w-4 h-4 text-neutral mr-3" strokeWidth={1.5} />
                <input placeholder="SEARCH THE KNOWLEDGE BASE..." className="flex-1 py-3 bg-transparent font-mono text-xs text-ink outline-none placeholder:text-neutral/50 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-wider" />
            </div>

            {/* ═══ RESEARCH LIBRARY ═══ */}
            {activeTab === "research" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Legal Research Library</span>
                        <button className="text-[9px] font-sans font-bold bg-ink text-newsprint px-2 py-0.5 uppercase hover:bg-ink/90 transition-colors">+ Add Resource</button>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {researchLibrary.map((r, i) => (
                            <div key={i} className="flex items-center px-4 py-3 hover:bg-ink/[0.03] transition-colors cursor-pointer group">
                                <BookOpen className="w-4 h-4 text-neutral mr-3 group-hover:text-ink transition-colors" strokeWidth={1.5} />
                                <div className="flex-1 min-w-0">
                                    <p className="font-sans text-xs font-bold text-ink">{r.title}</p>
                                    <p className="text-[9px] font-mono text-neutral mt-0.5">{r.author} · {r.pages} pages · Accessed {r.accessed}</p>
                                </div>
                                <span className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1.5 py-0.5 text-neutral mr-3">{r.category}</span>
                                <button onClick={() => toast(`OPENING ${r.title.toUpperCase().slice(0, 30)}...`)} className="text-[9px] font-sans font-bold border border-ink px-2 py-0.5 text-ink uppercase opacity-0 group-hover:opacity-100 transition-all hover:bg-ink hover:text-newsprint">
                                    Open
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══ FIRM PRECEDENTS ═══ */}
            {activeTab === "precedents" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center section-inverted">
                        <Landmark className="w-3.5 h-3.5 mr-2 text-newsprint" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">Firm Precedent Database</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {firmPrecedents.map((p, i) => (
                            <div key={i} className="px-4 py-4 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-mono text-[10px] text-neutral">{p.citation}</span>
                                    <span className={`text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 ${p.outcome === 'Landmark' ? 'bg-ink text-newsprint' : p.outcome === 'Won' ? 'border border-ink text-ink' : 'bg-accent text-newsprint'}`}>{p.outcome}</span>
                                </div>
                                <p className="font-sans text-xs font-bold text-ink">{p.title}</p>
                                <p className="text-[9px] font-mono text-neutral mt-0.5">{p.area} · Used {p.timesUsed} times</p>
                                <p className="font-serif text-[11px] text-neutral/80 mt-1.5 leading-relaxed italic">{p.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══ TRAINING ═══ */}
            {activeTab === "training" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <GraduationCap className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Training & Best Practices</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {trainingMaterials.map((t, i) => (
                            <div key={i} className="px-4 py-3 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div>
                                        <span className="font-sans text-xs font-bold text-ink">{t.title}</span>
                                        <span className="text-[9px] font-mono text-neutral ml-2">{t.type} · {t.duration} · {t.level}</span>
                                    </div>
                                    <span className={`font-mono text-[10px] font-bold ${t.completed === 100 ? 'text-ink' : 'text-neutral'}`}>{t.completed}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-ink/10">
                                    <div className={`h-full transition-all ${t.completed === 100 ? 'bg-ink' : 'bg-neutral'}`} style={{ width: `${t.completed}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══ JURISDICTION GUIDES ═══ */}
            {activeTab === "guides" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <Globe className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Jurisdiction-Specific Guides</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {jurisdictionGuides.map((g, i) => (
                            <div key={i} className={`p-4 hover:bg-ink/[0.03] transition-colors cursor-pointer group ${i % 2 === 0 ? 'md:border-r border-ink' : ''} ${i < jurisdictionGuides.length - 2 ? 'border-b border-ink/20' : ''}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-serif text-base font-bold text-ink">{g.jurisdiction}</h3>
                                    <span className="text-[8px] font-mono text-neutral">{g.updated}</span>
                                </div>
                                <p className="text-[10px] font-mono text-neutral">{g.courts}</p>
                                <p className="text-[9px] font-mono text-neutral mt-1">{g.rules} rules documented</p>
                                <button onClick={() => toast(`OPENING ${g.jurisdiction.toUpperCase()} GUIDE...`)} className="mt-2 text-[9px] font-sans font-bold border border-ink px-2 py-0.5 text-ink uppercase opacity-0 group-hover:opacity-100 transition-all hover:bg-ink hover:text-newsprint">
                                    Open Guide
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
