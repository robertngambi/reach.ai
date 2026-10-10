import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Monitor,
  Smartphone,
  Download,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Plus,
  Check,
  Code,
  FileCode2,
  Sliders,
  ExternalLink,
  Layers,
  Search,
  Mail,
  Zap,
  CheckCircle2,
  Trash2,
  X,
  Upload,
} from 'lucide-react';
import { GeneratedWebsiteProject, GeneratedFile, AppFeature } from '../../types';
import { useApp } from '../../context/AppContext';
import { downloadProjectZip } from '../../utils/zipDownloader';

interface WebsiteStudioPreviewProps {
  websiteProject: GeneratedWebsiteProject;
  isLoading: boolean;
  onReformat: (formatType: string) => void;
  onAddImage: (imageUrl: string, label: string) => void;
  onRemoveImage: (imageId: string) => void;
  onToggleFeature: (featureId: string) => void;
}

export const WebsiteStudioPreview: React.FC<WebsiteStudioPreviewProps> = ({
  websiteProject,
  isLoading,
  onReformat,
  onAddImage,
  onRemoveImage,
  onToggleFeature,
}) => {
  const { businessInfo, addToast, celebrate, setActiveTab, setActiveSettingsSection } = useApp();
  const [previewMode, setPreviewMode] = useState<'web' | 'mobile'>('web');
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(websiteProject.files[0] || null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customImageLabel, setCustomImageLabel] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadProjectZip(websiteProject.name, websiteProject.files, `${websiteProject.name}-website`);
      celebrate();
      addToast('Source Code Downloaded', `Exported full ${websiteProject.name} website package (.zip)`, 'success');
    } catch (e) {
      addToast('Download Failed', 'Could not generate zip archive', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImageImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customImageUrl.trim()) return;
    onAddImage(customImageUrl.trim(), customImageLabel.trim() || 'Brand Picture');
    setCustomImageUrl('');
    setCustomImageLabel('');
    addToast('Picture Imported', 'Added image into website showcase gallery!', 'success');
  };

  // Sample quick images to import
  const sampleImportImages = [
    { label: 'Executive Workspace', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Modern Team Collab', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Growth Metrics Chart', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Toolbar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-[#0E0E1B] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-extrabold text-white">{websiteProject.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30">
              Responsive Web Platform
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{websiteProject.tagline}</p>
        </div>

        {/* Device Mode Switchers & Actions */}
        <div className="flex items-center gap-3">
          {/* Device Toggles */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
            <button
              type="button"
              onClick={() => setPreviewMode('web')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewMode === 'web'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black shadow-md shadow-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Preview on PC / Desktop view"
            >
              <Monitor className="w-4 h-4" />
              <span>Web view</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewMode === 'mobile'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black shadow-md shadow-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Preview on Mobile phone screen"
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile screen</span>
            </button>
          </div>

          {/* Re-generate / Reformat Button */}
          <button
            type="button"
            onClick={() => onReformat('split-hero-layout')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-colors cursor-pointer"
            title="Reformat website structure"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Re-generate</span>
          </button>

          {/* Download Source Code Button */}
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-500 to-indigo-500 hover:brightness-110 text-slate-950 text-xs font-extrabold shadow-lg shadow-teal-500/25 transition-all cursor-pointer disabled:opacity-50"
            title="Download complete website source code as .ZIP"
          >
            {isDownloading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>Download Source Code</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Activity & Picture Importer + Right Responsive Web Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT SIDE: Activity, Generated Files & Imported Pictures (5 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Generated Code Files */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-[#0E0E1B] space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-teal-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Generated Web Files ({websiteProject.files.length})
                </h4>
              </div>
              <span className="text-[10px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded font-mono font-bold">
                React 19 / Vite / Tailwind
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {websiteProject.files.map((file) => (
                <div
                  key={file.path}
                  onClick={() => {
                    setSelectedFile(file);
                    setShowCodeModal(true);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Code className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="text-xs font-mono font-medium text-slate-200 group-hover:text-white truncate">
                      {file.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-500">{file.size || '2.8 KB'}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                      ✓ Ready
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Imported Pictures & Image Placement in Website */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-[#0E0E1B] space-y-4">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Imported Brand Pictures & Media</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Import pictures to embed directly into the website's gallery & hero.
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                {websiteProject.importedImages.length} In Page
              </span>
            </div>

            {/* Imported Pictures Grid */}
            <div className="grid grid-cols-3 gap-2">
              {websiteProject.importedImages.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video">
                  <img src={img.url} alt={img.label} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-1.5">
                    <span className="text-[9px] text-white truncate max-w-[60px]">{img.label}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveImage(img.id)}
                      className="p-1 rounded bg-rose-500/80 hover:bg-rose-600 text-white"
                      title="Remove picture"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Image URL / Upload Picture Form */}
            <form onSubmit={handleImageImport} className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Paste image URL (https://...jpg/png)"
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
                <input
                  type="text"
                  value={customImageLabel}
                  onChange={(e) => setCustomImageLabel(e.target.value)}
                  placeholder="Label (Hero, Gallery)"
                  className="w-28 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Put in Page</span>
                </button>
              </div>

              {/* Sample Quick Selector */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
                <span>Quick samples:</span>
                {sampleImportImages.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onAddImage(s.url, s.label)}
                    className="text-cyan-400 hover:text-white underline cursor-pointer"
                  >
                    +{s.label}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* 3. Website Features & Google Deployment Gateway */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-[#0E0E1B] space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Web Capabilities & Deployment</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setActiveSettingsSection('create-websites');
                  setActiveTab('settings');
                }}
                className="text-[11px] text-cyan-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>Google Deploy Setup →</span>
              </button>
            </div>

            <div className="space-y-2">
              {websiteProject.features.map((feat) => (
                <div
                  key={feat.id}
                  onClick={() => onToggleFeature(feat.id)}
                  className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between cursor-pointer hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={feat.enabled}
                      onChange={() => onToggleFeature(feat.id)}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{feat.name}</div>
                      <div className="text-[10px] text-slate-400">{feat.description}</div>
                    </div>
                  </div>
                  {feat.enabled && <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDE: Real Responsive Website Viewport (7 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="w-full h-[620px] rounded-3xl bg-black border border-slate-800 shadow-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              <motion.div
                animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-400 via-cyan-500 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-teal-500/50">
                  <Globe className="w-8 h-8 text-slate-950 animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-white tracking-wide">
                  Generation in process! ...
                </h3>
                <p className="text-xs text-teal-300 font-mono">
                  Formatting responsive layout, placing imported pictures & generating code...
                </p>
              </motion.div>
            </div>
          ) : previewMode === 'web' ? (
            /* 1. PC / Desktop Screen Web View */
            <div className="w-full h-[640px] rounded-2xl bg-[#090912] border border-white/15 shadow-2xl flex flex-col overflow-hidden">
              {/* Browser Window Header Bar */}
              <div className="px-4 py-2.5 bg-[#141424] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="flex-1 max-w-sm mx-4 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono text-slate-400 text-center truncate flex items-center justify-center gap-1.5">
                  <span className="text-emerald-400 text-[9px]">🔒</span>
                  <span>https://{businessInfo.companyName.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
                <div className="w-16 text-right">
                  <span className="text-[10px] text-teal-400 font-bold">1440px</span>
                </div>
              </div>

              {/* Live Rendered Website Canvas */}
              <div className="flex-1 overflow-y-auto font-sans text-white">
                {/* Navbar */}
                <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between backdrop-blur-md sticky top-0 bg-[#090912]/90 z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-400 to-cyan-500 flex items-center justify-center font-black text-slate-950 text-xs">
                      {businessInfo.companyName.charAt(0)}
                    </div>
                    <span className="text-sm font-extrabold tracking-tight">{businessInfo.companyName}</span>
                  </div>

                  <nav className="flex items-center gap-4 text-xs text-slate-300 font-medium">
                    <a href="#features" className="hover:text-white">Features</a>
                    <a href="#gallery" className="hover:text-white">Showcase</a>
                    <a href="#pricing" className="hover:text-white">Pricing</a>
                    <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-bold text-xs">
                      Get Started
                    </button>
                  </nav>
                </header>

                {/* Hero Section */}
                <section className="px-8 py-12 text-center max-w-3xl mx-auto space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[11px] font-bold">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    <span>Autonomous Client Acquisition Suite</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                    Scale Your Pipeline With Autonomous AI
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Convert prospective clients into high-value relationships. Discover verified decision-makers, launch cold email outreach, and create stunning multi-channel collateral.
                  </p>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/25">
                      Start 14-Day Free Pilot
                    </button>
                    <button className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10">
                      View Live Demo
                    </button>
                  </div>
                </section>

                {/* Picture Showcase Gallery (Featuring Imported Pictures) */}
                <section className="px-8 py-8 border-y border-white/10 bg-[#0F0F1E]/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Visual Showcase & Brand Gallery</h3>
                      <p className="text-[11px] text-slate-400">Featuring your imported company pictures and media</p>
                    </div>
                    <span className="text-[10px] text-teal-300 font-mono">Dynamic Placement</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {websiteProject.importedImages.map((img) => (
                      <div key={img.id} className="rounded-xl overflow-hidden border border-white/10 shadow-md group relative aspect-video">
                        <img src={img.url} alt={img.label} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] font-bold text-white">
                          {img.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Features Matrix */}
                <section className="px-8 py-10 max-w-4xl mx-auto space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold">Turnkey Growth Architecture</h3>
                    <p className="text-xs text-slate-400">Everything needed to accelerate pipeline in one web platform</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {businessInfo.services?.slice(0, 3).map((svc, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
                          0{idx + 1}
                        </div>
                        <div className="text-xs font-bold text-white">{svc}</div>
                        <div className="text-[10px] text-slate-400">
                          Automated execution with zero manual overhead.
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          ) : (
            /* 2. Mobile Screen Web View */
            <div className="w-full max-w-[340px] h-[640px] rounded-[48px] bg-black border-4 border-slate-700 shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/20">
              <div className="pt-2 pb-1 text-center border-b border-white/10">
                <span className="text-[10px] font-mono text-slate-400">Mobile Safari (390px)</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-white text-center">
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-black flex items-center justify-center mx-auto text-xs">
                  {businessInfo.companyName.charAt(0)}
                </div>
                <h3 className="text-xl font-black leading-tight">Scale Your Pipeline With Autonomous AI</h3>
                <p className="text-xs text-slate-300">
                  {websiteProject.tagline}
                </p>
                <button className="w-full py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs shadow-md">
                  Get Started Free
                </button>
                <div className="space-y-2 text-left pt-3 border-t border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Gallery</span>
                  {websiteProject.importedImages.slice(0, 2).map((img) => (
                    <img key={img.id} src={img.url} alt={img.label} referrerPolicy="no-referrer" className="w-full h-28 object-cover rounded-xl border border-white/10" />
                  ))}
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
                  <Code className="w-5 h-5 text-teal-400" />
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
                <pre className="text-xs font-mono text-teal-200 leading-relaxed">
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
                  className="px-5 py-2 rounded-xl bg-teal-500 text-slate-950 font-extrabold text-xs hover:bg-teal-400"
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
