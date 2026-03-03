"use client";

import { useState } from "react";
import {
    FileText, Gavel, Search, FolderOpen, Scale, Handshake, Mail,
    Sparkles, Layout, Library, GitMerge, Layers, ChevronRight, ChevronLeft,
    Download, Clock, Star, Zap, BookOpen, Check, Circle, AlertTriangle,
    Bot, Eye, RefreshCw, MessageSquare, Paperclip, Pen, Send, Save,
    Users, CheckSquare, XSquare, Info, Shield
} from "lucide-react";
import { toast } from "react-hot-toast";

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type DocCategory = {
    id: string; label: string; icon: typeof FileText; count: number;
    docs: { name: string; desc: string; popular?: boolean }[];
};

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const popularTemplates = [
    { name: "Motion to Dismiss", cat: "Pleadings" },
    { name: "Discovery Request", cat: "Discovery" },
    { name: "Complaint / Petition", cat: "Pleadings" },
    { name: "Settlement Demand", cat: "Settlement" },
    { name: "Trial Brief", cat: "Trial" },
    { name: "Engagement Letter", cat: "Contracts" },
];

const docCategories: DocCategory[] = [
    {
        id: "pleadings", label: "Pleadings", icon: Gavel, count: 42, docs: [
            { name: "Complaint / Petition", desc: "Initiate civil proceedings", popular: true },
            { name: "Answer / Response", desc: "Respond to plaintiff's complaint" },
            { name: "Motion to Dismiss", desc: "Seek dismissal under Rule 12(b)", popular: true },
            { name: "Motion for Summary Judgment", desc: "No genuine dispute of material fact" },
            { name: "Motion in Limine", desc: "Exclude prejudicial evidence" },
            { name: "Motion to Compel Discovery", desc: "Force compliance with discovery" },
            { name: "Motion for Protective Order", desc: "Protect sensitive information" },
            { name: "Motion to Amend", desc: "Amend pleadings with new claims" },
            { name: "Emergency / Ex Parte Motions", desc: "Urgent relief without full notice" },
        ]
    },
    {
        id: "discovery", label: "Discovery", icon: Search, count: 28, docs: [
            { name: "Interrogatories", desc: "Written questions requiring sworn answers", popular: true },
            { name: "Request for Production", desc: "Demand documents or ESI" },
            { name: "Request for Admissions", desc: "Admit or deny specific facts" },
            { name: "Subpoenas", desc: "Compel testimony or production of records", popular: true },
            { name: "Discovery Responses", desc: "Formal responses to interrogatories, RFPs" },
            { name: "Objections to Discovery", desc: "Object to overbroad requests" },
            { name: "Meet and Confer Letters", desc: "Resolve disputes before court intervention" },
        ]
    },
    {
        id: "trial", label: "Trial", icon: Scale, count: 15, docs: [
            { name: "Trial Briefs", desc: "Legal arguments and authorities before trial", popular: true },
            { name: "Witness Lists", desc: "All witnesses with expected testimony" },
            { name: "Exhibit Lists", desc: "Catalogue of all exhibits" },
            { name: "Jury Instructions", desc: "Proposed instructions for deliberation" },
            { name: "Verdict Forms", desc: "Structured forms for jury findings" },
            { name: "Opening Statement Outlines", desc: "Framework for case narrative" },
            { name: "Closing Argument Outlines", desc: "Synthesize evidence for closing" },
        ]
    },
    {
        id: "appellate", label: "Appellate", icon: BookOpen, count: 12, docs: [
            { name: "Notice of Appeal", desc: "Initiate appeal of trial court decision" },
            { name: "Appellate Brief — Opening", desc: "Errors of law and argument for reversal" },
            { name: "Appellate Brief — Response", desc: "Defend trial court ruling" },
            { name: "Petition for Writ", desc: "Seek extraordinary relief" },
        ]
    },
    {
        id: "settlement", label: "Settlement", icon: Handshake, count: 8, docs: [
            { name: "Settlement Demand Letters", desc: "Formal demand with damages and terms", popular: true },
            { name: "Settlement Agreements", desc: "Terms for resolving dispute" },
            { name: "Release of Claims", desc: "General or mutual release" },
            { name: "Mediation Briefs", desc: "Confidential brief for mediator" },
        ]
    },
    {
        id: "contracts", label: "Contracts", icon: FolderOpen, count: 35, docs: [
            { name: "Retainer Agreements", desc: "Terms of attorney-client engagement" },
            { name: "Engagement Letters", desc: "Confirmation of representation", popular: true },
            { name: "Fee Agreements", desc: "Hourly, contingency, flat fee structures" },
            { name: "Joint Defense Agreements", desc: "Coordinate defense among co-defendants" },
        ]
    },
];

const grounds = [
    { id: "12b6", label: "Failure to State a Claim (12(b)(6))", checked: true },
    { id: "12b1", label: "Lack of Subject Matter Jurisdiction (12(b)(1))", checked: true },
    { id: "12b2", label: "Lack of Personal Jurisdiction (12(b)(2))", checked: false },
    { id: "12b3", label: "Improper Venue (12(b)(3))", checked: false },
    { id: "sol", label: "Statute of Limitations", checked: false },
    { id: "party", label: "Failure to Join Necessary Party", checked: false },
];

