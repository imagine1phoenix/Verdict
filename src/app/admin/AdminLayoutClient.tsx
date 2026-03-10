"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-newsprint" />;
    }

    return (
        <>
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-col flex-1 min-w-0">
                <AdminHeader onMenuToggle={() => setSidebarOpen(prev => !prev)} />
                <main className="flex-1 overflow-y-auto bg-newsprint">
                    <div className="bg-accent/5 border-b border-ink px-4 py-2 border-l border-accent flex items-center">
                        <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink mr-2">
                            SYSTEM CONTROL
                        </span>
                    </div>
                    <div className="max-w-7xl mx-auto p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}
