/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, ChatSession, ChatMessage } from "../types";

/* ── Unique custom SVG icon set ─────────────────────────── */
const Icons = {
  Back: () => (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 5L7.5 10l5 5"/>
    </svg>
  ),
  AiCore: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
      <path d="M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12"/>
      <circle cx="12" cy="12" r="7" strokeOpacity="0.2"/>
    </svg>
  ),
  UserDot: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="8" r="3.5"/>
      <path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7"/>
    </svg>
  ),
  Ticket: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5H9a2 2 0 00-2 2v1a2 2 0 000 4v1a2 2 0 002 2h6a2 2 0 002-2v-1a2 2 0 000-4V7a2 2 0 00-2-2z"/>
      <line x1="12" y1="5" x2="12" y2="19" strokeDasharray="2 2"/>
    </svg>
  ),
  Star: ({ filled }: { filled?: boolean }) => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  Clip: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.48"/>
    </svg>
  ),
  Mic: ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3"/>
      {active
        ? <><path d="M5 10v2a7 7 0 0014 0v-2" strokeOpacity="1"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></>
        : <><path d="M5 10v2a7 7 0 0014 0v-2" strokeOpacity="0.5"/><line x1="12" y1="19" x2="12" y2="22" strokeOpacity="0.5"/><line x1="9" y1="22" x2="15" y2="22" strokeOpacity="0.5"/></>
      }
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none"/>
    </svg>
  ),
  Speaker: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.2"/>
      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="15" y1="5" x2="5" y2="15"/><line x1="5" y1="5" x2="15" y2="15"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Spin: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 animate-spin" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeOpacity="0.3"/>
      <path d="M12 2v4" strokeOpacity="1"/>
    </svg>
  ),
};

interface ChatInterfaceProps {
  user: User;
  chatId: string;
  onBack: () => void;
}

