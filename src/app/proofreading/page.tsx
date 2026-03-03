"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, UploadCloud, AlertTriangle, CheckCircle, SearchCode, ShieldAlert,
    Sparkles, FileSearch, BookOpen, GitCompare, Library, SpellCheck,
    Scale, Eye, FileWarning, MessageSquare, AtSign, Clock, Download,
    CheckSquare, XSquare, ArrowRightLeft, History, Search, ChevronRight
} from "lucide-react";
import { toast } from "react-hot-toast";

/* ─── Types & Data ─── */

type Tab = "upload" | "review" | "compare" | "templates";

const aiChecks = [
    { name: "Grammar & Spelling", status: "passed", issues: 0, icon: SpellCheck },
    { name: "Legal Terminology", status: "warning", issues: 3, icon: Scale },
    { name: "Citation Format (Bluebook)", status: "warning", issues: 2, icon: BookOpen },
    { name: "Consistency (Names/Dates)", status: "passed", issues: 0, icon: CheckCircle },
    { name: "Defined Terms Usage", status: "error", issues: 1, icon: FileWarning },
    { name: "Cross-References", status: "passed", issues: 0, icon: ArrowRightLeft },
    { name: "Passive Voice", status: "warning", issues: 5, icon: Eye },
    { name: "Readability Score", status: "info", issues: 0, icon: Sparkles },
    { name: "Jurisdiction Language", status: "passed", issues: 0, icon: ShieldAlert },
    { name: "Plagiarism Detection", status: "passed", issues: 0, icon: SearchCode },
];

const reviewStatuses = ["Draft", "Review", "Approved", "Final"];

const versionHistory = [
    { version: "v3.2", author: "Adv. Prit", date: "Today, 2:15 PM", changes: "Updated liability clause", status: "Review" },
    { version: "v3.1", author: "Adv. Meera", date: "Yesterday", changes: "Added indemnity cap", status: "Draft" },
    { version: "v3.0", author: "System", date: "Feb 20", changes: "Initial AI scan", status: "Draft" },
    { version: "v2.0", author: "Adv. Prit", date: "Feb 18", changes: "Major restructure", status: "Approved" },
];

const clauseLibrary = [
    { name: "Standard Indemnification", category: "Liability", uses: 42 },
    { name: "Force Majeure (COVID-era)", category: "General", uses: 38 },
    { name: "Non-Compete (India)", category: "Employment", uses: 31 },
    { name: "IP Assignment Clause", category: "IP", uses: 27 },
    { name: "Data Protection (DPDP Act)", category: "Privacy", uses: 24 },
    { name: "Arbitration (ICC Rules)", category: "Dispute", uses: 19 },
];

const templates = [
    { name: "Master Service Agreement", type: "Contract", updated: "Feb 20" },
    { name: "Non-Disclosure Agreement", type: "Contract", updated: "Feb 15" },
    { name: "Legal Opinion Letter", type: "Letter", updated: "Feb 10" },
    { name: "Affidavit Format", type: "Filing", updated: "Jan 28" },
];

/* ─── Component ─── */

