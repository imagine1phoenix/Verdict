"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Scale, PlayCircle, FileText, Bot, UploadCloud, CheckCircle2,
    Users, Timer, Gavel, MessageSquare, Brain, Shield,
    BarChart3, Download, ChevronRight, Mic, Monitor, AlertTriangle,
    Zap, Target, Heart, TrendingUp, ClipboardList, Video
} from '@/components/Icons';
import { toast } from "react-hot-toast";

/* ─── Types & Data ─── */

type Phase = "setup" | "execution" | "analysis";

const trialTemplates = [
    { id: "civil", label: "Civil Litigation", icon: Scale },
    { id: "criminal", label: "Criminal Defense", icon: Shield },
    { id: "corporate", label: "Corporate / Commercial", icon: BarChart3 },
    { id: "family", label: "Family Law", icon: Heart },
    { id: "ip", label: "IP Disputes", icon: Brain },
    { id: "custom", label: "Custom Template", icon: ClipboardList },
];

const roles = [
    { role: "Judge", assigned: "AI Simulation" },
    { role: "Prosecution", assigned: "Adv. Prit Thacker" },
    { role: "Defense", assigned: "AI-Simulated Counsel" },
    { role: "Witness #1", assigned: "Unassigned" },
    { role: "Jury Panel", assigned: "AI-Simulated (5 jurors)" },
];

const trialTypes = ["Full Trial", "Opening / Closing Only", "Cross-Examination Focus"];

const jurisdictions = ["Supreme Court of India", "High Court — Maharashtra", "District Court — Mumbai", "International Arbitration (ICC)", "US Federal Court"];

const aiFeatures = [
    { icon: Target, title: "Argument Strength", desc: "Real-time scoring of argument quality and persuasiveness", value: "82%" },
    { icon: Zap, title: "Counter-Arguments", desc: "AI-generated rebuttals and alternative framings", value: "3 suggested" },
    { icon: Gavel, title: "Objection Checker", desc: "Validates objection grounds against procedural rules", value: "Active" },
    { icon: FileText, title: "Precedent Finder", desc: "Live case law suggestions matching current arguments", value: "7 found" },
    { icon: Heart, title: "Tone Analysis", desc: "Emotional tone and jury perception scoring", value: "Confident" },
    { icon: TrendingUp, title: "Jury Prediction", desc: "Predicted verdict based on current performance", value: "Favorable" },
];

const postTrialScores = [
    { name: "Adv. Prit (Prosecution)", clarity: 88, persuasion: 82, evidence: 91, overall: 87 },
    { name: "AI Counsel (Defense)", clarity: 79, persuasion: 85, evidence: 74, overall: 79 },
];

const improvements = [
    "Strengthen timeline evidence for events after Aug 12 — jury showed uncertainty",
    "Opening statement could benefit from stronger emotional framing in first 60 seconds",
    "Cross-examination pacing was too fast — slow down for emphasis on key admissions",
    "Consider using demonstrative exhibits for complex financial data",
];

/* ─── Component ─── */

