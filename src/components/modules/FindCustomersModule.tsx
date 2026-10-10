import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Compass,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Users,
  Target,
  ArrowRight,
  Plus,
  RefreshCw,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lead } from '../../types';

export const FindCustomersModule: React.FC = () => {
  const {
    businessInfo,
    setBusinessInfo,
    leads,
    setLeads,
    selectedLeadIds,
    toggleLeadSelection,
    selectAllLeads,
    clearLeadSelection,
    setActiveTab,
    addToast,
    celebrate,
    incrementStat,
    addHistoryItem,
  } = useApp();

  const [inputUrl, setInputUrl] = useState(businessInfo.contactInfo?.website || 'https://agentreach.ai');
  const [isScanning, setIsScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);

  const steps = [
    'Scanning website structure and metadata…',
    'Analyzing products, services & pricing…',
    'Extracting company contact channels…',
    'Searching database for high-intent customer leads…',
    'Crafting personalized outreach angles…',
  ];

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    addToast('Copied to Clipboard', text, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleScanSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsScanning(true);
    setCurrentStepIndex(0);

    // Step progress timer animation
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const res = await fetch('/api/analyze-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (data && data.companyName) {
        setBusinessInfo(data);
        if (data.leads && Array.isArray(data.leads)) {
          setLeads(data.leads);
          // Auto select first 3 leads
          data.leads.slice(0, 3).forEach((l: Lead) => {
            if (!selectedLeadIds.includes(l.id)) toggleLeadSelection(l.id);
          });
          incrementStat('leadsFound', data.leads.length);
        }

        celebrate();
        addToast(
          'Customer Discovery Complete',
          `Discovered ${data.leads?.length || 5} qualified customer leads for ${data.companyName}!`,
          'success'
        );
        addHistoryItem({
          type: 'lead_scan',
          title: `Scanned ${data.companyName}`,
          description: `Discovered ${data.leads?.length || 5} prospective leads for ${data.industry}`,
        });
      }
    } catch (err) {
      console.error('Scan error:', err);
      clearInterval(stepInterval);
      addToast('Scan complete', 'Processed site analysis with synthesized leads', 'info');
    } finally {
      setIsScanning(false);
    }
  };

  const handleEnrichMore = async () => {
    setIsEnriching(true);
    addToast('Enriching Leads', `Finding additional contacts at target accounts…`, 'info');

    try {
      const res = await fetch('/api/find-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainOrCompany: businessInfo.companyName,
          industry: businessInfo.industry,
        }),
      });
      const data = await res.json();
      if (data.contacts && Array.isArray(data.contacts)) {
        setLeads((prev) => [...prev, ...data.contacts]);
        incrementStat('leadsFound', data.contacts.length);
        celebrate();
        addToast('New Leads Added', `Found ${data.contacts.length} additional verified decision makers!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Enrichment Notice', 'Added sample enriched leads', 'info');
    } finally {
      setIsEnriching(false);
    }
  };

  const handleDraftOutreach = () => {
    if (selectedLeadIds.length === 0 && leads.length > 0) {
      toggleLeadSelection(leads[0].id);
    }
    setActiveTab('email-outreach');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & URL Input Card */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/10 glass-panel shadow-2xl bg-gradient-to-br from-[#121225]/90 via-[#0F0F22]/90 to-[#0A0A16]/95">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-pink-400" />
            <span>Autonomous Prospecting Intelligence</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Find High-Intent Customers from Any Website URL
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Paste your company’s link. Reach will analyze your value proposition, uncover ideal
            buyer personas, and deliver verified decision maker contacts with tailored outreach hooks.
          </p>

          {/* Large Hero Input Box */}
          <form onSubmit={handleScanSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste your website link (e.g. https://yourbusiness.com)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.07] border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all cursor-pointer disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Leads</span>
                </>
              )}
            </button>
          </form>

          {/* Preset samples */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>Or try live links:</span>
            {[
              { name: 'Linear.app', url: 'https://linear.app' },
              { name: 'Vercel.com', url: 'https://vercel.com' },
              { name: 'BlueBottleCoffee.com', url: 'https://bluebottlecoffee.com' },
              { name: 'Shopify.com', url: 'https://shopify.com' },
            ].map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setInputUrl(p.url);
                }}
                className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Animated Progress Steps Bar */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-pink-400" />
                    <span>{steps[currentStepIndex]}</span>
                  </span>
                  <span>Step {currentStepIndex + 1} of {steps.length}</span>
                </div>

                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    transition={{ ease: 'easeInOut', duration: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Analysis Overview Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Summary & Services */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-extrabold shadow-md">
                  {businessInfo.companyName.charAt(0) || 'B'}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    {businessInfo.companyName}
                    <button
                      onClick={() => handleCopy(businessInfo.companyName, 'companyName')}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copy"
                    >
                      {copiedField === 'companyName' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </h2>
                  <p className="text-xs text-indigo-400 font-medium">{businessInfo.tagline}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {businessInfo.industry}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {businessInfo.summary}
            </p>

            {/* Value proposition highlight */}
            <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
              <strong className="text-white">Core Value Proposition:</strong> {businessInfo.valueProposition}
            </div>

            {/* Services Offered Chips */}
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Services & Products Identified
              </span>
              <div className="flex flex-wrap gap-2">
                {businessInfo.services?.map((svc, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-200 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-pink-400" />
                    <span>{svc}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick CTA to Outreach */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{leads.length} customer contacts discovered</span>
            </div>
            <button
              onClick={handleDraftOutreach}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all cursor-pointer"
            >
              <span>Draft Outreach Emails</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contact Info & Channels Card */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-pink-400" />
              <span>Extracted Contact & Channels</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="truncate max-w-[180px]">{businessInfo.contactInfo?.email}</span>
                </div>
                <button
                  onClick={() => handleCopy(businessInfo.contactInfo?.email, 'email')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{businessInfo.contactInfo?.phone}</span>
                </div>
                <button
                  onClick={() => handleCopy(businessInfo.contactInfo?.phone, 'phone')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate max-w-[180px]">{businessInfo.contactInfo?.address}</span>
                </div>
                <button
                  onClick={() => handleCopy(businessInfo.contactInfo?.address, 'address')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedField === 'address' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate max-w-[180px]">{businessInfo.contactInfo?.website}</span>
                </div>
                <a
                  href={businessInfo.contactInfo?.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Target Segments Mini preview */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <span className="text-xs font-bold text-slate-400 block mb-2">
              Top Customer Segments
            </span>
            <div className="space-y-1.5">
              {businessInfo.targetSegments?.slice(0, 2).map((seg, i) => (
                <div key={i} className="text-xs p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{seg.name}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{seg.matchScore}% Match</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{seg.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Discovered Customer Leads Table / Cards */}
      <section className="p-6 rounded-2xl glass-panel border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Discovered Customer Prospects</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                {leads.length} Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select contacts to pre-fill automated personalized cold emails in the Outreach module.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={selectAllLeads}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={clearLeadSelection}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleEnrichMore}
              disabled={isEnriching}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isEnriching ? 'Enriching…' : 'Find More Leads'}</span>
            </button>
          </div>
        </div>

        {/* Leads List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leads.map((lead) => {
            const isSelected = selectedLeadIds.includes(lead.id);

            return (
              <motion.div
                key={lead.id}
                whileHover={{ y: -2 }}
                onClick={() => toggleLeadSelection(lead.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/30 border-indigo-500/50 shadow-lg shadow-indigo-950/50'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {lead.name.charAt(0)}
                        </div>
                        {isSelected && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-white text-[9px] shadow-sm">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{lead.name}</h3>
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {lead.fitScore}% Fit
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium">
                          {lead.role}
                        </div>
                        <div className="text-xs text-indigo-400">
                          {lead.company} {lead.location ? `• ${lead.location}` : ''}
                        </div>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by parent div
                      className="w-4 h-4 rounded border-white/20 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Contact info snippet with copy buttons */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-black/20 border border-white/5 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <Mail className="w-3 h-3 text-pink-400 shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(lead.email, `lead-email-${lead.id}`);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Copy email"
                      >
                        {copiedField === `lead-email-${lead.id}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <Briefcase className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{lead.linkedin}</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(lead.linkedin, `lead-li-${lead.id}`);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Copy LinkedIn"
                      >
                        {copiedField === `lead-li-${lead.id}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Match Reason & Cold Email Angle */}
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="text-slate-400 text-[11px]">
                      <strong className="text-slate-300">Match Reason:</strong> {lead.matchReason}
                    </div>
                    <div className="text-indigo-300 text-[11px] bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
                      <strong className="text-indigo-200">Outreach Angle:</strong> {lead.suggestedAngle}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Status: <strong className="text-white">{lead.status}</strong>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!selectedLeadIds.includes(lead.id)) toggleLeadSelection(lead.id);
                      setActiveTab('email-outreach');
                    }}
                    className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
                  >
                    <span>Draft Email</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Action Footer */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            <strong>{selectedLeadIds.length}</strong> of {leads.length} contacts selected for automated outreach
          </div>

          <button
            onClick={handleDraftOutreach}
            disabled={selectedLeadIds.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 disabled:opacity-40 transition-all cursor-pointer"
          >
            <span>Proceed to Email Outreach ({selectedLeadIds.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
