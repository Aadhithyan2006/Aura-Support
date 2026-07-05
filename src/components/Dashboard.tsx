/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  History,
  Ticket as TicketIcon,
  HelpCircle,
  User as UserIcon,
  ArrowRight,
  LogOut,
  AlertCircle,
  Search,
  CheckCircle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Cpu,
  HardDrive,
  Thermometer,
  Battery,
  Wifi,
  AlertTriangle,
  X,
  Activity,
  Edit,
  Check,
  Settings,
  ShieldCheck
} from "lucide-react";
import { User, ChatSession, Ticket, KnowledgeBaseItem } from "../types";

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onSelectChat: (chatId: string) => void;
  setViewAdmin: (viewAdmin: boolean) => void;
  onUserUpdate: (updatedUser: User) => void;
}

export default function Dashboard({ user, onLogout, onSelectChat, setViewAdmin, onUserUpdate }: DashboardProps) {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [kb, setKb] = useState<KnowledgeBaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editUserId, setEditUserId] = useState(user.id);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Connection port state
  const [connectionPort, setConnectionPort] = useState(3000);
  const [isEditingPort, setIsEditingPort] = useState(false);
  const [tempPort, setTempPort] = useState("3000");

  // FAQ search and toggles
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Device Health Monitoring metrics
  const [cpuUsage, setCpuUsage] = useState(48);
  const [ramUsage, setRamUsage] = useState(62);
  const [cpuTemp, setCpuTemp] = useState(52);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [pingTime, setPingTime] = useState(32);
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const cpuCores = navigator.hardwareConcurrency || 8;
  const deviceMemory = (navigator as any).deviceMemory || 16;

  useEffect(() => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditUserId(user.id);
  }, [user]);

  useEffect(() => {
    fetchDashboardData();

    // Fetch battery level if supported
    if ((navigator as any).getBattery) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    } else {
      setBatteryLevel(84);
    }

    // Lively telemetry simulation updates
    const timer = setInterval(() => {
      setCpuUsage(prev => {
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const newVal = Math.min(Math.max(prev + change, 15), 98);
        return newVal;
      });
      setRamUsage(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const newVal = Math.min(Math.max(prev + change, 30), 95);
        return newVal;
      });
      setCpuTemp(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newVal = Math.min(Math.max(prev + change, 35), 85);
        return newVal;
      });
      setPingTime(prev => {
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const newVal = Math.min(Math.max(prev + change, 5), 120);
        return newVal;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleRunAIDiagnostics = async () => {
    setDiagnosing(true);
    setError(null);
    try {
      const metrics = {
        cpuCores,
        deviceMemory,
        cpuUsage,
        ramUsage,
        cpuTemp,
        batteryLevel,
        pingTime,
        language: navigator.language,
        userAgent: navigator.userAgent,
        diskHealth: "Optimal"
      };

      const response = await fetch("/api/diagnose-health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`
        },
        body: JSON.stringify({ metrics })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to analyze device telemetry");
      setDiagnosticReport(data.report);
      setShowReportModal(true);
    } catch (err: any) {
      setError(err.message || "Could not complete diagnostics run.");
    } finally {
      setDiagnosing(false);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${user.id}` };

      const [chatsRes, ticketsRes, kbRes] = await Promise.all([
        fetch("/api/chats", { headers }),
        fetch("/api/tickets", { headers }),
        fetch("/api/kb")
      ]);

      const chatsData = await chatsRes.json();
      const ticketsData = await ticketsRes.json();
      const kbData = await kbRes.json();

      if (!chatsRes.ok) throw new Error(chatsData.error || "Failed to load active chats");
      if (!ticketsRes.ok) throw new Error(ticketsData.error || "Failed to load support tickets");
      if (!kbRes.ok) throw new Error(kbData.error || "Failed to load solutions database");

      setChats(chatsData.chats || []);
      setTickets(ticketsData.tickets || []);
      setKb(kbData.kb || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred loading workspace.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProfileSuccess(null);
    setUpdatingProfile(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail.trim() || undefined,
          newId: editUserId
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      onUserUpdate(data.user);
      setProfileSuccess("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (err: any) {
      setError(err.message || "An error occurred while updating profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleSavePort = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(tempPort, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 65535) {
      setError("Invalid port range. Please choose a port between 1 and 65535.");
      return;
    }
    setConnectionPort(parsed);
    setIsEditingPort(false);
    setError(null);
  };

  const handleStartNewChat = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({ title: "New Diagnostic Session" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not launch support agent");

      onSelectChat(data.chat.id);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filteredFaqs = kb.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.symptoms.some(s => s.toLowerCase().includes(query))
    );
  });

  const toggleFaq = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const renderDiagnosticReport = (reportText: string) => {
    return reportText.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return <h4 key={idx} className="text-sm font-semibold font-mono text-[#c9973d] uppercase tracking-wider mt-4 mb-2">{trimmed.replace("###", "").trim()}</h4>;
      }
      if (trimmed.startsWith("##")) {
        return <h3 key={idx} className="text-base font-serif italic font-bold text-white mt-5 mb-2.5">{trimmed.replace("##", "").trim()}</h3>;
      }
      if (trimmed.startsWith("#")) {
        return <h2 key={idx} className="text-lg font-serif italic font-extrabold text-white mt-6 mb-3 border-b border-white/10 pb-1.5">{trimmed.replace("#", "").trim()}</h2>;
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return (
          <div key={idx} className="flex gap-2.5 pl-2 py-1 text-xs text-white/80 leading-relaxed">
            <span className="text-[#c9973d] shrink-0">â€¢</span>
            <span className="flex-1 font-medium">{trimmed.substring(1).trim().replace(/\*\*(.*?)\*\*/g, "$1")}</span>
          </div>
        );
      }
      if (/^\d+\./.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.(.*)$/);
        return (
          <div key={idx} className="flex gap-2.5 pl-2 py-1 text-xs text-white/80 leading-relaxed">
            <span className="text-[#c9973d] font-mono font-bold shrink-0">{match?.[1]}.</span>
            <span className="flex-1 font-medium">{match?.[2].trim().replace(/\*\*(.*?)\*\*/g, "$1")}</span>
          </div>
        );
      }
      if (!trimmed) return <div key={idx} className="h-2"></div>;
      
      // Basic inline bold formatter replacement
      const processedLine = trimmed.split(/\*\*(.*?)\*\*/g).map((chunk, chunkIdx) => {
        if (chunkIdx % 2 === 1) {
          return <strong key={chunkIdx} className="text-white font-semibold">{chunk}</strong>;
        }
        return chunk;
      });

      return <p key={idx} className="text-xs text-white/70 leading-relaxed mb-1">{processedLine}</p>;
    });
  };

  return (
    <div className="space-y-8" id="dashboard-container">
      {/* ── Welcome Hero Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dashboard-hero-grid">

        {/* Welcome Block — new style */}
        <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-[#0d0d0d]">
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(rgba(201,151,61,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(201,151,61,0.6) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          {/* Glow orb top-right */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#c9973d]/8 blur-3xl pointer-events-none" />

          <div className="relative p-7 flex flex-col justify-between h-full">
            <div>
              {/* Status row */}
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#c9973d]/10 border border-[#c9973d]/25 rounded-full">
                  {/* Pulse dot */}
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#c9973d]">Workspace Live</span>
                </div>
                {user.role === "admin" && (
                  <button
                    id="switch-admin-view-button"
                    onClick={() => setViewAdmin(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 hover:border-[#c9973d]/40 hover:bg-[#c9973d]/8 text-white/60 hover:text-[#c9973d] text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer"
                  >
                    {/* Crown icon SVG */}
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-[#c9973d]" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 11h12M2 11l2-5 4 3 4-5 2 7H2z" strokeLinejoin="round" strokeLinecap="round"/>
                    </svg>
                    Admin Console
                  </button>
                )}
              </div>

              {/* Greeting */}
              <h2 className="text-3xl md:text-4xl font-serif italic font-bold text-white tracking-wide leading-tight mb-3">
                Welcome, <span className="gold-heading">{user.name}</span>
              </h2>
              <p className="text-sm text-white/45 leading-relaxed max-w-lg font-sans">
                Your enterprise AI support platform is online. Diagnose issues, track tickets, and monitor device health — all in one place.
              </p>

              {/* Quick stat chips */}
              <div className="flex flex-wrap gap-3 mt-5">
                {[
                  { icon: (
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="1.5">
                      <rect x="1" y="3" width="14" height="10" rx="1.5" /><path d="M5 7h6M5 10h4" strokeLinecap="round"/>
                    </svg>
                  ), label: `${chats.length} Sessions` },
                  { icon: (
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z"/><path d="M8 5v3.5l2 2" strokeLinecap="round"/>
                    </svg>
                  ), label: `${tickets.filter(t=>t.status==="Open").length} Open Tickets` },
                  { icon: (
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 4h12M4 8h8M6 12h4" strokeLinecap="round"/>
                    </svg>
                  ), label: `${kb.length} KB Articles` },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-lg text-[11px] text-white/60 font-medium">
                    <span className="text-[#c9973d]">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                id="start-diagnostic-button"
                onClick={handleStartNewChat}
                disabled={loading}
                className="group relative px-6 py-3 bg-[#c9973d] hover:bg-[#d4a84d] disabled:opacity-50 text-black font-bold uppercase tracking-widest text-[11px] rounded-xl flex items-center gap-2.5 shadow-lg shadow-[#c9973d]/20 transition-all cursor-pointer overflow-hidden"
              >
                {/* Shimmer on hover */}
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {/* Custom neural/chat icon */}
                <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="2">
                  <circle cx="10" cy="10" r="3"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M3.22 16.78l1.42-1.42M15.36 4.64l1.42-1.42" strokeLinecap="round"/>
                </svg>
                Start Diagnostic Chat
              </button>

              <button
                id="refresh-dashboard-button"
                onClick={fetchDashboardData}
                className="px-5 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-bold uppercase tracking-widest text-[11px] rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                {/* Custom sync arrows icon */}
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-[#c9973d]" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4a8 8 0 0112 0M4 4v4h4M16 16a8 8 0 01-12 0M16 16v-4h-4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#0d0d0d] border border-white/10 p-6 rounded-2xl flex flex-col justify-between shadow-xl" id="profile-settings-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#c9973d] font-bold">User Identity</span>
              {!isEditingProfile && (
                <button
                  onClick={() => {
                    setEditName(user.name);
                    setEditEmail(user.email);
                    setEditUserId(user.id);
                    setIsEditingProfile(true);
                    setProfileSuccess(null);
                  }}
                  className="p-1 hover:bg-white/10 text-white/40 hover:text-[#c9973d] rounded transition-colors text-xs flex items-center gap-1 cursor-pointer font-mono uppercase tracking-wider text-[9px]"
                  title="Edit Profile"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
              )}
            </div>

            {profileSuccess && (
              <div className="p-2 bg-emerald-950/30 border border-emerald-900/50 rounded-lg text-emerald-200 text-[10px] font-semibold animate-fade-in">
                {profileSuccess}
              </div>
            )}

            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-3" id="edit-profile-form">
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-white/40 mb-1">User ID</label>
                  <input
                    type="text"
                    required
                    value={editUserId}
                    onChange={(e) => setEditUserId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c9973d] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-white/40 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c9973d]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-white/40 mb-1">
                    Email Address <span className="text-white/20 normal-case tracking-normal font-sans">(optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Leave blank to keep current"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9973d]"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="flex-1 py-1.5 bg-[#c9973d] hover:bg-[#d4b48c] text-black font-bold uppercase tracking-widest text-[9px] rounded-lg transition-colors cursor-pointer"
                  >
                    {updatingProfile ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-[9px] rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-[#c9973d]/10 border border-[#c9973d]/20 rounded-xl flex items-center justify-center text-[#c9973d]">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white text-sm leading-snug truncate">{user.name}</h4>
                    <p className="text-[11px] text-white/40 font-mono mt-0.5 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 font-mono text-[10px] uppercase">User ID</span>
                    <span className="font-mono text-white text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded select-all">{user.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 font-mono text-[10px] uppercase">Clearance</span>
                    <span className="font-mono font-bold capitalize text-white bg-[#c9973d]/10 border border-[#c9973d]/20 px-1.5 py-0.5 rounded text-[9px]">{user.role}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 font-mono text-[10px] uppercase">Open Tickets</span>
                    <span className="font-mono font-bold text-[#c9973d] text-sm">{tickets.length}</span>
                  </div>
                </div>
              </>
            )}

            {/* Gateway Connection Port Section */}
            <div className="pt-3.5 border-t border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/40 font-mono text-[10px] uppercase">Diagnostic Port</span>
                {isEditingPort ? (
                  <form onSubmit={handleSavePort} className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      className="w-16 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white text-right focus:outline-none focus:border-[#c9973d]"
                      value={tempPort}
                      onChange={(e) => setTempPort(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="p-1 bg-[#c9973d]/10 border border-[#c9973d]/20 rounded text-[#c9973d] hover:bg-[#c9973d]/20 transition-colors cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingPort(false)}
                      className="p-1 bg-white/5 border border-white/10 rounded text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-white text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      PORT {connectionPort}
                    </span>
                    <button
                      onClick={() => {
                        setTempPort(connectionPort.toString());
                        setIsEditingPort(true);
                      }}
                      className="p-1 hover:bg-white/10 text-white/30 hover:text-[#c9973d] rounded transition-all cursor-pointer"
                      title="Edit Port Connection"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            id="logout-button"
            onClick={onLogout}
            className="mt-6 w-full py-2.5 bg-red-950/10 hover:bg-red-950/20 border border-red-900/30 rounded-xl text-red-300 hover:text-red-200 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Account
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 text-red-200 rounded-xl text-xs flex items-center gap-2" id="dashboard-error">
          <AlertCircle className="w-4.5 h-4.5 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Dashboard Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="dashboard-modules-grid">
        {/* Left Column: Past Chats & Support Tickets */}
        <div className="space-y-8">
          {/* Previous Chats Card */}
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-xl" id="previous-chats-card">
            <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
              <h3 className="font-mono text-xs text-[#c9973d] flex items-center gap-2 uppercase tracking-[0.2em]">
                <History className="w-4.5 h-4.5 text-[#c9973d]" />
                Previous Chat History
              </h3>
              <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-[#c9973d] rounded-full text-[10px] font-mono font-bold">{chats.length}</span>
            </div>

            <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto">
              {chats.length === 0 ? (
                <div className="p-8 text-center text-white/30 text-xs">You have no previous support chats. Click "Start Diagnostic Chat" above to solve your first issue.</div>
              ) : (
                chats.map((c) => (
                  <div
                    key={c.id}
                    id={`chat-history-item-${c.id}`}
                    onClick={() => onSelectChat(c.id)}
                    className="p-4 hover:bg-white/[0.02] cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-1.5 max-w-[70%]">
                      <p className="font-serif italic text-white text-sm truncate leading-snug">{c.title}</p>
                      <p className="text-[10px] text-white/40 font-mono">{new Date(c.createdAt).toLocaleDateString()} â€¢ {c.messages.length} messages</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${c.status === "solved" ? "bg-emerald-950/30 text-emerald-300 border border-emerald-900/40" : c.status === "escalated" ? "bg-red-950/30 text-red-300 border border-red-900/40" : "bg-amber-950/30 text-amber-300 border border-amber-900/40"}`}>
                        {c.status}
                      </span>
                      <ArrowRight className="w-4 h-4 text-white/20" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Support Tickets Card */}
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-xl" id="support-tickets-card">
            <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
              <h3 className="font-mono text-xs text-[#c9973d] flex items-center gap-2 uppercase tracking-[0.2em]">
                <TicketIcon className="w-4.5 h-4.5 text-[#c9973d]" />
                Support Tickets
              </h3>
              <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-[#c9973d] rounded-full text-[10px] font-mono font-bold">{tickets.length}</span>
            </div>

            <div className="divide-y divide-white/5 max-h-[350px] overflow-y-auto">
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-white/30 text-xs">You have no open support tickets. Support tickets are automatically created if the support agent fails to resolve your technical problem.</div>
              ) : (
                tickets.map((t) => (
                  <div key={t.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:bg-white/[0.01]" id={`ticket-item-${t.id}`}>
                    <div className="space-y-1.5 max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#c9973d]">#{t.id}</span>
                        <span className={`px-1.5 py-0.2 bg-white/5 border border-white/10 text-white/60 rounded text-[9px] font-mono uppercase tracking-wider`}>{t.category}</span>
                      </div>
                      <p className="font-semibold text-white/95 leading-snug">{t.issue}</p>
                      <p className="text-[10px] text-white/40 font-mono">
                        Date: {new Date(t.createdAt).toLocaleDateString()}
                        {t.assignedTo && <span className="ml-2 font-sans font-medium text-[#c9973d]">Specialist: {t.assignedTo}</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-end md:self-auto">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${t.priority === "High" ? "bg-red-950/30 text-red-300 border border-red-900/40" : t.priority === "Medium" ? "bg-amber-950/30 text-amber-300 border border-amber-900/40" : "bg-white/5 text-white/50 border border-white/10"}`}>
                        {t.priority} Priority
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${t.status === "Open" ? "bg-blue-950/30 text-blue-300 border border-blue-900/40" : "bg-emerald-950/30 text-emerald-300 border border-emerald-900/40"}`}>
                        {t.status === "Open" ? <AlertCircle className="w-3 h-3 text-blue-400" /> : <CheckCircle className="w-3 h-3 text-emerald-400" />}
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Diagnostics Telemetry & FAQ */}
        <div className="space-y-8 flex flex-col" id="dashboard-right-column">
          {/* Device Health Monitor Card */}
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-xl p-5 space-y-4" id="device-health-monitor">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-[#c9973d]" />
                <h3 className="font-mono text-xs text-[#c9973d] uppercase tracking-[0.2em] font-semibold">Live Telemetry</h3>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-[#c9973d] bg-[#c9973d]/10 border border-[#c9973d]/30 px-2 py-0.5 rounded-full uppercase">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
                Active System
              </span>
            </div>

            {/* Auto-Alert Trigger Banner */}
            {(cpuUsage > 85 || cpuTemp > 75 || ramUsage > 85) && (
              <div className="p-3 bg-amber-950/25 border border-amber-900/40 rounded-xl text-[11px] text-amber-200 flex gap-2 animate-pulse">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Elevated Resource Usage Detected</p>
                  <p className="text-white/50 text-[10px]">High thermal or thread capacity alert. Run AI Diagnostics below to auto-optimize.</p>
                </div>
              </div>
            )}

            {/* Bento Grid Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* CPU load */}
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-white/40">
                  <span className="text-[9px] font-mono uppercase tracking-wider">CPU Core Load</span>
                  <Cpu className="w-3.5 h-3.5 text-[#c9973d]" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-mono font-bold text-white">{cpuUsage}%</span>
                  <span className="text-[9px] text-white/40 font-mono">({cpuCores} Cores)</span>
                </div>
                {/* Micro bar */}
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${cpuUsage > 80 ? "bg-red-500" : cpuUsage > 60 ? "bg-amber-500" : "bg-[#c9973d]"}`} style={{ width: `${cpuUsage}%` }}></div>
                </div>
              </div>

              {/* Memory */}
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-white/40">
                  <span className="text-[9px] font-mono uppercase tracking-wider">Memory Allocation</span>
                  <HardDrive className="w-3.5 h-3.5 text-[#c9973d]" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-mono font-bold text-white">{ramUsage}%</span>
                  <span className="text-[9px] text-white/40 font-mono">({deviceMemory} GB)</span>
                </div>
                {/* Micro bar */}
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${ramUsage > 80 ? "bg-red-500" : ramUsage > 60 ? "bg-amber-500" : "bg-[#c9973d]"}`} style={{ width: `${ramUsage}%` }}></div>
                </div>
              </div>

              {/* Thermal Core */}
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-2 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-white/40">
                  <span className="text-[9px] font-mono uppercase tracking-wider">Thermal Index</span>
                  <Thermometer className="w-3.5 h-3.5 text-[#c9973d]" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-mono font-bold text-white">{cpuTemp}Â°C</span>
                  <span className="text-[9px] text-white/40 font-mono">Core</span>
                </div>
                {/* Micro bar */}
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${cpuTemp > 75 ? "bg-red-500" : cpuTemp > 55 ? "bg-amber-500" : "bg-[#c9973d]"}`} style={{ width: `${(cpuTemp/100)*100}%` }}></div>
                </div>
              </div>

              {/* Ping latency */}
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Network Ping</span>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-[#c9973d]" />
                  <span className="text-xs font-mono font-bold text-white">{pingTime} ms</span>
                </div>
                <span className="text-[8px] text-emerald-400 font-mono block">â— Optimal Link</span>
              </div>

              {/* Power */}
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Power Battery</span>
                <div className="flex items-center gap-1.5">
                  <Battery className="w-3.5 h-3.5 text-[#c9973d]" />
                  <span className="text-xs font-mono font-bold text-white">{batteryLevel}%</span>
                </div>
                <span className="text-[8px] text-white/30 font-mono block">Status: Healthy</span>
              </div>
            </div>

            {/* AI Diagnose button */}
            <button
              id="ai-diagnose-system-health-button"
              onClick={handleRunAIDiagnostics}
              disabled={diagnosing}
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[#c9973d] font-bold uppercase tracking-widest text-[9px] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {diagnosing ? (
                <>
                  <RefreshCw className="w-3 h-3 text-[#c9973d] animate-spin" />
                  Generating Diagnostics...
                </>
              ) : (
                <>
                  <Activity className="w-3 h-3 text-[#c9973d]" />
                  Request AI Telemetry Diagnostics
                </>
              )}
            </button>
          </div>

          {/* Frequently Asked Questions Card */}
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col" id="faqs-card">
            <div className="p-4 bg-white/[0.02] border-b border-white/10">
              <h3 className="font-mono text-xs text-[#c9973d] flex items-center gap-2 uppercase tracking-[0.2em]">
                <HelpCircle className="w-4.5 h-4.5 text-[#c9973d]" />
                Interactive Solution FAQ
              </h3>
              <p className="text-[10px] text-white/50 mt-1 leading-snug">Read and perform standard resolution processes immediately without starting an active support chat.</p>

              <div className="relative mt-3">
                <span className="absolute left-3 top-2.5 text-[#c9973d]">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  id="faq-search-input"
                  type="text"
                  placeholder="Search solutions, symptoms, or issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c9973d]"
                />
              </div>
            </div>

            <div className="divide-y divide-white/5 overflow-y-auto max-h-[400px]" id="faqs-list">
              {filteredFaqs.length === 0 ? (
                <div className="p-8 text-center text-white/30 text-xs">No matching solution articles found. Try another search.</div>
              ) : (
                filteredFaqs.map((item) => {
                  const isExpanded = expandedFaqId === item.id;
                  return (
                    <div key={item.id} className="text-xs" id={`faq-item-${item.id}`}>
                      <button
                        onClick={() => toggleFaq(item.id)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.01] transition-colors font-semibold text-white/80 cursor-pointer"
                      >
                        <div className="space-y-1.5 max-w-[85%]">
                          <span className="px-1.5 py-0.2 bg-white/5 border border-white/10 text-[#c9973d] rounded text-[9px] font-mono uppercase tracking-wider">{item.category}</span>
                          <p className="font-semibold text-white/95 leading-snug">{item.title}</p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="px-4 pb-4 bg-white/[0.01] space-y-3.5 border-t border-white/5 pt-3.5 text-white/70"
                        >
                          <div className="space-y-2">
                            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest font-semibold">Troubleshooting instructions</p>
                            {item.solutionSteps.map((step, idx) => (
                              <div key={idx} className="flex gap-2.5 leading-relaxed">
                                <span className="font-serif italic text-[#c9973d] text-sm shrink-0">Step {idx + 1}</span>
                                <p className="font-medium text-xs text-white/80">{step}</p>
                              </div>
                            ))}
                          </div>

                          <div>
                            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest font-semibold mb-1.5">Symptoms/Triggers</p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.symptoms.map(s => (
                                <span key={s} className="px-2 py-0.5 bg-[#c9973d]/5 border border-[#c9973d]/20 text-[#c9973d] rounded text-[9px] font-mono">{s}</span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI DIAGNOSTICS REPORT MODAL */}
      {showReportModal && diagnosticReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="report-modal">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden"
          >
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#c9973d]" />
                <div>
                  <h3 className="font-serif italic font-semibold text-white text-sm">Aura AI System Diagnostic Report</h3>
                  <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider mt-0.5">Real-time performance tuning diagnostics</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-2 bg-[#0a0a0a]" id="report-modal-content">
              {renderDiagnosticReport(diagnosticReport)}
            </div>

            <div className="p-5 border-t border-white/10 bg-[#0d0d0d] flex justify-end gap-3.5">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 bg-[#c9973d] hover:bg-[#d4b48c] text-black rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-md transition-all cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

