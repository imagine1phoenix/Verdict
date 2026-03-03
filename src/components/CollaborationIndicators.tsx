"use client";

import { Users, Eye, Scale, FileText } from "lucide-react";

const onlineUsers = [
    { name: "Adv. Prit", avatar: "PT", status: "online", viewing: "Sharma v. State — Defense Brief" },
    { name: "Adv. Meera", avatar: "MS", status: "online", viewing: "Nexus IP — Patent Claims" },
    { name: "Ravi Kumar", avatar: "RK", status: "online", viewing: "Evidence Vault — Bates Indexing" },
    { name: "Adv. Rohan", avatar: "RI", status: "away", viewing: null },
    { name: "Adv. Priya", avatar: "PD", status: "offline", viewing: null },
];

const activeSessions = [
    { type: "Mock Trial", label: "Smith v. Jones — Phase 2 (Execution)", users: 2 },
];

export default function CollaborationIndicators() {
    const online = onlineUsers.filter(u => u.status === "online").length;

    return (
        <div className="border border-ink mb-6">
            {/* Header */}
            <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink flex items-center">
                    <Users className="w-3 h-3 mr-2" strokeWidth={1.5} />Online Now
                </span>
                <span className="font-mono text-[10px] text-ink font-bold">{online}</span>
            </div>

            {/* Users */}
            <div className="divide-y divide-ink/10">
                {onlineUsers.filter(u => u.status !== "offline").map((user, i) => (
                    <div key={i} className="px-4 py-2 flex items-center gap-2.5 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                        <div className="relative shrink-0">
                            <div className="w-6 h-6 bg-ink text-newsprint flex items-center justify-center font-mono text-[8px] font-bold">
                                {user.avatar}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 border border-newsprint ${user.status === "online" ? "bg-ink" : "bg-neutral/50"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-sans text-[10px] font-bold text-ink">{user.name}</p>
                            {user.viewing && (
                                <p className="text-[8px] font-mono text-neutral flex items-center mt-0.5 truncate">
                                    <Eye className="w-2.5 h-2.5 mr-1 shrink-0" strokeWidth={1.5} />{user.viewing}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Sessions */}
            {activeSessions.length > 0 && (
                <div className="border-t border-ink">
                    <div className="px-4 py-2.5">
                        <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest">Active Sessions</span>
                        {activeSessions.map((session, i) => (
                            <div key={i} className="mt-1.5 flex items-center gap-2 px-2 py-1.5 bg-ink/5 cursor-pointer hover:bg-ink/10 transition-colors">
                                <Scale className="w-3 h-3 text-ink" strokeWidth={1.5} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-sans font-bold text-ink truncate">{session.label}</p>
                                    <p className="text-[8px] font-mono text-neutral">{session.users} participants</p>
                                </div>
                                <div className="w-2 h-2 bg-accent animate-pulse shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
