"use client";

import { useState, useEffect } from "react";
import { Search, LogOut, Settings, User, Moon, Sun, Menu } from '@/components/Icons';
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import GlobalSearch from "@/components/GlobalSearch";

interface HeaderProps {
    onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
    const { data: session } = useSession();
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [dark, setDark] = useState(false);

    // Derive user info from session
    const userName = session?.user?.name || "User";
    const userEmail = session?.user?.email || "";
    const userInitials = userName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    const userRole = session?.user?.role || "member";

    // Hydrate dark mode from localStorage
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

    // Ctrl+K / Cmd+K shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen(prev => !prev);
            }
            if (e.key === "Escape") setSearchOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const handleNotifications = () => {
        toast("No new announcements.", { icon: "📝" });
    };

    const handleLogout = async () => {
        toast.error("SESSION TERMINATED");
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <>
            <header className="h-14 md:h-20 border-b border-ink flex items-stretch bg-newsprint sticky top-0 z-20">

                {/* Mobile Menu Button */}
                <div
                    className="flex md:hidden items-center justify-center px-4 border-r border-ink cursor-pointer hover:bg-ink/5 transition-colors"
                    onClick={onMenuToggle}
                >
                    <Menu className="w-5 h-5 text-ink" strokeWidth={1.5} />
                </div>

                {/* Universal Search Area */}
                <div className="flex-[2] border-r border-ink flex items-center px-3 md:px-6 group cursor-pointer min-w-0" onClick={() => setSearchOpen(true)}>
                    <Search className="w-4 h-4 text-ink mr-2 md:mr-3 shrink-0" strokeWidth={1.5} />
                    <span className="text-xs font-sans text-neutral uppercase tracking-wider truncate hidden sm:inline">Search cases, docs, evidence...</span>
                    <span className="text-xs font-sans text-neutral uppercase tracking-wider sm:hidden">Search...</span>
                    <div className="text-[10px] font-mono px-2 py-1 border border-ink text-neutral hidden md:block select-none ml-3 shrink-0 uppercase">
                        ⌘K
                    </div>
                </div>

                {/* Notifications */}
                <div
                    className="flex items-center justify-center px-3 md:px-6 border-r border-ink cursor-pointer hover:bg-ink/5 transition-colors relative"
                    onClick={handleNotifications}
                >
                    <div className="flex flex-col items-center">
                        <span className="uppercase tracking-widest font-sans font-bold text-[10px] mb-0.5 text-ink hidden sm:block">Alerts</span>
                        <span className="font-mono text-xs font-bold text-accent">( 2 )</span>
                    </div>
                </div>

                {/* Dark Mode Toggle */}
                <div
                    className="flex items-center justify-center px-3 md:px-5 border-r border-ink cursor-pointer hover:bg-ink/5 transition-colors"
                    onClick={toggleDark}
                >
                    {dark ? <Sun className="w-4 h-4 text-ink" strokeWidth={1.5} /> : <Moon className="w-4 h-4 text-ink" strokeWidth={1.5} />}
                </div>

                {/* Date Badge — hidden on mobile */}
                <div className="hidden md:flex items-center justify-center px-6 border-r border-ink">
                    <div className="text-center">
                        <span className="block font-serif text-sm font-bold text-ink">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                        <span className="block text-[10px] font-mono text-neutral uppercase tracking-wider">
                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Profile Area */}
                <div className="flex items-center justify-center px-3 md:px-6 relative cursor-pointer hover:bg-ink/5 transition-colors" onClick={() => setProfileOpen(!profileOpen)}>
                    <div className="text-right hidden xl:block mr-4">
                        <p className="text-xs font-sans font-bold uppercase tracking-wider text-ink">{userName}</p>
                        <p className={`text-[10px] font-mono mt-0.5 tracking-wider uppercase font-bold ${userRole === 'admin' ? 'text-accent' : 'text-neutral'}`}>
                            {userRole}
                        </p>
                    </div>
                    <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-serif font-bold text-xs md:text-sm shrink-0 ${userRole === 'admin' ? 'border-[2px] border-accent bg-newsprint text-accent' : 'border border-ink bg-newsprint text-ink'}`}>
                        {userInitials}
                    </div>

                    {/* Dropdown */}
                    {profileOpen && (
                        <div className="absolute top-full right-0 mt-0 w-56 bg-newsprint border border-ink z-50 flex flex-col">
                            <div className="px-4 py-3 border-b border-ink bg-ink text-newsprint">
                                <p className="text-xs font-sans font-bold uppercase">{userName}</p>
                                <p className="text-[10px] font-mono text-neutral mt-1 uppercase">{userEmail}</p>
                            </div>

                            <Link href="/settings" className="px-4 py-3 border-b border-ink font-sans text-xs font-semibold uppercase hover:bg-ink/5 text-ink flex items-center transition-colors tracking-wider">
                                <User className="w-3.5 h-3.5 mr-3" strokeWidth={1.5} /> Profile
                            </Link>

                            <Link href="/settings" className="px-4 py-3 border-b border-ink font-sans text-xs font-semibold uppercase hover:bg-ink/5 text-ink flex items-center transition-colors tracking-wider">
                                <Settings className="w-3.5 h-3.5 mr-3" strokeWidth={1.5} /> Firm Settings
                            </Link>

                            <button onClick={handleLogout} className="px-4 py-3 font-sans text-xs font-semibold uppercase hover:bg-accent hover:text-white text-ink flex items-center text-left transition-colors tracking-wider">
                                <LogOut className="w-3.5 h-3.5 mr-3" strokeWidth={1.5} /> Disconnect
                            </button>
                        </div>
                    )}
                </div>

            </header>

            {/* Global Search Modal */}
            {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
        </>
    );
}
