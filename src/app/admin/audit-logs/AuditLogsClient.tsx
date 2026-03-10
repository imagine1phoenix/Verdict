"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Activity, Filter, Download } from "lucide-react";
import { toast } from "react-hot-toast";

type AuditLog = {
    id: number;
    userId: number | null;
    userName: string | null;
    userEmail: string | null;
    action: string;
    resourceType: string;
    resourceId: number | null;
    resourceName: string | null;
    details: any;
    ipAddress: string | null;
    createdAt: string;
};

export default function AuditLogsClient() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEventCount, setTotalEventCount] = useState(0);

    const [actionFilter, setActionFilter] = useState("");
    const [resourceFilter, setResourceFilter] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", "15");
            if (actionFilter) params.append("action", actionFilter);
            if (resourceFilter) params.append("resourceType", resourceFilter);

            const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch logs");

            const data = await res.json();
            setLogs(data.logs);
            setTotalPages(data.totalPages);
            setTotalEventCount(data.totalCount);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load audit logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, actionFilter, resourceFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-ink p-2 gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                    <div className="flex items-center border border-ink/20 px-2 bg-newsprint shrink-0">
                        <Filter className="w-3 h-3 text-neutral mr-2" strokeWidth={1.5} />
                        <select
                            value={actionFilter}
                            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
                            className="bg-transparent font-mono text-[10px] uppercase tracking-wider py-2 outline-none cursor-pointer"
                        >
                            <option value="">All Actions</option>
                            <option value="login">Login</option>
                            <option value="create">Create</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="register">Register</option>
                            <option value="reset_database">Reset Database</option>
                        </select>
                    </div>

                    <div className="flex items-center border border-ink/20 px-2 bg-newsprint shrink-0">
                        <Filter className="w-3 h-3 text-neutral mr-2" strokeWidth={1.5} />
                        <select
                            value={resourceFilter}
                            onChange={(e) => { setResourceFilter(e.target.value); setPage(1); }}
                            className="bg-transparent font-mono text-[10px] uppercase tracking-wider py-2 outline-none cursor-pointer"
                        >
                            <option value="">All Resources</option>
                            <option value="user">User</option>
                            <option value="case">Case</option>
                            <option value="document">Document</option>
                            <option value="evidence">Evidence</option>
                            <option value="system">System</option>
                            <option value="auth">Auth</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                    <div className="font-mono text-[10px] font-bold uppercase text-ink px-3 border-l border-ink/20 shrink-0">
                        {loading ? '...' : totalEventCount} Logs Found
                    </div>
                    {/* Pagination Context */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className="p-1 border border-ink hover:bg-ink hover:text-newsprint transition-colors disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <span className="font-mono text-[10px] uppercase font-bold w-16 text-center">
                            {page} / {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages || loading}
                            className="p-1 border border-ink hover:bg-ink hover:text-newsprint transition-colors disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="border border-ink bg-white overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b-[3px] border-ink bg-newsprint">
                            <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold w-48">Timestamp</th>
                            <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold w-48">Actor</th>
                            <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold w-32">Action</th>
                            <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold">Resource / Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
                                        <Activity className="w-6 h-6 text-neutral" strokeWidth={1.5} />
                                        <span className="font-mono text-[10px] text-neutral uppercase tracking-widest">Retrieving logs...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : logs.map((log, i) => (
                            <tr key={log.id} className={`border-b border-ink/20 hover:bg-ink/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-newsprint/30'}`}>
                                <td className="p-3 align-top">
                                    <div className="font-mono text-[10px] text-ink whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                                        })}
                                    </div>
                                </td>
                                <td className="p-3 align-top">
                                    <div className="font-sans text-xs font-bold uppercase truncate max-w-[180px]" title={log.userName || log.userEmail || "System"}>
                                        {log.userName || log.userEmail || "System"}
                                    </div>
                                    <div className="font-mono text-[9px] text-neutral mt-0.5 truncate max-w-[180px]" title={log.userEmail || "System"}>
                                        {log.userEmail || "System Activity"}
                                    </div>
                                    {log.ipAddress && (
                                        <div className="font-mono text-[8px] text-neutral/50 mt-1 uppercase" title="IP Address">
                                            IP: {log.ipAddress}
                                        </div>
                                    )}
                                </td>
                                <td className="p-3 align-top">
                                    <span className={`px-2 py-0.5 border font-mono text-[9px] font-bold uppercase ${log.action === 'create' ? 'border-green-600 text-green-700 bg-green-50' :
                                            log.action === 'update' ? 'border-blue-600 text-blue-700 bg-blue-50' :
                                                log.action === 'delete' ? 'border-red-600 text-red-700 bg-red-50' :
                                                    log.action === 'login' ? 'border-purple-600 text-purple-700 bg-purple-50' :
                                                        log.action === 'register' ? 'border-teal-600 text-teal-700 bg-teal-50' :
                                                            log.action === 'reset_database' ? 'border-accent text-accent bg-accent/10' :
                                                                'border-ink text-ink bg-ink/5'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-3 align-top">
                                    <div className="font-sans text-xs uppercase tracking-wider text-ink mb-1">
                                        <span className="font-bold">{log.resourceType}</span>
                                        {log.resourceName && (
                                            <span className="text-neutral mx-1">/</span>
                                        )}
                                        {log.resourceName}
                                        {log.resourceId && !log.resourceName && (
                                            <span className="text-neutral ml-1">ID: {log.resourceId}</span>
                                        )}
                                    </div>
                                    {log.details && Object.keys(log.details).length > 0 && (
                                        <pre className="mt-2 bg-newsprint/50 border border-ink/10 p-2 text-[9px] font-mono text-neutral overflow-x-auto whitespace-pre-wrap break-all max-h-24 overflow-y-auto">
                                            {JSON.stringify(log.details, null, 2)}
                                        </pre>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {!loading && logs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center font-mono text-xs text-neutral">
                                    No audit logs found matching criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
