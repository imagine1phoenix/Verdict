"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Clock, Star, FileText, Scale, Archive, Calendar } from "lucide-react";

type ResultCategory = "cases" | "documents" | "evidence" | "events" | "precedents";

const searchResults = [
    { category: "cases" as ResultCategory, title: "Sharma v. State of Maharashtra", subtitle: "VDT-2024-001 · Criminal Defense · Discovery", icon: Scale },
    { category: "documents" as ResultCategory, title: "Defense Brief_v3.docx", subtitle: "Sharma v. State · Updated Today", icon: FileText },
    { category: "evidence" as ResultCategory, title: "CCTV Footage — Main Entrance", subtitle: "EV-001 · Digital · Relevance: 94%", icon: Archive },
    { category: "cases" as ResultCategory, title: "Nexus Inc. Patent Dispute", subtitle: "VDT-2024-002 · IP Litigation · Motions", icon: Scale },
    { category: "events" as ResultCategory, title: "Mock Trial — Smith v. Jones", subtitle: "Feb 25, 11:00 AM · Adv. Prit", icon: Calendar },
    { category: "documents" as ResultCategory, title: "Patent Filing US-2021-0342", subtitle: "Nexus IP · USPTO · Documentary", icon: FileText },
];

const recentSearches = ["Sharma evidence", "DPDP compliance", "patent filing deadline", "bail application"];
const savedSearches = ["All critical deadlines this week", "Cases by Adv. Meera", "Unreviewed evidence"];

export default function GlobalSearch({ onClose }: { onClose: () => void }) {
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<ResultCategory | "all">("all");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const filtered = query.length > 0
        ? searchResults.filter(r => (activeFilter === "all" || r.category === activeFilter) && r.title.toLowerCase().includes(query.toLowerCase().slice(0, 3)))
        : [];

    const filters: { id: ResultCategory | "all"; label: string }[] = [
        { id: "all", label: "All" },
        { id: "cases", label: "Cases" },
        { id: "documents", label: "Docs" },
        { id: "evidence", label: "Evidence" },
        { id: "events", label: "Events" },
        { id: "precedents", label: "Precedents" },
    ];

    return (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
            <div className="bg-newsprint border border-ink w-full max-w-2xl shadow-xl" onClick={e => e.stopPropagation()}>
                {/* Search Input */}
                <div className="flex items-center px-4 border-b border-ink">
                    <Search className="w-5 h-5 text-neutral mr-3" strokeWidth={1.5} />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search across cases, documents, evidence..."
                        className="flex-1 py-4 bg-transparent font-sans text-sm text-ink outline-none placeholder:text-neutral/50"
                    />
                    <div className="flex items-center gap-2 ml-2">
                        <kbd className="text-[9px] font-mono text-neutral border border-ink/30 px-1.5 py-0.5">ESC</kbd>
                        <button onClick={onClose}><X className="w-4 h-4 text-neutral hover:text-ink transition-colors" strokeWidth={1.5} /></button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex border-b border-ink/20 px-4">
                    {filters.map(f => (
                        <button key={f.id} onClick={() => setActiveFilter(f.id)}
                            className={`py-2 px-3 text-[9px] font-sans font-bold uppercase tracking-wider transition-colors ${activeFilter === f.id ? 'text-ink border-b-2 border-ink' : 'text-neutral hover:text-ink'}`}>
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Results or Suggestions */}
                <div className="max-h-[50vh] overflow-y-auto">
                    {query.length > 0 ? (
                        <div className="divide-y divide-ink/10">
                            {filtered.length > 0 ? filtered.map((r, i) => (
                                <div key={i} className="flex items-center px-4 py-3 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                                    <r.icon className="w-4 h-4 text-neutral mr-3 shrink-0" strokeWidth={1.5} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-sans text-xs font-bold text-ink">{r.title}</p>
                                        <p className="text-[9px] font-mono text-neutral mt-0.5">{r.subtitle}</p>
                                    </div>
                                    <span className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1.5 py-0.5 text-neutral">{r.category}</span>
                                </div>
                            )) : (
                                <div className="px-4 py-8 text-center">
                                    <p className="font-serif text-sm text-neutral">No results found for &ldquo;{query}&rdquo;</p>
                                    <p className="text-[9px] font-mono text-neutral/50 mt-1 uppercase">Try a different search term or filter</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 space-y-4">
                            {/* Recent */}
                            <div>
                                <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest flex items-center mb-2">
                                    <Clock className="w-3 h-3 mr-1.5" strokeWidth={1.5} />Recent Searches
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {recentSearches.map((s, i) => (
                                        <button key={i} onClick={() => setQuery(s)} className="text-[10px] font-mono text-ink border border-ink/20 px-2 py-1 hover:border-ink transition-colors">{s}</button>
                                    ))}
                                </div>
                            </div>
                            {/* Saved */}
                            <div>
                                <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest flex items-center mb-2">
                                    <Star className="w-3 h-3 mr-1.5" strokeWidth={1.5} />Saved Searches
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {savedSearches.map((s, i) => (
                                        <button key={i} onClick={() => setQuery(s)} className="text-[10px] font-mono text-ink border border-ink/20 px-2 py-1 hover:border-ink transition-colors">{s}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
