"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
    Users, MessageSquare, CheckSquare, Clock, BarChart3, AtSign,
    Send, Plus, Search, ChevronRight, AlertTriangle, CheckCircle,
    Circle, Timer, FileText, User, Loader2, X
} from "lucide-react";
import { toast } from "react-hot-toast";

/* ─── Types ─── */

type Tab = "chat" | "tasks" | "workload" | "time";
type TaskStatus = "todo" | "in-progress" | "review" | "done";

type TeamMember = { id: number; name: string; role: string; status: string; activeCases: number; hoursThisWeek: number; avatar: string };
type ChatMsg = { id: number; userName: string; text: string; thread: string; createdAt: string };
type TaskItem = { id: number; title: string; assignee: string; caseRef?: string; status: TaskStatus; priority: string; due?: string };
type TimeEntry = { id: number; lawyer: string; caseRef: string; activity: string; hours: number; billable: boolean; date: string };

const statusColors: Record<TaskStatus, string> = {
    "todo": "border border-ink/30 text-neutral",
    "in-progress": "bg-ink text-newsprint",
    "review": "bg-neutral text-newsprint",
    "done": "bg-ink/20 text-ink",
};

/* ─── Component ─── */

export default function TeamPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<Tab>("chat");
    const [activeThread, setActiveThread] = useState("General");
    const [loading, setLoading] = useState(true);

    // Data state
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
    const [timeData, setTimeData] = useState<TimeEntry[]>([]);

    // Chat input
    const [chatInput, setChatInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Task modal
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskAssignee, setNewTaskAssignee] = useState("");
    const [newTaskCase, setNewTaskCase] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState("Medium");

    // Time modal
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [newTimeLawyer, setNewTimeLawyer] = useState("");
    const [newTimeCase, setNewTimeCase] = useState("");
    const [newTimeActivity, setNewTimeActivity] = useState("");
    const [newTimeHours, setNewTimeHours] = useState("");
    const [newTimeBillable, setNewTimeBillable] = useState(true);

    useEffect(() => { fetchAll(); }, []);

    async function fetchAll() {
        setLoading(true);
        try {
            const [usersRes, msgsRes, tasksRes, timeRes] = await Promise.all([
                fetch("/api/users"),
                fetch("/api/team/messages"),
                fetch("/api/team/tasks"),
                fetch("/api/team/time"),
            ]);
            if (usersRes.ok) setTeamMembers(await usersRes.json());
            if (msgsRes.ok) setMessages(await msgsRes.json());
            if (tasksRes.ok) setTaskItems(await tasksRes.json());
            if (timeRes.ok) setTimeData(await timeRes.json());
        } catch (err) {
            console.error("Failed to fetch team data:", err);
        } finally {
            setLoading(false);
        }
    }

    // Derive threads from messages data
    const threads = ["General", ...Array.from(new Set(messages.filter(m => m.thread !== "General").map(m => m.thread)))];

    const filteredMessages = activeThread === "General"
        ? messages
        : messages.filter(m => m.thread === activeThread);

    // ─── Send message ───
    async function handleSendMessage() {
        if (!chatInput.trim()) return;
        try {
            const res = await fetch("/api/team/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: session?.user?.name || "User",
                    text: chatInput,
                    thread: activeThread,
                }),
            });
            if (res.ok) {
                const newMsg = await res.json();
                setMessages(prev => [...prev, newMsg]);
                setChatInput("");
                setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            } else {
                toast.error("Failed to send message");
            }
        } catch {
            toast.error("Network error");
        }
    }

    // ─── Create task ───
    async function handleCreateTask() {
        if (!newTaskTitle || !newTaskAssignee) { toast.error("Title and assignee required"); return; }
        try {
            const res = await fetch("/api/team/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTaskTitle, assignee: newTaskAssignee, caseRef: newTaskCase || null, priority: newTaskPriority }),
            });
            if (res.ok) {
                const task = await res.json();
                setTaskItems(prev => [task, ...prev]);
                setShowTaskModal(false);
                setNewTaskTitle(""); setNewTaskAssignee(""); setNewTaskCase(""); setNewTaskPriority("Medium");
                toast.success("Task created");
            }
        } catch { toast.error("Network error"); }
    }

    // ─── Update task status ───
    async function handleMoveTask(taskId: number, newStatus: TaskStatus) {
        try {
            const res = await fetch("/api/team/tasks", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: taskId, status: newStatus }),
            });
            if (res.ok) {
                const updated = await res.json();
                setTaskItems(prev => prev.map(t => t.id === taskId ? updated : t));
            }
        } catch { toast.error("Failed to update task"); }
    }

    // ─── Log time ───
    async function handleLogTime() {
        if (!newTimeLawyer || !newTimeCase || !newTimeActivity || !newTimeHours) { toast.error("All fields are required"); return; }
        try {
            const res = await fetch("/api/team/time", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lawyer: newTimeLawyer, caseRef: newTimeCase, activity: newTimeActivity, hours: parseFloat(newTimeHours), billable: newTimeBillable }),
            });
            if (res.ok) {
                const entry = await res.json();
                setTimeData(prev => [entry, ...prev]);
                setShowTimeModal(false);
                setNewTimeLawyer(""); setNewTimeCase(""); setNewTimeActivity(""); setNewTimeHours(""); setNewTimeBillable(true);
                toast.success("Time logged");
            }
        } catch { toast.error("Network error"); }
    }

    const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
        { id: "chat", label: "Messages", icon: MessageSquare },
        { id: "tasks", label: "Tasks", icon: CheckSquare },
        { id: "workload", label: "Workload", icon: BarChart3 },
        { id: "time", label: "Time Tracking", icon: Clock },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-neutral" />
                <span className="ml-2 font-mono text-sm text-neutral">Loading team data...</span>
            </div>
        );
    }

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
            <div className={`grid grid-cols-2 md:grid-cols-${Math.min(teamMembers.length, 5)} border border-ink mb-6`}>
                {teamMembers.map((m, i) => (
                    <div key={m.id} className={`p-3 flex flex-col items-center text-center hover:bg-ink/[0.03] transition-colors cursor-pointer ${i < teamMembers.length - 1 ? 'border-r border-b md:border-b-0 border-ink' : ''}`}>
                        <div className="w-10 h-10 bg-ink text-newsprint flex items-center justify-center font-mono text-xs font-bold mb-2">{m.avatar || m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
                        <span className="font-sans text-[10px] font-bold text-ink">{m.name}</span>
                        <span className="text-[8px] font-mono text-neutral uppercase mt-0.5">{m.role}</span>
                        <span className={`text-[8px] font-sans font-bold uppercase tracking-wider mt-1.5 px-1.5 py-0.5 ${m.status === 'online' ? 'bg-ink text-newsprint' : m.status === 'away' ? 'border border-ink/30 text-neutral' : 'bg-ink/10 text-neutral'}`}>{m.status}</span>
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
                            {filteredMessages.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare className="w-6 h-6 text-neutral mx-auto mb-2" strokeWidth={1} />
                                    <p className="text-sm font-sans text-neutral">No messages in this thread yet.</p>
                                </div>
                            ) : (
                                filteredMessages.map(msg => (
                                    <div key={msg.id} className="flex gap-3">
                                        <div className="w-7 h-7 bg-ink text-newsprint flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">
                                            {msg.userName.split(" ").pop()?.[0] || "U"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-sans text-[11px] font-bold text-ink">{msg.userName}</span>
                                                <span className="text-[9px] font-mono text-neutral">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="font-sans text-xs text-ink/80 mt-0.5 leading-relaxed">{msg.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="border-t border-ink px-4 py-3 flex items-center gap-2">
                            <input
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                                placeholder="TYPE A MESSAGE..."
                                className="flex-1 bg-transparent font-mono text-xs text-ink outline-none placeholder:text-neutral/50 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-wider"
                            />
                            <button onClick={handleSendMessage} className="bg-ink text-newsprint p-1.5 hover:bg-ink/90 transition-colors"><Send className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ TASKS TAB ═══ */}
            {activeTab === "tasks" && (
                <div className="border border-ink">
                    <div className="h-9 border-b border-ink px-4 flex items-center justify-between">
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Task Board</span>
                        <button onClick={() => setShowTaskModal(true)} className="text-[9px] font-sans font-bold bg-ink text-newsprint px-2 py-0.5 uppercase hover:bg-ink/90 transition-colors">+ Task</button>
                    </div>
                    <div className="grid grid-cols-4 border-b border-ink bg-ink/[0.03]">
                        {(["todo", "in-progress", "review", "done"] as TaskStatus[]).map((s, i) => (
                            <div key={s} className={`py-2 text-center font-sans text-[9px] font-bold uppercase tracking-widest text-neutral ${i < 3 ? 'border-r border-ink' : ''}`}>
                                {s === "todo" ? "To Do" : s === "in-progress" ? "In Progress" : s === "review" ? "Review" : "Done"} ({taskItems.filter(t => t.status === s).length})
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-4 min-h-[300px]">
                        {(["todo", "in-progress", "review", "done"] as TaskStatus[]).map((status, i) => (
                            <div key={status} className={`p-2 ${i < 3 ? 'border-r border-ink' : ''}`}>
                                {taskItems.filter(t => t.status === status).map(task => (
                                    <div key={task.id} className="border border-ink/20 p-2.5 mb-2 hover:border-ink/50 transition-colors cursor-pointer bg-newsprint group">
                                        <p className="font-sans text-[10px] font-bold text-ink leading-tight">{task.title}</p>
                                        <p className="text-[8px] font-mono text-neutral mt-1">{task.caseRef || "No case"}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[8px] font-mono text-neutral">{task.assignee}</span>
                                            <span className={`text-[7px] font-sans font-bold uppercase tracking-wider px-1 py-0.5 ${task.priority === 'High' || task.priority === 'Critical' ? 'bg-accent text-newsprint' : 'border border-ink/30 text-neutral'}`}>{task.priority}</span>
                                        </div>
                                        {task.due && <p className="text-[8px] font-mono text-neutral/60 mt-1">Due: {task.due}</p>}
                                        {/* Quick status change */}
                                        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {(["todo", "in-progress", "review", "done"] as TaskStatus[]).filter(s => s !== status).map(s => (
                                                <button key={s} onClick={() => handleMoveTask(task.id, s)} className="text-[7px] font-sans font-bold uppercase tracking-wider px-1 py-0.5 border border-ink/20 text-neutral hover:bg-ink/5 transition-colors">
                                                    {s === "todo" ? "TD" : s === "in-progress" ? "IP" : s === "review" ? "RV" : "✓"}
                                                </button>
                                            ))}
                                        </div>
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
                        {teamMembers.map(m => (
                            <div key={m.id} className="px-4 py-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-ink text-newsprint flex items-center justify-center font-mono text-[10px] font-bold">{m.avatar || m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
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
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink">Time Entries</span>
                        <button onClick={() => setShowTimeModal(true)} className="text-[9px] font-sans font-bold bg-ink text-newsprint px-2 py-0.5 uppercase hover:bg-ink/90 transition-colors flex items-center">
                            <Timer className="w-3 h-3 mr-1" strokeWidth={1.5} />Log Time
                        </button>
                    </div>
                    {timeData.length === 0 ? (
                        <div className="px-8 py-12 text-center">
                            <Clock className="w-6 h-6 text-neutral mx-auto mb-2" strokeWidth={1} />
                            <p className="font-serif text-sm text-ink">No time entries yet</p>
                        </div>
                    ) : (
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
                                    {timeData.map(e => (
                                        <tr key={e.id} className="border-b border-ink/10 hover:bg-ink/[0.03] transition-colors cursor-pointer">
                                            <td className="px-4 py-2.5 font-sans text-[11px] font-semibold text-ink">{e.lawyer}</td>
                                            <td className="px-4 py-2.5 font-mono text-[10px] text-neutral">{e.caseRef}</td>
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
                    )}
                    <div className="border-t border-ink px-4 py-3 flex justify-between">
                        <span className="font-sans text-[10px] font-bold text-neutral uppercase tracking-wider">Total</span>
                        <span className="font-mono text-sm font-bold text-ink">{timeData.reduce((s, e) => s + e.hours, 0).toFixed(1)}h</span>
                    </div>
                </div>
            )}

            {/* ── New Task Modal ── */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTaskModal(false)}>
                    <div className="bg-newsprint border border-ink w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="section-inverted px-4 py-3 flex items-center justify-between">
                            <h3 className="font-serif text-lg font-bold text-newsprint">New Task</h3>
                            <button onClick={() => setShowTaskModal(false)}><X className="w-4 h-4 text-newsprint" strokeWidth={1.5} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Title *</label>
                                <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink" placeholder="Task description..." />
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Assignee *</label>
                                <select value={newTaskAssignee} onChange={e => setNewTaskAssignee(e.target.value)} className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink cursor-pointer">
                                    <option value="">Select...</option>
                                    {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Case Ref (Optional)</label>
                                <input value={newTaskCase} onChange={e => setNewTaskCase(e.target.value)} className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink" placeholder="e.g. VDT-2024-001" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Priority</label>
                                <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)} className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink cursor-pointer">
                                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                                </select>
                            </div>
                            <button onClick={handleCreateTask} className="w-full py-2.5 bg-ink text-newsprint font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-ink/90 transition-colors">Create Task</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Log Time Modal ── */}
            {showTimeModal && (
                <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTimeModal(false)}>
                    <div className="bg-newsprint border border-ink w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="section-inverted px-4 py-3 flex items-center justify-between">
                            <h3 className="font-serif text-lg font-bold text-newsprint">Log Time</h3>
                            <button onClick={() => setShowTimeModal(false)}><X className="w-4 h-4 text-newsprint" strokeWidth={1.5} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Lawyer *</label>
                                <select value={newTimeLawyer} onChange={e => setNewTimeLawyer(e.target.value)} className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink cursor-pointer">
                                    <option value="">Select...</option>
                                    {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Case *</label>
                                <input value={newTimeCase} onChange={e => setNewTimeCase(e.target.value)} className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink" placeholder="e.g. VDT-2024-001" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Activity *</label>
                                <input value={newTimeActivity} onChange={e => setNewTimeActivity(e.target.value)} className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink" placeholder="What did you work on?" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-sans font-bold text-neutral mb-1.5 uppercase tracking-wider">Hours *</label>
                                    <input type="number" step="0.5" min="0" value={newTimeHours} onChange={e => setNewTimeHours(e.target.value)} className="w-full border-b border-ink py-2 font-mono text-sm bg-transparent outline-none text-ink" placeholder="3.5" />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" checked={newTimeBillable} onChange={e => setNewTimeBillable(e.target.checked)} className="mr-2.5 accent-ink" />
                                        <span className="font-sans text-[11px] font-semibold text-ink">Billable</span>
                                    </label>
                                </div>
                            </div>
                            <button onClick={handleLogTime} className="w-full py-2.5 bg-ink text-newsprint font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-ink/90 transition-colors">Log Time</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
