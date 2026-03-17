"use client";

import { useState } from "react";
import { Save, Plus, Trash2, Edit2, X } from '@/components/Icons';
import { toast } from "react-hot-toast";

type Setting = {
    key: string;
    value: any;
    description: string | null;
    updatedAt: Date | null;
};

interface SettingsClientProps {
    initialSettings: Setting[];
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
    const [settings, setSettings] = useState<Setting[]>(initialSettings);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // For inline editing
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const [form, setForm] = useState({
        key: "",
        value: "",
        description: "",
    });

    const handleSaveNew = async () => {
        if (!form.key || !form.value) {
            toast.error("Key and Value are required");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/admin/system-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to save setting");
            }

            const saved = await res.json();

            // Check if it was an update or create
            if (settings.some(s => s.key === saved.key)) {
                setSettings(settings.map(s => s.key === saved.key ? saved : s));
            } else {
                setSettings([...settings, saved].sort((a, b) => a.key.localeCompare(b.key)));
            }

            toast.success("Setting saved successfully");
            setIsFormOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to save setting");
        } finally {
            setSaving(false);
        }
    };

    const handleInlineSave = async (key: string) => {
        try {
            const res = await fetch("/api/admin/system-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, value: editValue }),
            });

            if (!res.ok) throw new Error("Update failed");
            const saved = await res.json();

            setSettings(settings.map(s => s.key === key ? saved : s));
            setEditingKey(null);
            toast.success("Setting updated");
        } catch (error) {
            console.error(error);
            toast.error("Update failed");
        }
    };

    const handleDelete = async (key: string) => {
        if (!confirm(`Delete setting '${key}'? This could break system functionality.`)) return;

        try {
            const res = await fetch(`/api/admin/system-settings?key=${key}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");

            setSettings(settings.filter(s => s.key !== key));
            toast.success("Setting deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white border border-ink p-2">
                <div className="font-mono text-[10px] font-bold uppercase text-ink px-3 border-ink/20">
                    Configuration Register
                </div>
                <button
                    onClick={() => {
                        setForm({ key: "", value: "", description: "" });
                        setIsFormOpen(true);
                    }}
                    className="flex items-center px-4 py-2 bg-ink text-newsprint font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-accent hover:text-white transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} /> Add Variable
                </button>
            </div>

            {/* List */}
            <div className="border border-ink bg-white overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-[3px] border-ink bg-newsprint">
                            <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-ink font-bold w-1/4 min-w-[200px]">Parameter Key</th>
                            <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-ink font-bold w-1/2">Value</th>
                            <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-ink font-bold w-32">Visibility</th>
                            <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-ink font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {settings.map((item, i) => (
                            <tr key={item.key} className={`border-b border-ink/20 hover:bg-ink/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-newsprint/30'} group`}>
                                <td className="p-4 align-top">
                                    <div className="font-mono text-[11px] font-bold text-ink uppercase tracking-wider bg-ink/5 inline-block px-2 py-1 border border-ink/10">
                                        {item.key}
                                    </div>
                                    <div className="font-sans text-xs text-neutral mt-2">
                                        {item.description || "No description provided"}
                                    </div>
                                    <div className="font-mono text-[9px] text-neutral/50 mt-1 uppercase tracking-wider">
                                        Last modified: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'}
                                    </div>
                                </td>
                                <td className="p-4 align-top">
                                    {editingKey === item.key ? (
                                        <div className="flex items-start flex-col gap-2">
                                            <textarea
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                rows={3}
                                                className="w-full bg-white border border-ink p-2 font-mono text-xs outline-none focus:border-accent resize-y min-h-[80px]"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleInlineSave(item.key)} className="px-3 py-1 bg-ink text-newsprint font-mono text-[9px] uppercase font-bold hover:bg-accent hover:text-white transition-colors">Save</button>
                                                <button onClick={() => setEditingKey(null)} className="px-3 py-1 border border-ink text-ink font-mono text-[9px] uppercase font-bold hover:bg-ink/5 transition-colors">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="font-mono text-xs text-ink whitespace-pre-wrap break-all cursor-pointer p-2 border border-transparent hover:border-ink/20"
                                            onClick={() => { setEditingKey(item.key); setEditValue(item.value); }}
                                            title="Click to edit"
                                        >
                                            {item.value || <span className="text-neutral italic">Empty</span>}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 align-top text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingKey(item.key); setEditValue(item.value); }} className="p-1.5 text-neutral hover:text-ink transition-colors border border-transparent hover:border-ink mr-2">
                                        <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    </button>
                                    <button onClick={() => handleDelete(item.key)} className="p-1.5 text-neutral hover:text-accent transition-colors border border-transparent hover:border-accent">
                                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {settings.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center font-mono text-xs text-neutral">
                                    No system variables configured.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-newsprint border-[3px] border-ink w-full max-w-lg shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                        <div className="flex justify-between items-center p-4 border-b-[3px] border-ink bg-ink text-newsprint">
                            <h2 className="font-sans font-bold uppercase tracking-wider text-sm">
                                Register Variable
                            </h2>
                            <button onClick={() => setIsFormOpen(false)} className="hover:text-accent transition-colors">
                                <X className="w-5 h-5" strokeWidth={1.5} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral mb-1">Key Name (e.g. SITE_NAME)</label>
                                <input
                                    type="text"
                                    value={form.key}
                                    onChange={e => setForm({ ...form, key: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                                    className="w-full bg-white border border-ink p-2 font-mono font-bold uppercase text-xs outline-none focus:border-accent"
                                    placeholder="KEY_NAME"
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral mb-1">Value Content</label>
                                <textarea
                                    value={form.value}
                                    onChange={e => setForm({ ...form, value: e.target.value })}
                                    rows={4}
                                    className="w-full bg-white border border-ink p-2 font-mono text-xs outline-none focus:border-accent resize-y"
                                    placeholder='{"some": "json"} or string'
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral mb-1">Description (Optional)</label>
                                <input
                                    type="text"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-white border border-ink p-2 font-sans text-xs outline-none focus:border-accent"
                                    placeholder="What does this control?"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-ink bg-ink/5 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsFormOpen(false)}
                                disabled={saving}
                                className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-neutral hover:text-ink transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveNew}
                                disabled={saving}
                                className="px-6 py-2 bg-ink text-newsprint font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
                            >
                                {saving ? "Writing..." : "Write to DB"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
