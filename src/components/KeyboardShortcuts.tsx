"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Search, FileText, Scale, Upload, Command, Keyboard } from "lucide-react";
import { toast } from "react-hot-toast";

type Shortcut = { keys: string; label: string; action: () => void };

export default function KeyboardShortcuts() {
    const [showGuide, setShowGuide] = useState(false);
    const router = useRouter();

    const shortcuts: Shortcut[] = [
        { keys: "⌘ K", label: "Universal Search", action: () => { } }, // handled by Header
        { keys: "⌘ N", label: "New Case", action: () => toast("NEW CASE WIZARD...") },
        { keys: "⌘ T", label: "Start Mock Trial", action: () => router.push("/mock-trials") },
        { keys: "⌘ E", label: "Upload Evidence", action: () => toast("UPLOAD EVIDENCE PANEL...") },
        { keys: "⌘ /", label: "Keyboard Shortcuts", action: () => setShowGuide(true) },
    ];

    const allShortcuts = [
        {
            category: "Navigation", items: [
                { keys: "⌘ K", label: "Universal search" },
                { keys: "⌘ /", label: "Show this guide" },
                { keys: "Esc", label: "Close modal / panel" },
            ]
        },
        {
            category: "Actions", items: [
                { keys: "⌘ N", label: "New case" },
                { keys: "⌘ T", label: "Start mock trial" },
                { keys: "⌘ E", label: "Upload evidence" },
                { keys: "⌘ U", label: "Upload document" },
                { keys: "⌘ S", label: "Save current" },
            ]
        },
        {
            category: "Views", items: [
                { keys: "⌘ 1", label: "Dashboard" },
                { keys: "⌘ 2", label: "Cases" },
                { keys: "⌘ 3", label: "Calendar" },
                { keys: "⌘ 4", label: "Team chat" },
            ]
        },
    ];

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!e.metaKey && !e.ctrlKey) return;
            // ⌘K is handled by Header/GlobalSearch
            if (e.key === "n") { e.preventDefault(); toast("NEW CASE WIZARD..."); }
            if (e.key === "t") { e.preventDefault(); router.push("/mock-trials"); }
            if (e.key === "e") { e.preventDefault(); toast("UPLOAD EVIDENCE PANEL..."); }
            if (e.key === "/") { e.preventDefault(); setShowGuide(prev => !prev); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [router]);

    if (!showGuide) return null;

    return (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4" onClick={() => setShowGuide(false)}>
            <div className="bg-newsprint border border-ink w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="section-inverted px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Keyboard className="w-4 h-4 text-newsprint" strokeWidth={1.5} />
                        <span className="font-sans text-sm font-bold text-newsprint uppercase tracking-wider">Keyboard Shortcuts</span>
                    </div>
                    <button onClick={() => setShowGuide(false)}><X className="w-4 h-4 text-newsprint" strokeWidth={1.5} /></button>
                </div>
                <div className="p-4 space-y-5">
                    {allShortcuts.map((group, i) => (
                        <div key={i}>
                            <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest">{group.category}</span>
                            <div className="mt-2 space-y-1.5">
                                {group.items.map((s, j) => (
                                    <div key={j} className="flex items-center justify-between py-1">
                                        <span className="font-sans text-[11px] text-ink">{s.label}</span>
                                        <kbd className="font-mono text-[10px] text-neutral border border-ink/30 px-2 py-0.5 bg-ink/[0.03]">{s.keys}</kbd>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
