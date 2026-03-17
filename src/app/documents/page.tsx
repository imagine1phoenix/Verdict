"use client";

import { useState, useEffect } from "react";
import {
    FileText, Search, FolderOpen, ChevronRight, Download, Plus, X,
    Trash2, Eye, Filter, Upload, Edit, Gavel, Scale, Handshake, Mail,
    BookOpen, Clock, Tag, CheckCircle, AlertTriangle
} from '@/components/Icons';
import { toast } from "react-hot-toast";

/* ─── Types ─── */

type Document = {
    id: number;
    title: string;
    caseRef: string | null;
    category: string;
    status: string;
    uploadedByName: string | null;
    fileUrl: string | null;
    fileType: string | null;
    fileSize: number | null;
    version: number;
    tags: string[];
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
};

type FilterCategory = "all" | "pleading" | "contract" | "evidence" | "correspondence" | "brief" | "motion" | "memo" | "other";

const categoryConfig: Record<string, { icon: typeof FileText; label: string }> = {
    pleading: { icon: Gavel, label: "Pleading" },
    contract: { icon: Handshake, label: "Contract" },
    evidence: { icon: Scale, label: "Evidence" },
    correspondence: { icon: Mail, label: "Correspondence" },
    brief: { icon: BookOpen, label: "Brief" },
    motion: { icon: Gavel, label: "Motion" },
    memo: { icon: FileText, label: "Memo" },
    other: { icon: FolderOpen, label: "Other" },
};

const statusOptions = ["draft", "review", "approved", "filed", "archived"];
const categoryOptions: FilterCategory[] = ["all", "pleading", "contract", "evidence", "correspondence", "brief", "motion", "memo", "other"];

/* ─── Component ─── */

