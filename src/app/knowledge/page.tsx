"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, Plus, X, Trash2, Pin, Eye, Tag } from "lucide-react";
import { toast } from "react-hot-toast";

type Article = {
    id: number; title: string; category: string; content: string | null; summary: string | null;
    author: string | null; tags: string[]; references: { title: string; url: string; type: string }[];
    views: number; isPinned: boolean; createdAt: string; updatedAt: string;
};

const cats = ["all", "statute", "case-law", "procedure", "guide", "template"];

export default function KnowledgePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [selId, setSelId] = useState<number | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [fCat, setFCat] = useState("all");
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({ title: "", category: "guide", content: "", summary: "", author: "", tags: "" });

    useEffect(() => { fetch("/api/knowledge").then(r => r.json()).then(d => { setArticles(d); setLoading(false); }).catch(() => { toast.error("FAILED TO LOAD"); setLoading(false); }); }, []);

    const api = async (m: string, b?: object, q?: string) => { const r = await fetch(`/api/knowledge${q || ""}`, { method: m, ...(b ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) } : {}) }); if (!r.ok) throw new Error((await r.json()).error); return r.json(); };

    const add = async (e: React.FormEvent) => {
        e.preventDefault(); if (!form.title.trim()) { toast.error("TITLE REQUIRED"); return; }
        try { const c = await api("POST", { ...form, tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [] }); setArticles(p => [c, ...p]); setShowAdd(false); setForm({ title: "", category: "guide", content: "", summary: "", author: "", tags: "" }); toast.success("ARTICLE CREATED"); } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "FAILED"); }
    };

    const togglePin = async (id: number, current: boolean) => { try { const u = await api("PATCH", { id, isPinned: !current }); setArticles(p => p.map(a => a.id === id ? u : a)); toast.success(u.isPinned ? "PINNED" : "UNPINNED"); } catch { toast.error("FAILED"); } };
    const del = async (id: number) => { if (!confirm("Delete this article?")) return; try { await api("DELETE", undefined, `?id=${id}`); setArticles(p => p.filter(a => a.id !== id)); if (selId === id) setSelId(null); toast.success("DELETED"); } catch { toast.error("FAILED"); } };
    const incView = async (id: number) => { try { await api("PATCH", { id }, "?view=true"); setArticles(p => p.map(a => a.id === id ? { ...a, views: a.views + 1 } : a)); } catch { /* silent */ } };

    const filtered = articles.filter(a => { if (fCat !== "all" && a.category !== fCat) return false; if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false; return true; });
    const pinned = filtered.filter(a => a.isPinned);
    const unpinned = filtered.filter(a => !a.isPinned);
    const sel = articles.find(a => a.id === selId) || null;

    if (loading) return <div className="max-w-5xl mx-auto pb-12"><div className="border-b-[4px] border-ink pb-5 mb-6"><div className="h-8 w-48 bg-ink/10 animate-pulse mb-2" /><div className="h-4 w-96 bg-ink/10 animate-pulse" /></div>{[1, 2, 3].map(i => <div key={i} className="border border-ink/20 p-4 mb-3"><div className="h-5 w-64 bg-ink/10 animate-pulse" /></div>)}</div>;

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="border-b-[4px] border-ink pb-5 mb-6"><div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div><h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center"><BookOpen className="w-6 h-6 mr-3" strokeWidth={1.5} />Knowledge Base</h1><p className="text-sm font-sans text-neutral">{articles.length} articles</p></div>
                <button onClick={() => setShowAdd(true)} className="flex items-center px-4 py-2 bg-ink text-newsprint hover:bg-ink/90 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider"><Plus className="w-3 h-3 mr-1.5" strokeWidth={1.5} />New Article</button>
            </div></div>

            <div className="flex gap-3 mb-6">
                <div className="flex-1 border border-ink flex items-center px-4"><Search className="w-4 h-4 text-neutral mr-3" strokeWidth={1.5} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="SEARCH ARTICLES..." className="flex-1 py-2.5 bg-transparent font-mono text-xs text-ink outline-none placeholder:text-neutral/50 placeholder:uppercase placeholder:text-[10px]" /></div>
                <select value={fCat} onChange={e => setFCat(e.target.value)} className="border border-ink bg-transparent font-mono text-[10px] uppercase tracking-wider px-3 py-2 outline-none">{cats.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}</select>
            </div>

            {filtered.length === 0 && <div className="border border-ink p-12 text-center"><BookOpen className="w-8 h-8 text-neutral/40 mx-auto mb-3" strokeWidth={1.5} /><p className="font-mono text-xs uppercase tracking-widest text-neutral">No articles found</p></div>}

            {/* Pinned */}
            {pinned.length > 0 && <div className="mb-4"><span className="font-mono text-[9px] text-neutral uppercase tracking-widest block mb-2">📌 Pinned</span><div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pinned.map(a => <div key={a.id} onClick={() => { setSelId(a.id); incView(a.id); }} className={`border border-ink p-4 cursor-pointer transition-colors ${selId === a.id ? "bg-ink/5" : "hover:bg-ink/[0.03]"}`}>
                    <div className="flex justify-between"><p className="font-sans text-sm font-bold text-ink">{a.title}</p><Pin className="w-3.5 h-3.5 text-ink shrink-0" strokeWidth={1.5} /></div>
                    <p className="font-mono text-[9px] text-neutral uppercase mt-1">{a.category} · {a.views} views</p>
                    {a.summary && <p className="font-sans text-[11px] text-neutral mt-1 line-clamp-2">{a.summary}</p>}
                </div>)}
            </div></div>}

            {/* Unpinned */}
            {unpinned.length > 0 && <div className="border border-ink mb-6">
                <div className="h-9 border-b border-ink px-4 flex items-center"><span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Articles</span><span className="ml-auto font-mono text-[9px] text-neutral">{unpinned.length}</span></div>
                <div className="divide-y divide-ink/10">
                    {unpinned.map(a => <div key={a.id} onClick={() => { setSelId(a.id); incView(a.id); }} className={`px-4 py-3 cursor-pointer transition-colors ${selId === a.id ? "bg-ink/5" : "hover:bg-ink/[0.03]"}`}>
                        <div className="flex items-center gap-3"><p className="font-sans text-[12px] font-bold text-ink flex-1">{a.title}</p><span className="font-mono text-[9px] text-neutral uppercase">{a.category}</span><span className="font-mono text-[9px] text-neutral flex items-center"><Eye className="w-3 h-3 mr-1" strokeWidth={1.5} />{a.views}</span></div>
                        {a.summary && <p className="font-sans text-[10px] text-neutral mt-0.5 truncate">{a.summary}</p>}
                    </div>)}
                </div>
            </div>}

            {/* Detail */}
            {sel && <div className="border border-ink mb-6">
                <div className="h-9 border-b border-ink px-4 flex items-center section-inverted"><span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint truncate">{sel.title}</span><button onClick={() => setSelId(null)} className="ml-auto text-newsprint/70 hover:text-newsprint"><X className="w-3.5 h-3.5" strokeWidth={1.5} /></button></div>
                <div className="p-4 space-y-3">
                    <div className="flex gap-2"><span className="font-mono text-[9px] border border-ink/30 px-2 py-0.5 uppercase">{sel.category}</span>{sel.author && <span className="font-mono text-[9px] text-neutral">{sel.author}</span>}<span className="font-mono text-[9px] text-neutral flex items-center"><Eye className="w-3 h-3 mr-1" strokeWidth={1.5} />{sel.views}</span></div>
                    {sel.content && <div className="border border-ink/10 p-4 font-serif text-sm text-ink leading-relaxed whitespace-pre-wrap">{sel.content}</div>}
                    {(sel.tags as string[]).length > 0 && <div className="flex gap-1 flex-wrap">{(sel.tags as string[]).map(t => <span key={t} className="text-[8px] font-sans font-bold uppercase tracking-wider border border-ink/30 px-1.5 py-0.5 text-neutral">{t}</span>)}</div>}
                    {(sel.references as { title: string; url: string; type: string }[]).length > 0 && <div><span className="font-mono text-[9px] text-neutral uppercase block mb-1">References</span>{(sel.references as { title: string; url: string; type: string }[]).map((r, i) => <div key={i} className="font-mono text-[10px] text-ink">{r.title} — <span className="text-neutral">{r.type}</span></div>)}</div>}
                    <div className="flex gap-2">
                        <button onClick={() => togglePin(sel.id, sel.isPinned)} className="text-[10px] font-mono text-ink hover:underline uppercase">{sel.isPinned ? "Unpin" : "Pin"}</button>
                        <button onClick={() => del(sel.id)} className="text-[10px] font-mono text-accent hover:underline uppercase">Delete</button>
                    </div>
                </div>
            </div>}

            {showAdd && <>
                <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50" onClick={() => setShowAdd(false)} />
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <form onSubmit={add} className="bg-newsprint border border-ink/30 p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4"><h2 className="font-serif text-xl font-bold text-ink">New Article</h2><button type="button" onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-neutral" /></button></div>
                        <div className="space-y-3">
                            <div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" required /></div>
                            <div className="grid grid-cols-2 gap-3"><div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Category</label><select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full border border-ink/30 bg-transparent font-mono text-xs px-2 py-2 outline-none">{cats.filter(c => c !== "all").map(c => <option key={c} value={c}>{c}</option>)}</select></div><div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Author</label><input value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" /></div></div>
                            <div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Summary</label><input value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" /></div>
                            <div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Content</label><textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} className="w-full border border-ink/30 bg-transparent font-mono text-sm px-2 py-2 outline-none resize-none" /></div>
                            <div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Tags</label><input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="tag1, tag2" className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none placeholder:text-neutral/50" /></div>
                        </div>
                        <button type="submit" className="mt-4 w-full py-2.5 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors">Create Article</button>
                    </form>
                </div>
            </>}
        </div>
    );
}
