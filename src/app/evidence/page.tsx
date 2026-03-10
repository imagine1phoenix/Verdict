"use client";

import { useState, useEffect } from "react";
import {
    Archive, Search, Shield, FileText, Upload, Filter, Calendar,
    Users, Link2, Brain, CheckCircle, AlertTriangle, ChevronRight,
    Download, Plus, X, Eye, Trash2, Edit
} from "lucide-react";
import { toast } from "react-hot-toast";

/* ─── Types ─── */

type EvidenceItem = {
    id: number;
    evidenceId: string;
    caseRef: string | null;
    title: string;
    type: string;
    status: string;
    collectedBy: string | null;
    collectedDate: string | null;
    chainOfCustody: { handler: string; action: string; date: string; location: string; notes?: string }[];
    storageLocation: string | null;
    fileUrl: string | null;
    description: string | null;
    tags: string[];
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
};

type EvidenceType = "all" | "physical" | "digital" | "documentary" | "testimonial" | "forensic";

const evidenceTypes: { id: EvidenceType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "physical", label: "Physical" },
    { id: "digital", label: "Digital" },
    { id: "documentary", label: "Documentary" },
    { id: "testimonial", label: "Testimonial" },
    { id: "forensic", label: "Forensic" },
];

const statusOptions = ["collected", "processing", "verified", "admitted", "challenged", "excluded"];

/* ─── Component ─── */