export default function DocumentsPage() {
    const [docs, setDocs] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQ, setSearchQ] = useState("");
    const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [cases, setCases] = useState<{ caseId: string; name: string }[]>([]);

    // Form state
    const [form, setForm] = useState({
        title: "", caseRef: "", category: "pleading", status: "draft",
        uploadedByName: "", fileType: "pdf", tags: "",
    });

    useEffect(() => {
        fetchDocs();
        fetchCases();
    }, []);

    async function fetchDocs() {
        try {
            setLoading(true);
            const res = await fetch("/api/documents");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setDocs(data);
        } catch {
            toast.error("FAILED TO LOAD DOCUMENTS");
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
        if (!form.title.trim()) {
            toast.error("TITLE IS REQUIRED");
            return;
        }
        try {
            const res = await fetch("/api/documents", {
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
                throw new Error(err.error || "Failed");
            }
            const created = await res.json();
            setDocs(prev => [created, ...prev]);
            setShowAddModal(false);
            setForm({ title: "", caseRef: "", category: "pleading", status: "draft", uploadedByName: "", fileType: "pdf", tags: "" });
            toast.success("DOCUMENT CREATED");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "SOMETHING WENT WRONG";
            toast.error(msg.toUpperCase());
        }
    }

    async function handleStatusChange(docId: number, newStatus: string) {
        try {
            const res = await fetch("/api/documents", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: docId, status: newStatus }),
            });
            if (!res.ok) throw new Error("Failed");
            const updated = await res.json();
            setDocs(prev => prev.map(d => d.id === docId ? updated : d));
            if (selectedDoc?.id === docId) setSelectedDoc(updated);
            toast.success("STATUS UPDATED");
        } catch {
            toast.error("FAILED TO UPDATE");
        }
    }

    async function handleDelete(id: number, title: string) {
        if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/documents?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");
            setDocs(prev => prev.filter(d => d.id !== id));
            if (selectedDoc?.id === id) setSelectedDoc(null);
            toast.success("DOCUMENT DELETED");
        } catch {
            toast.error("FAILED TO DELETE");
        }
    }

    // Derived
    const filtered = docs.filter(d => {
        if (filterCategory !== "all" && d.category !== filterCategory) return false;
        if (filterStatus !== "all" && d.status !== filterStatus) return false;
        if (searchQ && !d.title.toLowerCase().includes(searchQ.toLowerCase())) return false;
        return true;
    });

    const categoryCounts = docs.reduce<Record<string, number>>((acc, d) => {
        acc[d.category] = (acc[d.category] || 0) + 1;
        return acc;
    }, {});

    const statusCounts = docs.reduce<Record<string, number>>((acc, d) => {
        acc[d.status] = (acc[d.status] || 0) + 1;
        return acc;
    }, {});

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": case "filed": return "border-green-600 text-green-700";
            case "review": return "border-yellow-600 text-yellow-700";
            case "archived": return "border-ink/30 text-neutral";
            default: return "border-ink/50 text-ink";
        }
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return "—";
        if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
        return `${Math.round(bytes / 1000)} KB`;
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto pb-12">
                <div className="border-b-[4px] border-ink pb-5 mb-6">
                    <div className="h-8 w-48 bg-ink/10 animate-pulse mb-2" />
                    <div className="h-4 w-96 bg-ink/10 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="border border-ink/20 p-4">
                            <div className="h-4 w-48 bg-ink/10 animate-pulse mb-2" />
                            <div className="h-3 w-32 bg-ink/10 animate-pulse mb-2" />
                            <div className="h-3 w-20 bg-ink/10 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12">

            {/* ── Header ── */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center">
                            <FileText className="w-6 h-6 mr-3" strokeWidth={1.5} />
                            Documents
                        </h1>
                        <p className="text-sm font-sans text-neutral">{docs.length} documents across {Object.keys(categoryCounts).length} categories</p>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-ink text-newsprint hover:bg-ink/90 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider shrink-0">
                        <Plus className="w-3 h-3 mr-1.5" strokeWidth={1.5} />New Document
                    </button>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-5 border border-ink mb-6">
                {statusOptions.map((s, i) => (
                    <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
                        className={`py-3 text-center font-mono transition-colors ${i < 4 ? 'border-r border-ink' : ''} ${filterStatus === s ? 'bg-ink text-newsprint' : 'hover:bg-ink/5'}`}>
                        <p className="text-lg font-bold">{statusCounts[s] || 0}</p>
                        <p className="text-[9px] uppercase tracking-widest text-neutral">{s}</p>
                    </button>
                ))}
            </div>

            {/* ── Search + Filter ── */}
            <div className="flex gap-3 mb-6">
                <div className="flex-1 border border-ink flex items-center px-4">
                    <Search className="w-4 h-4 text-neutral mr-3" strokeWidth={1.5} />
                    <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                        placeholder="SEARCH DOCUMENTS..."
                        className="flex-1 py-2.5 bg-transparent font-mono text-xs text-ink outline-none placeholder:text-neutral/50 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-wider" />
                </div>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as FilterCategory)}
                    className="border border-ink bg-transparent font-mono text-[10px] uppercase tracking-wider px-3 py-2 outline-none text-ink">
                    {categoryOptions.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
                </select>
            </div>

            {/* ── Empty state ── */}
            {filtered.length === 0 && (
                <div className="border border-ink p-12 text-center mb-6">
                    <FileText className="w-8 h-8 text-neutral/40 mx-auto mb-3" strokeWidth={1.5} />
                    <p className="font-mono text-xs uppercase tracking-widest text-neutral">No documents found</p>
                    <button onClick={() => setShowAddModal(true)} className="mt-4 px-4 py-2 bg-ink text-newsprint font-sans text-[10px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors">
                        <Plus className="w-3 h-3 inline mr-1" strokeWidth={1.5} />Create first document
                    </button>
                </div>
            )}

            {/* ── Document List ── */}
            {filtered.length > 0 && (
                <div className="grid grid-cols-1 gap-0 border border-ink mb-6">
                    <div className="h-9 border-b border-ink px-4 flex items-center bg-ink/[0.03]">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Documents</span>
                        <span className="ml-auto font-mono text-[9px] text-neutral">{filtered.length} results</span>
                    </div>
                    {filtered.map((doc) => {
                        const catCfg = categoryConfig[doc.category] || categoryConfig.other;
                        const CatIcon = catCfg.icon;
                        return (
                            <div key={doc.id} onClick={() => setSelectedDoc(doc)}
                                className={`border-b border-ink/10 last:border-b-0 px-4 py-3 flex items-center gap-4 cursor-pointer transition-colors ${selectedDoc?.id === doc.id ? 'bg-ink/5' : 'hover:bg-ink/[0.03]'}`}>
                                <div className="w-8 h-8 border border-ink/30 flex items-center justify-center shrink-0">
                                    <CatIcon className="w-4 h-4 text-ink" strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-sans text-[12px] font-bold text-ink truncate">{doc.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="font-mono text-[9px] text-neutral uppercase">{catCfg.label}</span>
                                        {doc.caseRef && (
                                            <>
                                                <span className="text-neutral/30">·</span>
                                                <span className="font-mono text-[9px] text-neutral">{doc.caseRef}</span>
                                            </>
                                        )}
                                        {doc.uploadedByName && (
                                            <>
                                                <span className="text-neutral/30">·</span>
                                                <span className="font-mono text-[9px] text-neutral">{doc.uploadedByName}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    {doc.fileType && (
                                        <span className="font-mono text-[9px] text-neutral uppercase">{doc.fileType}</span>
                                    )}
                                    <span className="font-mono text-[9px] text-neutral">{formatFileSize(doc.fileSize)}</span>
                                    <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${getStatusColor(doc.status)}`}>
                                        {doc.status}
                                    </span>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(doc.id, doc.title); }}
                                        className="text-neutral/50 hover:text-accent transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Document Detail Panel ── */}
            {selectedDoc && (
                <div className="border border-ink mb-6">
                    <div className="h-9 border-b border-ink px-4 flex items-center section-inverted">
                        <FileText className="w-3.5 h-3.5 mr-2 text-newsprint" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">{selectedDoc.title}</span>
                        <button onClick={() => setSelectedDoc(null)} className="ml-auto text-newsprint/70 hover:text-newsprint">
                            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10 p-4">
                        <div className="pr-4 space-y-2">
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">Category</span><span className="font-sans text-[11px] text-ink capitalize">{selectedDoc.category}</span></div>
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">Case</span><span className="font-sans text-[11px] text-ink">{selectedDoc.caseRef || "—"}</span></div>
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">Uploaded By</span><span className="font-sans text-[11px] text-ink">{selectedDoc.uploadedByName || "—"}</span></div>
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">Version</span><span className="font-sans text-[11px] text-ink">v{selectedDoc.version}</span></div>
                        </div>
                        <div className="px-4 py-2 md:py-0 space-y-2">
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">File Type</span><span className="font-sans text-[11px] text-ink uppercase">{selectedDoc.fileType || "—"}</span></div>
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">File Size</span><span className="font-sans text-[11px] text-ink">{formatFileSize(selectedDoc.fileSize)}</span></div>
                            <div>
                                <span className="font-mono text-[9px] text-neutral uppercase block">Status</span>
                                <select value={selectedDoc.status} onChange={e => handleStatusChange(selectedDoc.id, e.target.value)}
                                    className="border border-ink/30 bg-transparent font-mono text-[10px] px-2 py-1 outline-none text-ink mt-0.5">
                                    {statusOptions.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="pl-4 py-2 md:py-0 space-y-2">
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">Tags</span>
                                <div className="flex gap-1 flex-wrap mt-0.5">
                                    {(selectedDoc.tags as string[]).map(tag => (
                                        <span key={tag} className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1.5 py-0.5 text-neutral">{tag}</span>
                                    ))}
                                    {(selectedDoc.tags as string[]).length === 0 && <span className="font-mono text-[10px] text-neutral/50">No tags</span>}
                                </div>
                            </div>
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">Metadata</span>
                                {Object.entries(selectedDoc.metadata || {}).map(([k, v]) => (
                                    <div key={k} className="flex justify-between mt-0.5">
                                        <span className="font-mono text-[9px] text-neutral capitalize">{k}</span>
                                        <span className="font-mono text-[10px] text-ink">{String(v)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Add Document Modal ── */}
            {showAddModal && (
                <>
                    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50" onClick={() => setShowAddModal(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <form onSubmit={handleAdd} className="bg-newsprint border border-ink/30 p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-serif text-xl font-bold text-ink">New Document</h2>
                                <button type="button" onClick={() => setShowAddModal(false)} className="text-neutral hover:text-ink"><X className="w-4 h-4" strokeWidth={1.5} /></button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Title *</label>
                                    <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Document title"
                                        className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none placeholder:text-neutral/50" required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Category *</label>
                                        <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                            className="w-full border border-ink/30 bg-transparent font-mono text-xs px-2 py-2 outline-none">
                                            {Object.entries(categoryConfig).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Status</label>
                                        <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                                            className="w-full border border-ink/30 bg-transparent font-mono text-xs px-2 py-2 outline-none">
                                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Case</label>
                                    <select value={form.caseRef} onChange={e => setForm(p => ({ ...p, caseRef: e.target.value }))}
                                        className="w-full border border-ink/30 bg-transparent font-mono text-xs px-2 py-2 outline-none">
                                        <option value="">None</option>
                                        {cases.map(c => <option key={c.caseId} value={c.caseId}>{c.caseId} — {c.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Uploaded By</label>
                                        <input value={form.uploadedByName} onChange={e => setForm(p => ({ ...p, uploadedByName: e.target.value }))}
                                            placeholder="Adv. Prit Thacker"
                                            className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none placeholder:text-neutral/50" />
                                    </div>
                                    <div>
                                        <label className="font-mono text-[9px] text-neutral uppercase block mb-1">File Type</label>
                                        <select value={form.fileType} onChange={e => setForm(p => ({ ...p, fileType: e.target.value }))}
                                            className="w-full border border-ink/30 bg-transparent font-mono text-xs px-2 py-2 outline-none">
                                            {["pdf", "docx", "xlsx", "img", "other"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="font-mono text-[9px] text-neutral uppercase block mb-1">Tags (comma-separated)</label>
                                    <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="criminal, chargesheet, filing"
                                        className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none placeholder:text-neutral/50" />
                                </div>
                            </div>
                            <button type="submit" className="mt-4 w-full py-2.5 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors">
                                Create Document
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
