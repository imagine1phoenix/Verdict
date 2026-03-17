"use client";

import { useState } from "react";
import { Edit2, ShieldAlert, Trash2, Shield, Search } from '@/components/Icons';
import { toast } from "react-hot-toast";

type User = {
    id: number;
    name: string | null;
    email: string | null;
    role: string | null;
    createdAt: Date | null;
};

interface UsersClientProps {
    initialUsers: User[];
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [updating, setUpdating] = useState<number | null>(null);

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user.role?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const handleRoleChange = async (userId: number, newRole: string) => {
        setUpdating(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            if (!res.ok) throw new Error("Failed to update user");

            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success(`Role updated to ${newRole}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update role");
        } finally {
            setUpdating(null);
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        setUpdating(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete user");

            setUsers(users.filter(u => u.id !== userId));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user");
            setUpdating(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white border border-ink p-2">
                <div className="relative w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral" strokeWidth={1.5} />
                    <input
                        type="text"
                        placeholder="SEARCH USERS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border border-ink/20 font-mono text-[10px] uppercase tracking-wider pl-9 pr-3 py-2 outline-none focus:border-ink transition-colors placeholder:text-neutral/50"
                    />
                </div>
                <div className="font-mono text-[10px] font-bold uppercase text-ink px-3 border-l border-ink/20">
                    {filteredUsers.length} Users Found
                </div>
            </div>

            {/* Table */}
            <div className="border border-ink bg-white overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-[3px] border-ink bg-newsprint">
                            <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold">User Details</th>
                            <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold">Role</th>
                            <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold">Joined</th>
                            <th className="p-3 font-mono text-[10px] uppercase tracking-wider text-ink font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, i) => (
                            <tr key={user.id} className={`border-b border-ink/20 hover:bg-ink/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-newsprint/30'} ${updating === user.id ? 'opacity-50 pointer-events-none' : ''}`}>
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 border border-ink bg-ink text-newsprint flex items-center justify-center font-serif font-bold text-xs mr-3 shrink-0">
                                            {(user.name || 'U').substring(0, 1)}
                                        </div>
                                        <div>
                                            <div className="font-sans text-sm font-bold uppercase">{user.name || 'Unknown User'}</div>
                                            <div className="font-mono text-[10px] text-neutral mt-0.5">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <select
                                        value={user.role || 'member'}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className={`font-mono text-[10px] font-bold uppercase px-2 py-1 outline-none border cursor-pointer border-transparent hover:border-ink/20 focus:border-ink transition-colors ${user.role === 'admin' ? 'bg-accent/10 text-accent' :
                                                user.role === 'partner' ? 'bg-blue-50 text-blue-700' :
                                                    'bg-ink/5 text-ink'
                                            }`}
                                    >
                                        <option value="member">Member</option>
                                        <option value="associate">Associate</option>
                                        <option value="paralegal">Paralegal</option>
                                        <option value="partner">Partner</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-4 font-mono text-[10px] text-neutral">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="p-1.5 text-neutral hover:text-accent hover:bg-accent/10 transition-colors border border-transparent hover:border-accent inline-block"
                                        title="Delete User"
                                        disabled={user.role === 'admin'}
                                    >
                                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center font-mono text-xs text-neutral">
                                    No users found matching "{searchQuery}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
