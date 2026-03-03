"use client";

import { useState } from "react";
import {
    Users, MessageSquare, CheckSquare, Clock, BarChart3, AtSign,
    Send, Plus, Search, ChevronRight, AlertTriangle, CheckCircle,
    Circle, Timer, FileText, User
} from "lucide-react";
import { toast } from "react-hot-toast";

/* ─── Mock Data ─── */

type Tab = "chat" | "tasks" | "workload" | "time";

const teamMembers = [
    { name: "Adv. Prit Thacker", role: "Senior Partner", status: "Online", activeCases: 4, hoursThisWeek: 32, avatar: "PT" },
    { name: "Adv. Meera Shah", role: "Associate", status: "Online", activeCases: 3, hoursThisWeek: 38, avatar: "MS" },
    { name: "Adv. Rohan Iyer", role: "Associate", status: "Away", activeCases: 2, hoursThisWeek: 28, avatar: "RI" },
    { name: "Adv. Priya Das", role: "Junior Associate", status: "Offline", activeCases: 2, hoursThisWeek: 35, avatar: "PD" },
    { name: "Ravi Kumar", role: "Paralegal", status: "Online", activeCases: 5, hoursThisWeek: 40, avatar: "RK" },
];

const chatMessages = [
    { id: 1, user: "Adv. Meera", text: "Just uploaded the revised indemnity clause for Horizon Corp. @Adv. Prit can you review?", time: "2:15 PM", thread: "Horizon Corp" },
    { id: 2, user: "Adv. Prit", text: "On it. Also, the Sharma hearing got moved to Court 3. Updated the calendar.", time: "2:20 PM", thread: "General" },
    { id: 3, user: "Ravi Kumar", text: "Bates numbering complete for Nexus IP evidence pack. 45 documents tagged.", time: "2:35 PM", thread: "Nexus IP" },
    { id: 4, user: "Adv. Rohan", text: "DEF Corp trial prep docs ready. Need someone to review the witness list.", time: "3:00 PM", thread: "DEF Corp" },
    { id: 5, user: "System", text: "⚠ Reminder: CloudNet evidence deadline in 3 days", time: "3:15 PM", thread: "CloudNet" },
];

const threads = ["General", "Sharma v. State", "Nexus IP", "Horizon Corp", "DEF Corp", "CloudNet"];

type TaskStatus = "todo" | "in-progress" | "review" | "done";
const tasks = [
    { id: 1, title: "Draft motion for summary judgment", assignee: "Adv. Prit", case: "Sharma v. State", status: "in-progress" as TaskStatus, priority: "High", due: "Feb 26" },
    { id: 2, title: "Review patent claims analysis", assignee: "Adv. Meera", case: "Nexus IP", status: "review" as TaskStatus, priority: "High", due: "Feb 25" },
    { id: 3, title: "Prepare witness deposition outline", assignee: "Adv. Rohan", case: "DEF Corp", status: "todo" as TaskStatus, priority: "Medium", due: "Feb 28" },
    { id: 4, title: "Compile evidence index with Bates #", assignee: "Ravi Kumar", case: "Sharma v. State", status: "done" as TaskStatus, priority: "Medium", due: "Feb 22" },
    { id: 5, title: "Client meeting prep — financials", assignee: "Adv. Priya", case: "Gupta Estate", status: "in-progress" as TaskStatus, priority: "Low", due: "Mar 1" },
    { id: 6, title: "Research DPDP Act precedents", assignee: "Adv. Meera", case: "CloudNet", status: "todo" as TaskStatus, priority: "High", due: "Feb 27" },
];

const timeEntries = [
    { lawyer: "Adv. Prit", case: "Sharma v. State", activity: "Motion drafting", hours: 3.5, date: "Today", billable: true },
    { lawyer: "Adv. Meera", case: "Nexus IP", activity: "Patent analysis review", hours: 2.0, date: "Today", billable: true },
    { lawyer: "Adv. Rohan", case: "DEF Corp", activity: "Witness prep", hours: 1.5, date: "Today", billable: true },
    { lawyer: "Ravi Kumar", case: "Sharma v. State", activity: "Evidence indexing", hours: 4.0, date: "Today", billable: true },
    { lawyer: "Adv. Prit", case: "Internal", activity: "Team meeting", hours: 0.5, date: "Today", billable: false },
    { lawyer: "Adv. Priya", case: "Gupta Estate", activity: "Client call prep", hours: 1.0, date: "Today", billable: true },
];

const statusColors: Record<TaskStatus, string> = {
    "todo": "border border-ink/30 text-neutral",
    "in-progress": "bg-ink text-newsprint",
    "review": "bg-neutral text-newsprint",
    "done": "bg-ink/20 text-ink",
};

/* ─── Component ─── */

