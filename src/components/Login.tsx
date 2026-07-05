/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LogIn, UserPlus, Mail, Lock, User as UserIcon, AlertCircle,
  X, Chrome, ShieldCheck, Cpu, Wifi, HardDrive, Activity,
  ArrowRight, Eye, EyeOff, CheckCircle2
} from "lucide-react";
import { User } from "../types";

/* Inline Aura logo â€” AI brain + circuit + shield */
function AuraLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18 3L5 8.5V18c0 7.18 5.6 13.9 13 15.5C25.4 31.9 31 25.18 31 18V8.5L18 3Z"
        fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M18 10.5c-1.2-1.8-4.2-2-5.5-.3-1 1.3-.8 3 .3 4-.9.6-1.5 1.7-1.3 2.9.2 1.3 1.2 2.2 2.4 2.4-.2.8 0 1.7.6 2.3.8.8 2 .9 2.9.3"
        stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 10.5c1.2-1.8 4.2-2 5.5-.3 1 1.3.8 3-.3 4 .9.6 1.5 1.7 1.3 2.9-.2 1.3-1.2 2.2-2.4 2.4.2.8 0 1.7-.6 2.3-.8.8-2 .9-2.9.3"
        stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="18" y1="10.5" x2="18" y2="22.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="12.5" cy="24.5" r="1" fill="currentColor" />
      <line x1="13.5" y1="24.5" x2="17" y2="24.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="12.5" y1="23.5" x2="12.5" y2="22.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="23.5" cy="24.5" r="1" fill="currentColor" />
      <line x1="22.5" y1="24.5" x2="19" y2="24.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="23.5" y1="23.5" x2="23.5" y2="22.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="18" cy="24.5" r="1.2" fill="currentColor" fillOpacity="0.9" />
      <circle cx="18" cy="24.5" r="2.8" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35" />
    </svg>
  );
}

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const FEATURES = [
  { icon: Cpu, label: "AI-Powered Diagnostics", desc: "Gemini Vision analyzes your error screenshots instantly" },
  { icon: Activity, label: "Live Device Telemetry", desc: "Real-time CPU, RAM & thermal monitoring dashboard" },
  { icon: Wifi, label: "Smart Ticket Routing", desc: "Auto-priority scoring and engineer assignment" },
  { icon: HardDrive, label: "Knowledge Base Engine", desc: "Step-by-step guided troubleshooting for 8 IT categories" },
];

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState("");
  const [googleCustomName, setGoogleCustomName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister ? { name, email, password } : { email, password };
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      if (isRegister) {
        setSuccess("Account created! You can now sign in.");
        setIsRegister(false);
        setPassword("");
      } else {
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (emailToUse: string, nameToUse: string) => {
    setError(null);
    setLoading(true);
    setShowGoogleModal(false);
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameToUse, email: emailToUse, googleId: `g-${Math.random().toString(36).substring(2, 10)}` }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Google Sign-In failed.");
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: "user" | "admin") => {
    setEmail(role === "admin" ? "admin@support.com" : "user@support.com");
    setPassword(role === "admin" ? "admin123" : "user123");
    setIsRegister(false);
    setError(null);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center" id="login-container">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-white/10">

        {/* â”€â”€ LEFT PANEL: Brand / Feature Showcase â”€â”€ */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#111008] via-[#1a1508] to-[#0d0d0d] border-r border-white/10 p-10">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-[#c9973d]/15 border border-[#c9973d]/40 flex items-center justify-center">
                <AuraLogo className="w-6 h-6 text-[#c9973d]" />
              </div>
              <div>
                <p className="font-serif italic font-bold text-[#c9973d] text-2xl gold-heading leading-none">Aura Support</p>
                <p className="text-[9px] text-white/30 font-mono uppercase tracking-[0.25em] mt-1">Enterprise ITSM Platform</p>
              </div>
            </div>

            <h2 className="text-4xl font-serif italic text-white font-bold leading-tight mb-3">
              AI-Powered IT<br />
              <span className="gold-heading">Support Intelligence</span>
            </h2>
            <p className="text-sm text-white/50 leading-relaxed mb-10 max-w-xs">
              Enterprise-grade technical support with conversational AI, predictive diagnostics, and intelligent ticket management.
            </p>

            {/* Feature list */}
            <div className="space-y-5">
              {FEATURES.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#c9973d]/10 border border-[#c9973d]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#c9973d]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{label}</p>
                    <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom stat strip */}
          <div className="grid grid-cols-3 gap-3 pt-8 border-t border-white/5">
            {[["8", "IT Categories"], ["5-Step", "AI Resolution"], ["24/7", "Monitoring"]].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <p className="text-xl font-serif italic font-bold gold-heading font-mono">{val}</p>
                <p className="text-[9px] text-white/30 uppercase tracking-wider font-medium mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* â”€â”€ RIGHT PANEL: Auth Form â”€â”€ */}
        <div className="bg-[#0d0d0d] flex flex-col justify-center p-8 sm:p-12">
          {/* Tab switcher */}
          <div className="flex bg-white/[0.04] border border-white/10 rounded-xl p-1 mb-8 gap-1">
            {["Sign In", "Register"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => { setIsRegister(i === 1); setError(null); setSuccess(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  isRegister === (i === 1)
                    ? "bg-[#c9973d] text-black shadow"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? "register" : "login"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-serif italic text-white font-bold mb-1">
                {isRegister ? "Create your account" : "Welcome back"}
              </h3>
              <p className="text-xs text-white/40 mb-6 font-sans tracking-wide">
                {isRegister ? "Join the Aura ITSM support platform" : "Sign in to access your support console"}
              </p>

              {/* Alerts */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex items-center gap-2 text-red-300 text-xs overflow-hidden"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-center gap-2 text-emerald-300 text-xs overflow-hidden"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
                {isRegister && (
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        id="register-name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9973d]/60 focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9973d]/60 focus:bg-white/[0.06] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder={isRegister ? "Min. 6 characters" : "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9973d]/60 focus:bg-white/[0.06] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="login-submit-button"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#c9973d] hover:bg-[#d4b48c] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#c9973d]/10 mt-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : isRegister ? (
                    <><UserPlus className="w-4 h-4" /> Create Account</>
                  ) : (
                    <><LogIn className="w-4 h-4" /> Sign In <ArrowRight className="w-3.5 h-3.5 ml-1" /></>
                  )}
                </button>

                {!isRegister && (
                  <button
                    id="google-signin-button"
                    type="button"
                    onClick={() => setShowGoogleModal(true)}
                    className="w-full py-3 px-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-semibold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                  >
                    <Chrome className="w-4 h-4 text-[#c9973d]" />
                    Continue with Google
                  </button>
                )}
              </form>

              {/* Demo accounts */}
              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-widest text-white/25 font-semibold text-center mb-3">Quick Demo Access</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Employee", email: "user@support.com", role: "user" as const },
                    { label: "IT Admin", email: "admin@support.com", role: "admin" as const },
                  ].map(({ label, email: demoEmail, role }) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleQuickDemo(role)}
                      className="group px-3 py-2.5 bg-white/[0.02] hover:bg-[#c9973d]/[0.08] border border-white/[0.07] hover:border-[#c9973d]/30 rounded-xl transition-all cursor-pointer text-left"
                    >
                      <p className="text-xs font-semibold text-white/70 group-hover:text-[#c9973d] transition-colors">{label}</p>
                      <p className="text-[9px] text-white/25 font-mono mt-0.5 truncate">{demoEmail}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* â”€â”€ Google Sign-In Modal â”€â”€ */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            id="google-auth-modal"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-5 border-b border-white/[0.07] flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <Chrome className="w-5 h-5 text-[#c9973d]" />
                  <div>
                    <p className="font-semibold text-white text-sm">Google Sign-In</p>
                    <p className="text-[10px] text-white/35 font-mono uppercase tracking-wider">Choose or enter account</p>
                  </div>
                </div>
                <button onClick={() => setShowGoogleModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/35 hover:text-white transition-colors cursor-pointer">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="p-5 space-y-3" id="google-modal-content">
                {[
                  { name: "Aadhithyan TN", email: "aadhithyantn47@gmail.com" },
                  { name: "Elena Gold", email: "elena.gold.support@gmail.com" },
                  { name: "Marcus Administrator", email: "marcus.admin@support.com" },
                ].map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleGoogleSignIn(acc.email, acc.name)}
                    className="w-full flex items-center gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#c9973d]/30 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#c9973d]/10 border border-[#c9973d]/20 flex items-center justify-center text-[#c9973d] text-xs font-bold uppercase group-hover:bg-[#c9973d]/20 transition-all">
                      {acc.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-white group-hover:text-[#c9973d] transition-colors">{acc.name}</p>
                      <p className="text-[10px] text-white/35 font-mono">{acc.email}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#c9973d] ml-auto transition-colors" />
                  </button>
                ))}

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-white/[0.06]" />
                  <span className="mx-3 text-[10px] font-mono text-white/25 uppercase tracking-wider">or custom</span>
                  <div className="flex-grow border-t border-white/[0.06]" />
                </div>

                <div className="space-y-2.5">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={googleCustomName}
                    onChange={(e) => setGoogleCustomName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9973d]/50"
                  />
                  <input
                    type="email"
                    placeholder="Google email address"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9973d]/50"
                  />
                  <button
                    id="google-custom-signin-submit"
                    type="button"
                    disabled={!googleCustomEmail}
                    onClick={() => handleGoogleSignIn(googleCustomEmail, googleCustomName || "Google User")}
                    className="w-full py-2.5 bg-[#c9973d] hover:bg-[#d4b48c] disabled:opacity-30 text-black font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Connect Account
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

