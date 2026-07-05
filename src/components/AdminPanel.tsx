/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Ticket as TicketIcon, BookOpen, Users, History, AlertCircle, CheckCircle, Trash2, Plus, X, Server, Check } from "lucide-react";
import { User, Ticket, KnowledgeBaseItem, ChatSession } from "../types";

interface AdminPanelProps {
  user: User;
}

export default function AdminPanel({ user }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"tickets" | "kb" | "users" | "chats">("tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [kb, setKb] = useState<KnowledgeBaseItem[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // KB Form state
  const [showKbModal, setShowKbModal] = useState(false);
  const [newKbCategory, setNewKbCategory] = useState("Network Issues");
  const [newKbTitle, setNewKbTitle] = useState("");
  const [newKbSymptoms, setNewKbSymptoms] = useState("");
  const [newKbSteps, setNewKbSteps] = useState("");

  const engineersList = ["Lead IT Support", "Security Expert", "Network Specialist", "Hardware Engineer", "Software Advisor"];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${user.id}` };

      if (activeTab === "tickets") {
        const res = await fetch("/api/tickets", { headers });
        const data = await res.json();
        setTickets(data.tickets || []);
      } else if (activeTab === "kb") {
        const res = await fetch("/api/kb");
        const data = await res.json();
        setKb(data.kb || []);
      } else if (activeTab === "users") {
        const res = await fetch("/api/admin/users", { headers });
        const data = await res.json();
        setUsersList(data.users || []);
      } else if (activeTab === "chats") {
        const res = await fetch("/api/chats", { headers });
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load management resources.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: "Open" | "Closed") => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      // Update local list
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status } : t));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAssignEngineer = async (ticketId: string, assignedTo: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({ assignedTo }),
      });
      if (!response.ok) throw new Error("Failed to assign specialist");
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, assignedTo } : t));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteKbItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to remove this Knowledge Base troubleshooting article?")) return;
    try {
      const response = await fetch(`/api/kb/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.id}`,
        }
      });
      if (!response.ok) throw new Error("Failed to delete KB item");
      setKb(kb.filter(item => item.id !== itemId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateKbItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKbTitle || !newKbSymptoms || !newKbSteps) return;

    // parse symptom commas and newline steps
    const symptoms = newKbSymptoms.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const solutionSteps = newKbSteps.split("\n").map(s => s.trim()).filter(Boolean);

    try {
      const response = await fetch("/api/kb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          category: newKbCategory,
          title: newKbTitle,
          symptoms,
          solutionSteps
        }),
      });

      if (!response.ok) throw new Error("Failed to create KB item");
      const data = await response.json();
      setKb([data.item, ...kb]);
      setShowKbModal(false);
      // Reset form
      setNewKbTitle("");
      setNewKbSymptoms("");
      setNewKbSteps("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6" id="admin-panel-container">
      {/* Header Info */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl" id="admin-header-card">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 bg-[#c9973d]/10 text-[#c9973d] border border-[#c9973d]/30 text-[10px] font-mono font-bold uppercase rounded-md tracking-widest">IT Lead</span>
            <h2 className="text-2xl font-serif italic font-bold text-white tracking-wide">System Control Console</h2>
          </div>
          <p className="text-white/40 text-xs mt-1.5 max-w-xl">Manage network tickets, assign system engineers, audit troubleshoot logs, and update knowledge base.</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-[#c9973d] bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-sm">
          <Server className="w-4 h-4 text-[#c9973d]" />
          <span>SUPPORT-ENGINE-V2.0.1</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-1 overflow-x-auto pb-px" id="admin-tabs">
        <button
          onClick={() => setActiveTab("tickets")}
          className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-widest font-mono font-bold border-b-2 transition-all cursor-pointer ${activeTab === "tickets" ? "border-[#c9973d] text-[#c9973d]" : "border-transparent text-white/40 hover:text-white/80"}`}
        >
          <TicketIcon className="w-4 h-4" />
          Support Tickets
        </button>
        <button
          onClick={() => setActiveTab("kb")}
          className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-widest font-mono font-bold border-b-2 transition-all cursor-pointer ${activeTab === "kb" ? "border-[#c9973d] text-[#c9973d]" : "border-transparent text-white/40 hover:text-white/80"}`}
        >
          <BookOpen className="w-4 h-4" />
          Knowledge Base Solutions
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-widest font-mono font-bold border-b-2 transition-all cursor-pointer ${activeTab === "users" ? "border-[#c9973d] text-[#c9973d]" : "border-transparent text-white/40 hover:text-white/80"}`}
        >
          <Users className="w-4 h-4" />
          User Directory
        </button>
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-widest font-mono font-bold border-b-2 transition-all cursor-pointer ${activeTab === "chats" ? "border-[#c9973d] text-[#c9973d]" : "border-transparent text-white/40 hover:text-white/80"}`}
        >
          <History className="w-4 h-4" />
          Troubleshoot Logs
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 text-red-200 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Content scroll area */}
      <div className="min-h-[45vh]" id="admin-tab-content">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="w-8 h-8 border-2 border-[#c9973d]/30 border-t-[#c9973d] rounded-full animate-spin"></span>
          </div>
        ) : (
          <>
            {/* TICKETS TAB */}
            {activeTab === "tickets" && (
              <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-xl" id="admin-tickets-table">
                <div className="p-4 bg-white/[0.02] border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-mono text-xs text-[#c9973d] uppercase tracking-[0.2em]">Active Support Tickets ({tickets.length})</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.01] text-[#c9973d] font-mono uppercase tracking-wider text-[10px]">
                        <th className="p-4">Ticket ID</th>
                        <th className="p-4">Author</th>
                        <th className="p-4">Reported Issue</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Assigned Engineer</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {tickets.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-white/30">No support tickets currently found.</td>
                        </tr>
                      ) : (
                        tickets.map((t) => (
                          <tr key={t.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-mono font-bold text-[#c9973d]">#{t.id}</td>
                            <td className="p-4">
                              <span className="font-semibold text-white block">{t.userName}</span>
                              <span className="text-[10px] text-white/40 font-mono">User ID: {t.userId}</span>
                            </td>
                            <td className="p-4 max-w-xs truncate font-medium text-white/90" title={t.issue}>{t.issue}</td>
                            <td className="p-4 text-white/60 font-mono">{t.category}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${t.priority === "High" ? "bg-red-950/30 text-red-300 border border-red-900/40" : t.priority === "Medium" ? "bg-amber-950/30 text-amber-300 border border-amber-900/40" : "bg-white/5 text-white/50 border border-white/10"}`}>
                                {t.priority}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${t.status === "Open" ? "bg-blue-950/30 text-blue-300 border border-blue-900/40" : "bg-emerald-950/30 text-emerald-300 border border-emerald-900/40"}`}>
                                {t.status === "Open" ? <AlertCircle className="w-3 h-3 text-blue-400" /> : <CheckCircle className="w-3 h-3 text-emerald-400" />}
                                {t.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <select
                                id={`assign-engineer-${t.id}`}
                                value={t.assignedTo || ""}
                                onChange={(e) => handleAssignEngineer(t.id, e.target.value)}
                                className="px-2 py-1.5 bg-white/[0.03] border border-white/10 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-[#c9973d] font-medium text-white"
                              >
                                <option value="" className="bg-[#0d0d0d] text-white/40">-- Unassigned --</option>
                                {engineersList.map(eng => (
                                  <option key={eng} value={eng} className="bg-[#0d0d0d] text-white">{eng}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              {t.status === "Open" ? (
                                <button
                                  id={`close-ticket-button-${t.id}`}
                                  onClick={() => handleUpdateTicketStatus(t.id, "Closed")}
                                  className="px-2.5 py-1.5 bg-[#c9973d]/10 hover:bg-[#c9973d]/20 border border-[#c9973d]/30 text-[#c9973d] rounded-lg font-bold uppercase tracking-widest ml-auto text-[9px] transition-all cursor-pointer"
                                >
                                  <Check className="w-3 h-3 inline-block mr-1" />
                                  Resolve
                                </button>
                              ) : (
                                <button
                                  id={`reopen-ticket-button-${t.id}`}
                                  onClick={() => handleUpdateTicketStatus(t.id, "Open")}
                                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-bold uppercase tracking-widest ml-auto text-[9px] transition-all cursor-pointer"
                                >
                                  Re-open
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* KNOWLEDGE BASE TAB */}
            {activeTab === "kb" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <p className="text-xs text-white/50 font-medium">Add, review, and delete active troubleshooting solution workflows.</p>
                  <button
                    id="add-kb-article-button"
                    onClick={() => setShowKbModal(true)}
                    className="px-4 py-2.5 bg-[#c9973d] hover:bg-[#d4b48c] text-black rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    New Solution Article
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="kb-grid-admin">
                  {kb.map((item) => (
                    <div key={item.id} className="bg-[#0d0d0d] border border-white/10 p-5 rounded-2xl shadow-xl relative flex flex-col justify-between" id={`kb-admin-${item.id}`}>
                      <button
                        id={`delete-kb-button-${item.id}`}
                        onClick={() => handleDeleteKbItem(item.id)}
                        className="absolute top-4 right-4 p-1.5 hover:bg-red-950/30 text-white/40 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete Solution Workflow"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[#c9973d] rounded-md text-[9px] font-mono font-bold uppercase tracking-wider">{item.category}</span>
                          <span className="text-[9px] font-mono text-white/30">ID: {item.id}</span>
                        </div>
                        <h4 className="font-serif italic font-semibold text-white text-sm mb-3 pr-8">{item.title}</h4>

                        <div className="mb-4">
                          <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest font-semibold mb-1.5">Keywords / Symptoms</p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.symptoms.map(s => (
                              <span key={s} className="px-2 py-0.5 bg-[#c9973d]/5 border border-[#c9973d]/20 text-[#c9973d] rounded text-[9px] font-mono">{s}</span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest font-semibold">Troubleshooting Path</p>
                          {item.solutionSteps.map((step, idx) => (
                            <div key={idx} className="flex gap-2 text-xs text-white/70 leading-relaxed">
                              <span className="font-serif italic text-[#c9973d] shrink-0 text-sm">Step {idx + 1}</span>
                              <span className="font-medium text-xs text-white/80">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-xl" id="admin-users-table">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.01] text-[#c9973d] font-mono uppercase tracking-wider text-[10px]">
                        <th className="p-4">User ID</th>
                        <th className="p-4">Full Name</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Security Role</th>
                        <th className="p-4 text-right">Access Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.01]">
                          <td className="p-4 font-mono font-bold text-white/30">{u.id}</td>
                          <td className="p-4 font-semibold text-white">{u.name}</td>
                          <td className="p-4 font-mono text-white/50">{u.email}</td>
                          <td className="p-4 capitalize">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${u.role === "admin" ? "bg-amber-950/30 text-amber-300 border border-amber-900/40" : "bg-white/5 text-white/50 border border-white/10"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-right font-semibold text-[#c9973d]">{u.role === "admin" ? "Console Admin" : "Customer Support"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CHATS TAB */}
            {activeTab === "chats" && (
              <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-xl" id="admin-chats-table">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.01] text-[#c9973d] font-mono uppercase tracking-wider text-[10px]">
                        <th className="p-4">Session ID</th>
                        <th className="p-4">Classification Title</th>
                        <th className="p-4">User ID</th>
                        <th className="p-4">Diagnostic Outcome</th>
                        <th className="p-4">Interactions</th>
                        <th className="p-4">Reported At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {chats.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-white/30">No troubleshooting sessions stored yet.</td>
                        </tr>
                      ) : (
                        chats.map((c) => (
                          <tr key={c.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-mono font-bold text-white/30">{c.id}</td>
                            <td className="p-4">
                              <span className="font-semibold text-white block">{c.title}</span>
                              {c.category && <span className="text-[10px] text-white/40 font-mono">Category: {c.category}</span>}
                            </td>
                            <td className="p-4 font-mono text-white/40">{c.userId}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${c.status === "solved" ? "bg-emerald-950/30 text-emerald-300 border border-emerald-900/40" : c.status === "escalated" ? "bg-red-950/30 text-red-300 border border-red-900/40" : "bg-amber-950/30 text-amber-300 border border-amber-900/40"}`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="p-4 font-medium text-white/60">{c.messages.length} messages</td>
                            <td className="p-4 font-mono text-white/30">{new Date(c.createdAt).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* NEW KB SOLUTION MODAL */}
      {showKbModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="kb-modal">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h3 className="font-serif italic font-semibold text-white text-base md:text-lg">Publish Troubleshooting Procedure</h3>
                <p className="text-[11px] text-white/40 mt-1 font-mono uppercase tracking-wider">Author standard diagnostic steps for system behaviors.</p>
              </div>
              <button
                onClick={() => setShowKbModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateKbItem} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs" id="kb-form">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1.5" htmlFor="kb-form-category">Issue Classification Category</label>
                <select
                  id="kb-form-category"
                  value={newKbCategory}
                  onChange={(e) => setNewKbCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#c9973d]"
                >
                  <option value="Network Issues" className="bg-[#0d0d0d]">Network Issues</option>
                  <option value="Software Issues" className="bg-[#0d0d0d]">Software Issues</option>
                  <option value="Hardware Issues" className="bg-[#0d0d0d]">Hardware Issues</option>
                  <option value="Operating System Issues" className="bg-[#0d0d0d]">Operating System Issues</option>
                  <option value="Performance Issues" className="bg-[#0d0d0d]">Performance Issues</option>
                  <option value="Security Issues" className="bg-[#0d0d0d]">Security Issues</option>
                  <option value="Account Issues" className="bg-[#0d0d0d]">Account Issues</option>
                  <option value="Printer Issues" className="bg-[#0d0d0d]">Printer Issues</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1.5" htmlFor="kb-form-title">Solution Title</label>
                <input
                  id="kb-form-title"
                  type="text"
                  required
                  placeholder="e.g. Troubleshooting stuck Windows Updates"
                  value={newKbTitle}
                  onChange={(e) => setNewKbTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#c9973d]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1.5" htmlFor="kb-form-symptoms">Symptom Keywords (comma separated)</label>
                <input
                  id="kb-form-symptoms"
                  type="text"
                  required
                  placeholder="e.g. update, stuck, fail, registry"
                  value={newKbSymptoms}
                  onChange={(e) => setNewKbSymptoms(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#c9973d]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1.5" htmlFor="kb-form-steps">Solution Steps (one step per line)</label>
                <textarea
                  id="kb-form-steps"
                  required
                  rows={5}
                  placeholder="e.g. Check your internet connection.&#10;Restart the Windows Update service.&#10;Run SFC Scannow command."
                  value={newKbSteps}
                  onChange={(e) => setNewKbSteps(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#c9973d] font-sans leading-normal"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowKbModal(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-kb-form-button"
                  type="submit"
                  className="px-4 py-2.5 bg-[#c9973d] hover:bg-[#d4b48c] text-black rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-md transition-colors cursor-pointer"
                >
                  Publish Solution
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