export default function TeamPage() {
    const [activeTab, setActiveTab] = useState<Tab>("chat");
    const [activeThread, setActiveThread] = useState("General");

    const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
        { id: "chat", label: "Messages", icon: MessageSquare },
        { id: "tasks", label: "Tasks", icon: CheckSquare },
        { id: "workload", label: "Workload", icon: BarChart3 },
        { id: "time", label: "Time Tracking", icon: Clock },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col">

            {/* ── Header ── */}
            <div className="border-b-[4px] border-ink pb-5 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight mb-1 flex items-center">
                            <Users className="w-6 h-6 mr-3" strokeWidth={1.5} />
                            Team Collaboration
                        </h1>
                        <p className="text-sm font-sans text-neutral">Internal messaging, task tracking, workload management, and time entries.</p>
                    </div>
                    <div className="flex border border-ink shrink-0">
                        {tabs.map((tab, i) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center ${i < tabs.length - 1 ? 'border-r border-ink' : ''} ${activeTab === tab.id ? 'bg-ink text-newsprint' : 'text-ink hover:bg-ink/5'}`}
                            >
                                <tab.icon className="w-3 h-3 mr-1.5" strokeWidth={1.5} />{tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Team Roster ── */}
            <div className="grid grid-cols-2 md:grid-cols-5 border border-ink mb-6">
                {teamMembers.map((m, i) => (
                    <div key={i} className={`p-3 flex flex-col items-center text-center hover:bg-ink/[0.03] transition-colors cursor-pointer ${i < teamMembers.length - 1 ? 'border-r border-b md:border-b-0 border-ink' : ''}`}>
                        <div className="w-10 h-10 bg-ink text-newsprint flex items-center justify-center font-mono text-xs font-bold mb-2">{m.avatar}</div>
                        <span className="font-sans text-[10px] font-bold text-ink">{m.name}</span>
                        <span className="text-[8px] font-mono text-neutral uppercase mt-0.5">{m.role}</span>
                        <span className={`text-[8px] font-sans font-bold uppercase tracking-wider mt-1.5 px-1.5 py-0.5 ${m.status === 'Online' ? 'bg-ink text-newsprint' : m.status === 'Away' ? 'border border-ink/30 text-neutral' : 'bg-ink/10 text-neutral'}`}>{m.status}</span>
                    </div>
                ))}
            </div>

            {/* ═══ CHAT TAB ═══ */}
            {activeTab === "chat" && (
                <div className="grid grid-cols-1 lg:grid-cols-4 border border-ink min-h-[450px]">
                    {/* Thread List */}
                    <div className="border-b lg:border-b-0 lg:border-r border-ink flex flex-col">
                        <div className="h-9 border-b border-ink px-3 flex items-center justify-between">
                            <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Threads</span>
                            <button onClick={() => toast("NEW THREAD...")} className="text-neutral hover:text-ink transition-colors"><Plus className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                        </div>
                        <div className="divide-y divide-ink/10">
                            {threads.map(t => (
                                <button key={t} onClick={() => setActiveThread(t)} className={`w-full text-left px-3 py-2.5 font-sans text-[11px] transition-colors ${activeThread === t ? 'bg-ink text-newsprint font-bold' : 'text-ink hover:bg-ink/[0.03]'}`}>
                                    # {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-3 flex flex-col">
                        <div className="h-9 border-b border-ink px-4 flex items-center">
                            <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink"># {activeThread}</span>
                        </div>
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[350px]">
                            {chatMessages.filter(m => m.thread === activeThread || activeThread === "General").map(msg => (
                                <div key={msg.id} className="flex gap-3">
                                    <div className="w-7 h-7 bg-ink text-newsprint flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">
                                        {msg.user.split(" ").pop()?.[0] || "S"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-sans text-[11px] font-bold text-ink">{msg.user}</span>
                                            <span className="text-[9px] font-mono text-neutral">{msg.time}</span>
                                        </div>
                                        <p className="font-sans text-xs text-ink/80 mt-0.5 leading-relaxed">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-ink px-4 py-3 flex items-center gap-2">
                            <button className="text-neutral hover:text-ink transition-colors"><AtSign className="w-4 h-4" strokeWidth={1.5} /></button>
                            <input placeholder="TYPE A MESSAGE..." className="flex-1 bg-transparent font-mono text-xs text-ink outline-none placeholder:text-neutral/50 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-wider" />
                            <button onClick={() => toast("MESSAGE SENT")} className="bg-ink text-newsprint p-1.5 hover:bg-ink/90 transition-colors"><Send className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ TASKS TAB ═══ */}
            {activeTab === "tasks" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Task Board</span>
                        <button onClick={() => toast("NEW TASK...")} className="text-[9px] font-sans font-bold bg-ink text-newsprint px-2 py-0.5 uppercase hover:bg-ink/90 transition-colors">+ Task</button>
                    </div>
                    {/* Column Headers */}
                    <div className="grid grid-cols-4 border-b border-ink bg-ink/[0.03]">
                        {(["todo", "in-progress", "review", "done"] as TaskStatus[]).map((s, i) => (
                            <div key={s} className={`py-2 text-center font-sans text-[9px] font-bold uppercase tracking-widest text-neutral ${i < 3 ? 'border-r border-ink' : ''}`}>
                                {s === "todo" ? "To Do" : s === "in-progress" ? "In Progress" : s === "review" ? "Review" : "Done"} ({tasks.filter(t => t.status === s).length})
                            </div>
                        ))}
                    </div>
                    {/* Kanban Columns */}
                    <div className="grid grid-cols-4 min-h-[300px]">
                        {(["todo", "in-progress", "review", "done"] as TaskStatus[]).map((status, i) => (
                            <div key={status} className={`p-2 ${i < 3 ? 'border-r border-ink' : ''}`}>
                                {tasks.filter(t => t.status === status).map(task => (
                                    <div key={task.id} className="border border-ink/20 p-2.5 mb-2 hover:border-ink/50 transition-colors cursor-pointer bg-newsprint">
                                        <p className="font-sans text-[10px] font-bold text-ink leading-tight">{task.title}</p>
                                        <p className="text-[8px] font-mono text-neutral mt-1">{task.case}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[8px] font-mono text-neutral">{task.assignee}</span>
                                            <span className={`text-[7px] font-sans font-bold uppercase tracking-wider px-1 py-0.5 ${task.priority === 'High' ? 'bg-accent text-newsprint' : 'border border-ink/30 text-neutral'}`}>{task.priority}</span>
                                        </div>
                                        <p className="text-[8px] font-mono text-neutral/60 mt-1">Due: {task.due}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══ WORKLOAD TAB ═══ */}
            {activeTab === "workload" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Team Workload Overview</span>
                    </div>
                    <div className="divide-y divide-ink/10">
                        {teamMembers.map((m, i) => (
                            <div key={i} className="px-4 py-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-ink text-newsprint flex items-center justify-center font-mono text-[10px] font-bold">{m.avatar}</div>
                                        <div>
                                            <span className="font-sans text-xs font-bold text-ink">{m.name}</span>
                                            <span className="text-[9px] font-mono text-neutral ml-2">{m.role}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-mono text-sm font-bold text-ink">{m.hoursThisWeek}h</span>
                                        <span className="text-[9px] font-mono text-neutral ml-1">/ 40h</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-ink/10">
                                        <div className={`h-full transition-all ${m.hoursThisWeek >= 38 ? 'bg-accent' : 'bg-ink'}`} style={{ width: `${(m.hoursThisWeek / 40) * 100}%` }} />
                                    </div>
                                    <span className="text-[9px] font-mono text-neutral shrink-0">{m.activeCases} cases</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══ TIME TRACKING TAB ═══ */}
            {activeTab === "time" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Time Entries — Today</span>
                        <button onClick={() => toast("NEW TIME ENTRY...")} className="text-[9px] font-sans font-bold bg-ink text-newsprint px-2 py-0.5 uppercase hover:bg-ink/90 transition-colors flex items-center">
                            <Timer className="w-3 h-3 mr-1" strokeWidth={1.5} />Log Time
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-ink bg-ink/[0.03]">
                                    <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Lawyer</th>
                                    <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Case</th>
                                    <th className="text-left px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Activity</th>
                                    <th className="text-right px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Hours</th>
                                    <th className="text-center px-4 py-2 font-sans text-[9px] font-bold text-neutral uppercase tracking-wider">Billable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timeEntries.map((e, i) => (
                                    <tr key={i} className="border-b border-ink/10 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                                        <td className="px-4 py-2.5 font-sans text-[11px] font-semibold text-ink">{e.lawyer}</td>
                                        <td className="px-4 py-2.5 font-mono text-[10px] text-neutral">{e.case}</td>
                                        <td className="px-4 py-2.5 font-sans text-[11px] text-ink">{e.activity}</td>
                                        <td className="px-4 py-2.5 text-right font-mono text-[11px] font-bold text-ink">{e.hours}h</td>
                                        <td className="px-4 py-2.5 text-center">
                                            {e.billable ? <CheckCircle className="w-3.5 h-3.5 text-ink mx-auto" strokeWidth={1.5} /> : <Circle className="w-3.5 h-3.5 text-neutral mx-auto" strokeWidth={1.5} />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-ink px-4 py-3 flex justify-between">
                        <span className="font-sans text-[10px] font-bold text-neutral uppercase tracking-wider">Total Today</span>
                        <span className="font-mono text-sm font-bold text-ink">{timeEntries.reduce((s, e) => s + e.hours, 0)}h</span>
                    </div>
                </div>
            )}
        </div>
    );
}