export default function MockTrialsPage() {
    const [phase, setPhase] = useState<Phase>("setup");
    const [selectedTemplate, setSelectedTemplate] = useState("civil");
    const [selectedType, setSelectedType] = useState("Full Trial");
    const [isSimulating, setIsSimulating] = useState(false);

    const handleStartTrial = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSimulating(true);
        toast("INITIALIZING MOCK TRIAL...");

        setTimeout(() => {
            setIsSimulating(false);
            setPhase("execution");
            toast.success("MOCK TRIAL STARTED");
        }, 3000);
    };

    const handleEndTrial = () => {
        setPhase("analysis");
        toast.success("TRIAL CONCLUDED — GENERATING ANALYSIS");
    };

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col">

            {/* ── Header ── */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1">Mock Trials AI</h1>
                        <p className="text-sm font-sans text-neutral">
                            Set up, execute, and analyze simulated court proceedings with AI-powered insights.
                        </p>
                    </div>
                    {/* Phase Indicator */}
                    <div className="flex border border-ink shrink-0">
                        {(["setup", "execution", "analysis"] as Phase[]).map((p, i) => (
                            <button
                                key={p}
                                onClick={() => setPhase(p)}
                                className={`px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-wider transition-colors ${i < 2 ? 'border-r border-ink' : ''} ${phase === p ? 'bg-ink text-newsprint' : 'text-ink hover:bg-ink/5'}`}
                            >
                                <span className="text-accent mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">

                {/* ══════════════════════════════ SETUP PHASE ══════════════════════════════ */}
                {phase === "setup" && (
                    <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <form onSubmit={handleStartTrial} className="space-y-6">

                            {/* Trial Templates */}
                            <div className="border border-ink">
                                <div className="h-9 border-b border-ink px-4 flex items-center">
                                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Select Trial Template</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                                    {trialTemplates.map((t, i) => (
                                        <button
                                            type="button"
                                            key={t.id}
                                            onClick={() => setSelectedTemplate(t.id)}
                                            className={`p-4 flex flex-col items-center gap-2 transition-colors ${i < trialTemplates.length - 1 ? 'border-r border-ink' : ''} ${selectedTemplate === t.id ? 'bg-ink text-newsprint' : 'hover:bg-ink/5 text-ink'}`}
                                        >
                                            <t.icon className="w-5 h-5" strokeWidth={1.5} />
                                            <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-center leading-tight">{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Case + Configuration */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 border border-ink">

                                {/* Case Selection & Facts */}
                                <div className="lg:col-span-2 flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                                    <div className="h-9 border-b border-ink px-4 flex items-center">
                                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Case Details</span>
                                    </div>
                                    <div className="p-5 space-y-4 flex-1">
                                        <div>
                                            <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Select Existing Case or Enter New</label>
                                            <select className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink uppercase cursor-pointer">
                                                <option>Sharma v. State — Criminal Defense</option>
                                                <option>Nexus Inc. Patent Dispute — IP</option>
                                                <option>Horizon Corp Acquisition — Corporate</option>
                                                <option>+ Enter New Case Facts</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Case Facts / Summary</label>
                                            <textarea
                                                rows={4}
                                                placeholder="Enter core facts of litigation or select an existing case above..."
                                                className="w-full border border-ink p-3 font-mono text-xs bg-newsprint outline-none resize-none placeholder:text-neutral/50 placeholder:text-[10px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Evidence Upload</label>
                                            <div className="border border-dashed border-ink p-4 text-center hover:bg-ink/5 transition-colors cursor-pointer">
                                                <UploadCloud className="w-5 h-5 text-ink mx-auto mb-1" strokeWidth={1.5} />
                                                <p className="text-[10px] font-sans font-bold text-ink uppercase tracking-wider">Drop files here — PDF, DOCX, TXT (Max 50MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Configuration */}
                                <div className="flex flex-col">
                                    <div className="h-9 border-b border-ink px-4 flex items-center">
                                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Configuration</span>
                                    </div>
                                    <div className="p-4 space-y-4 flex-1">
                                        <div>
                                            <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Trial Type</label>
                                            {trialTypes.map(t => (
                                                <label key={t} className="flex items-center py-1.5 cursor-pointer hover:bg-ink/5 px-1 transition-colors">
                                                    <input type="radio" name="trialType" checked={selectedType === t} onChange={() => setSelectedType(t)} className="mr-2.5 accent-ink" />
                                                    <span className="font-sans text-[11px] font-semibold text-ink">{t}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Jurisdiction / Rules</label>
                                            <select className="w-full border-b border-ink py-2 font-mono text-[11px] bg-transparent outline-none text-ink cursor-pointer">
                                                {jurisdictions.map(j => <option key={j}>{j}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-sans font-bold text-neutral mb-2 uppercase tracking-wider">Time Limit Per Phase</label>
                                            <div className="flex gap-2">
                                                <input type="number" defaultValue={15} className="w-16 border-b border-ink py-1 font-mono text-sm bg-transparent outline-none text-ink text-center" />
                                                <span className="font-mono text-xs text-neutral self-end pb-1">minutes</span>
                                            </div>
                                        </div>
                                        <label className="flex items-center mt-2 cursor-pointer hover:bg-ink/5 px-1 py-1.5 transition-colors">
                                            <input type="checkbox" defaultChecked className="mr-2.5 accent-ink" />
                                            <span className="font-sans text-[11px] font-semibold text-ink">AI-Simulated Opposing Counsel</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Role Assignment */}
                            <div className="border border-ink">
                                <div className="h-9 border-b border-ink px-4 flex items-center">
                                    <Users className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Role Assignment</span>
                                </div>
                                <div className="divide-y divide-ink/10">
                                    {roles.map((r, i) => (
                                        <div key={i} className="flex items-center px-4 py-2.5 hover:bg-ink/[0.03] transition-colors">
                                            <span className="font-sans text-[11px] font-bold text-ink w-32 uppercase tracking-wider">{r.role}</span>
                                            <ChevronRight className="w-3 h-3 text-neutral mx-2" strokeWidth={1.5} />
                                            <span className={`font-mono text-[11px] ${r.assigned === 'Unassigned' ? 'text-accent' : 'text-neutral'}`}>{r.assigned}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Start Button */}
                            <button
                                disabled={isSimulating}
                                type="submit"
                                className="w-full flex justify-center items-center py-3.5 bg-ink text-newsprint font-sans text-xs font-bold hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                            >
                                <PlayCircle className="w-4 h-4 mr-2" strokeWidth={1.5} />
                                {isSimulating ? "Initializing Trial..." : "Begin Mock Trial"}
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* ══════════════════════════════ EXECUTION PHASE ══════════════════════════════ */}
                {phase === "execution" && (
                    <motion.div key="execution" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

                        {/* Trial Status Bar */}
                        <div className="section-inverted border border-ink">
                            <div className="px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-newsprint flex items-center">
                                        <span className="w-2 h-2 bg-accent mr-2 animate-pulse" /> Live — Mock Trial in Progress
                                    </span>
                                    <span className="font-mono text-xs text-neutral">Sharma v. State</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm text-newsprint font-bold flex items-center">
                                        <Timer className="w-3.5 h-3.5 mr-1.5 text-accent" strokeWidth={1.5} /> 12:34
                                    </span>
                                    <span className="text-[9px] font-sans font-bold bg-accent text-newsprint px-2 py-0.5 uppercase">Phase: Cross-Examination</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Trial Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 border border-ink min-h-[450px]">

                            {/* Video / Presentation Area — 2/3 */}
                            <div className="lg:col-span-2 flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                                <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink flex items-center">
                                        <Video className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} /> Trial Room
                                    </span>
                                    <div className="flex gap-2">
                                        <button className="text-[9px] font-sans font-bold border border-ink px-2 py-0.5 text-ink hover:bg-ink/5 transition-colors uppercase">
                                            <Monitor className="w-3 h-3 inline mr-1" strokeWidth={1.5} />Share Screen
                                        </button>
                                        <button className="text-[9px] font-sans font-bold border border-ink px-2 py-0.5 text-ink hover:bg-ink/5 transition-colors uppercase">
                                            <Mic className="w-3 h-3 inline mr-1" strokeWidth={1.5} />Mic
                                        </button>
                                    </div>
                                </div>

                                {/* @TODO [BACKEND]: WebRTC video conferencing area */}
                                <div className="flex-1 bg-ink/[0.03] flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <Video className="w-12 h-12 text-neutral/30 mx-auto mb-3" strokeWidth={1} />
                                        <p className="font-serif text-lg text-neutral">Video conferencing panel</p>
                                        <p className="text-[10px] font-mono text-neutral/50 mt-1 uppercase">Requires WebRTC backend integration</p>
                                    </div>
                                </div>

                                {/* Live Transcript */}
                                <div className="border-t border-ink">
                                    <div className="h-8 border-b border-ink/30 px-4 flex items-center">
                                        <Mic className="w-3 h-3 mr-2 text-accent" strokeWidth={1.5} />
                                        <span className="font-sans text-[9px] font-bold tracking-widest uppercase text-neutral">Live Transcript</span>
                                    </div>
                                    <div className="p-4 max-h-32 overflow-y-auto font-mono text-xs text-ink/70 leading-relaxed">
                                        <p><span className="text-ink font-bold">[Prosecution]</span> Your Honor, the evidence clearly shows that the defendant was aware of the contractual obligations as outlined in Exhibit A...</p>
                                        <p className="mt-2"><span className="text-ink font-bold">[Defense AI]</span> Objection, Your Honor. The prosecution is characterizing my client&apos;s awareness without establishing proper foundation...</p>
                                        <p className="mt-2 text-neutral/50 italic">— Transcribing...</p>
                                    </div>
                                </div>
                            </div>

                            {/* Control Panel — 1/3 */}
                            <div className="flex flex-col overflow-y-auto">
                                {/* Objection System */}
                                <div className="border-b border-ink p-4">
                                    <span className="font-sans text-[9px] font-bold tracking-widest uppercase text-neutral block mb-3">Quick Actions</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => toast("OBJECTION RAISED!")} className="bg-accent text-newsprint py-2 font-sans text-[10px] font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors flex items-center justify-center">
                                            <AlertTriangle className="w-3 h-3 mr-1" strokeWidth={1.5} /> Objection!
                                        </button>
                                        <button onClick={() => toast("SUSTAINED")} className="border border-ink py-2 font-sans text-[10px] font-bold uppercase tracking-wider text-ink hover:bg-ink/5 transition-colors">
                                            Sustained
                                        </button>
                                        <button onClick={() => toast("OVERRULED")} className="border border-ink py-2 font-sans text-[10px] font-bold uppercase tracking-wider text-ink hover:bg-ink/5 transition-colors">
                                            Overruled
                                        </button>
                                        <button onClick={() => toast("SIDEBAR REQUESTED")} className="border border-ink py-2 font-sans text-[10px] font-bold uppercase tracking-wider text-ink hover:bg-ink/5 transition-colors">
                                            Sidebar
                                        </button>
                                    </div>
                                </div>

                                {/* Judge's Notepad */}
                                <div className="border-b border-ink p-4 flex-1">
                                    <span className="font-sans text-[9px] font-bold tracking-widest uppercase text-neutral block mb-2">Judge&apos;s Notepad</span>
                                    <textarea
                                        rows={4}
                                        placeholder="Take notes during the trial..."
                                        className="w-full border border-ink/30 p-2 font-mono text-[11px] bg-transparent outline-none resize-none placeholder:text-neutral/40 placeholder:text-[10px]"
                                    />
                                </div>

                                {/* Observer Chat */}
                                <div className="p-4">
                                    <span className="font-sans text-[9px] font-bold tracking-widest uppercase text-neutral block mb-2 flex items-center">
                                        <MessageSquare className="w-3 h-3 mr-1.5" strokeWidth={1.5} /> Observer Chat
                                    </span>
                                    <div className="border border-ink/30 p-2 space-y-2 max-h-24 overflow-y-auto mb-2">
                                        <p className="text-[10px] font-sans text-neutral"><span className="font-bold text-ink">Adv. Meera:</span> Strong opening, watch the timeline argument</p>
                                        <p className="text-[10px] font-sans text-neutral"><span className="font-bold text-ink">Adv. Rohan:</span> Defense AI is aggressive on foundation objections</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <input placeholder="MESSAGE..." className="flex-1 border-b border-ink py-1 font-mono text-[10px] bg-transparent outline-none placeholder:text-neutral/40 uppercase" />
                                        <button className="bg-ink text-newsprint px-2 py-1 text-[9px] font-sans font-bold uppercase">Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Features During Trial */}
                        <div className="border border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center section-inverted">
                                <Brain className="w-3.5 h-3.5 mr-2 text-newsprint" strokeWidth={1.5} />
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">AI Analysis — Live</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                                {aiFeatures.map((f, i) => (
                                    <div key={i} className={`p-3 flex flex-col hover:bg-ink/5 transition-colors cursor-pointer ${i < aiFeatures.length - 1 ? 'border-r border-ink' : ''}`}>
                                        <f.icon className="w-4 h-4 text-ink mb-2" strokeWidth={1.5} />
                                        <span className="font-sans text-[9px] font-bold text-ink uppercase tracking-wider mb-0.5">{f.title}</span>
                                        <span className="text-[9px] font-sans text-neutral leading-snug mb-2">{f.desc}</span>
                                        <span className="font-mono text-xs font-bold text-ink mt-auto">{f.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* End Trial Button */}
                        <button onClick={handleEndTrial} className="w-full py-3 bg-accent text-newsprint font-sans text-xs font-bold uppercase tracking-widest hover:bg-accent/90 transition-colors">
                            Conclude Trial & Generate Analysis
                        </button>
                    </motion.div>
                )}

                {/* ══════════════════════════════ ANALYSIS PHASE ══════════════════════════════ */}
                {phase === "analysis" && (
                    <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

                        {/* Summary Bar */}
                        <div className="section-inverted border border-ink p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="font-serif text-xl font-bold text-newsprint mb-1">Post-Trial Analysis</h2>
                                <p className="text-[11px] font-mono text-neutral">Sharma v. State — Full Trial — Duration: 47 min — Concluded just now</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => toast("DOWNLOADING TRANSCRIPT...")} className="flex items-center px-3 py-1.5 border border-newsprint/30 text-newsprint font-sans text-[10px] font-bold uppercase tracking-wider hover:bg-newsprint/10 transition-colors">
                                    <Download className="w-3 h-3 mr-1.5" strokeWidth={1.5} /> Transcript
                                </button>
                                <button onClick={() => toast("GENERATING PDF...")} className="flex items-center px-3 py-1.5 bg-accent text-newsprint font-sans text-[10px] font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors">
                                    <Download className="w-3 h-3 mr-1.5" strokeWidth={1.5} /> Export PDF
                                </button>
                            </div>
                        </div>

                        {/* Performance Scorecards */}
                        <div className="border border-ink">
                            <div className="h-9 border-b border-ink px-4 flex items-center">
                                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Performance Scorecard</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-ink bg-ink/[0.03]">
                                            <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Participant</th>
                                            <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Clarity</th>
                                            <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Persuasion</th>
                                            <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Evidence Use</th>
                                            <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Overall</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {postTrialScores.map((p, i) => (
                                            <tr key={i} className="border-b border-ink/10">
                                                <td className="px-4 py-3 font-sans text-xs font-bold text-ink">{p.name}</td>
                                                <td className="text-center px-4 py-3 font-mono text-sm font-bold text-ink">{p.clarity}%</td>
                                                <td className="text-center px-4 py-3 font-mono text-sm font-bold text-ink">{p.persuasion}%</td>
                                                <td className="text-center px-4 py-3 font-mono text-sm font-bold text-ink">{p.evidence}%</td>
                                                <td className="text-center px-4 py-3">
                                                    <span className={`font-mono text-sm font-bold px-2 py-0.5 ${p.overall >= 85 ? 'bg-ink text-newsprint' : 'border border-ink text-ink'}`}>
                                                        {p.overall}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Key Metrics + Improvements */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 border border-ink">
                            {/* Verdict Prediction */}
                            <div className="flex flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-ink">
                                <span className="font-sans text-[9px] font-bold text-neutral uppercase tracking-widest mb-3">AI Verdict Prediction</span>
                                <span className="font-mono text-5xl font-bold text-ink">78%</span>
                                <span className="font-sans text-[10px] font-bold text-ink mt-2 uppercase">Favorable Outcome</span>
                                <span className="font-mono text-[9px] text-neutral mt-1">+4% from previous trial</span>
                            </div>

                            {/* AI Improvements */}
                            <div className="lg:col-span-2 flex flex-col">
                                <div className="h-9 border-b border-ink px-4 flex items-center">
                                    <Brain className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">AI-Generated Improvements</span>
                                </div>
                                <div className="p-4 space-y-3">
                                    {improvements.map((imp, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="font-mono text-[10px] font-bold text-accent shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                            <p className="font-serif text-xs text-ink leading-relaxed">{imp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recording + Full Transcript placeholder */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 border border-ink">
                            <div className="flex flex-col items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-ink">
                                <Video className="w-10 h-10 text-neutral/30 mb-3" strokeWidth={1} />
                                <span className="font-serif text-sm text-neutral">Video Recording Playback</span>
                                <span className="font-mono text-[9px] text-neutral/50 mt-1 uppercase">Requires media storage backend</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-8">
                                <FileText className="w-10 h-10 text-neutral/30 mb-3" strokeWidth={1} />
                                <span className="font-serif text-sm text-neutral">Full Transcript with Timestamps</span>
                                <span className="font-mono text-[9px] text-neutral/50 mt-1 uppercase">47 min · 12,400 words · Searchable</span>
                            </div>
                        </div>

                        {/* Reset */}
                        <button onClick={() => { setPhase("setup"); setIsSimulating(false); }} className="w-full py-3 border border-ink text-ink font-sans text-xs font-bold uppercase tracking-widest hover:bg-ink/5 transition-colors">
                            Start New Mock Trial
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