export default function ProofreadingPage() {
    const [activeTab, setActiveTab] = useState<Tab>("upload");
    const [fileUploaded, setFileUploaded] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(1); // 0=Draft, 1=Review, 2=Approved, 3=Final

    const handleUpload = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setFileUploaded(true);
            setActiveTab("review");
            toast.success("DOCUMENT SCANNED — 11 ISSUES FOUND");
        }, 3000);
    };

    const tabs: { id: Tab; label: string }[] = [
        { id: "upload", label: "Upload" },
        { id: "review", label: "AI Review" },
        { id: "compare", label: "Compare" },
        { id: "templates", label: "Templates" },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col">

            {/* ── Header ── */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center">
                            <FileSearch className="w-6 h-6 mr-3" strokeWidth={1.5} />
                            Document Intelligence
                        </h1>
                        <p className="text-sm font-sans text-neutral">
                            Upload, proofread, compare, and manage legal documents with AI-powered analysis.
                        </p>
                    </div>
                    {/* Tab Navigation */}
                    <div className="flex border border-ink shrink-0">
                        {tabs.map((tab, i) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-wider transition-colors ${i < tabs.length - 1 ? 'border-r border-ink' : ''} ${activeTab === tab.id ? 'bg-ink text-newsprint' : 'text-ink hover:bg-ink/5'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">

                {/* ══════════════ UPLOAD TAB ══════════════ */}
                {activeTab === "upload" && (
                    <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

                        {!isScanning ? (
                            <>
                                {/* Drag & Drop Zone */}
                                <div
                                    onClick={handleUpload}
                                    className="border border-dashed border-ink min-h-[300px] flex flex-col items-center justify-center relative group hover:bg-ink/[0.03] transition-all cursor-pointer"
                                >
                                    <div className="w-16 h-16 border border-ink flex justify-center items-center mb-6 group-hover:bg-ink group-hover:text-newsprint transition-colors">
                                        <UploadCloud className="w-8 h-8" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-ink">Drag & Drop Documents</h3>
                                    <p className="text-sm font-sans text-neutral mt-2">or click here to browse</p>
                                    <div className="flex gap-2 mt-6">
                                        {["DOCX", "PDF", "TXT", "RTF"].map(ext => (
                                            <span key={ext} className="px-2 py-0.5 border border-ink text-[10px] font-mono text-neutral uppercase">.{ext}</span>
                                        ))}
                                    </div>
                                    <p className="text-[9px] font-mono text-neutral/50 mt-3 uppercase">Bulk upload supported · Max 50MB per file</p>
                                </div>

                                {/* Version Tracking */}
                                <div className="border border-ink">
                                    <div className="h-9 border-b border-ink px-4 flex items-center">
                                        <History className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Recent Uploads & Versions</span>
                                    </div>
                                    <div className="divide-y divide-ink/10">
                                        {versionHistory.map((v, i) => (
                                            <div key={i} className="flex items-center px-4 py-2.5 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                                                <span className="font-mono text-[10px] font-bold text-ink w-12">{v.version}</span>
                                                <span className="font-sans text-[11px] text-ink flex-1">{v.changes}</span>
                                                <span className="text-[9px] font-mono text-neutral mr-3">{v.author}</span>
                                                <span className="text-[9px] font-mono text-neutral mr-3">{v.date}</span>
                                                <span className={`text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 ${v.status === 'Approved' ? 'bg-ink text-newsprint' : 'border border-ink/30 text-neutral'}`}>{v.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="border border-ink min-h-[400px] flex flex-col items-center justify-center space-y-6">
                                <FileText className="w-20 h-20 text-ink/20" strokeWidth={1} />
                                <h3 className="font-serif text-lg font-bold text-ink flex items-center">
                                    <SearchCode className="w-5 h-5 mr-2 animate-pulse" strokeWidth={1.5} />
                                    Running 10 AI Checks...
                                </h3>
                                <div className="w-48 h-1 bg-ink/10"><div className="h-full bg-ink animate-pulse w-2/3" /></div>
                                <p className="text-[10px] font-mono text-neutral uppercase">Grammar · Legal terms · Citations · Cross-refs · Plagiarism...</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ══════════════ AI REVIEW TAB ══════════════ */}
                {activeTab === "review" && (
                    <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

                        {/* Status Workflow */}
                        <div className="border border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Review Status</span>
                                <span className="font-mono text-[10px] text-neutral">Master_Service_Agreement_v3.docx</span>
                            </div>
                            <div className="flex">
                                {reviewStatuses.map((status, i) => (
                                    <button
                                        key={status}
                                        onClick={() => { setCurrentStatus(i); toast.success(`STATUS: ${status.toUpperCase()}`); }}
                                        className={`flex-1 py-3 text-center font-sans text-[10px] font-bold uppercase tracking-wider transition-colors ${i < reviewStatuses.length - 1 ? 'border-r border-ink' : ''} ${i <= currentStatus ? 'bg-ink text-newsprint' : 'text-neutral hover:bg-ink/5'}`}
                                    >
                                        {i < currentStatus ? <CheckCircle className="w-3 h-3 inline mr-1" strokeWidth={1.5} /> : null}
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content: Document + AI Checks */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 border border-ink min-h-[500px]">

                            {/* Document Viewer — 2/3 */}
                            <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-ink flex flex-col">
                                <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Document</span>
                                    <div className="flex gap-2">
                                        <button className="text-[9px] font-sans font-bold border border-ink px-2 py-0.5 text-ink hover:bg-ink/5 transition-colors uppercase flex items-center">
                                            <MessageSquare className="w-3 h-3 mr-1" strokeWidth={1.5} />Comment
                                        </button>
                                        <button className="text-[9px] font-sans font-bold border border-ink px-2 py-0.5 text-ink hover:bg-ink/5 transition-colors uppercase flex items-center">
                                            <AtSign className="w-3 h-3 mr-1" strokeWidth={1.5} />Mention
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 overflow-y-auto flex-1 max-h-[600px]">
                                    <div className="font-serif text-sm text-ink/80 leading-8">
                                        <p className="drop-cap mb-4">
                                            This Master Service Agreement (&quot;Agreement&quot;) is made effective as of October 1, 2024, by and between TechCorp, Inc., and <span className="border-b-2 border-accent text-ink font-bold px-0.5 cursor-help relative group" title="Ambiguous Entity">the Client<span className="absolute -top-6 left-0 bg-ink text-newsprint text-[9px] font-mono px-2 py-0.5 hidden group-hover:block whitespace-nowrap">⚠ Defined term not specified</span></span>.
                                        </p>
                                        <p className="mb-4">
                                            The Consultant agrees to provide consulting services as detailed in <span className="bg-ink/5 border-b border-ink/30 px-0.5 cursor-pointer hover:bg-ink/10 transition-colors" title="Cross-reference verified ✓">Exhibit A</span>.
                                        </p>
                                        <p className="mb-4">
                                            <span className="bg-accent/10 border-b-2 border-accent text-ink font-bold px-0.5 cursor-help" title="HIGH RISK: Missing limitation of liability clause">
                                                In no event shall either party be liable for any indirect, incidental, special, or consequential damages.
                                            </span>
                                            {" "}However, this limitation does not apply to gross negligence or willful misconduct.
                                        </p>
                                        <p className="mb-4">
                                            Either party may terminate this Agreement upon <span className="border-b-2 border-ink text-ink font-bold px-0.5 cursor-pointer hover:bg-ink/5 transition-colors" title="Suggestion: Standardize to 30 days">15 days</span> written notice.
                                        </p>
                                        <div className="mt-6 border border-ink/20 p-4 bg-ink/[0.02]">
                                            <p className="text-[10px] font-sans font-bold text-neutral uppercase tracking-wider mb-2">Inline Comment — Adv. Meera</p>
                                            <p className="text-xs font-sans text-ink">&quot;Should we increase the notice period to 30 days? Standard for M&A.&quot;</p>
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => toast.success("EDIT ACCEPTED")} className="text-[9px] font-sans font-bold bg-ink text-newsprint px-2 py-0.5 uppercase flex items-center hover:bg-ink/90 transition-colors">
                                                    <CheckSquare className="w-3 h-3 mr-1" strokeWidth={1.5} />Accept
                                                </button>
                                                <button onClick={() => toast("EDIT REJECTED")} className="text-[9px] font-sans font-bold border border-ink text-ink px-2 py-0.5 uppercase flex items-center hover:bg-ink/5 transition-colors">
                                                    <XSquare className="w-3 h-3 mr-1" strokeWidth={1.5} />Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Checks Sidebar — 1/3 */}
                            <div className="flex flex-col overflow-y-auto max-h-[700px]">
                                <div className="h-9 border-b border-ink px-4 flex items-center section-inverted">
                                    <Sparkles className="w-3.5 h-3.5 mr-2 text-newsprint" strokeWidth={1.5} />
                                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">AI Proofreading (10 checks)</span>
                                </div>

                                {/* Readability Score */}
                                <div className="p-4 border-b border-ink text-center">
                                    <span className="font-sans text-[9px] font-bold text-neutral uppercase tracking-widest block mb-2">Readability Score</span>
                                    <span className="font-mono text-3xl font-bold text-ink">72</span>
                                    <span className="font-mono text-xs text-neutral block mt-1">/ 100 — Good</span>
                                </div>

                                {/* Individual Checks */}
                                <div className="divide-y divide-ink/10">
                                    {aiChecks.map((check, i) => (
                                        <div key={i} className="px-4 py-2.5 hover:bg-ink/[0.03] transition-colors cursor-pointer flex items-center gap-3">
                                            <div className={`w-2 h-2 shrink-0 ${check.status === 'passed' ? 'bg-ink' : check.status === 'error' ? 'bg-accent' : check.status === 'warning' ? 'bg-neutral' : 'bg-ink/30'}`} />
                                            <check.icon className="w-3.5 h-3.5 text-neutral shrink-0" strokeWidth={1.5} />
                                            <span className="font-sans text-[10px] font-semibold text-ink flex-1">{check.name}</span>
                                            {check.issues > 0 ? (
                                                <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 ${check.status === 'error' ? 'bg-accent text-newsprint' : 'border border-ink/30 text-neutral'}`}>
                                                    {check.issues}
                                                </span>
                                            ) : (
                                                <CheckCircle className="w-3 h-3 text-ink" strokeWidth={1.5} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="p-4 border-t border-ink mt-auto space-y-2">
                                    <button onClick={() => toast("AUTO-FIXING 5 PASSIVE VOICE ISSUES...")} className="w-full py-2 bg-ink text-newsprint font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-ink/90 transition-colors">
                                        Auto-Fix All (8 issues)
                                    </button>
                                    <button onClick={() => toast("DOWNLOADING REPORT...")} className="w-full py-2 border border-ink text-ink font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-ink/5 transition-colors flex items-center justify-center">
                                        <Download className="w-3 h-3 mr-1.5" strokeWidth={1.5} /> Export Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ══════════════ COMPARE TAB ══════════════ */}
                {activeTab === "compare" && (
                    <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

                        {/* Version Selector */}
                        <div className="grid grid-cols-1 md:grid-cols-2 border border-ink">
                            <div className="p-4 border-b md:border-b-0 md:border-r border-ink">
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Original Version</label>
                                <select className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink cursor-pointer uppercase">
                                    <option>v2.0 — Feb 18 (Adv. Prit)</option>
                                    <option>v3.0 — Feb 20 (System)</option>
                                </select>
                            </div>
                            <div className="p-4">
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Compare Against</label>
                                <select className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink cursor-pointer uppercase">
                                    <option>v3.2 — Today (Adv. Prit) — Current</option>
                                    <option>v3.1 — Yesterday (Adv. Meera)</option>
                                </select>
                            </div>
                        </div>

                        {/* Diff View */}
                        <div className="border border-ink min-h-[400px]">
                            <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink flex items-center">
                                    <GitCompare className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />
                                    Side-by-Side Diff — Redline View
                                </span>
                                <button onClick={() => toast("GENERATING BLACKLINE PDF...")} className="text-[9px] font-sans font-bold bg-ink text-newsprint px-3 py-1 uppercase tracking-wider hover:bg-ink/90 transition-colors">
                                    Export Blackline
                                </button>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-ink">
                                {/* Left — Original */}
                                <div className="p-5">
                                    <span className="text-[9px] font-mono text-neutral uppercase tracking-wider block mb-3">v2.0 — Original</span>
                                    <div className="font-serif text-xs text-ink/70 leading-7 space-y-3">
                                        <p>This Master Service Agreement is made effective as of October 1, 2024, by and between TechCorp, Inc., and the Client.</p>
                                        <p className="bg-accent/10 border-l-2 border-accent pl-3 text-ink">In no event shall either party be liable for any indirect damages.</p>
                                        <p>Either party may terminate upon <span className="bg-accent/10 text-accent font-bold">15 days</span> written notice.</p>
                                    </div>
                                </div>
                                {/* Right — Modified */}
                                <div className="p-5">
                                    <span className="text-[9px] font-mono text-neutral uppercase tracking-wider block mb-3">v3.2 — Current</span>
                                    <div className="font-serif text-xs text-ink/70 leading-7 space-y-3">
                                        <p>This Master Service Agreement is made effective as of October 1, 2024, by and between TechCorp, Inc., and the Client.</p>
                                        <p className="bg-ink/5 border-l-2 border-ink pl-3 text-ink">In no event shall either party be liable for any indirect, incidental, special, or consequential damages. <span className="bg-ink/10 font-bold">However, this limitation does not apply to gross negligence or willful misconduct.</span></p>
                                        <p>Either party may terminate upon <span className="bg-ink/10 text-ink font-bold">30 days</span> written notice.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Change Summary */}
                        <div className="border border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center">
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Change Summary</span>
                            </div>
                            <div className="grid grid-cols-3 text-center border-b border-ink/20">
                                <div className="p-4 border-r border-ink/20">
                                    <span className="font-mono text-2xl font-bold text-ink block">7</span>
                                    <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-wider">Lines Added</span>
                                </div>
                                <div className="p-4 border-r border-ink/20">
                                    <span className="font-mono text-2xl font-bold text-accent block">2</span>
                                    <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-wider">Lines Removed</span>
                                </div>
                                <div className="p-4">
                                    <span className="font-mono text-2xl font-bold text-ink block">3</span>
                                    <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-wider">Lines Modified</span>
                                </div>
                            </div>
                        </div>

                        {/* Version Timeline */}
                        <div className="border border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center">
                                <History className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Version History Timeline</span>
                            </div>
                            <div className="divide-y divide-ink/10">
                                {versionHistory.map((v, i) => (
                                    <div key={i} className="flex items-center px-4 py-3 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                                        <div className={`w-3 h-3 shrink-0 mr-3 ${i === 0 ? 'bg-ink' : 'border border-ink'}`} />
                                        <span className="font-mono text-[11px] font-bold text-ink w-12">{v.version}</span>
                                        <span className="font-sans text-[11px] text-ink flex-1">{v.changes}</span>
                                        <span className="text-[9px] font-mono text-neutral mr-4">{v.author}</span>
                                        <span className="text-[9px] font-mono text-neutral mr-4">{v.date}</span>
                                        <span className={`text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 ${v.status === 'Approved' ? 'bg-ink text-newsprint' : 'border border-ink/30 text-neutral'}`}>{v.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ══════════════ TEMPLATES TAB ══════════════ */}
                {activeTab === "templates" && (
                    <motion.div key="templates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

                        {/* Standard Templates */}
                        <div className="border border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink flex items-center">
                                    <FileText className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />
                                    Standard Legal Templates
                                </span>
                                <button className="text-[9px] font-sans font-bold bg-ink text-newsprint px-2 py-0.5 uppercase hover:bg-ink/90 transition-colors">
                                    + New Template
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {templates.map((t, i) => (
                                    <div key={i} className={`p-4 flex items-center justify-between hover:bg-ink/[0.03] transition-colors cursor-pointer group ${i < templates.length - 1 ? 'border-b md:border-b border-ink/20' : ''} ${i % 2 === 0 ? 'md:border-r border-ink/20' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-neutral group-hover:text-ink transition-colors" strokeWidth={1.5} />
                                            <div>
                                                <p className="font-sans text-xs font-bold text-ink">{t.name}</p>
                                                <p className="text-[9px] font-mono text-neutral mt-0.5">{t.type} · Updated {t.updated}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => toast(`LOADING ${t.name.toUpperCase()}...`)} className="text-[9px] font-sans font-bold border border-ink px-2 py-0.5 text-ink uppercase opacity-0 group-hover:opacity-100 transition-all hover:bg-ink hover:text-newsprint">
                                            Use
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Clause Library */}
                        <div className="border border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink flex items-center">
                                    <Library className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />
                                    Clause Bank — Searchable
                                </span>
                            </div>
                            {/* Search */}
                            <div className="border-b border-ink px-4 py-2 flex items-center">
                                <Search className="w-3.5 h-3.5 text-neutral mr-3" strokeWidth={1.5} />
                                <input
                                    placeholder="SEARCH CLAUSES..."
                                    className="w-full bg-transparent text-xs font-mono text-ink outline-none placeholder:text-neutral/50 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-wider"
                                />
                            </div>
                            <div className="divide-y divide-ink/10">
                                {clauseLibrary.map((clause, i) => (
                                    <div key={i} className="flex items-center px-4 py-3 hover:bg-ink/[0.03] transition-colors cursor-pointer group">
                                        <div className="flex-1">
                                            <p className="font-sans text-xs font-bold text-ink">{clause.name}</p>
                                            <p className="text-[9px] font-mono text-neutral mt-0.5">{clause.category} · Used {clause.uses} times</p>
                                        </div>
                                        <button onClick={() => toast(`CLAUSE INSERTED: ${clause.name.toUpperCase()}`)} className="text-[9px] font-sans font-bold bg-ink text-newsprint px-2 py-0.5 uppercase opacity-0 group-hover:opacity-100 transition-all hover:bg-ink/90">
                                            Insert
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Style Guide */}
                        <div className="border border-ink section-inverted p-5">
                            <h3 className="font-serif text-lg font-bold text-newsprint mb-3">Firm Style Guide</h3>
                            <p className="text-xs font-sans text-neutral leading-relaxed mb-4">
                                Auto-enforces your firm&apos;s specific formatting rules, preferred terminology, and citation style across all documents.
                            </p>
                            <div className="flex gap-2">
                                <button className="text-[9px] font-sans font-bold bg-accent text-newsprint px-3 py-1.5 uppercase tracking-wider hover:bg-accent/90 transition-colors">
                                    Configure Rules
                                </button>
                                <button className="text-[9px] font-sans font-bold border border-newsprint/30 text-newsprint px-3 py-1.5 uppercase tracking-wider hover:bg-newsprint/10 transition-colors">
                                    View Current Rules
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
