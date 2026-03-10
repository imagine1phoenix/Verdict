import { db } from "@/lib/db";
import { auditLogs, users } from "@/lib/schema";
import { desc } from "drizzle-orm";
import AuditLogsClient from "./AuditLogsClient";
import { History } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminAuditLogsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="font-serif text-3xl font-bold text-ink uppercase tracking-wider mb-2 flex items-center">
                    <History className="w-8 h-8 mr-3 opacity-50" strokeWidth={1.5} />
                    Audit Logs
                </h1>
                <p className="font-mono text-xs text-neutral tracking-wider uppercase">
                    Security tracking & immutable event ledger
                </p>
            </div>

            <AuditLogsClient />
        </div>
    );
}
