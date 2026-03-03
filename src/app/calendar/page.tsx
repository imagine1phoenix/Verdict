"use client";

import { useState } from "react";
import {
    Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, MapPin, Clock,
    X, Gavel, Users, FileText, AlertTriangle, Timer, BookOpen, User,
    Bell, Mail, Smartphone, Download, RefreshCw, ExternalLink, Layers
} from "lucide-react";
import { toast } from "react-hot-toast";

/* ─── Types & Data ─── */

type ViewMode = "daily" | "weekly" | "monthly" | "agenda" | "timeline";

type EventType = "hearing" | "meeting" | "mock-trial" | "deadline" | "deposition" | "internal" | "reminder" | "limitation";

const eventTypeConfig: Record<EventType, { label: string; color: string; icon: typeof Gavel }> = {
    "hearing": { label: "Court Hearing", color: "bg-ink", icon: Gavel },
    "meeting": { label: "Client Meeting", color: "bg-neutral", icon: Users },
    "mock-trial": { label: "Mock Trial", color: "bg-ink", icon: BookOpen },
    "deadline": { label: "Filing Deadline", color: "bg-accent", icon: AlertTriangle },
    "deposition": { label: "Deposition", color: "bg-neutral", icon: FileText },
    "internal": { label: "Internal Meeting", color: "bg-ink/50", icon: Users },
    "reminder": { label: "Personal Reminder", color: "bg-ink/30", icon: Bell },
    "limitation": { label: "Statute of Limitations", color: "bg-accent", icon: Timer },
};

type CalEvent = {
    id: number; title: string; type: EventType; date: string; time: string;
    lawyer: string; case?: string; location?: string; conflict?: boolean;
};

const events: CalEvent[] = [
    { id: 1, title: "Sharma v. State — Hearing #4", type: "hearing", date: "2026-02-24", time: "10:00 AM", lawyer: "Adv. Prit", case: "VDT-2024-001", location: "HC Mumbai, Court 3" },
    { id: 2, title: "Horizon Corp — Client Call", type: "meeting", date: "2026-02-24", time: "2:00 PM", lawyer: "Adv. Prit", case: "VDT-2024-003" },
    { id: 3, title: "Nexus IP — Filing Deadline", type: "deadline", date: "2026-02-25", time: "EOD", lawyer: "Adv. Meera", case: "VDT-2024-002" },
    { id: 4, title: "Mock Trial — Smith v. Jones", type: "mock-trial", date: "2026-02-25", time: "11:00 AM", lawyer: "Adv. Prit", case: "VDT-2024-001" },
    { id: 5, title: "Dr. Mehta Deposition", type: "deposition", date: "2026-02-26", time: "3:00 PM", lawyer: "Adv. Meera", case: "VDT-2024-001", location: "Office — Conference Room A" },
    { id: 6, title: "Team Standup", type: "internal", date: "2026-02-24", time: "9:00 AM", lawyer: "All" },
    { id: 7, title: "DEF Corp — Hearing (Conflict!)", type: "hearing", date: "2026-02-24", time: "10:00 AM", lawyer: "Adv. Rohan", case: "VDT-2024-004", location: "District Court Pune", conflict: true },
    { id: 8, title: "Sharma — Limitation Expires", type: "limitation", date: "2026-03-15", time: "EOD", lawyer: "Adv. Prit", case: "VDT-2024-001" },
    { id: 9, title: "Review Bail Application", type: "reminder", date: "2026-02-24", time: "5:00 PM", lawyer: "Adv. Prit" },
    { id: 10, title: "CloudNet — Evidence Deadline", type: "deadline", date: "2026-02-27", time: "EOD", lawyer: "Adv. Meera", case: "VDT-2024-006" },
    { id: 11, title: "Gupta Estate — Initial Consultation", type: "meeting", date: "2026-02-28", time: "11:00 AM", lawyer: "Adv. Priya", case: "VDT-2024-005", location: "Office" },
    { id: 12, title: "GreenTech — Compliance Review", type: "internal", date: "2026-02-26", time: "4:00 PM", lawyer: "Adv. Rohan" },
];

