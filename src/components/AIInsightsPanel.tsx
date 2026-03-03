"use client";

import { useState } from "react";
import {
    Brain, ChevronRight, ChevronDown, AlertTriangle, TrendingUp,
    Scale, FileText, Clock, Shield, X, ChevronLeft
} from "lucide-react";

type Insight = {
    type: "similarity" | "deadline" | "improvement" | "suggestion" | "risk";
    message: string;
    detail: string;
    case?: string;
    priority: "high" | "medium" | "low";
};

const insights: Insight[] = [
    { type: "similarity", message: "Case VDT-2024-001 has 73% similarity to past winning case State v. Patel", detail: "Similar evidence patterns and defendant profile. Review Patel strategy for cross-examination approach.", case: "Sharma v. State", priority: "high" },
    { type: "deadline", message: "File evidence submission in 3 days", detail: "Sharma v. State — Evidence submission deadline Feb 28. 2 exhibits still pending upload.", case: "VDT-2024-001", priority: "high" },
    { type: "improvement", message: "Mock trial performance improved 15% this month", detail: "Win prediction accuracy rose from 72% to 88%. Strongest improvement in cross-examination scores.", priority: "medium" },
    { type: "suggestion", message: "New precedent available for CloudNet breach case", detail: "Recent HC Karnataka ruling on DPDP Act Section 8 — data fiduciary obligations. Directly applicable.", case: "VDT-2024-006", priority: "medium" },
    { type: "risk", message: "Evidence gap identified in DEF Corp Defense", detail: "Missing witness corroboration for timeline claims. Consider deposing additional witnesses.", case: "VDT-2024-004", priority: "high" },
    { type: "suggestion", message: "Suggested: Update indemnity clause in Horizon Corp MSA", detail: "Current clause lacks cap on consequential damages. Refer to clause library template.", case: "VDT-2024-003", priority: "low" },
];

const typeConfig = {
    similarity: { icon: Scale, label: "AI Match", color: "bg-ink" },
    deadline: { icon: Clock, label: "Deadline", color: "bg-accent" },
    improvement: { icon: TrendingUp, label: "Trend", color: "bg-ink" },
    suggestion: { icon: FileText, label: "Suggest", color: "bg-neutral" },
    risk: { icon: Shield, label: "Risk", color: "bg-accent" },
};

export default function AIInsightsPanel() {
    const [collapsed, setCollapsed] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [dismissed, setDismissed] = useState<number[]>([]);

    const visible = insights.filter((_, i) => !dismissed.includes(i));
    const highPriority = visible.filter(i => i.priority === "high").length;

    if (collapsed) {
        return (
            <button
                onClick={() => setCollapsed(false)}
                className="border border-ink bg-ink text-newsprint px-3 py-2 flex items-center gap-2 hover:bg-ink/90 transition-colors w-full mb-6"
            >
                <Brain className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider">AI Insights</span>
                <span className="font-mono text-[10px] ml-auto">{visible.length}</span>
                <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
            </button>
        );
    }

    return (
        <div className="border border-ink mb-6">
            <div className="h-9 border-b border-ink px-4 flex items-center justify-between section-inverted">
                <div className="flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5 text-newsprint" strokeWidth={1.5} />
                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">AI Insights</span>
                    {highPriority > 0 && (
                        <span className="font-mono text-[9px] text-accent font-bold">{highPriority} urgent</span>
                    )}
                </div>
                <button onClick={() => setCollapsed(true)} className="text-newsprint/70 hover:text-newsprint transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
            </div>
            <div className="divide-y divide-ink/10 max-h-[400px] overflow-y-auto">
                {visible.map((insight, i) => {
                    const realIndex = insights.indexOf(insight);
                    const cfg = typeConfig[insight.type];
                    const Icon = cfg.icon;
                    const isExpanded = expandedId === realIndex;

                    return (
                        <div key={realIndex} className={`px-4 py-2.5 transition-colors ${insight.priority === 'high' ? 'bg-accent/[0.03]' : ''} hover:bg-ink/[0.03]`}>
                            <div className="flex items-start gap-2.5 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : realIndex)}>
                                <div className={`w-5 h-5 ${cfg.color} text-newsprint flex items-center justify-center shrink-0 mt-0.5`}>
                                    <Icon className="w-3 h-3" strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-sans text-[11px] font-semibold text-ink leading-snug">{insight.message}</p>
                                    {insight.case && (
                                        <p className="text-[9px] font-mono text-neutral mt-0.5">{insight.case}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button onClick={(e) => { e.stopPropagation(); setDismissed(prev => [...prev, realIndex]); }} className="text-neutral/50 hover:text-ink transition-colors">
                                        <X className="w-3 h-3" strokeWidth={1.5} />
                                    </button>
                                    {isExpanded ? <ChevronDown className="w-3 h-3 text-neutral" strokeWidth={1.5} /> : <ChevronRight className="w-3 h-3 text-neutral" strokeWidth={1.5} />}
                                </div>
                            </div>
                            {isExpanded && (
                                <p className="font-serif text-[10px] text-neutral/80 leading-relaxed mt-2 ml-[30px] italic">{insight.detail}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
