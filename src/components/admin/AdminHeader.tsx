"use client";

import { useState, useEffect } from "react";
import { LogOut, Sun, Moon, Menu, ShieldAlert } from '@/components/Icons';
import { toast } from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";

interface AdminHeaderProps {
    onMenuToggle?: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
    const { data: session } = useSession();
    const [dark, setDark] = useState(false);

    const userName = session?.user?.name || "Admin";
    const userInitials = userName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    useEffect(() => {
        const saved = localStorage.getItem("verdict-dark");
        if (saved === "true") {
            setDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleDark = () => {
        setDark(prev => {
            const next = !prev;
            document.documentElement.classList.toggle("dark", next);
            localStorage.setItem("verdict-dark", String(next));
            return next;
        });
    };

    const handleLogout = async () => {
        toast.error("SESSION TERMINATED");
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <header className="h-14 md:h-20 border-b border-ink flex items-stretch bg-newsprint sticky top-0 z-20">
            <div
                className="flex md:hidden items-center justify-center px-4 border-r border-ink cursor-pointer hover:bg-ink/5 transition-colors"
                onClick={onMenuToggle}
            >
                <Menu className="w-5 h-5 text-ink" strokeWidth={1.5} />
            </div>

            <div className="flex-[2] border-r border-ink flex items-center px-3 md:px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
                <ShieldAlert className="w-4 h-4 text-accent mr-3 animate-pulse" strokeWidth={1.5} />
                <span className="text-xs font-sans text-accent font-bold uppercase tracking-wider hidden sm:inline">
                    ADMIN OVERRIDE ACTIVE — PROCEED WITH CAUTION
                </span>
                <span className="text-xs font-sans text-accent font-bold uppercase tracking-wider sm:hidden">
                    ADMIN MODE
                </span>
            </div>

            <div
                className="flex items-center justify-center px-3 md:px-5 border-r border-ink cursor-pointer hover:bg-ink/5 transition-colors"
                onClick={toggleDark}
            >
                {dark ? <Sun className="w-4 h-4 text-ink" strokeWidth={1.5} /> : <Moon className="w-4 h-4 text-ink" strokeWidth={1.5} />}
            </div>

            <div className="flex items-center justify-center px-3 md:px-6 relative cursor-pointer hover:bg-ink/5 transition-colors" onClick={handleLogout}>
                <div className="text-right hidden xl:block mr-4">
                    <p className="text-xs font-sans font-bold uppercase tracking-wider text-ink">{userName}</p>
                    <p className="text-[10px] font-mono text-accent font-bold uppercase mt-0.5 tracking-wider">SYSTEM ADMIN</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 border border-ink bg-ink flex items-center justify-center font-serif font-bold text-xs md:text-sm text-newsprint shrink-0">
                    {userInitials}
                </div>
                <div className="ml-3 hidden sm:flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-ink hover:text-accent transition-colors" strokeWidth={1.5} />
                </div>
            </div>
        </header>
    );
}
