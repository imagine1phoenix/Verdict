"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Minimize2, Maximize2, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant" | "system"; text: string };

const suggestions = [
    "Summarize the Sharma v. State case",
    "What precedents apply to DPDP Act?",
    "Draft a bail application outline",
    "Explain Section 3(d) patentability",
];

export default function AIChatbot() {
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "system", text: "I'm Verdict AI — your legal research assistant. Ask me about cases, precedents, drafting, or legal concepts." },
    ]);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);

        // Simulate AI response
        setTimeout(() => {
            let response = "I'd be happy to help with that. Let me research this for you...";
            if (userMsg.toLowerCase().includes("sharma")) {
                response = "**Sharma v. State of Maharashtra (VDT-2024-001)**\n\nCriminal defense case currently in Discovery phase. Filed Jan 15, 2024 in HC Mumbai before Hon. Justice R. Deshmukh.\n\n**Key dates:** Evidence submission deadline Feb 28, Pre-trial conference Mar 15, Trial date Apr 5.\n\n**AI Win Prediction:** 72% based on evidence strength and similar precedents (State v. Patel — 87% similar).";
            } else if (userMsg.toLowerCase().includes("dpdp") || userMsg.toLowerCase().includes("privacy")) {
                response = "**Relevant DPDP Act Precedents:**\n\n1. **K.S. Puttaswamy v. UOI (2019)** — Right to privacy as fundamental right under Art. 21. Foundation for all data protection arguments.\n\n2. **DPDP Act 2023, Section 8** — Data fiduciary obligations regarding consent and purpose limitation.\n\n3. **DataLink Privacy Breach (TX-2024-005)** — Recent firm win using DPDP provisions in HC Karnataka. Expert testimony on data flow was persuasive.";
            } else if (userMsg.toLowerCase().includes("draft") || userMsg.toLowerCase().includes("bail")) {
                response = "**Bail Application Outline:**\n\n1. **Court & Case Details** — Case number, accused details, sections charged\n2. **Facts in Brief** — Concise case narrative\n3. **Grounds for Bail:**\n   - No flight risk\n   - Cooperation with investigation\n   - No tampering with evidence\n   - Surety available\n4. **Legal Precedents** — Cite Arnesh Kumar v. State of Bihar (2014)\n5. **Prayer** — Grant of regular bail with conditions";
            } else if (userMsg.toLowerCase().includes("section 3") || userMsg.toLowerCase().includes("patent")) {
                response = "**Section 3(d) — Indian Patents Act:**\n\nBars patents on new forms of known substances unless enhanced efficacy is demonstrated. Key case: **Novartis v. UOI (2013)** — SC held that Glivec's beta-crystalline form didn't show enhanced therapeutic efficacy over the known compound.\n\n**Implication:** All pharma patents in India must clear this higher bar compared to US/EU jurisdictions.";
            }
            setMessages(prev => [...prev, { role: "assistant", text: response }]);
        }, 1200);
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-11 h-11 md:w-12 md:h-12 bg-ink text-newsprint flex items-center justify-center hover:bg-ink/90 transition-all group shadow-lg"
            >
                <Bot className="w-5 h-5" strokeWidth={1.5} />
                <span className="absolute -top-8 right-0 bg-ink text-newsprint text-[9px] font-sans font-bold px-2 py-1 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    AI Assistant
                </span>
            </button>
        );
    }

    return (
        <div className={`fixed z-50 bg-newsprint border border-ink flex flex-col shadow-xl transition-all ${minimized ? 'bottom-4 right-4 md:bottom-6 md:right-6 w-72 h-12' : 'inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[520px]'}`}>
            {/* Header */}
            <div className="h-10 border-b border-ink px-3 flex items-center justify-between section-inverted shrink-0">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-newsprint" strokeWidth={1.5} />
                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">Verdict AI Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setMinimized(!minimized)} className="text-newsprint/70 hover:text-newsprint transition-colors p-1">
                        {minimized ? <Maximize2 className="w-3 h-3" strokeWidth={1.5} /> : <Minimize2 className="w-3 h-3" strokeWidth={1.5} />}
                    </button>
                    <button onClick={() => setOpen(false)} className="text-newsprint/70 hover:text-newsprint transition-colors p-1">
                        <X className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {!minimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] px-3 py-2 ${msg.role === "user" ? "bg-ink text-newsprint" : msg.role === "system" ? "bg-ink/5 border border-ink/20" : "border border-ink/20"}`}>
                                    {msg.role === "assistant" ? (
                                        <div className="font-sans text-[11px] text-ink leading-relaxed whitespace-pre-line">{msg.text}</div>
                                    ) : (
                                        <p className={`font-sans text-[11px] leading-relaxed ${msg.role === "user" ? "text-newsprint" : "text-ink"}`}>{msg.text}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>

                    {/* Suggestions (only if no user messages yet) */}
                    {messages.length <= 1 && (
                        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                            {suggestions.map((s, i) => (
                                <button key={i} onClick={() => { setInput(s); }} className="text-[9px] font-sans font-bold border border-ink/30 px-2 py-1 text-neutral hover:text-ink hover:border-ink transition-colors">
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="border-t border-ink px-3 py-2 flex items-center gap-2 shrink-0">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSend()}
                            placeholder="Ask anything..."
                            className="flex-1 bg-transparent font-mono text-[11px] text-ink outline-none placeholder:text-neutral/50"
                        />
                        <button onClick={handleSend} className="bg-ink text-newsprint p-1.5 hover:bg-ink/90 transition-colors">
                            <Send className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
