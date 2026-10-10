import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Send,
  Sparkles,
  Paperclip,
  RefreshCw,
  Check,
  Copy,
  Star,
  CornerUpLeft,
  MoreVertical,
  Trash2,
  Tag,
  Clock,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronDown,
  Wand2,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EmailClientPreviewProps {
  subject: string;
  setSubject: (val: string) => void;
  body: string;
  setBody: (val: string) => void;
  onSend: () => void;
  isSending: boolean;
  onReformat: (formatType: string) => void;
  isReformatting?: boolean;
}

export const EmailClientPreview: React.FC<EmailClientPreviewProps> = ({
  subject,
  setSubject,
  body,
  setBody,
  onSend,
  isSending,
  onReformat,
  isReformatting = false,
}) => {
  const { businessInfo, leads, selectedLeadIds, addToast } = useApp();
  const [clientView, setClientView] = useState<'gmail' | 'outlook' | 'editor'>('gmail');
  const [showReformatDropdown, setShowReformatDropdown] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const activeContact = leads.find((l) => selectedLeadIds.includes(l.id)) || leads[0] || {
    name: 'Sarah Montgomery',
    email: 's.montgomery@cloudforge.io',
    role: 'VP of Growth',
    company: 'CloudForge Systems',
  };

  const reformatOptions = [
    { id: 'bullets', label: '3-Bullet Value Highlight', desc: 'Punchy bullets with ROI focus' },
    { id: 'executive', label: 'Executive 30-Second Brief', desc: 'Ultra-concise, 3-paragraph direct ask' },
    { id: 'problem-solution', label: 'Problem-Agitate-Solve', desc: 'Highlights pain point and breakthrough solution' },
    { id: 'case-study', label: 'Case Study & Social Proof', desc: 'Includes client metric comparison' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setIsCopied(true);
    addToast('Copied', 'Email copied to clipboard', 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E0E1B] overflow-hidden shadow-2xl space-y-0">
      {/* Top Client Selector Toolbar & Re-generate Reformatting Bar */}
      <div className="p-3 bg-white/[0.03] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        {/* Client View Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
          <button
            type="button"
            onClick={() => setClientView('gmail')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              clientView === 'gmail'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span>Gmail Client</span>
          </button>

          <button
            type="button"
            onClick={() => setClientView('outlook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              clientView === 'outlook'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Outlook Client</span>
          </button>

          <button
            type="button"
            onClick={() => setClientView('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              clientView === 'editor'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Raw Text Editor</span>
          </button>
        </div>

        {/* Action Buttons: Re-generate Reformat & Copy */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowReformatDropdown(!showReformatDropdown)}
              disabled={isReformatting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              title="Re-generate and reformat email structure"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReformatting ? 'animate-spin' : ''}`} />
              <span>Re-generate</span>
              <ChevronDown className="w-3 h-3 text-indigo-400" />
            </button>

            {/* Reformat Structure Dropdown */}
            <AnimatePresence>
              {showReformatDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-2 w-64 p-2 rounded-2xl glass-panel bg-[#121226] border border-indigo-500/30 shadow-2xl z-50 space-y-1"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                    Reformat Output Structure
                  </div>
                  {reformatOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setShowReformatDropdown(false);
                        onReformat(opt.id);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-white/10 text-xs transition-colors cursor-pointer group"
                    >
                      <div className="font-bold text-white group-hover:text-indigo-300">
                        {opt.label}
                      </div>
                      <div className="text-[10px] text-slate-400">{opt.desc}</div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition-colors"
            title="Copy email content"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. GMAIL CLIENT PREVIEW */}
      {/* ------------------------------------------------------------- */}
      {clientView === 'gmail' && (
        <div className="bg-[#1A1A24] text-slate-200">
          {/* Gmail Red Accent Top Bar */}
          <div className="bg-[#242436] px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-red-600 flex items-center justify-center font-bold text-white text-[10px] shadow-sm">
                M
              </div>
              <span className="font-semibold text-slate-200 text-xs">Gmail Preview</span>
              <span className="text-[10px] text-slate-400">• Inbox &gt; Sent preview</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Star className="w-3.5 h-3.5 hover:text-amber-400 cursor-pointer" />
              <CornerUpLeft className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              <MoreVertical className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-4 font-sans">
            {/* Subject */}
            <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {subject}
              </h3>
              <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-400 shrink-0">
                Inbox
              </span>
            </div>

            {/* Sender and Recipient Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0">
                  {businessInfo.companyName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">
                      {businessInfo.companyName} Outreach
                    </span>
                    <span className="text-[11px] text-slate-400">
                      &lt;{businessInfo.contactInfo?.email || 'growth@reach.ai'}&gt;
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span>to: </span>
                    <span className="text-slate-200 font-semibold">{activeContact.name}</span>
                    <span className="text-slate-500">&lt;{activeContact.email}&gt;</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                <span>Today, 10:14 AM (just now)</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="bg-[#12121E] p-5 rounded-2xl border border-white/5 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans selection:bg-indigo-500/30">
              {body}
            </div>

            {/* Attached Brochure / Growth Card Pill */}
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white truncate">
                    {businessInfo.companyName}_Growth_Overview.pdf
                  </div>
                  <div className="text-[10px] text-slate-400">1.4 MB • Verified safe attachment</div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                Ready to deliver
              </span>
            </div>

            {/* Gmail Footer Quick Action */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={onSend}
                disabled={isSending || selectedLeadIds.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 text-white text-xs font-bold shadow-md shadow-red-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send via Gmail ({selectedLeadIds.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setClientView('editor')}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10"
              >
                Edit Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. OUTLOOK CLIENT PREVIEW */}
      {/* ------------------------------------------------------------- */}
      {clientView === 'outlook' && (
        <div className="bg-[#151824] text-slate-200">
          {/* Outlook Blue Top Ribbon */}
          <div className="bg-[#0078D4] text-white px-4 py-2 flex items-center justify-between text-xs font-semibold shadow-md">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider">OUTLOOK</span>
              <span className="text-[10px] opacity-80">| Message Preview</span>
            </div>
            <div className="text-[10px] opacity-90">
              High Priority Message
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-4 font-sans">
            {/* Outlook Header Meta */}
            <div className="bg-[#0F111B] p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0078D4] text-white font-bold flex items-center justify-center text-xs">
                    {businessInfo.companyName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {businessInfo.companyName} &lt;{businessInfo.contactInfo?.email || 'growth@reach.ai'}&gt;
                    </div>
                    <div className="text-[10px] text-slate-400">
                      To: {activeContact.name} ({activeContact.email})
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">
                  {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <div className="text-xs font-extrabold text-[#60A5FA]">
                  Subject: {subject}
                </div>
              </div>
            </div>

            {/* Outlook Message Body */}
            <div className="p-5 rounded-2xl bg-[#0F111B] border border-white/10 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {body}
            </div>

            {/* Outlook Footer & Send Action */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="text-[11px] text-slate-400">
                Recipient: <strong className="text-white">{activeContact.company}</strong> ({activeContact.role})
              </div>

              <button
                type="button"
                onClick={onSend}
                disabled={isSending || selectedLeadIds.length === 0}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send via Outlook ({selectedLeadIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. RAW TEXT EDITOR */}
      {/* ------------------------------------------------------------- */}
      {clientView === 'editor' && (
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-white text-xs font-semibold focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Email Body Content
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={9}
              className="w-full p-3 rounded-xl bg-white/[0.05] border border-white/15 text-white text-xs leading-relaxed resize-y font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[11px] text-slate-400">
              {body.length} characters • {body.split(/\s+/).filter(Boolean).length} words
            </span>

            <button
              type="button"
              onClick={onSend}
              disabled={isSending || selectedLeadIds.length === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 text-white text-xs font-bold shadow-md shadow-pink-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Send Cold Emails ({selectedLeadIds.length})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
