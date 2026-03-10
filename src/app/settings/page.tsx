"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Bell, CreditCard, Building, Mail, LogOut, Upload, CheckCircle2, Settings, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState("profile");

    // Profile form state — populated from session
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [bio, setBio] = useState("Senior Partner specializing in Corporate Litigation and Intellectual Property rights with over 10 years of experience in High Court matters.");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (session?.user?.name) {
            const parts = session.user.name.split(" ");
            // Handle names like "Adv. Prit Thacker"
            if (parts[0] === "Adv.") {
                setFirstName(parts[1] || "");
                setLastName(parts.slice(2).join(" "));
            } else {
                setFirstName(parts[0]);
                setLastName(parts.slice(1).join(" "));
            }
        }
        if (session?.user?.email) setEmail(session.user.email);
        if ((session?.user as { role?: string })?.role) setRole((session?.user as { role?: string })?.role || "");
    }, [session]);

    const userInitials = session?.user?.name
        ?.split(" ")
        .filter(w => w !== "Adv.")
        .map(w => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Find the user's id from the users API
            const usersRes = await fetch("/api/users");
            if (!usersRes.ok) throw new Error("Failed to fetch users");
            const users = await usersRes.json();
            const currentUser = users.find((u: { email: string }) => u.email === session?.user?.email);

            if (currentUser) {
                const fullName = firstName.startsWith("Adv.") ? `${firstName} ${lastName}` : `Adv. ${firstName} ${lastName}`;
                const res = await fetch("/api/users", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: currentUser.id, name: fullName, role: role }),
                });
                if (res.ok) {
                    toast.success("Profile updated");
                } else {
                    toast.error("Failed to update profile");
                }
            } else {
                toast.error("User not found");
            }
        } catch {
            toast.error("Network error");
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-neutral" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col h-full">

            {/* Header */}
            <div className="border-b-[4px] border-ink pb-6 mb-8">
                <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-2 flex items-center">
                    <Settings className="w-6 h-6 mr-3" strokeWidth={1.5} />
                    System Settings
                </h1>
                <p className="text-sm font-sans text-neutral">
                    Configure user parameters, firm directories, and billing protocols.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-0 border border-ink">

                {/* Navigation Sidebar */}
                <div className="w-full md:w-56 flex flex-col shrink-0 border-b md:border-b-0 md:border-r border-ink">
                    {[
                        { id: "profile", icon: User, label: "My Profile" },
                        { id: "firm", icon: Building, label: "Firm Details" },
                        { id: "notifications", icon: Bell, label: "Alerts / Notifs" },
                        { id: "security", icon: Shield, label: "Security Defs" },
                        { id: "billing", icon: CreditCard, label: "Billing Cycles" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center px-4 py-3 font-sans text-xs font-bold border-b border-ink transition-colors uppercase tracking-wider ${activeTab === tab.id
                                ? "bg-ink text-newsprint"
                                : "bg-newsprint hover:bg-ink/5 text-ink"
                                }`}
                        >
                            <tab.icon className={`w-3.5 h-3.5 mr-3 ${activeTab === tab.id ? "text-newsprint" : "text-ink"}`} strokeWidth={1.5} /> {tab.label}
                        </button>
                    ))}

                    <div className="border-b border-ink" />

                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex items-center px-4 py-3 font-sans text-xs font-bold bg-accent text-newsprint hover:bg-accent/90 transition-colors uppercase tracking-wider"
                    >
                        <LogOut className="w-3.5 h-3.5 mr-3" strokeWidth={1.5} /> Sign Out
                    </button>
                </div>

                {/* Settings Content Area */}
                <div className="flex-1 p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === "profile" ? (
                            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <h2 className="font-serif text-xl font-bold text-ink mb-6 border-b-[4px] border-ink pb-4">Profile Information</h2>

                                <div className="flex items-center space-x-6 mb-8">
                                    <div className="relative">
                                        <div className="w-20 h-20 border border-ink bg-ink flex items-center justify-center text-newsprint text-2xl font-serif font-bold">
                                            {userInitials}
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 bg-ink text-newsprint p-1.5 border border-newsprint hover:bg-ink/90 transition-colors">
                                            <Upload className="w-3 h-3" strokeWidth={1.5} />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-lg font-bold text-ink">{session?.user?.name || "User"}</h3>
                                        <p className="text-[10px] font-sans font-bold bg-ink text-newsprint inline-block px-2 py-0.5 mt-1 uppercase tracking-wider">{role || "Member"}</p>
                                        <p className="text-xs font-mono mt-2 flex items-center text-neutral">
                                            <Mail className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} /> {session?.user?.email}
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">First Name</label>
                                            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="input-newsprint text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Last Name</label>
                                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="input-newsprint text-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Email Address</label>
                                        <input type="email" value={email} disabled className="input-newsprint text-sm opacity-50 cursor-not-allowed" />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Role</label>
                                        <input type="text" value={role} onChange={e => setRole(e.target.value)} className="input-newsprint text-sm" />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Bio</label>
                                        <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} className="w-full border-b border-ink bg-transparent font-mono text-sm text-ink p-2 outline-none resize-none focus:border-b-2" />
                                    </div>

                                    <div className="pt-6 border-t border-ink flex justify-end">
                                        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-ink text-newsprint font-sans text-xs font-bold uppercase tracking-widest hover:bg-ink/90 transition-colors disabled:opacity-50">
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-ink">
                                <Settings className="w-10 h-10 text-neutral mb-4" strokeWidth={1} />
                                <h3 className="font-serif text-lg font-bold text-ink tracking-tight">Module Offline</h3>
                                <p className="text-xs font-sans text-neutral mt-2">Backend communications required to populate this tab.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
