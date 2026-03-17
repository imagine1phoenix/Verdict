"use client";

import { useState, useEffect } from "react";
import { Gavel, Search, Trash2, ChevronRight, ChevronDown, Trophy, XCircle, Handshake, AlertTriangle, Plus, X } from '@/components/Icons';
import { toast } from "react-hot-toast";

type PastTrial = {
    id: number; caseRef: string | null; caseName: string; court: string | null; judge: string | null;
    verdict: string; dateConcluded: string | null; durationDays: number | null; leadAttorney: string | null;
    team: { name: string; role: string }[]; summary: string | null; keyArguments: string[];
    opposingCounsel: string | null; lessonsLearned: string | null; documents: { name: string; url: string }[];
    createdAt: string;
};

const verdictIcons: Record<string, typeof Trophy> = { won: Trophy, lost: XCircle, settled: Handshake, dismissed: AlertTriangle };
const verdictColors: Record<string, string> = { won: "border-green-600 text-green-700", lost: "border-accent text-accent", settled: "border-yellow-600 text-yellow-700", dismissed: "border-ink/50 text-ink" };

export default function PastTrialsPage() {
    const [trials, setTrials] = useState<PastTrial[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [fVerdict, setFVerdict] = useState("all");
    const [search, setSearch] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ caseName: "", court: "", judge: "", verdict: "won", dateConcluded: "", durationDays: "", leadAttorney: "", summary: "", opposingCounsel: "", lessonsLearned: "" });

    useEffect(() => { fetch("/api/past-trials").then(r => r.json()).then(d => { setTrials(d); setLoading(false); }).catch(() => { toast.error("FAILED TO LOAD"); setLoading(false); }); }, []);

    const add = async (e: React.FormEvent) => {
        e.preventDefault(); if (!form.caseName.trim()) { toast.error("CASE NAME REQUIRED"); return; }
        try { const r = await fetch("/api/past-trials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, durationDays: form.durationDays ? Number(form.durationDays) : null }) }); if (!r.ok) throw new Error(); const c = await r.json(); setTrials(p => [c, ...p]); setShowAdd(false); setForm({ caseName: "", court: "", judge: "", verdict: "won", dateConcluded: "", durationDays: "", leadAttorney: "", summary: "", opposingCounsel: "", lessonsLearned: "" }); toast.success("TRIAL RECORD ADDED"); } catch { toast.error("FAILED TO CREATE"); }
    };

    const del = async (id: number) => { if (!confirm("Delete this trial record?")) return; try { await fetch(`/api/past-trials?id=${id}`, { method: "DELETE" }); setTrials(p => p.filter(t => t.id !== id)); if (expanded === id) setExpanded(null); toast.success("DELETED"); } catch { toast.error("FAILED"); } };

    const filtered = trials.filter(t => { if (fVerdict !== "all" && t.verdict !== fVerdict) return false; if (search && !t.caseName.toLowerCase().includes(search.toLowerCase())) return false; return true; });
    const stats = { total: trials.length, won: trials.filter(t => t.verdict === "won").length, lost: trials.filter(t => t.verdict === "lost").length, settled: trials.filter(t => t.verdict === "settled").length };
    const winRate = stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0;

    if (loading) return <div className="max-w-5xl mx-auto pb-12"><div className="border-b-[4px] border-ink pb-5 mb-6"><div className="h-8 w-48 bg-ink/10 animate-pulse mb-2" /><div className="h-4 w-96 bg-ink/10 animate-pulse" /></div>{[1, 2, 3].map(i => <div key={i} className="border border-ink/20 p-4 mb-3"><div className="h-5 w-64 bg-ink/10 animate-pulse" /></div>)}</div>;

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="border-b-[4px] border-ink pb-5 mb-6"><div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div><h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center"><Gavel className="w-6 h-6 mr-3" strokeWidth={1.5} />Past Trials</h1><p className="text-sm font-sans text-neutral">{trials.length} trial records · {winRate}% win rate</p></div>
                <button onClick={() => setShowAdd(true)} className="flex items-center px-4 py-2 bg-ink text-newsprint hover:bg-ink/90 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider"><Plus className="w-3 h-3 mr-1.5" strokeWidth={1.5} />Add Record</button>
            </div></div>

            {/* Stats */}
            <div className="grid grid-cols-4 border border-ink mb-6">
                {[{ label: "Total", val: stats.total }, { label: "Won", val: stats.won }, { label: "Lost", val: stats.lost }, { label: "Settled", val: stats.settled }].map((s, i) => (
                    <div key={s.label} className={`py-3 text-center ${i < 3 ? "border-r border-ink" : ""}`}><p className="font-mono text-lg font-bold text-ink">{s.val}</p><p className="text-[9px] font-mono text-neutral uppercase tracking-widest">{s.label}</p></div>
                ))}
            </div>

            <div className="flex gap-3 mb-6">
                <div className="flex-1 border border-ink flex items-center px-4"><Search className="w-4 h-4 text-neutral mr-3" strokeWidth={1.5} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="SEARCH CASES..." className="flex-1 py-2.5 bg-transparent font-mono text-xs text-ink outline-none placeholder:text-neutral/50 placeholder:uppercase placeholder:text-[10px]" /></div>
                <select value={fVerdict} onChange={e => setFVerdict(e.target.value)} className="border border-ink bg-transparent font-mono text-[10px] uppercase tracking-wider px-3 py-2 outline-none">{["all", "won", "lost", "settled", "dismissed"].map(v => <option key={v} value={v}>{v === "all" ? "All" : v}</option>)}</select>
            </div>

            {filtered.length === 0 && <div className="border border-ink p-12 text-center"><Gavel className="w-8 h-8 text-neutral/40 mx-auto mb-3" strokeWidth={1.5} /><p className="font-mono text-xs uppercase tracking-widest text-neutral">No trial records found</p></div>}

            <div className="space-y-3">
                {filtered.map(t => {
                    const VIcon = verdictIcons[t.verdict] || AlertTriangle; return (
                        <div key={t.id} className="border border-ink">
                            <div onClick={() => setExpanded(expanded === t.id ? null : t.id)} className={`px-4 py-3 flex items-center gap-4 cursor-pointer transition-colors ${expanded === t.id ? "bg-ink/5" : "hover:bg-ink/[0.03]"}`}>
                                <VIcon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                                <div className="flex-1"><p className="font-sans text-sm font-bold text-ink">{t.caseName}</p><div className="flex items-center gap-2 mt-0.5 flex-wrap"><span className="font-mono text-[9px] text-neutral">{t.court || "—"}</span>{t.dateConcluded && <span className="font-mono text-[9px] text-neutral">· {t.dateConcluded}</span>}{t.leadAttorney && <span className="font-mono text-[9px] text-neutral">· {t.leadAttorney}</span>}</div></div>
                                <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${verdictColors[t.verdict] || "border-ink/30 text-neutral"}`}>{t.verdict}</span>
                                {t.durationDays && <span className="font-mono text-[9px] text-neutral">{t.durationDays}d</span>}
                                {expanded === t.id ? <ChevronDown className="w-4 h-4 text-neutral" /> : <ChevronRight className="w-4 h-4 text-neutral" />}
                            </div>

                            {expanded === t.id && <div className="border-t border-ink/10 px-4 py-3 space-y-3">
                                {t.summary && <div><span className="font-mono text-[9px] text-neutral uppercase block">Summary</span><p className="font-sans text-[11px] text-ink mt-0.5">{t.summary}</p></div>}
                                {(t.keyArguments as string[]).length > 0 && <div><span className="font-mono text-[9px] text-neutral uppercase block mb-1">Key Arguments</span><ul className="space-y-1">{(t.keyArguments as string[]).map((a, i) => <li key={i} className="font-sans text-[11px] text-ink flex items-start"><span className="text-ink mr-2 font-bold">·</span>{a}</li>)}</ul></div>}
                                {t.judge && <div><span className="font-mono text-[9px] text-neutral uppercase">Judge: </span><span className="font-sans text-[11px] text-ink">{t.judge}</span></div>}
                                {t.opposingCounsel && <div><span className="font-mono text-[9px] text-neutral uppercase">Opposing: </span><span className="font-sans text-[11px] text-ink">{t.opposingCounsel}</span></div>}
                                {(t.team as { name: string; role: string }[]).length > 0 && <div><span className="font-mono text-[9px] text-neutral uppercase block mb-1">Team</span><div className="flex gap-2 flex-wrap">{(t.team as { name: string; role: string }[]).map((m, i) => <span key={i} className="border border-ink/30 px-2 py-0.5 font-mono text-[9px]">{m.name} ({m.role})</span>)}</div></div>}
                                {t.lessonsLearned && <div className="border-l-2 border-ink/30 pl-3"><span className="font-mono text-[9px] text-neutral uppercase block">Lessons Learned</span><p className="font-serif text-[11px] text-ink italic mt-0.5">{t.lessonsLearned}</p></div>}
                                <button onClick={() => del(t.id)} className="text-[10px] font-mono text-accent hover:underline uppercase">Delete</button>
                            </div>}
                        </div>
                    );
                })}
            </div>

            {showAdd && <>
                <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50" onClick={() => setShowAdd(false)} />
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <form onSubmit={add} className="bg-newsprint border border-ink/30 p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4"><h2 className="font-serif text-xl font-bold text-ink">Add Trial Record</h2><button type="button" onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-neutral" /></button></div>
                        <div className="space-y-3">
                            <div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Case Name *</label><input value={form.caseName} onChange={e => setForm(p => ({ ...p, caseName: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" required /></div>
                            <div className="grid grid-cols-2 gap-3"><div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Verdict *</label><select value={form.verdict} onChange={e => setForm(p => ({ ...p, verdict: e.target.value }))} className="w-full border border-ink/30 bg-transparent font-mono text-xs px-2 py-2 outline-none">{["won", "lost", "settled", "dismissed"].map(v => <option key={v} value={v}>{v}</option>)}</select></div><div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Duration (days)</label><input type="number" value={form.durationDays} onChange={e => setForm(p => ({ ...p, durationDays: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" /></div></div>
                            <div className="grid grid-cols-2 gap-3"><div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Court</label><input value={form.court} onChange={e => setForm(p => ({ ...p, court: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" /></div><div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Judge</label><input value={form.judge} onChange={e => setForm(p => ({ ...p, judge: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" /></div></div>
                            <div className="grid grid-cols-2 gap-3"><div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Lead Attorney</label><input value={form.leadAttorney} onChange={e => setForm(p => ({ ...p, leadAttorney: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" /></div><div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Date Concluded</label><input type="date" value={form.dateConcluded} onChange={e => setForm(p => ({ ...p, dateConcluded: e.target.value }))} className="w-full border-0 border-b border-ink/30 bg-transparent font-mono text-sm px-0 py-2 focus:border-ink focus:ring-0 focus:outline-none" /></div></div>
                            <div><label className="font-mono text-[9px] text-neutral uppercase block mb-1">Summary</label><textarea value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} rows={2} className="w-full border border-ink/30 bg-transparent font-mono text-sm px-2 py-2 outline-none resize-none" /></div>
                        </div>
                        <button type="submit" className="mt-4 w-full py-2.5 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors">Add Record</button>
                    </form>
                </div>
            </>}
        </div>
    );
}