const suggestedCases = [
    { citation: "Twombly v. Bell Atlantic Corp. (2007)", relevance: "Standard for 12(b)(6) motions", quote: "\"...must contain sufficient factual matter, accepted as true, to state a claim that is plausible on its face.\"", added: true },
    { citation: "Iqbal v. Ashcroft (2009)", relevance: "Plausibility standard", note: "Cited in 89% of winning motions (Firm data)", added: true },
    { citation: "Johnson v. Smith (2022) — WON ✓", relevance: "Similar facts, same jurisdiction", note: "Partner notes: \"Judge Martinez favors this approach\"", isFirm: true, added: false },
];

const statutes = [
    "CA Civil Procedure § 430.10",
    "Federal Rule of Civil Procedure 12(b)",
];

const proofIssues = [
    { type: "warn", title: "Citation Format", desc: "Line 47: \"Twombly, 550 US 544\" → Should be \"550 U.S.\"", fixed: true },
    { type: "warn", title: "Defined Term Inconsistency", desc: "\"Defendant\" vs \"Acme Corp\" — use consistently", fixed: false },
    { type: "info", title: "Style Suggestion", desc: "Paragraph 3 has passive voice. \"The contract was never signed\" → \"No party signed the contract\"", fixed: false },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function DocumentsPage() {
    const [step, setStep] = useState<Step>(1);
    const [selectedDoc, setSelectedDoc] = useState("Motion to Dismiss");
    const [selectedMethod, setSelectedMethod] = useState("guided");
    const [searchQ, setSearchQ] = useState("");
    const [expandedCat, setExpandedCat] = useState<string | null>(null);
    const [groundChecks, setGroundChecks] = useState(grounds.map(g => g.checked));
    const [facts, setFacts] = useState(["Contract was never executed", "Plaintiff lacks standing"]);
    const [addedSOL, setAddedSOL] = useState(false);
    const [caseAdded, setCaseAdded] = useState([true, true, false]);
    const [arg1Approved, setArg1Approved] = useState(false);
    const [showArg2, setShowArg2] = useState(false);
    const [proofFixed, setProofFixed] = useState([true, false, false]);
    const [exhibits, setExhibits] = useState([true, true, true]);
    const [filingOption, setFilingOption] = useState("efile");
    const [serveEmail, setServeEmail] = useState(true);
    const [serveMail, setServeMail] = useState(true);

    const stepLabels = ["Select", "Method", "Wizard", "Research", "Arguments", "Polish", "Finalize"];

    const next = () => setStep(prev => Math.min(prev + 1, 7) as Step);
    const back = () => setStep(prev => Math.max(prev - 1, 1) as Step);

    return (
        <div className="max-w-5xl mx-auto pb-12">

            {/* Header */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center">
                    <FileText className="w-6 h-6 mr-3" strokeWidth={1.5} />
                    Document Maker
                </h1>
                <p className="text-sm font-sans text-neutral">AI-powered litigation document generation — step-by-step wizard</p>
            </div>

            {/* Step Progress Bar */}
            <div className="border border-ink mb-6 p-4">
                <div className="flex items-center justify-between">
                    {stepLabels.map((label, i) => {
                        const s = (i + 1) as Step;
                        const isActive = s === step;
                        const isDone = s < step;
                        return (
                            <div key={i} className="flex items-center flex-1 last:flex-none">
                                <button onClick={() => s <= step && setStep(s)}
                                    className={`flex items-center gap-2 ${s <= step ? "cursor-pointer" : "cursor-default"}`}>
                                    <div className={`w-7 h-7 flex items-center justify-center font-mono text-xs font-bold transition-colors ${isDone ? "bg-ink text-newsprint" : isActive ? "border-2 border-ink text-ink" : "border border-ink/30 text-neutral"}`}>
                                        {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={2} /> : s}
                                    </div>
                                    <span className={`font-sans text-[11px] font-bold uppercase tracking-wider hidden md:block ${isActive ? "text-ink" : isDone ? "text-ink" : "text-neutral"}`}>{label}</span>
                                </button>
                                {i < stepLabels.length - 1 && (
                                    <div className={`flex-1 h-px mx-3 ${s < step ? "bg-ink" : "bg-ink/20"}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ═══ STEP 1: DOCUMENT SELECTION ═══ */}
            {step === 1 && (
                <div className="border border-ink">
                    <div className="h-10 border-b border-ink px-4 flex items-center section-inverted">
                        <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-newsprint">What would you like to create?</span>
                    </div>
                    <div className="p-5 space-y-5">
                        {/* Search */}
                        <div className="flex items-center border border-ink px-3">
                            <Search className="w-4 h-4 text-neutral mr-3" strokeWidth={1.5} />
                            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search for document type..."
                                className="flex-1 py-2.5 bg-transparent font-sans text-sm text-ink outline-none placeholder:text-neutral/50" />
                        </div>

                        {/* Popular Templates */}
                        <div>
                            <span className="font-sans text-[11px] font-bold text-neutral uppercase tracking-widest block mb-3">Popular Templates</span>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                                {popularTemplates.map((t, i) => (
                                    <button key={i} onClick={() => { setSelectedDoc(t.name); next(); }}
                                        className={`border p-3 text-left transition-colors hover:bg-ink hover:text-newsprint group ${selectedDoc === t.name ? "border-ink bg-ink/[0.06]" : "border-ink/30"}`}>
                                        <p className="font-sans text-xs font-bold text-ink group-hover:text-newsprint">{t.name}</p>
                                        <p className="text-[10px] font-mono text-neutral group-hover:text-newsprint/70 mt-1">{t.cat}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* By Category */}
                        <div>
                            <span className="font-sans text-[11px] font-bold text-neutral uppercase tracking-widest block mb-3">By Category</span>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                                {docCategories.map(c => (
                                    <button key={c.id} onClick={() => setExpandedCat(expandedCat === c.id ? null : c.id)}
                                        className={`border border-ink/30 px-3 py-2 flex items-center gap-2 text-left transition-colors ${expandedCat === c.id ? "bg-ink/[0.06] border-ink" : "hover:border-ink"}`}>
                                        <c.icon className="w-4 h-4 text-ink" strokeWidth={1.5} />
                                        <span className="font-sans text-xs font-bold text-ink">{c.label}</span>
                                        <span className="font-mono text-[10px] text-neutral ml-auto">({c.count})</span>
                                    </button>
                                ))}
                            </div>
                            {expandedCat && (
                                <div className="border border-ink divide-y divide-ink/10">
                                    {docCategories.find(c => c.id === expandedCat)?.docs
                                        .filter(d => !searchQ || d.name.toLowerCase().includes(searchQ.toLowerCase()))
                                        .map((d, i) => (
                                            <button key={i} onClick={() => { setSelectedDoc(d.name); next(); }}
                                                className="w-full flex items-center px-4 py-2.5 hover:bg-ink/[0.03] transition-colors text-left group">
                                                <FileText className="w-3.5 h-3.5 text-neutral mr-2.5 group-hover:text-ink" strokeWidth={1.5} />
                                                <span className="font-sans text-xs font-bold text-ink flex-1">{d.name}</span>
                                                {d.popular && <span className="text-[9px] font-sans font-bold bg-ink text-newsprint px-1.5 py-0.5 uppercase tracking-wider mr-2">Popular</span>}
                                                <span className="text-[10px] font-sans text-neutral">{d.desc}</span>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* AI Describe */}
                        <div className="border border-ink/30 p-4">
                            <span className="font-sans text-[11px] font-bold text-ink uppercase tracking-wider flex items-center mb-2">
                                <Bot className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />Describe what you need in plain English
                            </span>
                            <textarea rows={2} placeholder="e.g. &quot;I need a motion to exclude expert testimony on damages because their methodology is unreliable under Daubert...&quot;"
                                className="w-full border border-ink/30 bg-newsprint px-3 py-2 font-sans text-sm text-ink outline-none resize-none placeholder:text-neutral/50" />
                            <button onClick={() => { setSelectedDoc("Motion in Limine"); next(); }}
                                className="mt-2 px-4 py-1.5 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors">
                                <Sparkles className="w-3 h-3 inline mr-1.5" strokeWidth={1.5} />Detect & Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ STEP 2: GENERATION METHOD ═══ */}
            {step === 2 && (
                <div className="border border-ink">
                    <div className="h-10 border-b border-ink px-4 flex items-center section-inverted">
                        <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-newsprint">How would you like to create this {selectedDoc}?</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {[
                            { id: "quick", label: "Quick Generate (AI-Powered)", desc: "AI drafts entire document from case details", time: "~2-3 minutes", icon: Zap },
                            { id: "guided", label: "Guided Wizard", desc: "Step-by-step with smart suggestions", time: "~10-15 minutes", icon: Layout, recommended: true },
                            { id: "template", label: "Template-Based", desc: "Fill in blanks with auto-complete", time: "~5-8 minutes", icon: FileText },
                            { id: "clone", label: "Clone from Past Document", desc: "Modify previous similar document", time: "~3-5 minutes", icon: GitMerge },
                            { id: "scratch", label: "Start from Scratch", desc: "Blank document with AI assistant", time: "Variable", icon: Pen },
                        ].map(m => (
                            <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                                className={`w-full px-5 py-4 flex items-start gap-4 text-left transition-colors ${selectedMethod === m.id ? "bg-ink/[0.06]" : "hover:bg-ink/[0.03]"}`}>
                                <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedMethod === m.id ? "border-ink" : "border-ink/30"}`}>
                                    {selectedMethod === m.id && <div className="w-2.5 h-2.5 bg-ink" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-sans text-sm font-bold text-ink">{m.label}</span>
                                        {m.recommended && <span className="text-[9px] font-sans font-bold bg-ink text-newsprint px-1.5 py-0.5 uppercase tracking-wider">Recommended</span>}
                                    </div>
                                    <p className="font-sans text-xs text-neutral mt-0.5">{m.desc}</p>
                                    <p className="font-mono text-[11px] text-neutral/70 mt-1">⏱️ {m.time}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-4 border-t border-ink flex justify-end">
                        <button onClick={next} className="px-5 py-2 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors flex items-center">
                            Next: Setup Wizard <ChevronRight className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            )}

            {/* ═══ STEP 3: GUIDED WIZARD ═══ */}
            {step === 3 && (
                <div className="border border-ink">
                    <div className="h-10 border-b border-ink px-4 flex items-center justify-between section-inverted">
                        <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-newsprint">{selectedDoc} — Setup Wizard</span>
                        <span className="font-mono text-[11px] text-newsprint/70">Step 1 of 5</span>
                    </div>
                    <div className="p-5 space-y-5">
                        {/* 1. Basic Info */}
                        <div>
                            <span className="font-sans text-xs font-bold text-ink uppercase tracking-wider block mb-3">1. Basic Information</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="font-sans text-[11px] font-bold text-neutral uppercase tracking-wider block mb-1">Case</label>
                                    <select className="w-full border border-ink bg-newsprint px-3 py-2 font-sans text-xs text-ink outline-none">
                                        <option>Smith v. Acme Corp</option>
                                        <option>Sharma v. State (VDT-2024-001)</option>
                                        <option>Nexus Inc. Patent Dispute</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-sans text-[11px] font-bold text-neutral uppercase tracking-wider block mb-1">Jurisdiction</label>
                                    <input defaultValue="California Superior Court, LA County" className="w-full border border-ink bg-newsprint px-3 py-2 font-sans text-xs text-ink outline-none" />
                                </div>
                                <div>
                                    <label className="font-sans text-[11px] font-bold text-neutral uppercase tracking-wider block mb-1">Filing Party</label>
                                    <input defaultValue="Defendant Acme Corporation" className="w-full border border-ink bg-newsprint px-3 py-2 font-sans text-xs text-ink outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Grounds */}
                        <div>
                            <span className="font-sans text-xs font-bold text-ink uppercase tracking-wider block mb-3">2. Grounds for Dismissal</span>
                            <div className="space-y-2">
                                {grounds.map((g, i) => (
                                    <label key={g.id} className="flex items-center gap-3 px-3 py-2 border border-ink/20 hover:border-ink/40 transition-colors cursor-pointer">
                                        <div className={`w-4 h-4 border flex items-center justify-center ${groundChecks[i] ? "border-ink bg-ink" : "border-ink/40"}`}>
                                            {groundChecks[i] && <Check className="w-2.5 h-2.5 text-newsprint" strokeWidth={2} />}
                                        </div>
                                        <span className="font-sans text-xs text-ink">{g.label}</span>
                                        <input type="checkbox" checked={groundChecks[i]} onChange={() => { const c = [...groundChecks]; c[i] = !c[i]; setGroundChecks(c); }} className="sr-only" />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 3. Supporting Facts */}
                        <div>
                            <span className="font-sans text-xs font-bold text-ink uppercase tracking-wider block mb-3">3. Supporting Facts</span>
                            {!addedSOL && (
                                <div className="border border-ink/30 bg-ink/[0.03] p-3 mb-3 flex items-start gap-2">
                                    <Sparkles className="w-4 h-4 text-ink mt-0.5 shrink-0" strokeWidth={1.5} />
                                    <div className="flex-1">
                                        <p className="font-sans text-xs font-bold text-ink">AI detected: Complaint filed 3 years after incident</p>
                                        <p className="font-sans text-[11px] text-neutral mt-0.5">→ Statute of limitations may apply!</p>
                                    </div>
                                    <button onClick={() => { setAddedSOL(true); setFacts(f => [...f, "Complaint filed 3 years after incident — statute of limitations"]); const c = [...groundChecks]; c[4] = true; setGroundChecks(c); }}
                                        className="text-[10px] font-sans font-bold bg-ink text-newsprint px-2 py-1 uppercase tracking-wider hover:bg-ink/90 shrink-0">
                                        Add this argument ✓
                                    </button>
                                </div>
                            )}
                            <div className="space-y-2">
                                {facts.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2 border border-ink/20">
                                        <span className="font-sans text-xs text-ink flex-1">• {f}</span>
                                        <button onClick={() => setFacts(prev => prev.filter((_, j) => j !== i))} className="text-neutral/50 hover:text-accent transition-colors">
                                            <XSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => setFacts(f => [...f, ""])}
                                    className="text-[11px] font-sans font-bold text-ink hover:text-accent transition-colors">+ Add fact</button>
                            </div>
                        </div>
                    </div>
                    {/* Nav */}
                    <div className="p-4 border-t border-ink flex justify-between">
                        <button onClick={back} className="px-4 py-2 border border-ink text-ink font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/5 transition-colors flex items-center">
                            <ChevronLeft className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Back
                        </button>
                        <button onClick={next} className="px-5 py-2 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors flex items-center">
                            Next: Legal Standards <ChevronRight className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            )}

            {/* ═══ STEP 4: LEGAL RESEARCH ═══ */}
            {step === 4 && (
                <div className="border border-ink">
                    <div className="h-10 border-b border-ink px-4 flex items-center justify-between section-inverted">
                        <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-newsprint">Suggested Legal Authority</span>
                        <span className="font-mono text-[11px] text-newsprint/70">Step 2 of 5</span>
                    </div>
                    <div className="p-5 space-y-5">
                        <p className="font-sans text-xs text-neutral">AI found <span className="font-bold text-ink">47 relevant cases</span> and <span className="font-bold text-ink">12 statutes</span>. Top matches:</p>

                        {/* Cases */}
                        <div className="divide-y divide-ink/10 border border-ink">
                            {suggestedCases.map((c, i) => (
                                <div key={i} className={`px-4 py-3 ${c.isFirm ? "bg-ink/[0.03]" : ""}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {caseAdded[i] ? <Check className="w-3.5 h-3.5 text-ink" strokeWidth={2} /> : <Circle className="w-3.5 h-3.5 text-neutral" strokeWidth={1.5} />}
                                                <span className="font-sans text-xs font-bold text-ink">{c.citation}</span>
                                                {c.isFirm && <span className="text-[9px] font-sans font-bold border border-ink px-1.5 py-0.5 uppercase tracking-wider text-ink">Your Firm</span>}
                                            </div>
                                            <p className="font-sans text-[11px] text-neutral ml-6">{c.relevance}</p>
                                            {c.quote && <p className="font-serif text-[11px] text-neutral/80 italic ml-6 mt-1">{c.quote}</p>}
                                            {c.note && <p className="font-mono text-[10px] text-neutral/70 ml-6 mt-1">{c.isFirm ? "📝 " : "🔥 "}{c.note}</p>}
                                        </div>
                                        <div className="flex gap-1.5 shrink-0">
                                            <button className="text-[9px] font-sans font-bold border border-ink/30 px-2 py-0.5 text-ink uppercase hover:border-ink transition-colors">Preview</button>
                                            <button onClick={() => { const a = [...caseAdded]; a[i] = !a[i]; setCaseAdded(a); }}
                                                className={`text-[9px] font-sans font-bold px-2 py-0.5 uppercase transition-colors ${caseAdded[i] ? "bg-ink text-newsprint hover:bg-ink/90" : "border border-ink text-ink hover:bg-ink hover:text-newsprint"}`}>
                                                {caseAdded[i] ? "Added ✓" : "Add to Brief"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search more */}
                        <div className="flex items-center border border-ink/30 px-3">
                            <Search className="w-3.5 h-3.5 text-neutral mr-2" strokeWidth={1.5} />
                            <input placeholder="Search for more cases..." className="flex-1 py-2 bg-transparent font-sans text-xs text-ink outline-none placeholder:text-neutral/50" />
                        </div>

                        {/* Statutes */}
                        <div>
                            <span className="font-sans text-[11px] font-bold text-neutral uppercase tracking-widest block mb-2">Jurisdiction-Specific Rules</span>
                            {statutes.map((s, i) => (
                                <div key={i} className="flex items-center gap-2 mb-1">
                                    <Check className="w-3 h-3 text-ink" strokeWidth={2} />
                                    <span className="font-mono text-xs text-ink">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 border-t border-ink flex justify-between">
                        <button onClick={back} className="px-4 py-2 border border-ink text-ink font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/5 transition-colors flex items-center">
                            <ChevronLeft className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Back
                        </button>
                        <button onClick={next} className="px-5 py-2 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors flex items-center">
                            Next: Draft Arguments <ChevronRight className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            )}

            {/* ═══ STEP 5: AI ARGUMENTS ═══ */}
            {step === 5 && (
                <div className="border border-ink">
                    <div className="h-10 border-b border-ink px-4 flex items-center justify-between section-inverted">
                        <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-newsprint">AI-Generated Arguments</span>
                        <span className="font-mono text-[11px] text-newsprint/70">Step 3 of 5</span>
                    </div>
                    <div className="p-5 space-y-5">
                        <p className="font-sans text-xs text-neutral">Based on your inputs, AI has drafted arguments:</p>

                        {/* Argument I */}
                        <div className="border border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center">
                                <span className="font-sans text-xs font-bold text-ink uppercase tracking-wider">Argument I: Failure to State a Claim</span>
                            </div>
                            <div className="p-4">
                                <div className="bg-ink/[0.03] border border-ink/20 p-4 mb-3">
                                    <p className="font-serif text-sm text-ink leading-relaxed">
                                        Plaintiff&apos;s Complaint fails to state a claim upon which relief can be granted because it does not contain sufficient factual matter, accepted as true, to state a claim that is plausible on its face. <em>Bell Atlantic Corp. v. Twombly</em>, 550 U.S. 544, 570 (2007).
                                    </p>
                                    <p className="font-serif text-sm text-ink leading-relaxed mt-3">
                                        Specifically, Plaintiff alleges only conclusory statements without supporting factual allegations. Under <em>Ashcroft v. Iqbal</em>, 556 U.S. 662, 678 (2009), the Court must disregard such allegations and assess whether the remaining factual content states a plausible claim...
                                    </p>
                                </div>
                                {/* Scores */}
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <span className="font-sans text-[11px] text-neutral">💪 Argument Strength</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-2 bg-ink/10"><div className="h-full bg-ink" style={{ width: "82%" }} /></div>
                                            <span className="font-mono text-xs font-bold text-ink">8.2/10</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-sans text-[11px] text-neutral">🎯 Persuasiveness</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-2 bg-ink/10"><div className="h-full bg-ink" style={{ width: "91%" }} /></div>
                                            <span className="font-mono text-xs font-bold text-ink">9.1/10</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button className="text-[10px] font-sans font-bold border border-ink px-2.5 py-1 text-ink uppercase hover:bg-ink/5 transition-colors flex items-center gap-1"><Pen className="w-3 h-3" strokeWidth={1.5} />Edit</button>
                                    <button className="text-[10px] font-sans font-bold border border-ink px-2.5 py-1 text-ink uppercase hover:bg-ink/5 transition-colors flex items-center gap-1"><RefreshCw className="w-3 h-3" strokeWidth={1.5} />Regenerate</button>
                                    <button onClick={() => setArg1Approved(true)} className={`text-[10px] font-sans font-bold px-2.5 py-1 uppercase transition-colors flex items-center gap-1 ${arg1Approved ? "bg-ink text-newsprint" : "border border-ink text-ink hover:bg-ink hover:text-newsprint"}`}><Check className="w-3 h-3" strokeWidth={1.5} />{arg1Approved ? "Approved" : "Approve"}</button>
                                    <button className="text-[10px] font-sans font-bold border border-ink px-2.5 py-1 text-ink uppercase hover:bg-ink/5 transition-colors flex items-center gap-1"><MessageSquare className="w-3 h-3" strokeWidth={1.5} />Comment</button>
                                </div>
                                {/* AI Suggestion */}
                                <div className="mt-3 border border-ink/30 bg-ink/[0.03] p-3 flex items-start gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5 text-ink mt-0.5 shrink-0" strokeWidth={1.5} />
                                    <div className="flex-1">
                                        <p className="font-sans text-[11px] text-ink"><span className="font-bold">AI Suggestion:</span> Consider adding reference to recent CA Supreme Court decision (<em>People v. XYZ, 2023</em>)</p>
                                        <button className="text-[10px] font-sans font-bold text-ink border border-ink/30 px-2 py-0.5 mt-1.5 uppercase hover:border-ink transition-colors">Add Citation</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Argument II */}
                        <div className="border border-ink/30">
                            <button onClick={() => setShowArg2(!showArg2)} className="w-full px-4 py-3 flex items-center justify-between hover:bg-ink/[0.03] transition-colors">
                                <span className="font-sans text-xs font-bold text-ink uppercase tracking-wider">Argument II: Statute of Limitations</span>
                                <span className="text-[10px] font-sans text-neutral">{showArg2 ? "Hide ▲" : "Show ▼"}</span>
                            </button>
                            {showArg2 && (
                                <div className="p-4 border-t border-ink/20">
                                    <div className="bg-ink/[0.03] border border-ink/20 p-4">
                                        <p className="font-serif text-sm text-ink leading-relaxed">
                                            Plaintiff&apos;s claims are barred by the applicable statute of limitations. The alleged incident occurred on January 12, 2020, yet the Complaint was not filed until March 3, 2023 — more than three years later, exceeding the two-year limitations period under Cal. Code Civ. Proc. § 335.1...
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-3">
                                        <div>
                                            <span className="font-sans text-[11px] text-neutral">💪 Strength</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex-1 h-2 bg-ink/10"><div className="h-full bg-ink" style={{ width: "94%" }} /></div>
                                                <span className="font-mono text-xs font-bold text-ink">9.4/10</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-sans text-[11px] text-neutral">🎯 Persuasiveness</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex-1 h-2 bg-ink/10"><div className="h-full bg-ink" style={{ width: "88%" }} /></div>
                                                <span className="font-mono text-xs font-bold text-ink">8.8/10</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-4 border-t border-ink flex justify-between">
                        <button onClick={back} className="px-4 py-2 border border-ink text-ink font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/5 transition-colors flex items-center"><ChevronLeft className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Back</button>
                        <button onClick={next} className="px-5 py-2 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors flex items-center">Next: Review & Polish <ChevronRight className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} /></button>
                    </div>
                </div>
            )}

            {/* ═══ STEP 6: POLISH & REVIEW ═══ */}
            {step === 6 && (
                <div className="border border-ink">
                    <div className="h-10 border-b border-ink px-4 flex items-center justify-between section-inverted">
                        <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-newsprint">Final Review & AI Polish</span>
                        <span className="font-mono text-[11px] text-newsprint/70">Step 4 of 5</span>
                    </div>
                    <div className="p-5 space-y-5">
                        <p className="font-sans text-xs text-neutral">AI Proofreading Results: <span className="font-bold text-ink">✅ 3 issues found, {proofFixed.filter(Boolean).length} fixed</span></p>

                        {/* Issues */}
                        <div className="space-y-2">
                            {proofIssues.map((issue, i) => (
                                <div key={i} className={`border p-3 flex items-start gap-3 ${proofFixed[i] ? "border-ink/20 bg-ink/[0.02]" : "border-ink/40"}`}>
                                    {issue.type === "warn" ? <AlertTriangle className="w-4 h-4 text-ink shrink-0 mt-0.5" strokeWidth={1.5} /> : <Info className="w-4 h-4 text-neutral shrink-0 mt-0.5" strokeWidth={1.5} />}
                                    <div className="flex-1">
                                        <p className="font-sans text-xs font-bold text-ink">{issue.title}</p>
                                        <p className="font-sans text-[11px] text-neutral mt-0.5">{issue.desc}</p>
                                    </div>
                                    {proofFixed[i] ? (
                                        <span className="text-[9px] font-sans font-bold text-ink uppercase">Auto-fixed ✓</span>
                                    ) : (
                                        <div className="flex gap-1.5">
                                            <button onClick={() => { const f = [...proofFixed]; f[i] = true; setProofFixed(f); }} className="text-[9px] font-sans font-bold bg-ink text-newsprint px-2 py-0.5 uppercase hover:bg-ink/90">Accept</button>
                                            <button className="text-[9px] font-sans font-bold border border-ink/30 px-2 py-0.5 text-neutral uppercase hover:border-ink">Ignore</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Metrics */}
                        <div className="border border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center">
                                <span className="font-sans text-[11px] font-bold text-ink uppercase tracking-wider">📊 Document Metrics</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4">
                                {[
                                    { label: "Length", value: "12 pages", note: "within 15-page limit ✓" },
                                    { label: "Reading Level", value: "Legal professional", note: "✓" },
                                    { label: "Citations", value: "8 cases, 3 statutes", note: "✓" },
                                    { label: "Bluebook", value: "97%", note: "compliance ✓" },
                                ].map((m, i) => (
                                    <div key={i} className={`p-3 ${i < 3 ? "border-r border-ink" : ""}`}>
                                        <span className="font-sans text-[10px] text-neutral uppercase">{m.label}</span>
                                        <p className="font-mono text-sm font-bold text-ink mt-0.5">{m.value}</p>
                                        <p className="text-[9px] font-mono text-neutral">{m.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comparison */}
                        <div className="border border-ink/30 p-4">
                            <span className="font-sans text-[11px] font-bold text-ink uppercase tracking-wider block mb-2">🎯 Compared to Similar Motions</span>
                            <div className="space-y-1.5">
                                <p className="font-sans text-xs text-ink">Argument strength: <span className="font-bold">Above average (+15%)</span></p>
                                <p className="font-sans text-xs text-ink">Citation quality: <span className="font-bold">Excellent</span></p>
                                <p className="font-sans text-xs text-ink">Structure: <span className="font-bold">Matches winning template</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-ink flex justify-between">
                        <button onClick={back} className="px-4 py-2 border border-ink text-ink font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/5 transition-colors flex items-center"><ChevronLeft className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Back</button>
                        <button onClick={next} className="px-5 py-2 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors flex items-center">Next: Add Exhibits & File <ChevronRight className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} /></button>
                    </div>
                </div>
            )}

            {/* ═══ STEP 7: FINALIZATION & FILING ═══ */}
            {step === 7 && (
                <div className="border border-ink">
                    <div className="h-10 border-b border-ink px-4 flex items-center justify-between section-inverted">
                        <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-newsprint">Finalize Document</span>
                        <span className="font-mono text-[11px] text-newsprint/70">Step 5 of 5</span>
                    </div>
                    <div className="p-5 space-y-5">
                        {/* Exhibits */}
                        <div>
                            <span className="font-sans text-xs font-bold text-ink uppercase tracking-wider flex items-center mb-3">
                                <Paperclip className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />Attach Supporting Documents
                            </span>
                            <div className="space-y-2">
                                {["Exhibit A — Contract (from Evidence Vault)", "Exhibit B — Email Chain", "Proposed Order"].map((ex, i) => (
                                    <label key={i} className="flex items-center gap-3 px-3 py-2 border border-ink/20 hover:border-ink/40 transition-colors cursor-pointer">
                                        <div className={`w-4 h-4 border flex items-center justify-center ${exhibits[i] ? "border-ink bg-ink" : "border-ink/40"}`}>
                                            {exhibits[i] && <Check className="w-2.5 h-2.5 text-newsprint" strokeWidth={2} />}
                                        </div>
                                        <span className="font-sans text-xs text-ink">{ex}</span>
                                        <input type="checkbox" checked={exhibits[i]} onChange={() => { const e = [...exhibits]; e[i] = !e[i]; setExhibits(e); }} className="sr-only" />
                                    </label>
                                ))}
                                <button className="text-[11px] font-sans font-bold text-ink hover:text-accent transition-colors">+ Add Exhibit</button>
                            </div>
                        </div>

                        {/* Signature */}
                        <div>
                            <span className="font-sans text-xs font-bold text-ink uppercase tracking-wider flex items-center mb-3">
                                <Pen className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />Signature
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="font-sans text-[11px] font-bold text-neutral uppercase tracking-wider block mb-1">Signing Attorney</label>
                                    <select className="w-full border border-ink bg-newsprint px-3 py-2 font-sans text-xs text-ink outline-none">
                                        <option>Adv. Prit Thacker, Esq.</option>
                                        <option>Adv. Meera Sharma</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-sans text-[11px] font-bold text-neutral uppercase tracking-wider block mb-1">Bar Number</label>
                                    <input defaultValue="MH-BAR-2024-4567" className="w-full border border-ink bg-newsprint px-3 py-2 font-mono text-xs text-ink outline-none" readOnly />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <div className="w-4 h-4 border border-ink bg-ink flex items-center justify-center"><Check className="w-2.5 h-2.5 text-newsprint" strokeWidth={2} /></div>
                                <span className="font-sans text-xs text-ink">Use Digital Signature</span>
                            </label>
                        </div>

                        {/* Filing Options */}
                        <div>
                            <span className="font-sans text-xs font-bold text-ink uppercase tracking-wider block mb-3">📅 Filing Options</span>
                            <div className="space-y-2">
                                {[
                                    { id: "draft", label: "Save as Draft", detail: null },
                                    { id: "review", label: "Send for Internal Review", detail: "Reviewers: @Senior Partner, @Paralegal" },
                                    { id: "efile", label: "E-File with Court", detail: "Court: LA Superior Court (Auto-detected) · Filing Fee: $435" },
                                    { id: "download", label: "Download Only (PDF/DOCX)", detail: null },
                                ].map(opt => (
                                    <button key={opt.id} onClick={() => setFilingOption(opt.id)}
                                        className={`w-full px-4 py-3 flex items-start gap-3 text-left border transition-colors ${filingOption === opt.id ? "border-ink bg-ink/[0.06]" : "border-ink/20 hover:border-ink/40"}`}>
                                        <div className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 mt-0.5 ${filingOption === opt.id ? "border-ink" : "border-ink/30"}`}>
                                            {filingOption === opt.id && <div className="w-2 h-2 bg-ink" />}
                                        </div>
                                        <div>
                                            <span className="font-sans text-xs font-bold text-ink">{opt.label}</span>
                                            {opt.detail && <p className="font-mono text-[10px] text-neutral mt-0.5">{opt.detail}</p>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Service */}
                        <div>
                            <span className="font-sans text-xs font-bold text-ink uppercase tracking-wider flex items-center mb-3">
                                <Send className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />Serve Opposing Counsel
                            </span>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 px-3 py-2 border border-ink/20 cursor-pointer">
                                    <div className={`w-4 h-4 border flex items-center justify-center ${serveEmail ? "border-ink bg-ink" : "border-ink/40"}`}>
                                        {serveEmail && <Check className="w-2.5 h-2.5 text-newsprint" strokeWidth={2} />}
                                    </div>
                                    <span className="font-sans text-xs text-ink">Email to opposing.counsel@lawfirm.com</span>
                                    <input type="checkbox" checked={serveEmail} onChange={e => setServeEmail(e.target.checked)} className="sr-only" />
                                </label>
                                <label className="flex items-center gap-3 px-3 py-2 border border-ink/20 cursor-pointer">
                                    <div className={`w-4 h-4 border flex items-center justify-center ${serveMail ? "border-ink bg-ink" : "border-ink/40"}`}>
                                        {serveMail && <Check className="w-2.5 h-2.5 text-newsprint" strokeWidth={2} />}
                                    </div>
                                    <span className="font-sans text-xs text-ink">Send via certified mail</span>
                                    <input type="checkbox" checked={serveMail} onChange={e => setServeMail(e.target.checked)} className="sr-only" />
                                </label>
                            </div>
                            <p className="font-mono text-[10px] text-neutral mt-2">Certificate of Service auto-generated ✓</p>
                        </div>
                    </div>

                    {/* Final Actions */}
                    <div className="p-4 border-t border-ink flex items-center justify-between">
                        <button onClick={back} className="px-4 py-2 border border-ink text-ink font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/5 transition-colors flex items-center"><ChevronLeft className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Back</button>
                        <div className="flex gap-2">
                            <button onClick={() => toast.success("DRAFT SAVED")} className="px-4 py-2 border border-ink text-ink font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/5 transition-colors flex items-center">
                                <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Draft
                            </button>
                            <button onClick={() => toast.success("DOCUMENT FILED SUCCESSFULLY")} className="px-5 py-2 bg-ink text-newsprint font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors flex items-center">
                                <Send className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />File Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