const courtHolidays = [
    { date: "Feb 26 (Wed)", name: "Maha Shivaratri", jurisdiction: "All Courts — Maharashtra" },
    { date: "Mar 14 (Fri)", name: "Holi", jurisdiction: "All Courts — National" },
    { date: "Mar 31 (Mon)", name: "Eid-ul-Fitr", jurisdiction: "High Courts" },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthDates = Array.from({ length: 28 }, (_, i) => i + 1);

const lawyerFilters = ["All", "Adv. Prit", "Adv. Meera", "Adv. Rohan", "Adv. Priya"];

const integrations = [
    { name: "Google Calendar", status: "Connected", icon: "G" },
    { name: "Outlook 365", status: "Not Connected", icon: "O" },
    { name: "Apple Calendar", status: "Not Connected", icon: "A" },
];

/* ─── Component ─── */

export default function CalendarPage() {
    const [view, setView] = useState<ViewMode>("weekly");
    const [showModal, setShowModal] = useState(false);
    const [lawyerFilter, setLawyerFilter] = useState("All");

    const filteredEvents = lawyerFilter === "All"
        ? events
        : events.filter(e => e.lawyer === lawyerFilter || e.lawyer === "All");

    const todayEvents = filteredEvents.filter(e => e.date === "2026-02-24");
    const conflicts = events.filter(e => e.conflict);

    const views: { id: ViewMode; label: string }[] = [
        { id: "daily", label: "Day" },
        { id: "weekly", label: "Week" },
        { id: "monthly", label: "Month" },
        { id: "agenda", label: "Agenda" },
        { id: "timeline", label: "Timeline" },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col">

            {/* ── Header ── */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center">
                            <CalendarIcon className="w-6 h-6 mr-3" strokeWidth={1.5} />
                            Calendar
                        </h1>
                        <p className="text-sm font-sans text-neutral">Court hearings, deadlines, depositions, and team schedules — all in one view.</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={() => toast("EXPORTING ICAL...")} className="flex items-center px-3 py-2 border border-ink text-ink hover:bg-ink/5 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider">
                            <Download className="w-3 h-3 mr-1.5" strokeWidth={1.5} /> iCal
                        </button>
                        <button onClick={() => setShowModal(true)} className="flex items-center px-3 py-2 bg-ink text-newsprint hover:bg-ink/90 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider">
                            <Plus className="w-3 h-3 mr-1.5" strokeWidth={1.5} /> New Event
                        </button>
                    </div>
                </div>
            </div>

            {/* ── View Tabs + Filters ── */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex border border-ink">
                    {views.map((v, i) => (
                        <button
                            key={v.id}
                            onClick={() => setView(v.id)}
                            className={`px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-wider transition-colors ${i < views.length - 1 ? 'border-r border-ink' : ''} ${view === v.id ? 'bg-ink text-newsprint' : 'text-ink hover:bg-ink/5'}`}
                        >
                            {v.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center border border-ink px-3">
                    <Layers className="w-3.5 h-3.5 text-neutral mr-2" strokeWidth={1.5} />
                    <select
                        value={lawyerFilter}
                        onChange={e => setLawyerFilter(e.target.value)}
                        className="bg-transparent font-mono text-[10px] text-ink outline-none py-2 cursor-pointer uppercase"
                    >
                        {lawyerFilters.map(l => <option key={l}>{l}</option>)}
                    </select>
                </div>
                <div className="flex items-center border border-ink px-3 ml-auto">
                    <button className="text-neutral hover:text-ink transition-colors mr-3"><ChevronLeft className="w-4 h-4" strokeWidth={1.5} /></button>
                    <span className="font-serif text-sm font-bold text-ink">February 24 — March 2, 2026</span>
                    <button className="text-neutral hover:text-ink transition-colors ml-3"><ChevronRight className="w-4 h-4" strokeWidth={1.5} /></button>
                </div>
            </div>

            {/* ── Conflict Alert ── */}
            {conflicts.length > 0 && (
                <div className="border border-accent bg-accent/5 mb-6 px-4 py-3 flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-accent shrink-0" strokeWidth={1.5} />
                    <div className="flex-1">
                        <span className="font-sans text-[10px] font-bold text-accent uppercase tracking-wider">Scheduling Conflict Detected</span>
                        <p className="text-[11px] font-sans text-ink mt-0.5">
                            {conflicts.map(c => c.title).join(", ")} — overlapping at 10:00 AM on Feb 24
                        </p>
                    </div>
                    <button onClick={() => toast("RESOLVING CONFLICT...")} className="text-[9px] font-sans font-bold bg-accent text-newsprint px-3 py-1 uppercase tracking-wider hover:bg-accent/90 transition-colors shrink-0">
                        Resolve
                    </button>
                </div>
            )}

            {/* ── Calendar Grid (Weekly View) ── */}
            {(view === "weekly" || view === "daily" || view === "monthly") && (
                <div className="border border-ink mb-6">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">
                            {view === "monthly" ? "February 2026" : view === "daily" ? "Monday, February 24" : "Week of Feb 24"}
                        </span>
                    </div>

                    {view === "monthly" ? (
                        /* Monthly Grid */
                        <div>
                            <div className="grid grid-cols-7 border-b border-ink">
                                {weekDays.map(d => (
                                    <div key={d} className="text-center py-2 text-[9px] font-sans font-bold text-neutral uppercase tracking-widest border-r border-ink last:border-r-0">{d}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7">
                                {monthDates.map((d) => {
                                    const dayEvents = filteredEvents.filter(e => e.date === `2026-02-${String(d).padStart(2, '0')}`);
                                    const isToday = d === 24;
                                    return (
                                        <div key={d} className={`min-h-[80px] p-1.5 border-r border-b border-ink/20 last:border-r-0 ${isToday ? 'bg-ink/5' : ''} hover:bg-ink/[0.03] transition-colors cursor-pointer`}>
                                            <span className={`font-mono text-[10px] ${isToday ? 'bg-ink text-newsprint px-1.5 py-0.5 font-bold' : 'text-neutral'}`}>{d}</span>
                                            {dayEvents.slice(0, 2).map(ev => (
                                                <div key={ev.id} className={`mt-1 text-[8px] font-sans font-bold text-newsprint px-1 py-0.5 truncate ${eventTypeConfig[ev.type].color}`}>
                                                    {ev.title.slice(0, 20)}
                                                </div>
                                            ))}
                                            {dayEvents.length > 2 && <span className="text-[8px] font-mono text-neutral">+{dayEvents.length - 2} more</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : view === "daily" ? (
                        /* Daily View */
                        <div className="divide-y divide-ink/10">
                            {Array.from({ length: 10 }, (_, i) => i + 8).map(hour => {
                                const hourEvents = todayEvents.filter(e => {
                                    const h = parseInt(e.time);
                                    const isPM = e.time.includes("PM");
                                    const hour24 = isPM && h !== 12 ? h + 12 : h;
                                    return hour24 === hour;
                                });
                                return (
                                    <div key={hour} className="flex min-h-[48px]">
                                        <span className="w-16 shrink-0 py-2 px-3 text-[10px] font-mono text-neutral border-r border-ink/20 text-right">
                                            {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                                        </span>
                                        <div className="flex-1 px-3 py-1.5 flex flex-wrap gap-1.5">
                                            {hourEvents.map(ev => (
                                                <div key={ev.id} className={`${eventTypeConfig[ev.type].color} ${ev.conflict ? 'ring-2 ring-accent' : ''} text-newsprint px-2 py-1 text-[10px] font-sans font-bold flex items-center gap-1.5`}>
                                                    {ev.title}
                                                    {ev.location && <span className="text-newsprint/70 font-mono text-[9px]">· {ev.location}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Weekly View */
                        <div>
                            <div className="grid grid-cols-7 border-b border-ink">
                                {weekDays.map((d, i) => (
                                    <div key={d} className={`text-center py-2 border-r border-ink last:border-r-0 ${i === 0 ? 'bg-ink/5' : ''}`}>
                                        <span className="text-[9px] font-sans font-bold text-neutral uppercase tracking-widest block">{d}</span>
                                        <span className={`font-mono text-sm ${i === 0 ? 'font-bold text-ink' : 'text-neutral'}`}>{24 + i}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 min-h-[300px]">
                                {weekDays.map((_, i) => {
                                    const dateStr = `2026-02-${24 + i}`;
                                    const dayEvs = filteredEvents.filter(e => e.date === dateStr);
                                    return (
                                        <div key={i} className={`border-r border-ink last:border-r-0 p-1.5 ${i === 0 ? 'bg-ink/[0.03]' : ''}`}>
                                            {dayEvs.map(ev => {
                                                const cfg = eventTypeConfig[ev.type];
                                                return (
                                                    <div key={ev.id} className={`mb-1.5 p-1.5 ${cfg.color} ${ev.conflict ? 'ring-2 ring-accent' : ''} text-newsprint cursor-pointer hover:opacity-90 transition-opacity`}>
                                                        <p className="text-[8px] font-sans font-bold leading-tight">{ev.title}</p>
                                                        <p className="text-[7px] font-mono text-newsprint/70 mt-0.5">{ev.time}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Agenda View ── */}
            {view === "agenda" && (
                <div className="border border-ink mb-6">
                    <div className="h-9 border-b border-ink px-4 flex items-center section-inverted">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">Agenda — Next 7 Days</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {filteredEvents.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).map(ev => {
                            const cfg = eventTypeConfig[ev.type];
                            const Icon = cfg.icon;
                            return (
                                <div key={ev.id} className={`flex items-center px-4 py-3 hover:bg-ink/[0.03] transition-colors cursor-pointer ${ev.conflict ? 'bg-accent/5' : ''}`}>
                                    <div className={`w-7 h-7 ${cfg.color} text-newsprint flex items-center justify-center shrink-0 mr-3`}>
                                        <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-sans text-xs font-bold text-ink">{ev.title}</p>
                                        <p className="text-[9px] font-mono text-neutral mt-0.5">
                                            {ev.case || "No case"} · {ev.lawyer}
                                            {ev.location && ` · ${ev.location}`}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0 ml-3">
                                        <p className={`font-mono text-[10px] font-bold ${ev.date === '2026-02-24' ? 'text-accent' : 'text-ink'}`}>
                                            {ev.date === '2026-02-24' ? 'Today' : ev.date.slice(5)}
                                        </p>
                                        <p className="text-[9px] font-mono text-neutral">{ev.time}</p>
                                    </div>
                                    {ev.conflict && <AlertTriangle className="w-3.5 h-3.5 text-accent ml-2" strokeWidth={1.5} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Timeline / Gantt View ── */}
            {view === "timeline" && (
                <div className="border border-ink mb-6">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Case Milestones — Gantt View</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        {/* Timeline header */}
                        <div className="flex mb-3">
                            <div className="w-40 shrink-0" />
                            {Array.from({ length: 14 }, (_, i) => (
                                <div key={i} className="flex-1 min-w-[50px] text-center">
                                    <span className={`text-[8px] font-mono ${i === 0 ? 'font-bold text-ink' : 'text-neutral'}`}>
                                        {`${24 + i > 28 ? `Mar ${24 + i - 28}` : `Feb ${24 + i}`}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* Timeline rows */}
                        {[
                            { case: "Sharma v. State", bars: [{ start: 0, width: 3, label: "Discovery", color: "bg-ink" }, { start: 4, width: 1, label: "Deposition", color: "bg-neutral" }, { start: 8, width: 2, label: "Filing", color: "bg-accent" }] },
                            { case: "Nexus IP", bars: [{ start: 1, width: 1, label: "Deadline", color: "bg-accent" }, { start: 5, width: 4, label: "Motion Prep", color: "bg-ink" }] },
                            { case: "DEF Corp", bars: [{ start: 0, width: 6, label: "Trial Prep", color: "bg-ink" }, { start: 8, width: 3, label: "Trial", color: "bg-ink" }] },
                            { case: "CloudNet", bars: [{ start: 3, width: 1, label: "Evidence DL", color: "bg-accent" }, { start: 6, width: 5, label: "Discovery", color: "bg-neutral" }] },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center mb-1.5">
                                <span className="w-40 shrink-0 font-sans text-[10px] font-bold text-ink truncate pr-2">{row.case}</span>
                                <div className="flex-1 flex relative h-6">
                                    {row.bars.map((bar, j) => (
                                        <div
                                            key={j}
                                            className={`absolute h-full ${bar.color} text-newsprint flex items-center px-1.5 text-[7px] font-sans font-bold uppercase tracking-wider cursor-pointer hover:opacity-90 transition-opacity`}
                                            style={{ left: `${(bar.start / 14) * 100}%`, width: `${(bar.width / 14) * 100}%` }}
                                        >
                                            {bar.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Bottom Row: Court Holidays + Reminders + Integrations ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 border border-ink">

                {/* Court Holidays */}
                <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center section-inverted">
                        <CalendarIcon className="w-3.5 h-3.5 mr-2 text-newsprint" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-newsprint">Court Holidays</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {courtHolidays.map((h, i) => (
                            <div key={i} className="px-4 py-2.5 hover:bg-ink/[0.03] transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="font-sans text-[11px] font-bold text-ink">{h.name}</span>
                                    <span className="font-mono text-[9px] text-neutral">{h.date}</span>
                                </div>
                                <p className="text-[9px] font-mono text-neutral mt-0.5">{h.jurisdiction}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reminder Settings */}
                <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <Bell className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Reminders</span>
                    </div>
                    <div className="p-4 space-y-3">
                        {[
                            { label: "Email Reminder", detail: "1 day before", icon: Mail, enabled: true },
                            { label: "SMS Alert", detail: "Critical deadlines", icon: Smartphone, enabled: true },
                            { label: "Push Notification", detail: "1 hour before", icon: Bell, enabled: false },
                            { label: "Daily Digest", detail: "Every morning 8 AM", icon: RefreshCw, enabled: true },
                        ].map((r, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <r.icon className="w-3.5 h-3.5 text-neutral shrink-0" strokeWidth={1.5} />
                                <div className="flex-1">
                                    <span className="font-sans text-[10px] font-bold text-ink">{r.label}</span>
                                    <span className="text-[9px] font-mono text-neutral ml-2">{r.detail}</span>
                                </div>
                                <div className={`w-8 h-4 flex items-center px-0.5 cursor-pointer transition-colors ${r.enabled ? 'bg-ink justify-end' : 'bg-ink/20 justify-start'}`}>
                                    <div className={`w-3 h-3 ${r.enabled ? 'bg-newsprint' : 'bg-neutral'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar Integrations */}
                <div className="flex flex-col">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <ExternalLink className="w-3.5 h-3.5 mr-2 text-ink" strokeWidth={1.5} />
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Integrations</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {integrations.map((ig, i) => (
                            <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                                <div className="w-7 h-7 border border-ink flex items-center justify-center font-mono text-[10px] font-bold text-ink shrink-0">{ig.icon}</div>
                                <div className="flex-1">
                                    <p className="font-sans text-[11px] font-bold text-ink">{ig.name}</p>
                                    <p className={`text-[9px] font-mono uppercase ${ig.status === 'Connected' ? 'text-ink' : 'text-neutral'}`}>{ig.status}</p>
                                </div>
                                <button onClick={() => toast(`${ig.status === 'Connected' ? 'SYNCING' : 'CONNECTING'} ${ig.name.toUpperCase()}...`)} className={`text-[9px] font-sans font-bold px-2 py-0.5 uppercase tracking-wider ${ig.status === 'Connected' ? 'border border-ink text-ink hover:bg-ink/5' : 'bg-ink text-newsprint hover:bg-ink/90'} transition-colors`}>
                                    {ig.status === "Connected" ? "Sync" : "Connect"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Event Type Legend ── */}
            <div className="border border-ink mt-6 px-4 py-3 flex flex-wrap gap-4">
                {Object.entries(eventTypeConfig).map(([key, cfg]) => (
                    <span key={key} className="flex items-center text-[8px] font-sans font-bold text-neutral uppercase tracking-wider">
                        <span className={`w-2.5 h-2.5 ${cfg.color} mr-1.5`} />
                        {cfg.label}
                    </span>
                ))}
            </div>

            {/* ── New Event Modal ── */}
            {showModal && (
                <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-newsprint border border-ink w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="section-inverted px-4 py-3 flex items-center justify-between">
                            <h3 className="font-serif text-lg font-bold text-newsprint">New Event</h3>
                            <button onClick={() => setShowModal(false)}><X className="w-4 h-4 text-newsprint" strokeWidth={1.5} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Title</label>
                                <input className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink" placeholder="Event name..." />
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Event Type</label>
                                <select className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink cursor-pointer">
                                    {Object.entries(eventTypeConfig).map(([k, v]) => <option key={k}>{v.label}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Date</label>
                                    <input type="date" className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Time</label>
                                    <input type="time" className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Case (Optional)</label>
                                <select className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink cursor-pointer">
                                    <option>None</option>
                                    <option>VDT-2024-001 — Sharma v. State</option>
                                    <option>VDT-2024-002 — Nexus IP</option>
                                    <option>VDT-2024-003 — Horizon Corp</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Location</label>
                                <input className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink" placeholder="Court, office, or virtual..." />
                            </div>
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="mr-2.5 accent-ink" />
                                <span className="font-sans text-[11px] font-semibold text-ink">Recurring event</span>
                            </label>
                            <button onClick={() => { setShowModal(false); toast.success("EVENT CREATED"); }} className="w-full py-2.5 bg-ink text-newsprint font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-ink/90 transition-colors">
                                Create Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
