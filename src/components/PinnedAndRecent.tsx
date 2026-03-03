"use client";

import { useState } from "react";
import {
    Pin, Star, Clock, Bookmark, FileText, Scale, Archive,
    Search, X, ChevronRight, ChevronDown
} from "lucide-react";

type PinnedItem = { type: "case" | "document" | "evidence" | "search"; title: string; detail: string };

const pinnedItems: PinnedItem[] = [
    { type: "case", title: "Sharma v. State", detail: "VDT-2024-001 · Criminal" },
    { type: "document", title: "Defense Brief_v3.docx", detail: "Updated Today" },
    { type: "evidence", title: "CCTV Footage — Main Entrance", detail: "EV-001 · 94% relevance" },
    { type: "search", title: "All critical deadlines this week", detail: "Saved search" },
];

const recentItems = [
    { title: "Nexus IP — Filing Deadline", detail: "Viewed 10 min ago", type: "case" as const },
    { title: "Patent Filing US-2021-0342", detail: "Viewed 25 min ago", type: "document" as const },
    { title: "Mock Trial — Smith v. Jones", detail: "Viewed 1 hour ago", type: "case" as const },
    { title: "Team Standup Notes", detail: "Viewed 2 hours ago", type: "document" as const },
    { title: "GreenTech Compliance Report", detail: "Viewed yesterday", type: "document" as const },
];

const iconMap = {
    case: Scale,
    document: FileText,
    evidence: Archive,
    search: Search,
};

export default function PinnedAndRecent() {
    const [showPinned, setShowPinned] = useState(true);
    const [showRecent, setShowRecent] = useState(true);

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
        </div>
    );
}
