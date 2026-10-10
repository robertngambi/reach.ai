import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Compass,
  Mail,
  Image as ImageIcon,
  Share2,
  Video,
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  Trash2,
  X,
  Smartphone,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HistoryItem, NavTab } from '../../types';

export const HistoryModule: React.FC = () => {
  const { historyItems, setActiveTab, setActiveDirective, addToast } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'lead_scan':
        return <Compass className="w-4 h-4 text-violet-400" />;
      case 'email_campaign':
        return <Mail className="w-4 h-4 text-pink-400" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-rose-400" />;
      case 'post':
        return <Share2 className="w-4 h-4 text-amber-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-cyan-400" />;
      case 'brochure':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'app':
        return <Smartphone className="w-4 h-4 text-blue-400" />;
      case 'website':
        return <Globe className="w-4 h-4 text-teal-400" />;
      default:
        return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleOpenStudio = (type: string) => {
    setActiveTab('studio');
    switch (type) {
      case 'lead_scan':
      case 'email_campaign':
        setActiveDirective('create-leads');
        break;
      case 'image':
        setActiveDirective('create-image');
        break;
      case 'post':
        setActiveDirective('create-post');
        break;
      case 'video':
        setActiveDirective('create-video');
        break;
      case 'brochure':
        setActiveDirective('create-brochure');
        break;
      case 'app':
        setActiveDirective('create-apps');
        break;
      case 'website':
        setActiveDirective('create-websites');
        break;
      default:
        setActiveDirective('create-leads');
    }
  };

  const filtered = historyItems.filter((item) => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Copied description', text, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner with Exit 'X' Button on top right side */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-slate-400" />
            <h1 className="text-2xl font-extrabold text-white">Campaign & Creation Archive</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review and reuse all previously scanned customer leads, cold outreach emails, social posts, apps, websites, and visual assets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('studio')}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          title="Exit archive and return to studio"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns & assets…"
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'lead_scan', label: 'Lead Scans' },
            { id: 'email_campaign', label: 'Outreach' },
            { id: 'image', label: 'Images' },
            { id: 'post', label: 'Posts' },
            { id: 'video', label: 'Videos' },
            { id: 'brochure', label: 'Brochures' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterType(pill.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                filterType === pill.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Items Grid */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass-panel border border-white/10">
            <History className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-white">No items found</div>
            <p className="text-xs text-slate-400 mt-1">
              Start by scanning a website or creating marketing collateral to build your archive.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white">{item.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">• {item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(item.description, item.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors"
                  title="Copy details"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleOpenStudio(item.type)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Open Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