export default function ChatInterface({ user, chatId, onBack }: ChatInterfaceProps) {
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [aiMode, setAiMode] = useState<"ai" | "fallback">("ai");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchChat(); }, [chatId]);
  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat?.messages, loading]);

  const fetchChat = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, { headers: { Authorization: `Bearer ${user.id}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load session");
      setChat(data.chat);
    } catch (err: any) { setError(err.message); }
  };

  const startListening = () => {
    setVoiceError(null);
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setVoiceError("Speech recognition not supported. Use Chrome or Safari."); return; }
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false; rec.lang = "en-US";
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = (e: any) => {
      setIsListening(false);
      if (e.error === "not-allowed") setVoiceError("Microphone blocked. Enable permissions.");
      else if (e.error === "no-speech") setVoiceError("No speech detected. Try again.");
      else setVoiceError(`Voice error: ${e.error}`);
    };
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setInputText(p => p ? p + " " + t : t);
    };
    try { rec.start(); } catch { setVoiceError("Could not start microphone."); setIsListening(false); }
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*#`_\-]/g, ""));
    u.rate = 1.05; u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Image must be < 2MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setAttachedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e?: React.FormEvent, forceText?: string) => {
    if (e) e.preventDefault();
    const textToSend = forceText || inputText;
    if (!textToSend.trim() || loading) return;
    const img = attachedImage;
    setInputText(""); setAttachedImage(null); setLoading(true); setError(null);
    if (chat) {
      const tmp: ChatMessage = { id: `tmp-${Date.now()}`, sender: "user", text: textToSend, timestamp: new Date().toISOString(), image: img || undefined };
      setChat({ ...chat, messages: [...chat.messages, tmp] });
    }
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.id}` },
        body: JSON.stringify({ text: textToSend, image: img }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get reply");
      setChat(data.chat); setAiMode(data.mode);
    } catch (err: any) { setError(err.message); fetchChat(); }
    finally { setLoading(false); }
  };

  const handleRate = async (stars: number) => {
    try {
      await fetch(`/api/chats/${chatId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.id}` },
        body: JSON.stringify({ rating: stars }),
      });
    } catch {}
    setRating(stars); setFeedbackSubmitted(true);
  };

  if (error && !chat) return (
    <div className="flex flex-col items-center justify-center p-20 text-center" id="chat-error-state">
      <div className="w-14 h-14 rounded-2xl bg-red-950/30 border border-red-800/40 flex items-center justify-center text-red-400 mb-4">
        <Icons.Alert />
      </div>
      <p className="text-white font-serif italic text-lg mb-1">Session Failed</p>
      <p className="text-white/50 text-sm mb-5">{error}</p>
      <button onClick={onBack} className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm text-white font-semibold transition-colors cursor-pointer">
        Return to Dashboard
      </button>
    </div>
  );

  if (!chat) return (
    <div className="flex flex-col items-center justify-center p-20" id="chat-loading-state">
      <div className="text-[#c9973d] mb-4"><Icons.Spin /></div>
      <p className="text-white/40 text-[11px] font-mono uppercase tracking-[0.2em]">Initializing diagnostic pipeline...</p>
    </div>
  );

  const lastMsg = chat.messages[chat.messages.length - 1];
  const isAwaitingYesNo = lastMsg?.sender === "assistant" && lastMsg.text.includes("Yes") && lastMsg.text.includes("No");
  const statusColor = chat.status === "active" ? "bg-amber-400" : chat.status === "solved" ? "bg-emerald-400" : "bg-red-400";

  return (
    <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden flex flex-col border border-white/10 shadow-2xl bg-[#0c0c0c]" style={{ height: "80vh" }} id="active-chat-container">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-3.5 border-b border-white/[0.07] bg-[#0e0e0e] flex items-center justify-between gap-4" id="chat-header">
        <div className="flex items-center gap-3">
          <button id="chat-back-button" onClick={onBack}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/[0.07] flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer">
            <Icons.Back />
          </button>
          <div className="w-px h-6 bg-white/[0.07]" />
          <div>
            <h3 className="font-serif italic font-bold text-white text-base leading-tight">{chat.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${statusColor} ${chat.status === "active" ? "animate-pulse" : ""}`} />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                {chat.status}
                {chat.category && <> &middot; <span className="text-white/60">{chat.category}</span></>}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {aiMode === "fallback" && (
            <span className="px-2 py-0.5 rounded-full bg-[#c9973d]/10 border border-[#c9973d]/25 text-[#c9973d] text-[9px] font-mono uppercase tracking-widest">KB Mode</span>
          )}
          <span className="text-[9px] font-mono text-white/20 hidden sm:block">{chatId}</span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      {chat.status === "active" && chat.troubleshootingSteps && chat.troubleshootingSteps.length > 0 && (
        <div className="shrink-0 px-5 py-2 border-b border-white/[0.05] bg-[#0d0d0d]" id="progress-bar-container">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Resolution Path</span>
            <span className="text-[9px] font-mono text-[#c9973d]">
              {Math.min((chat.currentStepIndex ?? 0) + 1, chat.troubleshootingSteps.length)} / {chat.troubleshootingSteps.length} steps
            </span>
          </div>
          <div className="flex gap-1">
            {chat.troubleshootingSteps.map((_, idx) => {
              const cur = chat.currentStepIndex ?? 0;
              return (
                <div key={idx} className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${idx < cur ? "bg-[#c9973d]" : idx === cur ? "bg-[#c9973d]/50" : "bg-white/[0.06]"}`} />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-[#090909]" id="messages-scroller"
        style={{ backgroundImage: "radial-gradient(circle at 80% 10%, rgba(201,151,61,0.03) 0%, transparent 60%)" }}>

        {chat.messages.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="h-full flex flex-col items-center justify-center text-center px-8 gap-5" id="empty-chat-welcome">
            {/* Unique animated icon */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9973d]/20 to-[#c9973d]/5 border border-[#c9973d]/30 flex items-center justify-center text-[#c9973d] shadow-lg shadow-[#c9973d]/10">
                <Icons.AiCore />
              </div>
              {/* Orbit ring */}
              <div className="absolute inset-0 rounded-2xl border border-[#c9973d]/15 scale-125 animate-pulse" />
              {/* Corner dots */}
              {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map(pos => (
                <span key={pos} className={`absolute ${pos} w-1.5 h-1.5 rounded-full bg-[#c9973d]/40`} />
              ))}
            </div>
            <div>
              <p className="font-serif italic text-white text-xl font-semibold mb-2">Diagnostic Session Ready</p>
              <p className="text-white/40 text-sm max-w-sm leading-relaxed">
                Describe your issue in plain language, upload an error screenshot, or speak your problem. The AI engine will classify, analyse, and guide you to a resolution.
              </p>
            </div>
            {/* Capability chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {[
                { icon: "🧠", label: "AI Classification" },
                { icon: "📸", label: "Screenshot Analysis" },
                { icon: "🎙️", label: "Voice Input" },
              ].map(({ icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-[11px] text-white/50">
                  <span>{icon}</span>{label}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          chat.messages.map((msg, i) => {
            const isBot = msg.sender === "assistant";
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i === chat.messages.length - 1 ? 0 : 0 }}
                className={`flex gap-3 ${isBot ? "mr-auto max-w-[88%]" : "ml-auto max-w-[78%] flex-row-reverse"}`}
                id={`message-bubble-${msg.id}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${isBot
                  ? "bg-gradient-to-br from-[#c9973d]/20 to-[#c9973d]/5 border-[#c9973d]/25 text-[#c9973d]"
                  : "bg-white/[0.06] border-white/[0.1] text-white/60"}`}>
                  {isBot ? <Icons.AiCore /> : <Icons.UserDot />}
                </div>
                <div className="space-y-1">
                  {/* Bubble */}
                  <div className={`px-4 py-3 text-[13px] leading-relaxed rounded-2xl ${isBot
                    ? "bg-[#141414] border border-white/[0.07] text-[#e0e0e0] rounded-tl-sm"
                    : "bg-gradient-to-br from-[#c9973d] to-[#a87830] text-black font-semibold rounded-tr-sm shadow-lg shadow-[#c9973d]/15"}`}>
                    {msg.image && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-white/10 shadow-lg max-w-xs">
                        <img src={msg.image} className="w-full max-h-52 object-cover" alt="Screenshot" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                  {/* Meta row */}
                  <div className={`flex items-center gap-2 px-1 ${isBot ? "justify-start" : "justify-end"}`}>
                    <span className="text-[9px] text-white/25 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {isBot && (
                      <button onClick={() => speakText(msg.text)} title="Read aloud"
                        className="p-0.5 text-white/25 hover:text-[#c9973d] transition-colors cursor-pointer">
                        <Icons.Speaker />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 mr-auto max-w-[60%]" id="bot-typing-indicator">
            <div className="w-8 h-8 rounded-xl shrink-0 bg-gradient-to-br from-[#c9973d]/20 to-[#c9973d]/5 border border-[#c9973d]/25 flex items-center justify-center text-[#c9973d]">
              <Icons.AiCore />
            </div>
            <div className="px-4 py-3 bg-[#141414] border border-white/[0.07] rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              {[0, 150, 300].map(d => (
                <span key={d} className="w-1.5 h-1.5 bg-[#c9973d]/60 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* ── Solved feedback ── */}
      <AnimatePresence>
        {chat.status === "solved" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="shrink-0 border-t border-emerald-900/30 bg-gradient-to-r from-emerald-950/20 to-[#0c0c0c] px-6 py-5 text-center" id="solved-feedback-area">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Icons.Check />
              </div>
              <span className="text-emerald-400 font-semibold text-sm">Issue Resolved Successfully</span>
            </div>
            {!feedbackSubmitted ? (
              <>
                <p className="text-white/40 text-xs mb-3">Rate this resolution to improve our AI engine</p>
                <div className="flex justify-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => handleRate(s)}
                      onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(null)}
                      className={`transition-all cursor-pointer scale-100 hover:scale-110 ${(hoverRating ?? rating ?? 0) >= s ? "text-[#c9973d]" : "text-white/20"}`}>
                      <Icons.Star filled={(hoverRating ?? rating ?? 0) >= s} />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[#c9973d] text-xs font-mono">
                {rating}★ recorded — thank you. Your feedback refines the diagnostic model.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Escalated ticket banner ── */}
      {chat.status === "escalated" && chat.ticketId && (
        <div className="shrink-0 border-t border-red-900/30 bg-gradient-to-r from-red-950/20 to-[#0c0c0c] px-5 py-4 flex items-center justify-between gap-4" id="escalated-ticket-banner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 shrink-0">
              <Icons.Ticket />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Support Ticket Raised</p>
              <p className="text-white/40 text-[11px] mt-0.5 font-mono">
                ID: <span className="text-red-400 font-bold">#{chat.ticketId}</span> &nbsp;&middot;&nbsp; Awaiting engineer assignment
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-300 text-[9px] font-mono uppercase tracking-widest shrink-0">Open</span>
        </div>
      )}

      {/* ── Input area ── */}
      {chat.status === "active" && (
        <div className="shrink-0 border-t border-white/[0.07] bg-[#0e0e0e] px-4 pt-3 pb-4" id="chat-input-area">

          {/* Yes / No quick replies */}
          <AnimatePresence>
            {isAwaitingYesNo && !loading && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                className="flex gap-2 justify-center mb-3">
                <button id="quick-yes-button" onClick={() => handleSendMessage(undefined, "Yes, it is resolved")}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-700/40 text-emerald-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">✓</span>
                  Yes, fixed!
                </button>
                <button id="quick-no-button" onClick={() => handleSendMessage(undefined, "No, still not resolved")}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/50 border border-red-800/40 text-red-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                  <span className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">✕</span>
                  Still broken
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attached image preview */}
          {attachedImage && (
            <div className="flex items-center gap-3 px-3 py-2 bg-white/[0.03] border border-white/[0.07] rounded-xl mb-3 max-w-sm" id="attached-preview-tray">
              <img src={attachedImage} className="h-10 w-10 object-cover rounded-lg border border-white/10" alt="Preview" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-white/80 truncate">Screenshot attached</p>
                <p className="text-[9px] text-[#c9973d] font-mono">Vision AI will analyse this image</p>
              </div>
              <button onClick={() => setAttachedImage(null)} className="p-1 text-white/30 hover:text-white transition-colors cursor-pointer"><Icons.Close /></button>
            </div>
          )}

          {/* Voice error */}
          {voiceError && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-950/20 border border-red-900/30 rounded-xl mb-3 text-[11px] text-red-300" id="voice-error-tray">
              <Icons.Alert />
              <span className="flex-1">{voiceError}</span>
              <button onClick={() => setVoiceError(null)} className="text-white/30 hover:text-white cursor-pointer"><Icons.Close /></button>
            </div>
          )}

          {/* Input row */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2" id="chat-message-form">
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

            {/* Screenshot button */}
            <button id="upload-screenshot-button" type="button" onClick={() => fileInputRef.current?.click()} title="Attach screenshot"
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer shrink-0
                ${attachedImage ? "bg-[#c9973d]/15 border-[#c9973d]/40 text-[#c9973d]" : "bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.08]"}`}>
              <Icons.Clip />
            </button>

            {/* Mic button */}
            <button id="voice-input-button" type="button" onClick={startListening} title="Voice input"
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer shrink-0
                ${isListening ? "bg-red-950/40 border-red-700/50 text-red-400 animate-pulse" : "bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.08]"}`}>
              <Icons.Mic active={isListening} />
            </button>

            {/* Text input */}
            <input id="chat-text-input" type="text" required={!attachedImage}
              placeholder={isListening ? "🎙 Listening — speak now..." : isAwaitingYesNo ? "Type Yes / No or describe what happened..." : "Describe your issue, or reply to the step above..."}
              value={inputText} onChange={e => setInputText(e.target.value)} disabled={loading}
              className="flex-1 h-9 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#c9973d]/50 focus:bg-white/[0.06] transition-all disabled:opacity-50" />

            {/* Send button */}
            <button id="send-message-button" type="submit" disabled={loading || (!inputText.trim() && !attachedImage)}
              className="w-9 h-9 rounded-xl bg-[#c9973d] hover:bg-[#d4a843] disabled:opacity-30 text-black flex items-center justify-center transition-all cursor-pointer shadow-md shadow-[#c9973d]/20 shrink-0">
              <Icons.Send />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
