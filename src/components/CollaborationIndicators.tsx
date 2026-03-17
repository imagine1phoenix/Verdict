"use client";

import { useState, useEffect } from "react";
import { Users, Eye, Loader2 } from '@/components/Icons';

type OnlineUser = {
    id: number;
    name: string;
    avatar: string;
    status: string;
    viewing: string | null;
};

export default function CollaborationIndicators() {
    const [users, setUsers] = useState<OnlineUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("/api/users");
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.filter((u: OnlineUser) => u.status === "online" || u.status === "away"));
                }
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="border border-ink mb-6 px-4 py-3 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-neutral" />
            </div>
        );
    }

    if (users.length === 0) return null;

    return (
        <div className="border border-ink mb-6">
            <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink flex items-center">
                    <Users className="w-3 h-3 mr-2" strokeWidth={1.5} />Online Now
                    <span className="font-mono text-neutral ml-2">({users.length})</span>
                </span>
            </div>
            <div className="divide-y divide-ink/10">
                {users.map(u => (
                    <div key={u.id} className="px-4 py-2 flex items-center gap-2.5 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                        <div className="relative shrink-0">
                            <div className="w-7 h-7 bg-ink text-newsprint flex items-center justify-center font-mono text-[9px] font-bold">
                                {u.avatar || u.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-newsprint ${u.status === "online" ? "bg-green-600" : "bg-yellow-500"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-sans text-[10px] font-bold text-ink truncate">{u.name}</p>
                            {u.viewing && (
                                <p className="text-[8px] font-mono text-neutral truncate flex items-center">
                                    <Eye className="w-2.5 h-2.5 mr-1 shrink-0" strokeWidth={1.5} />{u.viewing}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
