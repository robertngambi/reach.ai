import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  Printer,
  Download,
  Share2,
  Mail,
  Palette,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Phone,
  Globe,
  MapPin,
  RefreshCw,
  QrCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrochureData } from '../../types';

export const CreateBrochureModule: React.FC = () => {
  const {
    businessInfo,
    setAttachedAsset,
    setActiveTab,
    addToast,
    celebrate,
    incrementStat,
    addHistoryItem,
  } = useApp();

  const [template, setTemplate] = useState<'tri-fold' | 'bi-fold' | 'flyer' | 'poster'>('tri-fold');
  const [prompt, setPrompt] = useState(
    `Comprehensive high-converting commercial overview brochure for ${businessInfo.companyName} targeting corporate decision makers.`
  );
  const [primaryColor, setPrimaryColor] = useState(businessInfo.brandColors?.primary || '#6366F1');
  const [accentColor, setAccentColor] = useState(businessInfo.brandColors?.accent || '#EC4899');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isGenerating, setIsGenerating] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const [brochure, setBrochure] = useState<BrochureData>({
    headline: 'Accelerate Your Customer Acquisition With Autonomous AI',
    subheadline: 'The all-in-one growth agent that converts prospective buyers into long-term clients.',
    aboutText: `${businessInfo.companyName} unites web enrichment, automated outbound prospecting, and generative marketing collateral into one command platform. Stop juggling disconnected tools and manual cold outreach — let our autonomous agent fill your sales pipeline 24/7.`,
    keyFeatures: [
      {
        title: 'Smart URL Lead Discovery',
        description: 'Simply paste your website link. Our AI analyzes your offerings and identifies high-conversion prospective buyers in under 30 seconds.',
        icon: 'compass',
      },
      {
        title: 'Hyper-Personalized Outreach',
        description: 'Generate tailored cold emails with proven psychological hooks that bypass spam filters and spark real sales conversations.',
        icon: 'mail',
      },
      {
        title: 'Instant Multi-Channel Collateral',
        description: 'Produce high-converting social media posts, print-ready flyers, promotional brochures, and video ads on demand.',
        icon: 'palette',
      },
    ],
    stats: [
      { value: '10x', label: 'Faster Pipeline Creation' },
      { value: '62%', label: 'Lower Cost Per Acquisition' },
      { value: '98.2%', label: 'Verified Lead Accuracy' },
    ],
    specialOffer: {
      title: 'Exclusive Growth Launch Pass',
      description: 'Scan your site today and claim 100 free verified customer contacts and custom email campaign blueprints.',
      badge: 'LIMITED TIME INVITATION',
    },
    testimonial: {
      quote: '“Within 48 hours of using this agent, we booked 7 qualified sales calls with enterprise decision makers we never could have reached on our own.”',
      author: 'Marcus Vance',
      role: 'Chief Revenue Officer, HyperFlow Global',
    },
    contact: {
      phone: businessInfo.contactInfo?.phone || '+1 (415) 890-3412',
      email: businessInfo.contactInfo?.email || 'hello@agentreach.ai',
      website: businessInfo.contactInfo?.website || 'https://agentreach.ai',
      address: businessInfo.contactInfo?.address || 'San Francisco, CA & Global Remote',
    },
  });

  const templates = [
    { id: 'tri-fold', label: 'Tri-Fold Brochure', icon: '📖', desc: '3-Panel Corporate Fold' },
    { id: 'bi-fold', label: 'Bi-Fold Folio', icon: '📄', desc: 'Executive 2-Page Spread' },
    { id: 'flyer', label: 'Modern One-Page Flyer', icon: '📜', desc: 'Direct Event & Sales Sheet' },
    { id: 'poster', label: 'Product Poster', icon: '🖼️', desc: 'Bold Visual Exhibition' },
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    addToast('Designing Brochure', `Generating structured content for ${template.toUpperCase()}…`, 'info');

    try {
      const res = await fetch('/api/generate-brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          template,
          businessInfo,
          colors: { primary: primaryColor, accent: accentColor },
        }),
      });

      const data = await res.json();
      if (data && data.headline) {
        setBrochure(data);
        celebrate();
        incrementStat('assetsGenerated', 1);
        addToast('Brochure Ready', 'Rendered live print-ready brochure preview!', 'success');
        addHistoryItem({
          type: 'brochure',
          title: `Created ${template.toUpperCase()} Brochure`,
          description: `Headline: "${data.headline.slice(0, 50)}..."`,
        });
      }
    } catch (err) {
      console.error(err);
      addToast('Brochure styled', 'Loaded brochure layout', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleAttachToEmail = () => {
    setAttachedAsset({
      type: 'brochure',
      name: `${businessInfo.companyName} Overview Brochure.pdf`,
    });
    addToast('Attached to Email', 'Brochure PDF attached to outreach sequence', 'success');
    setActiveTab('email-outreach');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner (hidden in print) */}
      <div className="no-print">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-extrabold text-white">AI Brochure & Flyer Designer</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Generate print-ready tri-folds, corporate flyers, and PDF sheets with live layout customization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Design Controls (4 cols) - no-print */}
        <div className="no-print lg:col-span-4 p-6 rounded-3xl glass-panel border border-white/10 space-y-5 bg-gradient-to-br from-[#121225]/90 via-[#0F0F22]/90 to-[#0A0A16]/95">
          {/* Template Format Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Brochure Template Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id as any)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    template === t.id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-transparent shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="text-sm">{t.icon}</div>
                  <div className="text-xs font-bold mt-1 truncate">{t.label}</div>
                  <div className="text-[10px] text-slate-300 truncate opacity-80">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Brochure Objective & Offer
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="What should the brochure highlight? (e.g. 10x ROI for mid-market SaaS, pricing tiers, services breakdown)..."
              className="w-full p-3 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 transition-all resize-y"
            />
          </div>

          {/* Brand Palette */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Brand Accent Colors
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs text-slate-300 font-mono">{primaryColor}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs text-slate-300 font-mono">{accentColor}</span>
              </div>
            </div>
          </div>

          {/* Headline & Body editable fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Headline
              </label>
              <input
                type="text"
                value={brochure.headline}
                onChange={(e) => setBrochure({ ...brochure, headline: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Subheadline
              </label>
              <input
                type="text"
                value={brochure.subheadline}
                onChange={(e) => setBrochure({ ...brochure, subheadline: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-xs shadow-lg shadow-teal-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Design…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Regenerate Layout</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Interactive Preview Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar (Zoom, Print, Email) - no-print */}
          <div className="no-print flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel border border-white/10">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1">Zoom:</span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono text-white px-1.5">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(130, z + 15))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="text-[10px] text-slate-400 hover:text-white ml-1"
              >
                Reset
              </button>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAttachToEmail}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-200 text-xs font-semibold transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Use in Outreach</span>
              </button>

              <button
                onClick={handlePrintPDF}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF / Print</span>
              </button>
            </div>
          </div>

          {/* Live Preview Canvas Container */}
          <div className="overflow-x-auto p-4 rounded-3xl glass-panel border border-white/10 bg-[#06060c] flex justify-center">
            <div
              ref={previewRef}
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-200 w-full max-w-[820px] rounded-2xl bg-white text-slate-900 shadow-2xl overflow-hidden p-8 sm:p-10 font-sans border border-slate-200"
            >
              {/* Brochure Top Header with Brand Logo & Color Bar */}
              <div
                className="h-2.5 rounded-full mb-8"
                style={{
                  background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                }}
              />

              <div className="flex items-start justify-between border-b border-slate-100 pb-6 mb-8">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md"
                    style={{ background: primaryColor }}
                  >
                    {businessInfo.companyName.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {businessInfo.companyName}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">{businessInfo.tagline}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white"
                    style={{ background: accentColor }}
                  >
                    Official Briefing
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">{businessInfo.contactInfo.website}</div>
                </div>
              </div>

              {/* Hero Headline & Subhead */}
              <div className="space-y-3 mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {brochure.headline}
                </h1>
                <p className="text-sm font-semibold text-slate-600 leading-snug">
                  {brochure.subheadline}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  {brochure.aboutText}
                </p>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-8">
                {brochure.stats.map((s, idx) => (
                  <div key={idx} className="text-center">
                    <div
                      className="text-2xl font-black"
                      style={{ color: primaryColor }}
                    >
                      {s.value}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* 3 Core Features (Tri-Fold layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {brochure.keyFeatures.map((feat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className="w-7 h-7 rounded-lg text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs"
                        style={{ background: primaryColor }}
                      >
                        {i + 1}
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 mb-1">{feat.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Promotion & Testimonial Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white mb-8 shadow-lg">
                <div>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950 inline-block mb-2">
                    {brochure.specialOffer.badge}
                  </span>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {brochure.specialOffer.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {brochure.specialOffer.description}
                  </p>
                </div>

                <div className="border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-between">
                  <p className="text-xs italic text-slate-200 leading-relaxed">
                    {brochure.testimonial.quote}
                  </p>
                  <div className="mt-2 text-[10px] font-bold text-amber-300">
                    — {brochure.testimonial.author}, {brochure.testimonial.role}
                  </div>
                </div>
              </div>

              {/* Footer with Contact Card & Scan QR Code */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900">Direct Inquiries & Discovery Call:</div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{brochure.contact.phone}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{brochure.contact.email}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>{brochure.contact.website}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <QrCode className="w-6 h-6 text-slate-800" />
                  <div className="text-[10px] leading-tight">
                    <strong className="block text-slate-900">Scan to Book</strong>
                    <span className="text-slate-500">Instant Demo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
