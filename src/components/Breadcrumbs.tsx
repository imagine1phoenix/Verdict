"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
    "/": "Dashboard",
    "/mock-trials": "Mock Trials",
    "/proofreading": "Document Intelligence",
    "/cases": "Case Management",
    "/evidence": "Evidence Vault",
    "/past-trials": "Past Trials Archive",
    "/calendar": "Calendar",
    "/team": "Team Collaboration",
    "/analytics": "Analytics & Reporting",
    "/knowledge": "Knowledge Base",
    "/settings": "Settings",
};

export default function Breadcrumbs() {
    const pathname = usePathname();

    if (pathname === "/" || pathname === "/login") return null;

    const label = routeLabels[pathname] || pathname.slice(1).replace(/-/g, " ");

    return (
        <nav className="flex items-center gap-1.5 mb-4 px-0">
            <Link href="/" className="text-neutral hover:text-ink transition-colors">
                <Home className="w-3 h-3" strokeWidth={1.5} />
            </Link>
            <ChevronRight className="w-2.5 h-2.5 text-neutral/50" strokeWidth={1.5} />
            <span className="font-sans text-[10px] font-bold text-ink uppercase tracking-wider">{label}</span>
        </nav>
    );
}
