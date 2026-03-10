"use client";

import { Home, FileText, History, Settings, ChevronRight, Archive, BarChart3, Users, X, ShieldAlert } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const menuItems = [
    { icon: BarChart3, label: "Overview", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: History, label: "Audit Logs", href: "/admin/audit-logs" },
    { icon: FileText, label: "Announcements", href: "/admin/announcements" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
    { icon: Archive, label: "Database", href: "/admin/database" },
];

const bottomItems = [
    { icon: Home, label: "Back to App", href: "/" },
];

interface AdminSidebarProps {
    open?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    useEffect(() => {
        onClose?.();
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <div className="h-20 border-b-[4px] border-ink flex items-center justify-between px-6 bg-ink text-newsprint relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
                    <ShieldAlert className="w-24 h-24" />
                </div>
                <div className="text-center flex-1 relative z-10">
                    <span className="font-serif text-2xl font-bold tracking-[0.2em] text-newsprint uppercase block">
                        Verdict
                    </span>
                    <span className="text-[9px] font-mono text-newsprint/70 uppercase tracking-[0.3em]">
                        Admin Override
                    </span>
                </div>
                <button onClick={onClose} className="md:hidden p-1 text-newsprint hover:text-accent transition-colors -mr-2 relative z-10">
                    <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 py-1 flex flex-col overflow-y-auto mt-2">
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
                                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-accent" />
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
                    return (
                        <Link key={item.label} href={item.href}>
                            <div className="flex items-center px-5 py-2.5 transition-colors group border-b border-ink/10 hover:bg-ink/5 text-ink">
                                <item.icon className="w-4 h-4 text-ink" strokeWidth={1.5} />
                                <span className="ml-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-ink">
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-ink bg-ink/5">
                <p className="text-[8px] font-mono text-neutral uppercase tracking-wider text-center leading-relaxed">
                    System Control<br />Authorized Personnel Only
                </p>
            </div>
        </>
    );

    return (
        <>
            <aside className="hidden md:flex w-60 bg-newsprint border-r border-ink flex-col relative shrink-0">
                {sidebarContent}
            </aside>
            <div
                className={clsx(
                    "fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300",
                    open ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />
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
