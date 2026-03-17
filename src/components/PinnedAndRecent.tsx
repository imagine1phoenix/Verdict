"use client";

import { useState, useEffect } from "react";
import {
    Pin, Star, Clock, Bookmark, FileText, Scale, Archive,
    Search, X, ChevronRight, ChevronDown, Loader2
} from '@/components/Icons';

type PinnedItem = { type: "case" | "document" | "evidence" | "search"; title: string; detail: string };

const iconMap = {
    case: Scale,
    document: FileText,
    evidence: Archive,
    search: Search,
};

export default function PinnedAndRecent() {
    const [showPinned, setShowPinned] = useState(true);
    const [showRecent, setShowRecent] = useState(true);
    const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);
    const [recentItems, setRecentItems] = useState<PinnedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [casesRes, eventsRes] = await Promise.all([
                    fetch("/api/cases"),
                    fetch("/api/events"),
                ]);

                const pinned: PinnedItem[] = [];
                const recent: PinnedItem[] = [];

                if (casesRes.ok) {
                    const cases = await casesRes.json();
                    // First 3 cases = pinned, rest = recent
                    cases.slice(0, 3).forEach((c: { name: string; caseId: string; type: string }) => {
                        pinned.push({ type: "case", title: c.name, detail: `${c.caseId} · ${c.type}` });
                    });
                    cases.slice(3, 6).forEach((c: { name: string; caseId: string; type: string }) => {
                        recent.push({ type: "case", title: c.name, detail: `${c.caseId} · ${c.type}` });
                    });
                }

                if (eventsRes.ok) {
                    const events = await eventsRes.json();
                    events.slice(0, 2).forEach((e: { title: string; date: string; type: string }) => {
                        pinned.push({ type: "document", title: e.title, detail: `${e.date} · ${e.type}` });
                    });
                }

                setPinnedItems(pinned.length > 0 ? pinned : [
                    { type: "search", title: "All critical deadlines this week", detail: "Saved search" },
                ]);
                setRecentItems(recent.length > 0 ? recent : []);
            } catch (err) {
                console.error("Failed to fetch pinned/recent:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="border border-ink mb-6 px-4 py-4 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-neutral" />
            </div>
        );
    }

    return (
        <div className="border border-ink mb-6">
            {/* Pinned */}
            <div>
                <button
                    onClick={() => setShowPinned(!showPinned)}
                    className="w-full h-9 border-b border-ink px-4 flex items-center justify-between hover:bg-ink/[0.03] transition-colors"
                >
                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink flex items-center">
                        <Pin className="w-3 h-3 mr-2" strokeWidth={1.5} />Pinned Items
                        <span className="font-mono text-neutral ml-2">({pinnedItems.length})</span>
                    </span>
                    {showPinned ? <ChevronDown className="w-3 h-3 text-neutral" strokeWidth={1.5} /> : <ChevronRight className="w-3 h-3 text-neutral" strokeWidth={1.5} />}
                </button>
                {showPinned && (
                    <div className="divide-y divide-ink/10 border-b border-ink/20">
                        {pinnedItems.map((item, i) => {
                            const Icon = iconMap[item.type];
                            return (
                                <div key={i} className="flex items-center px-4 py-2 hover:bg-ink/[0.03] transition-colors cursor-pointer group">
                                    <Icon className="w-3 h-3 text-neutral mr-2.5 shrink-0 group-hover:text-ink transition-colors" strokeWidth={1.5} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-sans text-[10px] font-semibold text-ink truncate">{item.title}</p>
                                        <p className="text-[8px] font-mono text-neutral truncate">{item.detail}</p>
                                    </div>
                                    <Star className="w-3 h-3 text-ink/30 fill-ink/30 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Recent */}
            {recentItems.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowRecent(!showRecent)}
                        className="w-full h-9 border-b border-ink px-4 flex items-center justify-between hover:bg-ink/[0.03] transition-colors"
                    >
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink flex items-center">
                            <Clock className="w-3 h-3 mr-2" strokeWidth={1.5} />Recent
                            <span className="font-mono text-neutral ml-2">({recentItems.length})</span>
                        </span>
                        {showRecent ? <ChevronDown className="w-3 h-3 text-neutral" strokeWidth={1.5} /> : <ChevronRight className="w-3 h-3 text-neutral" strokeWidth={1.5} />}
                    </button>
                    {showRecent && (
                        <div className="divide-y divide-ink/10">
                            {recentItems.map((item, i) => {
                                const Icon = iconMap[item.type];
                                return (
                                    <div key={i} className="flex items-center px-4 py-2 hover:bg-ink/[0.03] transition-colors cursor-pointer group">
                                        <Icon className="w-3 h-3 text-neutral mr-2.5 shrink-0 group-hover:text-ink transition-colors" strokeWidth={1.5} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-sans text-[10px] font-semibold text-ink truncate">{item.title}</p>
                                            <p className="text-[8px] font-mono text-neutral truncate">{item.detail}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
