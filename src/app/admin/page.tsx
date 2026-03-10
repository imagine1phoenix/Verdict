import { db } from "@/lib/db";
import { users, cases, documents, auditLogs, evidence } from "@/lib/schema";
import { desc, sql } from "drizzle-orm";
import { Users, FolderOpen, FileText, Database, ShieldAlert, Activity } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    // Run all count queries in parallel
    const [
        usersCountResult,
        casesCountResult,
        documentsCountResult,
        evidenceCountResult,
        recentLogs
    ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(users),
        db.select({ count: sql<number>`count(*)` }).from(cases),
        db.select({ count: sql<number>`count(*)` }).from(documents),
        db.select({ count: sql<number>`count(*)` }).from(evidence),
        db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(5)
    ]);

    const stats = [
        { label: "Total Users", value: usersCountResult[0].count, icon: Users, href: "/admin/users" },
        { label: "Total Cases", value: casesCountResult[0].count, icon: FolderOpen, href: "#" },
        { label: "Total Documents", value: documentsCountResult[0].count, icon: FileText, href: "#" },
        { label: "Total Evidence", value: evidenceCountResult[0].count, icon: Database, href: "#" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="font-serif text-3xl font-bold text-ink uppercase tracking-wider mb-2">
                    System Overview
                </h1>
                <p className="font-mono text-xs text-neutral tracking-wider uppercase">
                    Real-time platform statistics & security alerts
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="border border-ink bg-white p-5 hover:bg-ink/5 transition-colors relative group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral">
                                {stat.label}
                            </span>
                            <stat.icon className="w-5 h-5 text-ink opacity-50" strokeWidth={1.5} />
                        </div>
                        <div className="font-serif text-4xl font-bold text-ink">
                            {stat.value}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Audit Logs */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b-[3px] border-ink pb-2">
                        <div className="flex items-center">
                            <Activity className="w-5 h-5 text-ink mr-2" strokeWidth={1.5} />
                            <h2 className="font-sans font-bold text-sm tracking-widest uppercase">Security Event Log</h2>
                        </div>
                        <Link href="/admin/audit-logs" className="text-[10px] font-mono hover:text-accent font-bold uppercase tracking-wider underline underline-offset-4">
                            View All Logs
                        </Link>
                    </div>

                    <div className="border border-ink bg-white overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-[2px] border-ink bg-ink/5">
                                    <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold">Timestamp</th>
                                    <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold">User</th>
                                    <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold">Action</th>
                                    <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold">Resource</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentLogs.length > 0 ? (
                                    recentLogs.map((log, i) => (
                                        <tr key={log.id} className={`border-b border-ink/20 hover:bg-ink/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-newsprint/30'}`}>
                                            <td className="p-3 font-mono text-[10px] text-neutral whitespace-nowrap">
                                                {new Date(log.createdAt).toLocaleString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="p-3">
                                                <div className="font-sans text-xs font-semibold uppercase">{log.userName || log.userEmail}</div>
                                                <div className="font-mono text-[9px] text-neutral mt-0.5">{log.userEmail}</div>
                                            </td>
                                            <td className="p-3 font-mono text-[10px] font-bold uppercase">
                                                <span className={`px-2 py-0.5 border ${log.action === 'create' ? 'border-green-600 text-green-700 bg-green-50' :
                                                        log.action === 'update' ? 'border-blue-600 text-blue-700 bg-blue-50' :
                                                            log.action === 'delete' ? 'border-red-600 text-red-700 bg-red-50' :
                                                                log.action === 'login' ? 'border-purple-600 text-purple-700 bg-purple-50' :
                                                                    'border-ink text-ink bg-ink/5'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="p-3 font-sans text-xs uppercase tracking-wider text-ink">
                                                <span className="font-bold">{log.resourceType}</span>: {log.resourceName || log.resourceId}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-6 text-center font-mono text-xs text-neutral">No recent events.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Status */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b-[3px] border-ink pb-2">
                        <div className="flex items-center">
                            <ShieldAlert className="w-5 h-5 text-accent mr-2" strokeWidth={1.5} />
                            <h2 className="font-sans font-bold text-sm tracking-widest uppercase text-accent">System Status</h2>
                        </div>
                    </div>

                    <div className="border border-ink bg-white p-5 space-y-5">
                        <div className="flex justify-between items-center pb-4 border-b border-ink/20">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral">Database Status</span>
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 border border-green-200">Online</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-ink/20">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral">Storage Used</span>
                            <span className="font-sans font-bold text-xs uppercase tracking-wider text-ink">45% (4.5 TB)</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-ink/20">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral">Active Sessions</span>
                            <span className="font-sans font-bold text-xs uppercase tracking-wider text-ink">122</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral">Last Backup</span>
                            <span className="font-sans font-bold text-xs uppercase tracking-wider text-ink">3 hrs ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
