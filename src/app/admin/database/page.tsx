"use client";

import { useState } from "react";
import { Download, RefreshCw, AlertTriangle, Archive, Database as DatabaseIcon, ShieldAlert } from '@/components/Icons';
import { toast } from "react-hot-toast";

export default function AdminDatabasePage() {
    const [exporting, setExporting] = useState(false);
    const [resetting, setResetting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        const toastId = toast.loading("Generating full database export...");

        try {
            // Trigger download by navigation
            window.location.href = "/api/admin/export";
            toast.success("Download started", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Export failed. File may be too large.", { id: toastId });
        } finally {
            setTimeout(() => setExporting(false), 2000);
        }
    };

    const handleReset = async () => {
        const confirm1 = prompt('This will DELETE all current data and restore to factory defaults. Type "CONFIRM" to proceed.');
        if (confirm1 !== "CONFIRM") return;

        const confirm2 = confirm("FINAL WARNING: All data will be lost. This cannot be undone.");
        if (!confirm2) return;

        setResetting(true);
        const toastId = toast.loading("Executing Database Factory Reset...");

        try {
            const res = await fetch("/api/seed", { method: "POST" });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Reset failed");

            toast.success("Database reset successful!", { id: toastId });
            setTimeout(() => window.location.reload(), 1500);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to reset database", { id: toastId });
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="font-serif text-3xl font-bold text-ink uppercase tracking-wider mb-2 flex items-center">
                    <Archive className="w-8 h-8 mr-3 opacity-50" strokeWidth={1.5} />
                    Database Ops
                </h1>
                <p className="font-mono text-xs text-neutral tracking-wider uppercase">
                    Data portability and destructive operations
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Export Card */}
                <div className="border border-ink bg-white p-6 relative group flex flex-col h-full">
                    <div className="absolute top-0 right-0 p-4">
                        <Download className="w-6 h-6 text-ink/20 group-hover:text-ink transition-colors" strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center mb-4">
                        <DatabaseIcon className="w-6 h-6 text-ink mr-3" strokeWidth={1.5} />
                        <h2 className="font-sans font-bold uppercase text-lg">System Image Export</h2>
                    </div>
                    <p className="font-serif text-sm text-neutral mb-8 leading-relaxed flex-1">
                        Download a complete JSON snapshot of all database tables including users, cases, evidence, and configuration logs. This action constitutes a "read" and is logged in the audit trail.
                    </p>
                    <button
                        onClick={handleExport}
                        disabled={exporting || resetting}
                        className="w-full py-4 bg-ink text-newsprint font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
                    >
                        {exporting ? (
                            <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Packaging JSON...</span>
                        ) : (
                            <span className="flex items-center"><Download className="w-4 h-4 mr-2" /> Download JSON Snapshot</span>
                        )}
                    </button>
                </div>

                {/* Nuclear Card */}
                <div className="border border-red-600 bg-red-50 p-6 relative group flex flex-col h-full">
                    <div className="absolute top-0 right-0 p-4">
                        <AlertTriangle className="w-6 h-6 text-red-600/30 group-hover:text-red-600 transition-colors animate-pulse" strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600 mr-3" strokeWidth={2} />
                        <h2 className="font-sans font-bold uppercase text-lg text-red-600">Danger Zone</h2>
                    </div>
                    <p className="font-serif text-sm text-red-800 mb-8 leading-relaxed flex-1 font-semibold">
                        This action truncates the entire database and replays the initial seed scripts. All active sessions, documents, and historical data will be permanently purged without recovery.
                    </p>
                    <button
                        onClick={handleReset}
                        disabled={resetting || exporting}
                        className="w-full py-4 bg-red-600 text-white border-2 border-transparent hover:border-red-800 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center transition-all disabled:opacity-50"
                    >
                        {resetting ? (
                            <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Factory Wipe in Progress...</span>
                        ) : (
                            <span className="flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> Execute Factory Reset</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Meta */}
            <div className="border border-ink/20 bg-ink/5 p-4 flex items-start">
                <ShieldAlert className="w-4 h-4 text-neutral mr-3 mt-0.5 shrink-0" strokeWidth={1.5} />
                <p className="font-mono text-[9px] uppercase tracking-widest text-neutral leading-relaxed">
                    Database version: Neon Postgres V14 • ORM: Drizzle V0.29 <br />
                    All actions on this screen are logged and reviewed chronologically by System Administrators.
                </p>
            </div>
        </div>
    );
}
