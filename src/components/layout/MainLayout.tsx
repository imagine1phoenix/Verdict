"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AIChatbot from "@/components/AIChatbot";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useEffect, useState } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-newsprint" />;
    }

    if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/admin')) {
        return <>{children}</>;
    }

    return (
        <>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-col flex-1 min-w-0">
                <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />
                <main className="flex-1 overflow-y-auto bg-newsprint">
                    <div className="max-w-7xl mx-auto p-4 md:p-8">
                        <Breadcrumbs />
                        {children}
                    </div>
                    {/* Footer */}
                    <footer className="border-t border-ink px-4 md:px-8 py-4 mt-auto">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
                            <span className="font-mono text-[9px] text-neutral uppercase tracking-wider">
                                © 2024 Verdict.AI — All rights reserved
                            </span>
                            <div className="flex gap-4 text-[9px] font-sans font-bold text-neutral uppercase tracking-wider">
                                <a href="#" className="hover:text-ink transition-colors underline underline-offset-2">Privacy Policy</a>
                                <a href="#" className="hover:text-ink transition-colors underline underline-offset-2">Terms</a>
                                <a href="#" className="hover:text-ink transition-colors underline underline-offset-2">Help</a>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
            {/* Global Overlays */}
            <AIChatbot />
            <KeyboardShortcuts />
        </>
    );
}
