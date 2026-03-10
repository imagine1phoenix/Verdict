import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { desc } from "drizzle-orm";
import UsersClient from "./UsersClient";
import { Users as UsersIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="font-serif text-3xl font-bold text-ink uppercase tracking-wider mb-2 flex items-center">
                    <UsersIcon className="w-8 h-8 mr-3 opacity-50" strokeWidth={1.5} />
                    User Management
                </h1>
                <p className="font-mono text-xs text-neutral tracking-wider uppercase">
                    Manage access, roles, and profiles
                </p>
            </div>

            <UsersClient initialUsers={allUsers} />
        </div>
    );
}
