"use client";

import { Scale, Home, Calendar, FileText, History, Settings, ChevronRight, FolderOpen, Archive, BarChart3, Users, GraduationCap, Gavel, X } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const menuItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Scale, label: "Mock Trials", href: "/mock-trials" },
    { icon: FileText, label: "Proofreading", href: "/proofreading" },
    { icon: Gavel, label: "Documents", href: "/documents" },
    { icon: FolderOpen, label: "Cases", href: "/cases" },
    { icon: Archive, label: "Evidence", href: "/evidence" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Users, label: "Team", href: "/team" },
];

const bottomItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: GraduationCap, label: "Knowledge", href: "/knowledge" },
];

interface SidebarProps {
    open?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const pathname = usePathname();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        onClose?.();
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const sidebarContent = (
        <>
            {/* Masthead / Brand */}
            <div className="h-20 border-b-[4px] border-ink flex items-center justify-between px-6">
                <div className="text-center flex-1">
                    <span className="font-serif text-2xl font-bold tracking-[0.2em] text-ink uppercase block">
                        Verdict
                    </span>
                    <span className="text-[9px] font-mono text-neutral uppercase tracking-[0.3em]">
                        Legal Intelligence
                    </span>
                </div>
                {/* Mobile close button */}
                <button onClick={onClose} className="md:hidden p-1 text-ink hover:text-accent transition-colors -mr-2">
                    <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>

            {/* Edition info */}
            <div className="border-b border-ink px-4 py-2 flex justify-between items-center">
                <span className="text-[10px] font-mono text-neutral uppercase tracking-wider">Vol. I</span>
                <span className="text-[10px] font-mono text-neutral uppercase tracking-wider">Est. 2024</span>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 py-1 flex flex-col overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.label} href={item.href}>
                            <div
                                className={clsx(
                                    "flex items-center px-5 py-2.5 border-b border-ink/10 relative transition-colors group",
                                    isActive
                                        ? "bg-ink text-newsprint"
                                        : "hover:bg-ink/5 text-ink"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" />
                                )}
                                <item.icon className={clsx("w-4 h-4 shrink-0", isActive ? "text-newsprint" : "text-ink")} strokeWidth={1.5} />
                                <span className={clsx("ml-3 font-sans text-[11px] font-semibold tracking-wider uppercase", isActive ? "text-newsprint" : "text-ink")}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <div className="ml-auto">
                                        <ChevronRight className="w-3 h-3 text-newsprint" strokeWidth={1.5} />
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom nav items */}
            <div className="border-t border-ink">
                {bottomItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.label} href={item.href}>
                            <div className={clsx(
                                "flex items-center px-5 py-2.5 transition-colors group border-b border-ink/10",
                                isActive ? "bg-ink text-newsprint" : "hover:bg-ink/5 text-ink"
                            )}>
                                <item.icon className={clsx("w-4 h-4", isActive ? "text-newsprint" : "text-ink")} strokeWidth={1.5} />
                                <span className={clsx("ml-3 font-sans text-[11px] font-semibold uppercase tracking-wider", isActive ? "text-newsprint" : "text-ink")}>
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-ink">
                <p className="text-[8px] font-mono text-neutral uppercase tracking-wider text-center leading-relaxed">
                    © 2024 Verdict.AI<br />All rights reserved
                </p>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop sidebar — always visible */}
            <aside className="hidden md:flex w-60 bg-newsprint border-r border-ink flex-col relative shrink-0">
                {sidebarContent}
            </aside>

            {/* Mobile sidebar — slide-in drawer */}
            {/* Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300",
                    open ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />
            {/* Drawer */}
            <aside
                className={clsx(
                    "fixed left-0 top-0 bottom-0 w-72 bg-newsprint border-r border-ink flex flex-col z-50 md:hidden transition-transform duration-300 ease-in-out",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {sidebarContent}
            </aside>
        </>
    );
}
