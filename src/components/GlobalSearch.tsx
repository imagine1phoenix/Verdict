"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Clock, Star, FileText, Scale, Archive, Calendar, Users, Loader2 } from '@/components/Icons';

type ResultCategory = "cases" | "events" | "users";

const categoryIcons: Record<ResultCategory, typeof Scale> = {
    cases: Scale,
    events: Calendar,
    users: Users,
};

const recentSearches = ["Sharma evidence", "DPDP compliance", "patent filing deadline", "bail application"];
const savedSearches = ["All critical deadlines this week", "Cases by Adv. Meera", "Unreviewed evidence"];

export default function GlobalSearch({ onClose }: { onClose: () => void }) {
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<ResultCategory | "all">("all");
    const [results, setResults] = useState<{ category: ResultCategory; title: string; subtitle: string }[]>([]);
    const [searching, setSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    useEffect(() => {
        if (query.length < 2) { setResults([]); return; }

        // Debounce API calls
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query]);

    const filtered = activeFilter === "all" ? results : results.filter(r => r.category === activeFilter);

    const filters: { id: ResultCategory | "all"; label: string }[] = [
        { id: "all", label: "All" },
        { id: "cases", label: "Cases" },
        { id: "events", label: "Events" },
        { id: "users", label: "Users" },
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
                        placeholder="Search across cases, events, users..."
                        className="flex-1 py-4 bg-transparent font-sans text-sm text-ink outline-none placeholder:text-neutral/50"
                    />
                    <div className="flex items-center gap-2 ml-2">
                        {searching && <Loader2 className="w-4 h-4 animate-spin text-neutral" strokeWidth={1.5} />}
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
                            {filtered.length > 0 ? filtered.map((r, i) => {
                                const Icon = categoryIcons[r.category] || FileText;
                                return (
                                    <div key={i} className="flex items-center px-4 py-3 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                                        <Icon className="w-4 h-4 text-neutral mr-3 shrink-0" strokeWidth={1.5} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-sans text-xs font-bold text-ink">{r.title}</p>
                                            <p className="text-[9px] font-mono text-neutral mt-0.5">{r.subtitle}</p>
                                        </div>
                                        <span className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1.5 py-0.5 text-neutral">{r.category}</span>
                                    </div>
                                );
                            }) : (
                                <div className="px-4 py-8 text-center">
                                    {searching ? (
                                        <p className="font-serif text-sm text-neutral">Searching...</p>
                                    ) : (
                                        <>
                                            <p className="font-serif text-sm text-neutral">No results found for &ldquo;{query}&rdquo;</p>
                                            <p className="text-[9px] font-mono text-neutral/50 mt-1 uppercase">Try a different search term</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 space-y-4">
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
