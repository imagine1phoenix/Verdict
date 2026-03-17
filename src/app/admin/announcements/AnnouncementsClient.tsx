"use client";

import { useState } from "react";
import { Trash2, Edit2, Plus, X, Globe, EyeOff, Check } from '@/components/Icons';
import { toast } from "react-hot-toast";

type Announcement = {
    id: number;
    title: string;
    content: string;
    type: string | null;
    isActive: boolean | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};

interface AnnouncementsClientProps {
    initialAnnouncements: Announcement[];
}

export default function AnnouncementsClient({ initialAnnouncements }: AnnouncementsClientProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        content: "",
        type: "info",
        isActive: true,
        expiresAt: ""
    });

    const openCreateForm = () => {
        setForm({ title: "", content: "", type: "info", isActive: true, expiresAt: "" });
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (item: Announcement) => {
        setForm({
            title: item.title,
            content: item.content,
            type: item.type || "info",
            isActive: item.isActive ?? true,
            expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 16) : ""
        });
        setEditingId(item.id);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
    };

    const handleSave = async () => {
        if (!form.title || !form.content) {
            toast.error("Title and Content are required");
            return;
        }

        setSaving(true);
        try {
            const method = editingId ? "PATCH" : "POST";
            const payload = { ...form, id: editingId, expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null };

            const res = await fetch("/api/admin/announcements", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save announcement");

            const saved = await res.json();

            if (editingId) {
                setAnnouncements(announcements.map(a => a.id === editingId ? saved : a));
                toast.success("Announcement updated");
            } else {
                setAnnouncements([saved, ...announcements]);
                toast.success("Announcement broadcasted");
            }
            closeForm();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save announcement");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this announcement?")) return;

        try {
            const res = await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");

            setAnnouncements(announcements.filter(a => a.id !== id));
            toast.success("Announcement deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete");
        }
    };

    const toggleStatus = async (item: Announcement) => {
        try {
            const res = await fetch("/api/admin/announcements", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
            });
            if (!res.ok) throw new Error("Update failed");
            const saved = await res.json();
            setAnnouncements(announcements.map(a => a.id === item.id ? saved : a));
            toast.success(saved.isActive ? "Announcement activated" : "Announcement hidden");
        } catch (error) {
            console.error(error);
            toast.error("Status toggle failed");
        }
    };

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white border border-ink p-2">
                <div className="font-mono text-[10px] font-bold uppercase text-ink px-3 border-ink/20">
                    {announcements.length} Total Announcements
                </div>
                <button
                    onClick={openCreateForm}
                    className="flex items-center px-4 py-2 bg-ink text-newsprint font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-accent hover:text-white transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} /> Broadcast New
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.map(item => (
                    <div key={item.id} className={`border p-5 relative transition-colors ${item.isActive ? 'border-ink bg-white' : 'border-ink/30 bg-newsprint/50'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <h3 className={`font-sans font-bold uppercase text-sm ${item.isActive ? 'text-ink' : 'text-neutral'}`}>
                                {item.title}
                            </h3>
                            <button
                                onClick={() => toggleStatus(item)}
                                className={`px-2 py-0.5 border font-mono text-[9px] uppercase tracking-wider font-bold transition-colors ${item.isActive
                                        ? 'border-green-600 text-green-700 bg-green-50 hover:bg-green-100'
                                        : 'border-neutral text-neutral hover:bg-neutral/10'
                                    }`}
                            >
                                {item.isActive ? 'Active' : 'Draft/Hidden'}
                            </button>
                        </div>
                        <p className={`font-serif text-sm leading-relaxed mb-4 ${item.isActive ? 'text-ink line-clamp-2' : 'text-neutral line-clamp-2'}`}>
                            {item.content}
                        </p>
                        <div className="flex items-center justify-between border-t border-ink/10 pt-3">
                            <span className="font-mono text-[9px] text-neutral uppercase tracking-wider">
                                Type: {item.type} | {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                            </span>
                            <div className="flex space-x-2">
                                <button onClick={() => openEditForm(item)} className="p-1.5 text-neutral hover:text-ink transition-colors border border-transparent hover:border-ink">
                                    <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-neutral hover:text-accent transition-colors border border-transparent hover:border-accent">
                                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-newsprint border-[3px] border-ink w-full max-w-lg shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                        <div className="flex justify-between items-center p-4 border-b-[3px] border-ink bg-ink text-newsprint">
                            <h2 className="font-sans font-bold uppercase tracking-wider text-sm">
                                {editingId ? "Edit Announcement" : "Broadcast Announcement"}
                            </h2>
                            <button onClick={closeForm} className="hover:text-accent transition-colors">
                                <X className="w-5 h-5" strokeWidth={1.5} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral mb-1">Headline</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-white border border-ink p-2 font-sans font-bold uppercase text-xs outline-none focus:border-accent"
                                    placeholder="CRITICAL UPDATE: ..."
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral mb-1">Message Content</label>
                                <textarea
                                    value={form.content}
                                    onChange={e => setForm({ ...form, content: e.target.value })}
                                    rows={4}
                                    className="w-full bg-white border border-ink p-2 font-serif text-sm outline-none focus:border-accent resize-none"
                                    placeholder="Enter full details here..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral mb-1">Type</label>
                                    <select
                                        value={form.type}
                                        onChange={e => setForm({ ...form, type: e.target.value })}
                                        className="w-full bg-white border border-ink px-2 py-2 font-mono text-[10px] uppercase outline-none focus:border-accent cursor-pointer"
                                    >
                                        <option value="info">Info</option>
                                        <option value="warning">Warning</option>
                                        <option value="critical">Critical</option>
                                        <option value="success">Success</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral mb-1">Expires (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        value={form.expiresAt}
                                        onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                                        className="w-full bg-white border border-ink px-2 py-[7px] font-mono text-[10px] uppercase outline-none focus:border-accent"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={form.isActive}
                                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                    className="w-4 h-4 border-ink accent-ink cursor-pointer"
                                />
                                <label htmlFor="isActive" className="ml-2 font-mono text-[10px] uppercase tracking-wider text-ink cursor-pointer">
                                    Publish Immediately
                                </label>
                            </div>
                        </div>
                        <div className="p-4 border-t border-ink bg-ink/5 flex justify-end space-x-4">
                            <button
                                onClick={closeForm}
                                disabled={saving}
                                className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-neutral hover:text-ink transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-ink text-newsprint font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
                            >
                                {saving ? "Saving..." : editingId ? "Save Changes" : "Broadcast"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
