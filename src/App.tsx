/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ChatInterface from "./components/ChatInterface";
import AdminPanel from "./components/AdminPanel";
import { User, UserRole } from "./types";
import { ShieldAlert, LogOut, ArrowLeft } from "lucide-react";

/* Aura Support â€” custom AI+IT support logo mark (brain + circuit + shield) */
function AuraLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Aura Support Logo"
    >
      {/* Outer shield */}
      <path
        d="M18 3L5 8.5V18c0 7.18 5.6 13.9 13 15.5C25.4 31.9 31 25.18 31 18V8.5L18 3Z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Brain left lobe */}
      <path
        d="M18 10.5c-1.2-1.8-4.2-2-5.5-.3-1 1.3-.8 3 .3 4-.9.6-1.5 1.7-1.3 2.9.2 1.3 1.2 2.2 2.4 2.4-.2.8 0 1.7.6 2.3.8.8 2 .9 2.9.3"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Brain right lobe */}
      <path
        d="M18 10.5c1.2-1.8 4.2-2 5.5-.3 1 1.3.8 3-.3 4 .9.6 1.5 1.7 1.3 2.9-.2 1.3-1.2 2.2-2.4 2.4.2.8 0 1.7-.6 2.3-.8.8-2 .9-2.9.3"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center spine */}
      <line x1="18" y1="10.5" x2="18" y2="22.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Circuit nodes â€” left */}
      <circle cx="12.5" cy="24.5" r="1" fill="currentColor" />
      <line x1="13.5" y1="24.5" x2="17" y2="24.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="12.5" y1="23.5" x2="12.5" y2="22.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {/* Circuit nodes â€” right */}
      <circle cx="23.5" cy="24.5" r="1" fill="currentColor" />
      <line x1="22.5" y1="24.5" x2="19" y2="24.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="23.5" y1="23.5" x2="23.5" y2="22.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {/* Bottom center node */}
      <circle cx="18" cy="24.5" r="1.2" fill="currentColor" fillOpacity="0.9" />
      {/* Pulse ring */}
      <circle cx="18" cy="24.5" r="2.8" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35" />
    </svg>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [viewAdmin, setViewAdmin] = useState(false);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentChatId(null);
    setViewAdmin(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentChatId(null);
    setViewAdmin(false);
  };

  const handleBackToDashboard = () => {
    setCurrentChatId(null);
    setViewAdmin(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans antialiased" id="app-root">
      {/* Global Navigation Header */}
      <header className="sticky top-0 bg-[#0d0d0d] border-b border-white/10 z-30" id="app-navigation-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c9973d]/10 border border-[#c9973d]/30 rounded-xl flex items-center justify-center text-[#c9973d] shadow-sm shadow-[#c9973d]/10">
              <AuraLogo className="w-6 h-6 text-[#c9973d]" />
            </div>
            <div>
              <h1 className="font-serif italic font-bold text-base md:text-xl gold-heading leading-none tracking-wide">Aura Support</h1>
              <p className="text-[9px] text-white/35 uppercase tracking-[0.25em] font-mono mt-1">Technical Intelligence</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              {/* Back button when in Chat or Admin View */}
              {(currentChatId || viewAdmin) && (
                <button
                  id="header-back-button"
                  onClick={handleBackToDashboard}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-[#e0e0e0] font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4 text-[#c9973d]" />
                  <span className="hidden md:inline">Dashboard</span>
                </button>
              )}

              {user.role === UserRole.ADMIN && !viewAdmin && (
                <button
                  id="header-admin-console-button"
                  onClick={() => {
                    setViewAdmin(true);
                    setCurrentChatId(null);
                  }}
                  className="px-3.5 py-2 bg-[#c9973d]/10 border border-[#c9973d]/30 hover:bg-[#c9973d]/20 text-[#c9973d] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <ShieldAlert className="w-4 h-4 text-[#c9973d] animate-pulse" />
                  <span>Admin Console</span>
                </button>
              )}

              <button
                id="header-logout-button"
                onClick={handleLogout}
                className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white/80 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="app-main-content">
        {!user ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : viewAdmin && user.role === UserRole.ADMIN ? (
          <AdminPanel user={user} />
        ) : currentChatId ? (
          <ChatInterface user={user} chatId={currentChatId} onBack={handleBackToDashboard} />
        ) : (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onSelectChat={setCurrentChatId}
            setViewAdmin={setViewAdmin}
            onUserUpdate={setUser}
          />
        )}
      </main>
    </div>
  );
}

