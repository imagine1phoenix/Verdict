import { db } from "@/lib/db";
import { systemSettings } from "@/lib/schema";
import { asc } from "drizzle-orm";
import SettingsClient from "./SettingsClient";
import { Settings as SettingsIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
    const allSettings = await db.select().from(systemSettings).orderBy(asc(systemSettings.key));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="font-serif text-3xl font-bold text-ink uppercase tracking-wider mb-2 flex items-center">
                    <SettingsIcon className="w-8 h-8 mr-3 opacity-50" strokeWidth={1.5} />
                    System Settings
                </h1>
                <p className="font-mono text-xs text-neutral tracking-wider uppercase">
                    Configure global application behavior
                </p>
            </div>

            <SettingsClient initialSettings={allSettings} />
        </div>
    );
}