export default function EvidencePage() {
    const [items, setItems] = useState<EvidenceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeType, setActiveType] = useState<EvidenceType>("all");
    const [searchQ, setSearchQ] = useState("");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCustodyModal, setShowCustodyModal] = useState(false);
    const [cases, setCases] = useState<{ caseId: string; name: string }[]>([]);

    // Form state
    const [form, setForm] = useState({
        evidenceId: "", title: "", type: "digital", caseRef: "", collectedBy: "",
        collectedDate: "", storageLocation: "", description: "", tags: "",
    });

    // Custody form
    const [custodyForm, setCustodyForm] = useState({
        handler: "", action: "", date: "", location: "", notes: "",
    });

    useEffect(() => {
        fetchEvidence();
        fetchCases();
    }, []);

    async function fetchEvidence() {
        try {
            setLoading(true);
            const res = await fetch("/api/evidence");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setItems(data);
            if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
        } catch {
            toast.error("FAILED TO LOAD EVIDENCE");
        } finally {
            setLoading(false);
        }
    }

    async function fetchCases() {
        try {
            const res = await fetch("/api/cases");
            if (res.ok) {
                const data = await res.json();
                setCases(data.map((c: { caseId: string; name: string }) => ({ caseId: c.caseId, name: c.name })));
            }
        } catch { /* silent */ }
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!form.title.trim() || !form.evidenceId.trim()) {
            toast.error("EVIDENCE ID AND TITLE ARE REQUIRED");
            return;
        }
        try {
            const res = await fetch("/api/evidence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    caseRef: form.caseRef || null,
                    tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create");
            }
            const created = await res.json();
            setItems(prev => [created, ...prev]);
            setShowAddModal(false);
            setForm({ evidenceId: "", title: "", type: "digital", caseRef: "", collectedBy: "", collectedDate: "", storageLocation: "", description: "", tags: "" });
            toast.success("EVIDENCE ADDED");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "SOMETHING WENT WRONG";
            toast.error(message.toUpperCase());
        }
    }

    async function handleStatusChange(id: number, newStatus: string) {
        try {
            const res = await fetch("/api/evidence", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (!res.ok) throw new Error("Failed to update");
            const updated = await res.json();
            setItems(prev => prev.map(i => i.id === id ? updated : i));
            toast.success("STATUS UPDATED");
        } catch {
            toast.error("FAILED TO UPDATE STATUS");
        }
    }

    async function handleAddCustody(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedItem || !custodyForm.handler || !custodyForm.action) {
            toast.error("HANDLER AND ACTION ARE REQUIRED");
            return;
        }
        const newChain = [...(selectedItem.chainOfCustody || []), { ...custodyForm }];
        try {
            const res = await fetch("/api/evidence", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedItem.id, chainOfCustody: newChain }),
            });
            if (!res.ok) throw new Error("Failed");
            const updated = await res.json();
            setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
            setShowCustodyModal(false);
            setCustodyForm({ handler: "", action: "", date: "", location: "", notes: "" });
            toast.success("CUSTODY RECORD ADDED");
        } catch {
            toast.error("FAILED TO UPDATE CHAIN");
        }
    }

    async function handleDelete(id: number, title: string) {
        if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/evidence?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setItems(prev => prev.filter(i => i.id !== id));
            if (selectedId === id) setSelectedId(null);
            toast.success("EVIDENCE DELETED");
        } catch {
            toast.error("FAILED TO DELETE");
        }
    }

    // Derived
    const filtered = items.filter(e => {
        if (activeType !== "all" && e.type !== activeType) return false;
        if (searchQ && !e.title.toLowerCase().includes(searchQ.toLowerCase()) && !e.evidenceId.toLowerCase().includes(searchQ.toLowerCase())) return false;
        return true;
    });

    const typeCounts = items.reduce<Record<string, number>>((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1;
        return acc;
    }, {});

    const selectedItem = items.find(i => i.id === selectedId) || null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "admitted": case "verified": return "border-green-600 text-green-700";
            case "challenged": case "excluded": return "border-accent text-accent";
            case "processing": return "border-yellow-600 text-yellow-700";
            default: return "border-ink/30 text-neutral";
        }
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto pb-12">
                <div className="border-b-[4px] border-ink pb-5 mb-6">
                    <div className="h-8 w-48 bg-ink/10 animate-pulse mb-2" />
                    <div className="h-4 w-96 bg-ink/10 animate-pulse" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="border border-ink/20 p-4 flex gap-4">
                            <div className="h-4 w-24 bg-ink/10 animate-pulse" />
                            <div className="h-4 w-64 bg-ink/10 animate-pulse" />
                            <div className="h-4 w-20 bg-ink/10 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col">

            {/* ── Header ── */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center">
                            <Archive className="w-6 h-6 mr-3" strokeWidth={1.5} />
                            Evidence Vault
                        </h1>
                        <p className="text-sm font-sans text-neutral">Secure, categorized evidence storage with chain of custody tracking.</p>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-ink text-newsprint hover:bg-ink/90 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider shrink-0">
                        <Plus className="w-3 h-3 mr-1.5" strokeWidth={1.5} />Add Evidence
                    </button>
                </div>
            </div>

            {/* ── Search Bar ── */}
            <div className="border border-ink mb-6 flex items-center px-4">
                <Search className="w-4 h-4 text-neutral mr-3" strokeWidth={1.5} />
                <input
                    value={searchQ} onChange={e => setSearchQ(e.target.value)}
                    placeholder="SEARCH EVIDENCE BY TITLE OR ID..."
                    className="flex-1 py-3 bg-transparent font-mono text-xs text-ink outline-none placeholder:text-neutral/50 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-wider"
                />
            </div>

            {/* ── Category Tabs ── */}
            <div className="flex border border-ink mb-6">
                {evidenceTypes.map((cat, i) => (
                    <button key={cat.id} onClick={() => setActiveType(cat.id)}
                        className={`flex-1 py-2.5 text-center font-sans text-[10px] font-bold uppercase tracking-wider transition-colors ${i < evidenceTypes.length - 1 ? 'border-r border-ink' : ''} ${activeType === cat.id ? 'bg-ink text-newsprint' : 'text-neutral hover:bg-ink/5'}`}>
                        {cat.label} ({cat.id === "all" ? items.length : typeCounts[cat.id] || 0})
                    </button>
                ))}
            </div>

            {/* ── Empty state ── */}
            {filtered.length === 0 && !loading && (
                <div className="border border-ink p-12 text-center mb-6">
                    <Archive className="w-8 h-8 text-neutral/40 mx-auto mb-3" strokeWidth={1.5} />
                    <p className="font-mono text-xs uppercase tracking-widest text-neutral">No evidence found</p>
                    <button onClick={() => setShowAddModal(true)} className="mt-4 px-4 py-2 bg-ink text-newsprint font-sans text-[10px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors">
                        <Plus className="w-3 h-3 inline mr-1" strokeWidth={1.5} />Add first evidence
                    </button>
                </div>
            )}

            {/* ── Evidence List ── */}
            {filtered.length > 0 && (
                <div className="border border-ink mb-6">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Evidence Items</span>
                        <span className="ml-auto font-mono text-[9px] text-neutral">{filtered.length} items</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-ink bg-ink/[0.03]">
                                    <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">ID</th>
                                    <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Evidence</th>
                                    <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Case</th>
                                    <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Type</th>
                                    <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Status</th>
                                    <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Tags</th>
                                    <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((e) => (
                                    <tr key={e.id} onClick={() => setSelectedId(e.id)}
                                        className={`border-b border-ink/10 cursor-pointer transition-colors ${selectedId === e.id ? 'bg-ink/5' : 'hover:bg-ink/[0.03]'}`}>
                                        <td className="px-4 py-2.5 font-mono text-[10px] font-bold text-ink">{e.evidenceId}</td>
                                        <td className="px-4 py-2.5 font-sans text-[11px] font-semibold text-ink">{e.title}</td>
                                        <td className="px-4 py-2.5 text-[9px] font-mono text-neutral">{e.caseRef || "—"}</td>
                                        <td className="px-4 py-2.5 text-[10px] font-mono text-neutral capitalize">{e.type}</td>
                                        <td className="px-4 py-2.5 text-center">
                                            <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${getStatusColor(e.status)}`}>
                                                {e.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <div className="flex gap-1 flex-wrap">
                                                {(e.tags as string[]).slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1 py-0.5 text-neutral">{tag}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5 text-center">
                                            <button onClick={(ev) => { ev.stopPropagation(); handleDelete(e.id, e.title); }}
                                                className="text-neutral hover:text-accent transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Detail Panels ── */}
            {selectedItem && (
                <div className="grid grid-cols-1 lg:grid-cols-3 border border-ink">
                    {/* Chain of Custody */}
                    <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                        <div className="h-9 border-b border-ink px-4 flex items-center section-inverted">
                            <Shield className="w-3.5 h-3.5 mr-2 text-newsprint" strokeWidth={1.5} />
                            <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">Chain of Custody</span>
                            <button onClick={() => setShowCustodyModal(true)} className="ml-auto text-newsprint/70 hover:text-newsprint transition-colors">
                                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            {(selectedItem.chainOfCustody || []).length === 0 && (
                                <p className="font-mono text-[10px] text-neutral/50 uppercase">No custody records</p>
                            )}
                            {(selectedItem.chainOfCustody || []).map((c, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 ${i === (selectedItem.chainOfCustody || []).length - 1 ? 'bg-ink' : 'border border-ink'}`} />
                                        {i < (selectedItem.chainOfCustody || []).length - 1 && <div className="w-px h-8 bg-ink/20" />}
                                    </div>
                                    <div>
                                        <p className="font-sans text-[10px] font-bold text-ink uppercase">{c.action}</p>
                                        <p className="text-[9px] font-mono text-neutral">{c.handler} · {c.date}</p>
                                        <p className="text-[9px] font-mono text-neutral/60">{c.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                        <div className="h-9 border-b border-ink px-4 flex items-center">
                            <Eye className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                            <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Details</span>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <p className="font-mono text-[9px] text-neutral uppercase mb-0.5">Description</p>
                                <p className="font-sans text-[11px] text-ink">{selectedItem.description || "No description"}</p>
                            </div>
                            <div>
                                <p className="font-mono text-[9px] text-neutral uppercase mb-0.5">Collected</p>
                                <p className="font-sans text-[11px] text-ink">{selectedItem.collectedBy || "—"} · {selectedItem.collectedDate || "—"}</p>
                            </div>
                            <div>
                                <p className="font-mono text-[9px] text-neutral uppercase mb-0.5">Storage</p>
                                <p className="font-sans text-[11px] text-ink">{selectedItem.storageLocation || "—"}</p>
                            </div>
                            <div>
                                <p className="font-mono text-[9px] text-neutral uppercase mb-0.5">Status</p>
                                <select value={selectedItem.status} onChange={e => handleStatusChange(selectedItem.id, e.target.value)}
                                    className="border border-ink/30 bg-transparent font-mono text-[10px] px-2 py-1 outline-none text-ink">
                                    {statusOptions.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col">
                        <div className="h-9 border-b border-ink px-4 flex items-center">
                            <Link2 className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                            <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Metadata</span>
                        </div>
                        <div className="p-4 space-y-2">
                            {Object.entries(selectedItem.metadata || {}).map(([key, val]) => (
                                <div key={key} className="flex justify-between">
                                    <span className="font-mono text-[9px] text-neutral uppercase">{key}</span>
                                    <span className="font-mono text-[10px] text-ink">{String(val)}</span>
                                </div>
                            ))}
                            {Object.keys(selectedItem.metadata || {}).length === 0 && (
                                <p className="font-mono text-[10px] text-neutral/50 uppercase">No metadata</p>
                            )}
                            <div className="pt-2 mt-2 border-t border-ink/10">
                                <p className="font-mono text-[9px] text-neutral uppercase">Tags</p>
                                <div className="flex gap-1 flex-wrap mt-1">
                                    {(selectedItem.tags as string[]).map(tag => (
                                        <span key={tag} className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1.5 py-0.5 text-neutral">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Add Evidence Modal ── */}
            {showAddModal && (
                <>
                    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50" onClick={() => setShowAddModal(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <form onSubmit={handleAdd} className="bg-newsprint border border-ink/30 p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-serif text-xl font-bold text-ink">Add Evidence</h2>
                                <button type="button" onClick={() => setShowAddModal(false)} className="text-neutral hover:text-ink"><X className="w-4 h-4" strokeWidth={1.5} /></button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Evidence ID *</label>
                                    <input value={form.evidenceId} onChange={e => setForm(p => ({ ...p, evidenceId: e.target.value }))} placeholder="EVD-2024-011"
                                        className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none placeholder:text-neutral/50" required />
                                </div>
                                <div>
                                    <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Title *</label>
                                    <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Evidence title"
                                        className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none placeholder:text-neutral/50" required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Type</label>
                                        <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                                            className="w-full border border-ink/30 bg-transparent font-mono text-xs px-2 py-2 outline-none">
                                            {["physical", "digital", "documentary", "testimonial", "forensic"].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Case</label>
                                        <select value={form.caseRef} onChange={e => setForm(p => ({ ...p, caseRef: e.target.value }))}
                                            className="w-full border border-ink/30 bg-transparent font-mono text-xs px-2 py-2 outline-none">
                                            <option value="">None</option>
                                            {cases.map(c => <option key={c.caseId} value={c.caseId}>{c.caseId} — {c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Collected By</label>
                                        <input value={form.collectedBy} onChange={e => setForm(p => ({ ...p, collectedBy: e.target.value }))}
                                            className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none placeholder:text-neutral/50" />
                                    </div>
                                    <div>
                                        <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Collection Date</label>
                                        <input type="date" value={form.collectedDate} onChange={e => setForm(p => ({ ...p, collectedDate: e.target.value }))}
                                            className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Storage Location</label>
                                    <input value={form.storageLocation} onChange={e => setForm(p => ({ ...p, storageLocation: e.target.value }))}
                                        className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none placeholder:text-neutral/50" />
                                </div>
                                <div>
                                    <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Description</label>
                                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
                                        className="w-full border border-ink/30 bg-transparent font-mono text-sm px-2 py-2 outline-none resize-none" />
                                </div>
                                <div>
                                    <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Tags (comma-separated)</label>
                                    <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="forensic, DNA, critical"
                                        className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none placeholder:text-neutral/50" />
                                </div>
                            </div>
                            <button type="submit" className="mt-4 w-full py-2.5 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors">
                                Add Evidence
                            </button>
                        </form>
                    </div>
                </>
            )}

            {/* ── Add Custody Record Modal ── */}
            {showCustodyModal && selectedItem && (
                <>
                    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50" onClick={() => setShowCustodyModal(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <form onSubmit={handleAddCustody} className="bg-newsprint border border-ink/30 p-6 max-w-md w-full">
                            <h2 className="font-serif text-lg font-bold text-ink mb-4">Add Custody Record</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Handler *</label>
                                    <input value={custodyForm.handler} onChange={e => setCustodyForm(p => ({ ...p, handler: e.target.value }))}
                                        className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Action *</label>
                                    <input value={custodyForm.action} onChange={e => setCustodyForm(p => ({ ...p, action: e.target.value }))} placeholder="e.g. Collected, Analyzed, Filed"
                                        className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Date</label>
                                        <input type="date" value={custodyForm.date} onChange={e => setCustodyForm(p => ({ ...p, date: e.target.value }))}
                                            className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Location</label>
                                        <input value={custodyForm.location} onChange={e => setCustodyForm(p => ({ ...p, location: e.target.value }))}
                                            className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="mt-4 w-full py-2.5 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors">
                                Add Record
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
