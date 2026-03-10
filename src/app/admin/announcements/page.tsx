import { db } from "@/lib/db";
import { announcements } from "@/lib/schema";
import { desc } from "drizzle-orm";
import AnnouncementsClient from "./AnnouncementsClient";
import { FileText } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminAnnouncementsPage() {
    const allAnnouncements = await db.select().from(announcements).orderBy(desc(announcements.createdAt));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="font-serif text-3xl font-bold text-ink uppercase tracking-wider mb-2 flex items-center">
                    <FileText className="w-8 h-8 mr-3 opacity-50" strokeWidth={1.5} />
                    Announcements
                </h1>
                <p className="font-mono text-xs text-neutral tracking-wider uppercase">
                    System-wide messages & alerts broadcasts
                </p>
            </div>

            <AnnouncementsClient initialAnnouncements={allAnnouncements} />
        </div>
    );
}
