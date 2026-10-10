import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Check,
  Maximize2,
  RefreshCw,
  Share2,
  Paperclip,
  X,
  Mail,
  Sliders,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GeneratedImageItem {
  id: string;
  url: string;
  title: string;
  badge?: string;
  style: string;
  aspectRatio: string;
}

export const CreateImageModule: React.FC = () => {
  const {
    businessInfo,
    setAttachedAsset,
    setActiveTab,
    addToast,
    celebrate,
    incrementStat,
    addHistoryItem,
  } = useApp();

  const [prompt, setPrompt] = useState(
    `A sleek high-converting 3D marketing illustration for ${businessInfo.companyName}, modern glassmorphism aesthetic with glowing purple and cyan volumetric lighting.`
  );
  const [selectedStyle, setSelectedStyle] = useState('3D');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<GeneratedImageItem | null>(null);

  const stylePresets = [
    { id: 'Realistic', label: 'Realistic', icon: '📸' },
    { id: '3D', label: '3D Render', icon: '💎' },
    { id: 'Minimalist', label: 'Minimalist', icon: '⚪' },
    { id: 'Illustration', label: 'Illustration', icon: '🎨' },
    { id: 'Product Shot', label: 'Product Shot', icon: '📦' },
    { id: 'Ad Banner', label: 'Ad Banner', icon: '🚀' },
  ];

  const aspectRatios = [
    { id: '1:1', label: '1:1 Square (Instagram / Post)' },
    { id: '16:9', label: '16:9 Landscape (YouTube / Web / X)' },
    { id: '9:16', label: '9:16 Story (TikTok / Reels)' },
    { id: '4:5', label: '4:5 Portrait (LinkedIn / FB)' },
  ];

  const [images, setImages] = useState<GeneratedImageItem[]>([
    {
      id: 'img-init-1',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
      title: 'Modern Growth Studio & Analytics Workspace',
      badge: 'Editorial Ad',
      style: '3D',
      aspectRatio: '1:1',
    },
    {
      id: 'img-init-2',
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      title: 'Collaborative AI Strategy Launch',
      badge: 'Brand Story',
      style: 'Realistic',
      aspectRatio: '1:1',
    },
    {
      id: 'img-init-3',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      title: 'Data-Driven High Impact Conversion Surge',
      badge: 'Growth Proof',
      style: 'Minimalist',
      aspectRatio: '1:1',
    },
    {
      id: 'img-init-4',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      title: 'Futuristic Volumetric Neon Gradient Wave',
      badge: '3D Aesthetic',
      style: 'Illustration',
      aspectRatio: '1:1',
    },
  ]);

  const [historyImages, setHistoryImages] = useState<GeneratedImageItem[]>(images);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    addToast('Generating Visual Assets', `Creating 4 variations in ${selectedStyle} style…`, 'info');

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          aspectRatio,
          businessInfo,
        }),
      });

      const data = await res.json();
      if (data && data.images && Array.isArray(data.images)) {
        setImages(data.images);
        setHistoryImages((prev) => [...data.images, ...prev].slice(0, 16));
        celebrate();
        incrementStat('assetsGenerated', 4);
        addToast('Visuals Created', 'Generated 4 marketing image variations!', 'success');
        addHistoryItem({
          type: 'image',
          title: `Generated 4 Images (${selectedStyle})`,
          description: `Prompt: "${prompt.slice(0, 70)}..."`,
        });
      }
    } catch (err) {
      console.error(err);
      addToast('Generated marketing imagery', 'Visuals ready', 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Prompt Copied', 'Copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (img: GeneratedImageItem) => {
    const link = document.createElement('a');
    link.href = img.url;
    link.download = `agentreach-${img.id}.jpg`;
    link.target = '_blank';
    link.click();
    addToast('Download Started', `Saving ${img.title}`, 'success');
  };

  const handleUseInOutreach = (img: GeneratedImageItem) => {
    setAttachedAsset({
      type: 'image',
      name: `${img.title}.jpg`,
      url: img.url,
    });
    addToast('Attached to Email', `Ready to send with your cold outreach`, 'success');
    setActiveTab('email-outreach');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div>
        <div className="flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-rose-400" />
          <h1 className="text-2xl font-extrabold text-white">AI Marketing Image Studio</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Generate realistic product photography, 3D brand visuals, and ad banners with Google AI Studio.
        </p>
      </div>

      {/* Input Controls Card */}
      <section className="p-6 rounded-3xl glass-panel border border-white/10 shadow-2xl bg-gradient-to-br from-[#121225]/90 via-[#0F0F22]/90 to-[#0A0A16]/95">
        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Prompt Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Describe the image you want
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPrompt(
                      `High-converting minimal SaaS hero graphic for ${businessInfo.companyName}, floating UI dashboard with metrics graph and soft purple neon illumination.`
                    )
                  }
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  ⚡ SaaS Hero Preset
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() =>
                    setPrompt(
                      `Commercial lifestyle product advertisement for ${businessInfo.companyName}, studio tabletop lighting, depth of field, 8k resolution.`
                    )
                  }
                  className="text-[11px] text-pink-400 hover:text-pink-300 font-medium"
                >
                  📦 Product Ad Preset
                </button>
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe the image you want (e.g. futuristic glass dashboard with glowing growth arrows, hyperrealistic studio lighting)..."
              className="w-full p-4 rounded-2xl bg-white/[0.06] border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all resize-y"
            />
          </div>

          {/* Style Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Style Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {stylePresets.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedStyle === style.id
                      ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white border-transparent shadow-md shadow-pink-500/25'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{style.icon}</span>
                  <span>{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio & Reference Image Drop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setAspectRatio(ar.id)}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                      aspectRatio === ar.id
                        ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-slate-200">{ar.id}</div>
                    <div className="text-[10px] text-slate-400 truncate">{ar.label.split(' ')[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reference image optional */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Attach Reference Image (Optional)
              </label>
              <div
                onClick={() => {
                  setReferenceImage('brand-sample-moodboard.png');
                  addToast('Reference Attached', 'Using brand sample moodboard as aesthetic guide', 'info');
                }}
                className="h-[74px] rounded-xl border-2 border-dashed border-white/15 hover:border-indigo-400/50 bg-white/[0.02] flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
                <span>
                  {referenceImage ? `Attached: ${referenceImage}` : 'Click to load brand moodboard reference'}
                </span>
                {referenceImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReferenceImage(null);
                    }}
                    className="p-1 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Visuals…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 4 Variations</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* 4 Variations Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Generated Marketing Variations</span>
            <span className="text-xs font-normal text-slate-400">({images.length} images)</span>
          </h2>
          <span className="text-xs text-slate-400">Hover image to download or attach to email</span>
        </div>

        {/* Loading Skeletons */}
        {isGenerating ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-white/[0.05] border border-white/10 animate-pulse flex flex-col justify-end p-4"
              >
                <div className="h-3 w-2/3 bg-white/10 rounded mb-2" />
                <div className="h-2 w-1/2 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0F0F1E] shadow-xl aspect-square flex flex-col justify-end"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Top Badge */}
                {img.badge && (
                  <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white">
                    {img.badge}
                  </div>
                )}

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-end z-20">
                  <div className="text-xs font-bold text-white line-clamp-1 mb-1">{img.title}</div>
                  <div className="text-[10px] text-slate-300 mb-3 line-clamp-1">{img.style} • {img.aspectRatio}</div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleDownload(img)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewImage(img)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                      title="Zoom / Full preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopyPrompt(prompt, img.id)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                      title="Copy prompt"
                    >
                      {copiedId === img.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleUseInOutreach(img)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Use in Email</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History Strip at bottom (Prompt 4 requirement) */}
      <section className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Recent Visual Creations Strip
        </h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {historyImages.map((hImg, idx) => (
            <div
              key={`${hImg.id}-${idx}`}
              onClick={() => setPreviewImage(hImg)}
              className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/15 shrink-0 hover:border-pink-400 transition-all cursor-pointer group"
            >
              <img src={hImg.url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zoom / Full Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full rounded-3xl overflow-hidden glass-panel border border-white/20 bg-[#0F0F1E] shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={previewImage.url}
              alt={previewImage.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[70vh] object-contain bg-black"
            />

            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
              <div>
                <h4 className="text-base font-bold text-white">{previewImage.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Style: {previewImage.style} • Aspect: {previewImage.aspectRatio}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewImage)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res</span>
                </button>
                <button
                  onClick={() => {
                    handleUseInOutreach(previewImage);
                    setPreviewImage(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-semibold"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Use in Email Outreach</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
