import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Monitor,
  Code,
  Download,
  Sparkles,
  RefreshCw,
  FolderDown,
  Layers,
  ShieldCheck,
  Bell,
  Database,
  CreditCard,
  Link,
  Plus,
  Check,
  Eye,
  FileCode2,
  Sliders,
  ChevronRight,
  ExternalLink,
  Zap,
  Globe,
  Lock,
  Compass,
  User,
  ShoppingBag,
  Activity,
  Home,
  CheckCircle2,
  X,
} from 'lucide-react';
import { GeneratedAppProject, AppFeature, GeneratedFile } from '../../types';
import { useApp } from '../../context/AppContext';
import { downloadProjectZip } from '../../utils/zipDownloader';

interface AppStudioPreviewProps {
  appProject: GeneratedAppProject;
  isLoading: boolean;
  onReformat: (formatType: string) => void;
  onAddFeature: (featureName: string) => void;
  onToggleFeature: (featureId: string) => void;
}

export const AppStudioPreview: React.FC<AppStudioPreviewProps> = ({
  appProject,
  isLoading,
  onReformat,
  onAddFeature,
  onToggleFeature,
}) => {
  const { businessInfo, addToast, celebrate } = useApp();
  const [previewMode, setPreviewMode] = useState<'mobile' | 'web'>('mobile');
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'activity' | 'profile'>('home');
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(appProject.files[0] || null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [customFeatureInput, setCustomFeatureInput] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadProjectZip(appProject.name, appProject.files, `${appProject.name}-mobile-app`);
      celebrate();
      addToast('Source Code Downloaded', `Exported full ${appProject.name} project (.zip)`, 'success');
    } catch (e) {
      addToast('Download Failed', 'Could not generate zip archive', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCustomFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFeatureInput.trim()) return;
    onAddFeature(customFeatureInput.trim());
    setCustomFeatureInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Toolbar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-[#0E0E1B] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-extrabold text-white">{appProject.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
              {appProject.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{appProject.tagline}</p>
        </div>

        {/* Preview Device Switchers & Code Actions */}
        <div className="flex items-center gap-3">
          {/* Device Toggles as explicitly requested */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
            <button
              type="button"
              onClick={() => setPreviewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewMode === 'mobile'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Preview on Mobile phone screen"
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile screen</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewMode('web')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewMode === 'web'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Preview on PC / Web view"
            >
              <Monitor className="w-4 h-4" />
              <span>Web view</span>
            </button>
          </div>

          {/* Re-generate / Reformat Button */}
          <button
            type="button"
            onClick={() => onReformat('modular-architecture')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-colors cursor-pointer"
            title="Reformat app structure and code"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Re-generate</span>
          </button>

          {/* Download Source Code Button */}
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
            title="Download complete source code folder as .ZIP"
          >
            {isDownloading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>Download Source Code</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Activity & Implementation Side + Right App Preview Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT SIDE: Activity, Generated Files & Feature Customizer (5 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Activity: Files Generated in Process */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-[#0E0E1B] space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Generated Project Files ({appProject.files.length})
                </h4>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono font-bold">
                TypeScript / React Native
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {appProject.files.map((file) => (
                <div
                  key={file.path}
                  onClick={() => {
                    setSelectedFile(file);
                    setShowCodeModal(true);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Code className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-xs font-mono font-medium text-slate-200 group-hover:text-white truncate">
                      {file.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-500">{file.size || '3.2 KB'}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                      ✓ Ready
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Interactive App Feature Refinement (Auth, Payments, Logo, Links) */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-[#0E0E1B] space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Add / Customize App Features</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Toggle essential integrations or ask for custom capabilities to be added.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2">
              {appProject.features.map((feat) => (
                <div
                  key={feat.id}
                  onClick={() => onToggleFeature(feat.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    feat.enabled
                      ? 'bg-indigo-950/40 border-indigo-500/40'
                      : 'bg-white/[0.02] border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={feat.enabled}
                      onChange={() => onToggleFeature(feat.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{feat.name}</span>
                        {feat.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                            {feat.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{feat.description}</div>
                    </div>
                  </div>
                  {feat.enabled && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
              ))}
            </div>

            {/* Prompt Feature Adder Input */}
            <form onSubmit={handleCustomFeatureSubmit} className="pt-2 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={customFeatureInput}
                onChange={(e) => setCustomFeatureInput(e.target.value)}
                placeholder="Ask to add feature (e.g. Dark mode, AI Chat, Stripe subscription)..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDE: Real Mobile Chassis / Web View (7 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {/* While generating: Pop in and out 'Generation in process! ...' on black screen */}
          {isLoading ? (
            <div className="w-full max-w-sm h-[680px] rounded-[48px] bg-black border-4 border-slate-800 shadow-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-indigo-900/30 via-transparent to-transparent pointer-events-none" />
              <motion.div
                animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <Smartphone className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-white tracking-wide">
                  Generation in process! ...
                </h3>
                <p className="text-xs text-indigo-300 font-mono">
                  Synthesizing screens, styling UI components & compiling navigation...
                </p>
              </motion.div>
            </div>
          ) : previewMode === 'mobile' ? (
            /* 1. Authentic Mobile Phone Structure Frame */
            <div className="relative w-full max-w-[340px] h-[680px] rounded-[48px] bg-[#000000] border-4 border-slate-700 shadow-2xl shadow-indigo-500/20 flex flex-col overflow-hidden ring-1 ring-white/20">
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-black z-30 flex items-center justify-center gap-2 border border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
              </div>

              {/* Status Bar */}
              <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-20 select-none">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <div className="w-5 h-2.5 rounded-xs border border-white/40 p-0.5 flex items-center">
                    <div className="w-full h-full bg-white rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* In-App Screen Content */}
              <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 py-2 text-white">
                {/* Screen Header */}
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                      {appProject.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate leading-tight">{appProject.name}</div>
                      <div className="text-[9px] text-slate-400">Live Client View</div>
                    </div>
                  </div>
                  <Bell className="w-4 h-4 text-slate-400" />
                </div>

                {/* Tab Views */}
                {activeTab === 'home' && (
                  <div className="space-y-3 py-3 animate-in fade-in duration-200">
                    {/* Welcome Banner Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-md space-y-1">
                      <span className="text-[9px] uppercase font-bold text-indigo-200 tracking-wider">
                        Welcome to {businessInfo.companyName}
                      </span>
                      <h4 className="text-sm font-extrabold text-white leading-tight">
                        Autonomous Customer Growth & Sales Portal
                      </h4>
                      <p className="text-[10px] text-white/80">
                        Tap below to explore verified offers and services.
                      </p>
                    </div>

                    {/* Quick Metric Grid */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                        <div className="text-base font-extrabold text-indigo-400">98.4%</div>
                        <div className="text-[9px] text-slate-400">Satisfaction Rate</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                        <div className="text-base font-extrabold text-pink-400">Instant</div>
                        <div className="text-[9px] text-slate-400">Lead Delivery</div>
                      </div>
                    </div>

                    {/* Featured Offerings List */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Featured Offerings
                      </span>
                      {businessInfo.services?.slice(0, 3).map((svc, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-xs"
                        >
                          <span className="truncate text-[11px] font-medium text-slate-200">{svc}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'catalog' && (
                  <div className="space-y-3 py-3 animate-in fade-in duration-200">
                    <div className="text-xs font-bold text-white">Services & Store Catalog</div>
                    <div className="space-y-2">
                      {['Outbound Growth Accelerator', 'AI Creative Suite Package', 'Custom Lead Enrichment Engine'].map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/[0.05] border border-white/10 space-y-1">
                          <div className="text-xs font-bold text-indigo-300">{item}</div>
                          <div className="text-[10px] text-slate-400">Enterprise verified tier</div>
                          <button className="mt-1 w-full py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-[10px]">
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-3 py-3 animate-in fade-in duration-200">
                    <div className="text-xs font-bold text-white">Recent Activity & Orders</div>
                    <div className="space-y-2">
                      {[
                        { title: 'Customer Lead Scan Completed', time: '10m ago', badge: 'Complete' },
                        { title: 'Email Outreach Dispatched', time: '1h ago', badge: 'Delivered' },
                        { title: 'Video Ad Rendering', time: '3h ago', badge: 'Ready' },
                      ].map((act, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="text-[11px] font-bold text-slate-200">{act.title}</div>
                            <div className="text-[9px] text-slate-400">{act.time}</div>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            {act.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-3 py-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                        U
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Executive User</div>
                        <div className="text-[10px] text-slate-400">{businessInfo.contactInfo?.email}</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Cloud Auth</span>
                        <span className="text-emerald-400 font-semibold">Active</span>
                      </div>
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Payment Method</span>
                        <span className="text-indigo-400 font-semibold">Apple Pay</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Bar */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-4 gap-1 text-center">
                  {[
                    { id: 'home', label: 'Home', icon: Home },
                    { id: 'catalog', label: 'Store', icon: ShoppingBag },
                    { id: 'activity', label: 'Activity', icon: Activity },
                    { id: 'profile', label: 'Profile', icon: User },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-1.5 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                          isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[9px] font-bold mt-0.5">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="pb-2 pt-1 flex justify-center">
                <div className="w-32 h-1 rounded-full bg-white/40" />
              </div>
            </div>
          ) : (
            /* 2. Authentic PC Screen / Monitor Web View */
            <div className="w-full max-w-xl h-[560px] rounded-2xl bg-[#0F0F1E] border border-white/15 shadow-2xl flex flex-col overflow-hidden">
              {/* PC Screen Window Bar */}
              <div className="px-4 py-2.5 bg-[#181828] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="flex-1 max-w-xs mx-4 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono text-slate-400 text-center truncate">
                  https://app.{businessInfo.companyName.toLowerCase().replace(/\s+/g, '')}.com
                </div>
                <div className="w-12 text-right">
                  <span className="text-[10px] text-emerald-400 font-bold">1080p</span>
                </div>
              </div>

              {/* Responsive Web Content */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-white">
                      {appProject.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold">{appProject.name} Web App</h4>
                      <p className="text-xs text-slate-400">{appProject.tagline}</p>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">
                    Launch App
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {appProject.screens.map((screen) => (
                    <div key={screen.id} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                      <div className="text-xs font-bold text-indigo-300">{screen.title}</div>
                      <div className="text-[10px] text-slate-400">{screen.subtitle}</div>
                      <div className="flex flex-wrap gap-1">
                        {screen.components.slice(0, 2).map((c, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Instant Cross-Platform Sync</div>
                    <div className="text-[10px] text-slate-300">
                      State synced in real-time across iOS, Android and Web viewports.
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">100% Responsive</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code Viewer Modal */}
      <AnimatePresence>
        {showCodeModal && selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-3xl rounded-3xl bg-[#0F0F1E] border border-white/15 p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-bold text-white font-mono">{selectedFile.path}</span>
                </div>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto rounded-xl bg-black/60 p-4 border border-white/10">
                <pre className="text-xs font-mono text-indigo-200 leading-relaxed">
                  {selectedFile.content}
                </pre>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedFile.content);
                    addToast('Copied', 'File contents copied to clipboard', 'info');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15"
                >
                  Copy File Content
                </button>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
