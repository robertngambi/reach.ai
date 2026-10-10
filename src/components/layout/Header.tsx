import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Send,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC<{ onMobileMenuClick?: () => void }> = ({ onMobileMenuClick }) => {
    const {
    theme,
    toggleTheme,
    toggleChat,
    isChatOpen,
    setActiveTab,
    setActiveDirective,
    historyItems,
    businessInfo,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchQuery.includes('.') || searchQuery.startsWith('http')) {
      setActiveTab('studio');
      setActiveDirective('create-leads');
    } else {
      setActiveTab('studio');
      setActiveDirective('create-post');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-white/10 bg-[#0B0B14]/80 dark:bg-[#0B0B14]/80 backdrop-blur-xl">
      {/* Left: Mobile hamburger & search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile menu button */}
        <button
          onClick={onMobileMenuClick}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-300"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns, enter website URL, or command Reach..."
            className="w-full pl-10 pr-14 py-2 text-xs rounded-xl bg-white/[0.05] dark:bg-white/[0.05] border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/10 rounded border border-white/10">
            ⌘K
          </kbd>
        </form>
      </div>

      {/* Right: Controls & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Quick Create Leads shortcut pill */}
        <button
          onClick={() => {
            setActiveTab('studio');
            setActiveDirective('create-leads');
          }}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Create Leads</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel p-3 shadow-2xl border border-white/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Live Activity Center
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                    3 New
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close activity center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto mt-1">
                {historyItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-2.5 hover:bg-white/5 rounded-xl transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                      <div className="text-xs font-medium text-white truncate">{item.title}</div>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {item.description}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">{item.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reach Agent Summon Button (Pulsing glowing orb) */}
        <button
          onClick={toggleChat}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer ${
            isChatOpen
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
              : 'bg-white/5 hover:bg-white/10 border-indigo-500/40 text-slate-200'
          }`}
          title="Open Reach AI Chat Panel"
        >
          <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 blur-xs opacity-75 animate-ping" />
            <Bot className="relative w-4 h-4 text-indigo-300" />
          </div>
          <span className="text-xs font-semibold hidden sm:inline">Reach AI</span>
        </button>

        {/* User Profile Avatar with Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shrink-0 shadow-sm">
              <div className="w-full h-full rounded-full bg-[#0F0F1E] flex items-center justify-center text-xs font-bold text-white">
                {businessInfo.companyName.charAt(0) || 'A'}
              </div>
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight truncate max-w-[100px]">
                {businessInfo.companyName}
              </span>
              <span className="text-[10px] text-indigo-400 font-medium">Growth Tier</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-2xl border border-white/10 z-50">
              <div className="p-2 border-b border-white/10">
                <div className="text-xs font-bold text-white">{businessInfo.companyName}</div>
                <div className="text-[11px] text-slate-400 truncate">{businessInfo.contactInfo.email}</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  Brand & Settings
                </button>
                <button
                  onClick={() => {
                    setActiveTab('history');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  Campaign Archive
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
