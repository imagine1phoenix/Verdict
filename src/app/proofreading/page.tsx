"use client";

import { useState, useEffect } from "react";
import { FileSearch, Plus, X, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

type ProofJob = {
    id: number; documentTitle: string | null; submittedByName: string | null; status: string; priority: string;
    assignedTo: string | null; originalText: string | null; correctedText: string | null;
    comments: { author: string; text: string; resolved: boolean }[]; issuesFound: number;
    dueDate: string | null; completedAt: string | null; createdAt: string;
};

const statusOpts = ["pending", "in-progress", "completed", "revision-needed"];
const priorityOpts = ["Low", "Medium", "High", "Critical"];
const reviewers = ["Adv. Prit Thacker", "Adv. Meera Shah", "Ravi Kumar", "Adv. Priya Desai"];

export default function ProofreadingPage() {
    const [jobs, setJobs] = useState<ProofJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [selId, setSelId] = useState<number | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [filt, setFilt] = useState("all");
    const [form, setForm] = useState({ documentTitle: "", submittedByName: "", priority: "Medium", assignedTo: "", originalText: "", dueDate: "" });

    useEffect(() => { fetch("/api/proofreading").then(r => r.json()).then(d => { setJobs(d); setLoading(false); }).catch(() => { toast.error("FAILED TO LOAD"); setLoading(false); }); }, []);

    const api = async (method: string, body?: object, qs?: string) => {
        const res = await fetch(`/api/proofreading${qs || ""}`, { method, ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}) });
        if (!res.ok) throw new Error((await res.json()).error || "Failed");
        return res.json();
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.documentTitle.trim()) { toast.error("TITLE REQUIRED"); return; }
        try { const c = await api("POST", { ...form, assignedTo: form.assignedTo || null }); setJobs(p => [c, ...p]); setShowAdd(false); setForm({ documentTitle: "", submittedByName: "", priority: "Medium", assignedTo: "", originalText: "", dueDate: "" }); toast.success("JOB CREATED"); }
        catch (err: unknown) { toast.error(err instanceof Error ? err.message : "FAILED"); }
    };

    const updateStatus = async (id: number, status: string) => { try { const u = await api("PATCH", { id, status }); setJobs(p => p.map(j => j.id === id ? u : j)); toast.success("UPDATED"); } catch { toast.error("FAILED"); } };
    const assign = async (id: number, name: string) => { try { const u = await api("PATCH", { id, assignedTo: name, status: "in-progress" }); setJobs(p => p.map(j => j.id === id ? u : j)); toast.success("ASSIGNED"); } catch { toast.error("FAILED"); } };
    const del = async (id: number, t: string) => { if (!confirm(`Delete "${t}"?`)) return; try { await api("DELETE", undefined, `?id=${id}`); setJobs(p => p.filter(j => j.id !== id)); if (selId === id) setSelId(null); toast.success("DELETED"); } catch { toast.error("FAILED"); } };

    const filtered = jobs.filter(j => filt === "all" || j.status === filt);
    const sel = jobs.find(j => j.id === selId) || null;
    const sColor = (s: string) => s === "completed" ? "border-green-600 text-green-700" : s === "in-progress" ? "border-yellow-600 text-yellow-700" : s === "revision-needed" ? "border-accent text-accent" : "border-ink/50 text-ink";
    const pColor = (p: string) => p === "Critical" ? "border-accent text-accent" : p === "High" ? "border-yellow-600 text-yellow-700" : "border-ink/30 text-neutral";

    if (loading) return <div className="max-w-5xl mx-auto pb-12"><div className="border-b-[4px] border-ink pb-5 mb-6"><div className="h-8 w-48 bg-ink/10 animate-pulse mb-2" /><div className="h-4 w-96 bg-ink/10 animate-pulse" /></div>{[1, 2, 3].map(i => <div key={i} className="border border-ink/20 p-4 mb-3"><div className="h-5 w-64 bg-ink/10 animate-pulse" /></div>)}</div>;

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="border-b-[4px] border-ink pb-5 mb-6"><div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div><h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center"><FileSearch className="w-6 h-6 mr-3" strokeWidth={1.5} />Proofreading</h1><p className="text-sm font-sans text-neutral">{jobs.length} jobs</p></div>
                <button onClick={() => setShowAdd(true)} className="flex items-center px-4 py-2 bg-ink text-newsprint hover:bg-ink/90 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider"><Plus className="w-3 h-3 mr-1.5" strokeWidth={1.5} />Submit for Review</button>
            </div></div>

            <div className="flex border border-ink mb-6">
                {["all", ...statusOpts].map((s, i) => <button key={s} onClick={() => setFilt(s)} className={`flex-1 py-2.5 text-center font-sans text-[10px] font-bold uppercase tracking-wider transition-colors ${i < statusOpts.length ? "border-r border-ink" : ""} ${filt === s ? "bg-ink text-newsprint" : "text-neutral hover:bg-ink/5"}`}>{s === "all" ? `All (${jobs.length})` : `${s} (${jobs.filter(j => j.status === s).length})`}</button>)}
            </div>

            {filtered.length === 0 && <div className="border border-ink p-12 text-center"><FileSearch className="w-8 h-8 text-neutral/40 mx-auto mb-3" strokeWidth={1.5} /><p className="font-mono text-xs uppercase tracking-widest text-neutral">No jobs found</p></div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                <div className={`${sel ? "lg:col-span-1" : "lg:col-span-3"} border border-ink`}>
                    <div className="h-9 border-b border-ink px-4 flex items-center"><span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Jobs</span><span className="ml-auto font-mono text-[9px] text-neutral">{filtered.length}</span></div>
                    <div className="divide-y divide-ink/10 max-h-[600px] overflow-y-auto">
                        {filtered.map(j => <div key={j.id} onClick={() => setSelId(j.id)} className={`px-4 py-3 cursor-pointer transition-colors ${selId === j.id ? "bg-ink/5" : "hover:bg-ink/[0.03]"}`}>
                            <div className="flex items-start justify-between"><p className="font-sans text-[11px] font-bold text-ink flex-1 truncate">{j.documentTitle}</p><span className={`border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider shrink-0 ml-2 ${sColor(j.status)}`}>{j.status}</span></div>
                            <div className="flex items-center gap-2 mt-1"><span className={`border px-1 py-0 font-mono text-[8px] uppercase ${pColor(j.priority)}`}>{j.priority}</span>{j.assignedTo && <span className="font-mono text-[9px] text-neutral">{j.assignedTo}</span>}{j.dueDate && <span className="font-mono text-[9px] text-neutral ml-auto">{j.dueDate}</span>}</div>
                        </div>)}
                    </div>
                </div>

                {sel && <div className="lg:col-span-2 border border-ink lg:border-l-0">
                    <div className="h-9 border-b border-ink px-4 flex items-center section-inverted"><span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint truncate">{sel.documentTitle}</span><button onClick={() => setSelId(null)} className="ml-auto text-newsprint/70 hover:text-newsprint"><X className="w-3.5 h-3.5" strokeWidth={1.5} /></button></div>
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">Status</span><select value={sel.status} onChange={e => updateStatus(sel.id, e.target.value)} className="border border-ink/30 bg-transparent font-mono text-[10px] px-2 py-1 outline-none w-full mt-0.5">{statusOpts.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">Priority</span><span className={`border px-2 py-0.5 font-mono text-[9px] uppercase mt-0.5 inline-block ${pColor(sel.priority)}`}>{sel.priority}</span></div>
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">Issues</span><p className="font-mono text-lg font-bold text-ink">{sel.issuesFound}</p></div>
                            <div><span className="font-mono text-[9px] text-neutral uppercase block">Submitted By</span><p className="font-sans text-[11px] text-ink">{sel.submittedByName || "—"}</p></div>
                        </div>

                        {!sel.assignedTo && <div className="border border-ink/20 p-3"><span className="font-mono text-[9px] text-neutral uppercase block mb-1">Assign Reviewer</span><div className="flex gap-2 flex-wrap">{reviewers.map(n => <button key={n} onClick={() => assign(sel.id, n)} className="border border-ink/30 px-2 py-1 font-mono text-[9px] hover:bg-ink hover:text-newsprint transition-colors">{n}</button>)}</div></div>}
                        {sel.assignedTo && <div><span className="font-mono text-[9px] text-neutral uppercase block">Assigned To</span><p className="font-sans text-[11px] text-ink font-bold">{sel.assignedTo}</p></div>}

                        {sel.originalText && <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="border border-ink/20 p-3"><span className="font-mono text-[9px] text-neutral uppercase block mb-1">Original</span><p className="font-serif text-[11px] text-ink leading-relaxed">{sel.originalText}</p></div>
                            <div className="border border-ink/20 p-3"><span className="font-mono text-[9px] text-neutral uppercase block mb-1">{sel.correctedText ? "Corrected" : "Pending"}</span><p className="font-serif text-[11px] text-ink leading-relaxed">{sel.correctedText || "No corrections yet."}</p></div>
                        </div>}

                        {(sel.comments as { author: string; text: string; resolved: boolean }[]).length > 0 && <div><span className="font-mono text-[9px] text-neutral uppercase block mb-1">Comments</span>{(sel.comments as { author: string; text: string; resolved: boolean }[]).map((c, i) => <div key={i} className="border-l-2 border-ink/30 pl-3 mb-2"><p className="font-sans text-[11px] text-ink">{c.text}</p><p className="font-mono text-[9px] text-neutral mt-0.5">— {c.author} · {c.resolved ? "✓" : "Pending"}</p></div>)}</div>}

                        <button onClick={() => del(sel.id, sel.documentTitle || "job")} className="text-[10px] font-mono text-accent hover:underline uppercase">Delete</button>
                    </div>
                </div>}
            </div>

            {showAdd && <>
                <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50" onClick={() => setShowAdd(false)} />
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleAdd} className="bg-newsprint border border-ink/30 p-6 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4"><h2 className="font-serif text-xl font-bold text-ink">Submit for Review</h2><button type="button" onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-neutral" strokeWidth={1.5} /></button></div>
                        <div className="space-y-3">
                            <div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Document Title *</label><input value={form.documentTitle} onChange={e => setForm(p => ({ ...p, documentTitle: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" required /></div>
                            <div className="grid grid-cols-2 gap-3"><div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Submitted By</label><input value={form.submittedByName} onChange={e => setForm(p => ({ ...p, submittedByName: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" /></div><div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Priority</label><select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full border border-ink/30 bg-transparent font-mono text-xs px-2 py-2 outline-none">{priorityOpts.map(p => <option key={p} value={p}>{p}</option>)}</select></div></div>
                            <div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Due Date</label><input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" /></div>
                            <div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Text to Review</label><textarea value={form.originalText} onChange={e => setForm(p => ({ ...p, originalText: e.target.value }))} rows={3} className="w-full border border-ink/30 bg-transparent font-mono text-sm px-2 py-2 outline-none resize-none" /></div>
                        </div>
                        <button type="submit" className="mt-4 w-full py-2.5 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors">Submit</button>
                    </form>
                </div>
            </>}
        </div>
    );
}
