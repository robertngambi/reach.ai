/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AgentPanel } from './components/agent/AgentPanel';
import { ToastContainer } from './components/common/ToastContainer';

import { UnifiedStudio } from './components/studio/UnifiedStudio';
import { HistoryModule } from './components/modules/HistoryModule';
import { SettingsModule } from './components/modules/SettingsModule';

const MainLayout: React.FC = () => {
  const { activeTab, toggleChat, isChatOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'studio':
        return <UnifiedStudio />;
      case 'history':
        return <HistoryModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <UnifiedStudio />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0B14] text-[#F1F5F9] selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Desktop & Collapsible Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden shadow-2xl"
            >
              <Sidebar onClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Canvas Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Sticky Top Header */}
        <Header onMobileMenuClick={() => setMobileMenuOpen(true)} />

        {/* Scrollable Route Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveModule()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Persistent Chat / Agent Drawer (Reach) */}
      <AgentPanel />

      {/* Floating Action Button (FAB) on mobile / tablet to summon Reach */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-40 lg:hidden p-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-2xl shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center group"
          title="Chat with Reach AI"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-600 animate-pulse" />
          </div>
        </button>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
