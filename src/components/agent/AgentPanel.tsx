import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Paperclip,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  Compass,
  Image,
  FileText,
  Video,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';

export const AgentPanel: React.FC = () => {
    const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendChatMessage,
    isAgentTyping,
    setActiveTab,
    setActiveDirective,
    businessInfo,
  } = useApp();

  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen, isAgentTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !attachment) return;

    const messageText = input;
    const currentAttachment = attachment || undefined;
    setInput('');
    setAttachment(null);
    await sendChatMessage(messageText, currentAttachment);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionChipClick = (actionText: string) => {
    const lower = actionText.toLowerCase();
    if (lower.includes('customer') || lower.includes('find') || lower.includes('scan') || lower.includes('lead')) {
      setActiveTab('studio');
      setActiveDirective('create-leads');
      sendChatMessage(`Let's create leads for ${businessInfo.companyName}`);
    } else if (lower.includes('post') || lower.includes('linkedin') || lower.includes('instagram')) {
      setActiveTab('studio');
      setActiveDirective('create-post');
      sendChatMessage(`Draft a high-performing social post for ${businessInfo.companyName}`);
    } else if (lower.includes('image') || lower.includes('visual') || lower.includes('logo')) {
      setActiveTab('studio');
      setActiveDirective('create-image');
      sendChatMessage(`Generate a fresh marketing visual or logo`);
    } else if (lower.includes('video') || lower.includes('schematic')) {
      setActiveTab('studio');
      setActiveDirective('create-video');
      sendChatMessage(`Create a commercial schematic video storyboard and narration script`);
    } else if (lower.includes('brochure') || lower.includes('flyer')) {
      setActiveTab('studio');
      setActiveDirective('create-brochure');
      sendChatMessage(`Design a marketing brochure for ${businessInfo.companyName}`);
    } else {
      sendChatMessage(actionText);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file.name);
    }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          {/* Backdrop on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChatOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          />

          {/* Drawer Container */}
          <motion.aside
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] glass-panel border-l border-white/10 shadow-2xl flex flex-col bg-[#0E0E1B]/95 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                {/* Glowing orb avatar */}
                <div className="relative flex items-center justify-center w-10 h-10">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-indigo-500 animate-spin opacity-80 blur-xs" style={{ animationDuration: '6s' }} />
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0F0F1E] border border-white/30 shadow-inner">
                    <Sparkles className="w-4 h-4 text-pink-300" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F0F1E] shadow-[0_0_8px_#34d399]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-wide">Reach</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      Growth AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Always online • Ready to acquire customers
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Chips Bar */}
            <div className="px-4 py-2.5 border-b border-white/5 bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleActionChipClick('Find Customers')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-300 text-[11px] font-medium shrink-0 transition-colors cursor-pointer"
              >
                <Compass className="w-3 h-3" />
                <span>Find Customers</span>
              </button>
              <button
                onClick={() => handleActionChipClick('Create Image')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/25 text-pink-300 text-[11px] font-medium shrink-0 transition-colors cursor-pointer"
              >
                <Image className="w-3 h-3" />
                <span>Create Image</span>
              </button>
              <button
                onClick={() => handleActionChipClick('Create Post')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-300 text-[11px] font-medium shrink-0 transition-colors cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Create Post</span>
              </button>
              <button
                onClick={() => handleActionChipClick('Create Video')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-300 text-[11px] font-medium shrink-0 transition-colors cursor-pointer"
              >
                <Video className="w-3 h-3" />
                <span>Create Video</span>
              </button>
              <button
                onClick={() => handleActionChipClick('Create Brochure')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-300 text-[11px] font-medium shrink-0 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3 h-3" />
                <span>Brochure</span>
              </button>
            </div>

            {/* Message List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-start gap-2.5 max-w-[88%]">
                      {isAgent && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                          isAgent
                            ? 'bg-white/[0.06] border border-white/10 text-slate-100 rounded-tl-sm'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-sm shadow-indigo-500/20'
                        }`}
                      >
                        {msg.attachmentName && (
                          <div className="mb-2 px-2 py-1 rounded bg-black/30 border border-white/10 flex items-center gap-1.5 text-[11px] text-indigo-200">
                            <Paperclip className="w-3 h-3" />
                            <span className="truncate max-w-[180px]">{msg.attachmentName}</span>
                          </div>
                        )}

                        <div className="whitespace-pre-wrap">{msg.text}</div>

                        {/* Interactive Suggestion Buttons */}
                        {isAgent && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                            {msg.suggestedActions.map((action, i) => (
                              <button
                                key={i}
                                onClick={() => handleActionChipClick(action)}
                                className="group flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-[10px] font-semibold transition-all cursor-pointer"
                              >
                                <span>{action}</span>
                                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {!isAgent && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {isAgentTyping && (
                <div className="flex items-center gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-slate-400 ml-1">Reach is strategizing…</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3.5 border-t border-white/10 bg-[#0A0A14]/90">
              {attachment && (
                <div className="mb-2 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="truncate">{attachment}</span>
                  </div>
                  <button
                    onClick={() => setAttachment(null)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSend} className="relative flex flex-col gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Reach to find customers, write copy, or create assets..."
                  rows={2}
                  className="w-full resize-none p-3 pr-10 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Attach file or brief"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      Press <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">Return</kbd> to send
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={!input.trim() && !attachment}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
