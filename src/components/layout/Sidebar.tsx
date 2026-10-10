import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Compass,
  ImageIcon,
  FileText,
  Video,
  BookOpen,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Zap,
  Sliders,
  Layers,
  Smartphone,
  Globe,
  BookMarked,
  MessageSquareCode,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavTab, GeneratorDirective } from '../../types';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const {
    activeTab,
    setActiveTab,
    activeDirective,
    setActiveDirective,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    toggleChat,
    leads,
    setActiveSettingsSection,
  } = useApp();

  const mainTabs: {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    color: string;
  }[] = [
    {
      id: 'studio',
      label: 'AI Studio',
      icon: Sparkles,
      color: 'text-indigo-400',
    },
    {
      id: 'history',
      label: 'Archive & History',
      icon: History,
      color: 'text-slate-400',
    },
    {
      id: 'settings',
      label: 'Directive Settings',
      icon: Settings,
      color: 'text-slate-400',
    },
  ];

  const directiveJumpers: {
    id: GeneratorDirective;
    label: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    { id: 'create-leads', label: 'Create leads', icon: Compass, color: 'text-violet-400' },
    { id: 'create-image', label: 'Create Image', icon: ImageIcon, color: 'text-pink-400' },
    { id: 'create-post', label: 'Create Post', icon: FileText, color: 'text-amber-400' },
    { id: 'create-video', label: 'Create Video', icon: Video, color: 'text-cyan-400' },
    { id: 'create-brochure', label: 'Create Brochure', icon: BookOpen, color: 'text-emerald-400' },
    { id: 'create-apps', label: 'Create Apps', icon: Smartphone, color: 'text-blue-400' },
    { id: 'create-websites', label: 'Create websites', icon: Globe, color: 'text-teal-400' },
    { id: 'create-books', label: 'Create Books', icon: BookMarked, color: 'text-amber-400' },
    { id: 'lets-chat', label: "Let's Chat", icon: MessageSquareCode, color: 'text-fuchsia-400' },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col h-screen shrink-0 transition-all duration-300 ease-in-out border-r border-white/10 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-[#0F0F1E]/95 via-[#0D0D1A]/95 to-[#080811]/98 backdrop-blur-xl shadow-2xl`}
    >
      {/* App Branding Header */}
      <div className="flex items-center justify-between h-18 px-4 border-b border-white/5">
        <div
          onClick={() => {
            setActiveTab('studio');
            setActiveDirective('create-leads');
          }}
          className="flex items-center gap-3 cursor-pointer overflow-hidden group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-30 blur group-hover:opacity-70 transition duration-300 pointer-events-none" />
          </div>

          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white">
                    Reach<span className="gradient-text">.ai</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Agent
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">
                  Reach - Your AI Agent Platform
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle Collapse Button on desktop */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Exit 'X' Button on side menu drawer */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Exit menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Workspace
        </div>

        {mainTabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose?.();
              }}
              className={`relative flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group cursor-pointer ${
                isActive
                  ? 'text-white bg-white/[0.08] shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]"
                />
              )}

              <div
                className={`flex items-center justify-center w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? item.color : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-3 truncate font-medium text-left flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}

        {/* Generator Directives Section in Sidebar */}
        <div className="pt-4 pb-1 px-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Directives
          </div>
        </div>

        {directiveJumpers.map((dir) => {
          const Icon = dir.icon;
          const isDirectiveActive = activeTab === 'studio' && activeDirective === dir.id;

          return (
            <button
              key={dir.id}
              onClick={() => {
                setActiveTab('studio');
                setActiveDirective(dir.id);
                onClose?.();
              }}
              className={`relative flex items-center w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isDirectiveActive
                  ? 'bg-indigo-500/20 text-white border border-indigo-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className={`w-5 h-5 flex items-center justify-center shrink-0 ${dir.color}`}>
                <Icon className="w-4 h-4" />
              </div>

              {!isSidebarCollapsed && (
                <span className="ml-3 truncate text-left flex-1">
                  {dir.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Agent "Reach" Mini Orb Card */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={toggleChat}
          className="relative w-full p-3 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 hover:from-indigo-900/70 hover:to-purple-900/70 border border-indigo-500/30 transition-all duration-300 group cursor-pointer text-left overflow-hidden shadow-lg shadow-indigo-950/50"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />

          <div className="flex items-center gap-3">
            {/* Glowing animated orb avatar */}
            <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 animate-spin opacity-80 blur-xs"
                style={{ animationDuration: '8s' }}
              />
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0F0F1E] border border-white/20 shadow-inner">
                <Bot className="w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F0F1E] shadow-[0_0_8px_#34d399]" />
            </div>

            <AnimatePresence>
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      Reach Agent
                      <Sparkles className="w-3 h-3 text-pink-400 inline" />
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">Online</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    Click to open chat assistance
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
      </div>
    </aside>
  );
};
