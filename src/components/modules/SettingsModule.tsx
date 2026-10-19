import React, { useState } from 'react';
import {
  Settings,
  Video,
  Compass,
  ImageIcon,
  FileText,
  BookOpen,
  Smartphone,
  Globe,
  Building2,
  Check,
  Save,
  Cpu,
  Volume2,
  Calendar,
  Share2,
  Radio,
  Sliders,
  Sparkles,
  Link,
  ShieldCheck,
  Zap,
  X,
  Download,
  ExternalLink,
  FolderDown,
  BookMarked,
  Feather,
  Layers,
  MessageSquareCode,
  Bot,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  AlignRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GeneratorDirective, SettingsSectionId } from '../../types';
import { downloadProjectZip } from '../../utils/zipDownloader';

export const SettingsModule: React.FC = () => {
  const {
    businessInfo,
    setBusinessInfo,
    directiveSettings,
    setDirectiveSettings,
    activeSettingsSection,
    setActiveSettingsSection,
    setActiveTab,
    addToast,
    celebrate,
  } = useApp();

  const [activeSection, setActiveSection] = useState<SettingsSectionId>(
    activeSettingsSection === 'general' || activeSettingsSection === 'my-activities'
      ? 'create-video'
      : (activeSettingsSection as SettingsSectionId)
  );

  React.useEffect(() => {
    if (activeSettingsSection) {
      setActiveSection(
        activeSettingsSection === 'general' || activeSettingsSection === 'my-activities'
          ? 'create-video'
          : (activeSettingsSection as SettingsSectionId)
      );
    }
  }, [activeSettingsSection]);

  const [isSaved, setIsSaved] = useState(false);

  // Local draft state for settings of all directives
  const [videoSettings, setVideoSettings] = useState(directiveSettings.video);
  const [leadsSettings, setLeadsSettings] = useState(directiveSettings.leads);
  const [imageSettings, setImageSettings] = useState(directiveSettings.image);
  const [postSettings, setPostSettings] = useState(directiveSettings.post);
  const [brochureSettings, setBrochureSettings] = useState(directiveSettings.brochure);
  const [appsSettings, setAppsSettings] = useState(directiveSettings.apps);
  const [websitesSettings, setWebsitesSettings] = useState(directiveSettings.websites);
  const [booksSettings, setBooksSettings] = useState(
    directiveSettings.books || {
      defaultGenre: 'non-fiction',
      defaultAlignment: 'justify' as const,
      enableIllustrations: true,
      imagesPerChapter: 2 as const,
      defaultImageType: 'cinematic photorealism',
      antiAiStrictCadence: true,
    }
  );
  const [chatSettings, setChatSettings] = useState(
    directiveSettings.chat || {
      defaultMode: 'all' as const,
      crossDirectiveAwareness: true,
      codeStyle: 'TypeScript / React' as const,
      detailedArchitecture: true,
      autoSaveSolutionsToArchive: true,
    }
  );
  const [brandInfo, setBrandInfo] = useState(businessInfo);

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDirectiveSettings({
      leads: leadsSettings,
      image: imageSettings,
      post: postSettings,
      video: videoSettings,
      brochure: brochureSettings,
      apps: appsSettings,
      websites: websitesSettings,
      books: booksSettings,
      chat: chatSettings,
    });
    setBusinessInfo(brandInfo);

    setIsSaved(true);
    celebrate();
    addToast('Settings Saved', 'All generator directive configurations updated!', 'success');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const sections: { id: SettingsSectionId; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'create-video', label: 'Videos', icon: Video },
    { id: 'create-leads', label: 'Leads', icon: Compass },
    { id: 'create-image', label: 'Images', icon: ImageIcon },
    { id: 'create-post', label: 'Posts', icon: FileText },
    { id: 'create-brochure', label: 'Brochures', icon: BookOpen },
    { id: 'create-apps', label: 'Apps', icon: Smartphone },
    { id: 'create-websites', label: 'Websites', icon: Globe },
    { id: 'create-books', label: 'Books', icon: BookMarked },
    { id: 'lets-chat', label: 'Chat', icon: MessageSquareCode },
    { id: 'brand', label: 'Brand & AI Engine', icon: Building2 },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-extrabold text-white">Generator Directive Settings</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure automation preferences, video eras, social media dispatch links, and default options for each AI directive.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Changes Saved!' : 'Save All Settings'}</span>
          </button>

          {/* Exit 'X' Button on Top Right as Requested */}
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Exit settings and return to Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation: Sub-menu of AI Generating Directives (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-3xl glass-panel border border-white/10 space-y-1.5 bg-[#0E0E1B]/95 h-fit">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Directive Settings Menu
          </div>

          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                  <span>{sec.label}</span>
                </div>
                {sec.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] font-bold uppercase tracking-wider">
                    {sec.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Form: Settings Pane for Selected Directive (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 bg-gradient-to-br from-[#121225]/90 via-[#0F0F22]/90 to-[#0A0A16]/95 space-y-6 shadow-2xl">
          {/* ========================================================= */}
          {/* 1. VIDEO GENERATION MANAGEMENT SETTINGS (Explicitly detailed) */}
          {/* ========================================================= */}
          {activeSection === 'create-video' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-cyan-400" />
                  <span>Video Generation Management & Auto-Dispatch</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure visual era style, auto-generation schedule, video batch quotas, and connected social media platform links.
                </p>
              </div>

              {/* Visual Era Style Radio Options (Ancient, 20th century, Modern world, Cartoons, etc.) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Visual Era & Artistic Style (Radio Options):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'Ancient style', label: 'Ancient style', desc: 'Mythological, classical stone & epic cinematic lighting' },
                    { id: '20th century', label: '20th century style', desc: 'Vintage film grain, retro commercial aesthetic' },
                    { id: 'Modern world', label: 'Modern world style', desc: 'Contemporary crisp 4K corporate & lifestyle' },
                    { id: 'Cartoons', label: 'Cartoons / Animation style', desc: 'Vibrant animated stylized characters & vector motion' },
                    { id: 'Cyberpunk', label: 'Cyberpunk / Futuristic', desc: 'Neon holograms, volumetric lighting & synthwave' },
                  ].map((era) => (
                    <label
                      key={era.id}
                      className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                        videoSettings.visualEra === era.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/50'
                          : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visualEra"
                        value={era.id}
                        checked={videoSettings.visualEra === era.id}
                        onChange={() => setVideoSettings({ ...videoSettings, visualEra: era.id as any })}
                        className="mt-0.5 w-4 h-4 text-cyan-500 focus:ring-cyan-400"
                      />
                      <div>
                        <div className="text-xs font-bold">{era.label}</div>
                        <div className="text-[11px] text-slate-400">{era.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Auto Generation & Daily Count (1 to 8 radio options) & Day/Night Schedule */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoSettings.autoGenerateEnabled}
                    onChange={(e) =>
                      setVideoSettings({ ...videoSettings, autoGenerateEnabled: e.target.checked })
                    }
                    className="w-5 h-5 rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Enable Video Auto-Generation & Social Media Dispatch
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Automatically generate video batches and send to your social media platform links.
                    </span>
                  </div>
                </label>

                {/* Number of videos to be generated: Radio options 1 to 8 */}
                <div className="pt-2 border-t border-white/10">
                  <span className="block text-xs font-bold text-slate-300 mb-2">
                    Number of Videos to be Generated (1 to 8 Radio Options):
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((count) => (
                      <label
                        key={count}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          videoSettings.dailyBatchCount === count
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <input
                          type="radio"
                          name="dailyBatchCount"
                          value={count}
                          checked={videoSettings.dailyBatchCount === count}
                          onChange={() =>
                            setVideoSettings({ ...videoSettings, dailyBatchCount: count })
                          }
                          className="hidden"
                        />
                        <span>{count} {count === 1 ? 'video' : 'videos'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Generation schedule: Day / Night radio options */}
                <div className="pt-2 border-t border-white/10">
                  <span className="block text-xs font-bold text-slate-300 mb-2">
                    Generation Schedule Time:
                  </span>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    {(['Day', 'Night', 'Both (24/7)'] as const).map((time) => (
                      <label key={time} className="flex items-center gap-2 cursor-pointer text-slate-200">
                        <input
                          type="radio"
                          name="scheduleTime"
                          value={time}
                          checked={videoSettings.scheduleTime === time}
                          onChange={() =>
                            setVideoSettings({ ...videoSettings, scheduleTime: time })
                          }
                          className="w-4 h-4 text-cyan-500 focus:ring-cyan-400"
                        />
                        <span>{time}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Media Links Checklist with Destination Input Boxes (As requested) */}
              <div className="space-y-3">
                <div>
                  <span className="block text-xs font-bold text-white uppercase tracking-wider">
                    Social Media Destination Links (Checklist Enabling Style):
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Enable the platforms where generated videos will be automatically dispatched, and paste your channel/profile links below:
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourbrand' },
                    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourbrand' },
                    { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourbrand' },
                    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourbrand' },
                    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourbrand' },
                    { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/yourbrand' },
                  ].map((p) => {
                    const platformState = (videoSettings.socialPlatforms as any)[p.key];

                    return (
                      <div
                        key={p.key}
                        className={`p-3 rounded-2xl border transition-all ${
                          platformState.enabled
                            ? 'bg-white/[0.05] border-cyan-500/40'
                            : 'bg-white/[0.02] border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <label className="flex items-center gap-2.5 cursor-pointer shrink-0 w-32">
                            <input
                              type="checkbox"
                              checked={platformState.enabled}
                              onChange={(e) =>
                                setVideoSettings({
                                  ...videoSettings,
                                  socialPlatforms: {
                                    ...videoSettings.socialPlatforms,
                                    [p.key]: {
                                      ...platformState,
                                      enabled: e.target.checked,
                                    },
                                  },
                                })
                              }
                              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                            />
                            <span className="text-xs font-bold text-white">{p.label}</span>
                          </label>

                          <div className="relative flex-1">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="text"
                              disabled={!platformState.enabled}
                              value={platformState.url}
                              onChange={(e) =>
                                setVideoSettings({
                                  ...videoSettings,
                                  socialPlatforms: {
                                    ...videoSettings.socialPlatforms,
                                    [p.key]: {
                                      ...platformState,
                                      url: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder={p.placeholder}
                              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cloud Background Auto-Generation Activation Card with prominent 'Enable' Button */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-indigo-950/50 to-purple-950/50 border border-cyan-500/40 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
                      <h4 className="text-sm font-extrabold text-white">
                        24/7 Cloud Background Auto-Generation
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        {videoSettings.autoGenerateEnabled ? 'Active in Cloud' : 'Ready to Enable'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Enables the autonomous server-side cloud runner to generate <strong className="text-cyan-300">{videoSettings.dailyBatchCount} {videoSettings.visualEra}</strong> videos during <strong className="text-cyan-300">{videoSettings.scheduleTime}</strong> and auto-dispatch to your active social channels — <strong>even when your phone, computer, or gadget is completely powered off</strong>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      const newEnabled = !videoSettings.autoGenerateEnabled;
                      setVideoSettings({ ...videoSettings, autoGenerateEnabled: newEnabled });
                      try {
                        await fetch('/api/video-automation/toggle', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            enabled: newEnabled,
                            visualEra: videoSettings.visualEra,
                            dailyBatchCount: videoSettings.dailyBatchCount,
                            scheduleTime: videoSettings.scheduleTime,
                          }),
                        });
                      } catch (e) {
                        // ignore
                      }
                      if (newEnabled) {
                        celebrate();
                        addToast(
                          '24/7 Auto-Generation Enabled!',
                          `Reach will auto-generate ${videoSettings.dailyBatchCount} videos daily even when your device is off.`,
                          'success'
                        );
                      } else {
                        addToast('Auto-Generation Paused', 'Paused background worker', 'info');
                      }
                    }}
                    className={`shrink-0 px-6 py-3 rounded-2xl text-xs font-extrabold shadow-lg transition-all cursor-pointer flex items-center gap-2 ${
                      videoSettings.autoGenerateEnabled
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/30 hover:brightness-110'
                        : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white shadow-cyan-500/40 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{videoSettings.autoGenerateEnabled ? '✓ Enabled (Running in Cloud)' : 'Enable'}</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Server Daemon: <strong>Active (24/7 Cloud Background Run)</strong></span>
                  </div>
                  <div>Next Scheduled Batch: <strong className="text-slate-200">In ~3.5 hours</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. CREATE LEADS & OUTREACH SETTINGS */}
          {/* ========================================================= */}
          {activeSection === 'create-leads' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  <span>Create Leads & Email Outreach Preferences</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tune email tone algorithms, prospect fit requirements, and auto-dispatch rules.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Default Cold Outreach Tone
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Persuasive', 'Friendly', 'Formal', 'Casual', 'Bold'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setLeadsSettings({ ...leadsSettings, defaultOutreachTone: t })}
                        className={`px-3 py-1.5 rounded-xl border font-semibold ${
                          leadsSettings.defaultOutreachTone === t
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={leadsSettings.autoSendOutreach}
                      onChange={(e) => setLeadsSettings({ ...leadsSettings, autoSendOutreach: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <span className="text-slate-200 font-semibold">Auto-dispatch outreach emails immediately upon lead discovery</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={leadsSettings.requireLinkedInProfile}
                      onChange={(e) => setLeadsSettings({ ...leadsSettings, requireLinkedInProfile: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <span className="text-slate-200 font-semibold">Enforce verified LinkedIn profile matching for all leads</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. CREATE IMAGE SETTINGS */}
          {/* ========================================================= */}
          {activeSection === 'create-image' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-pink-400" />
                  <span>Create Image Studio Preferences</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Set default aspect ratios, logo creation presets, and high-res rendering options.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="block font-bold text-slate-300 mb-2">Default Aspect Ratio:</span>
                  <div className="flex flex-wrap gap-2">
                    {['1:1', '16:9', '9:16', '4:5'].map((ar) => (
                      <button
                        key={ar}
                        type="button"
                        onClick={() => setImageSettings({ ...imageSettings, defaultAspectRatio: ar })}
                        className={`px-3 py-1.5 rounded-xl border font-bold ${
                          imageSettings.defaultAspectRatio === ar
                            ? 'bg-pink-600 text-white border-pink-400'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={imageSettings.highResUpscale}
                      onChange={(e) => setImageSettings({ ...imageSettings, highResUpscale: e.target.checked })}
                      className="w-4 h-4 rounded text-pink-600"
                    />
                    <span className="text-slate-200 font-semibold">Enable AI 4K Upscale enhancement on all generated assets</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. CREATE POST SETTINGS */}
          {/* ========================================================= */}
          {activeSection === 'create-post' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Create Post Studio Preferences</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Default tone of voice, hashtag algorithms, and scheduling parameters.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Default Tone</label>
                  <select
                    value={postSettings.defaultTone}
                    onChange={(e) => setPostSettings({ ...postSettings, defaultTone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white"
                  >
                    <option value="Insightful & Engaging" className="bg-[#121225]">Insightful & Engaging</option>
                    <option value="Bold & Controversial" className="bg-[#121225]">Bold & Controversial</option>
                    <option value="Storytelling & Vulnerable" className="bg-[#121225]">Storytelling & Vulnerable</option>
                    <option value="Direct & Action-Oriented" className="bg-[#121225]">Direct & Action-Oriented</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postSettings.autoHashtags}
                      onChange={(e) => setPostSettings({ ...postSettings, autoHashtags: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600"
                    />
                    <span className="text-slate-200 font-semibold">Auto-generate viral hashtags for every platform</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postSettings.autoScheduleNextBestSlot}
                      onChange={(e) => setPostSettings({ ...postSettings, autoScheduleNextBestSlot: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600"
                    />
                    <span className="text-slate-200 font-semibold">Auto-queue post for peak engagement time</span>
                  </label>
                </div>

                {/* Synced Social Media Links (Shared across Video and Post) */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div>
                    <span className="block text-xs font-bold text-white uppercase tracking-wider">
                      Social Media Channels (Shared with Video Auto-Gen):
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Destination links pasted here or in Video Auto-Gen are shared across all post creation and video generation tools:
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourbrand' },
                      { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourbrand' },
                      { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourbrand' },
                      { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourbrand' },
                      { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourbrand' },
                      { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/yourbrand' },
                    ].map((p) => {
                      const platformState = (videoSettings.socialPlatforms as any)[p.key];
                      return (
                        <div
                          key={p.key}
                          className={`p-2.5 rounded-xl border transition-all ${
                            platformState?.enabled ? 'bg-white/[0.04] border-amber-500/30' : 'bg-white/[0.01] border-white/5 opacity-60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <label className="flex items-center gap-2 cursor-pointer w-28 shrink-0">
                              <input
                                type="checkbox"
                                checked={platformState?.enabled}
                                onChange={(e) =>
                                  setVideoSettings({
                                    ...videoSettings,
                                    socialPlatforms: {
                                      ...videoSettings.socialPlatforms,
                                      [p.key]: {
                                        ...platformState,
                                        enabled: e.target.checked,
                                      },
                                    },
                                  })
                                }
                                className="w-3.5 h-3.5 rounded text-amber-500"
                              />
                              <span className="text-xs font-bold text-white">{p.label}</span>
                            </label>

                            <input
                              type="text"
                              value={platformState?.url || ''}
                              onChange={(e) =>
                                setVideoSettings({
                                  ...videoSettings,
                                  socialPlatforms: {
                                    ...videoSettings.socialPlatforms,
                                    [p.key]: {
                                      ...platformState,
                                      url: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder={p.placeholder}
                              className="flex-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 font-mono"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. CREATE BROCHURE SETTINGS */}
          {/* ========================================================= */}
          {activeSection === 'create-brochure' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>Create Brochure & Print Preferences</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure default brochure folding templates, QR codes, and brand colors.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="block font-bold text-slate-300 mb-2">Default Brochure Template:</span>
                  <div className="flex flex-wrap gap-2">
                    {['tri-fold', 'bi-fold', 'flyer', 'poster'].map((tmpl) => (
                      <button
                        key={tmpl}
                        type="button"
                        onClick={() => setBrochureSettings({ ...brochureSettings, defaultTemplate: tmpl as any })}
                        className={`px-3 py-1.5 rounded-xl border font-bold uppercase ${
                          brochureSettings.defaultTemplate === tmpl
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                      >
                        {tmpl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brochureSettings.includeQrCode}
                      onChange={(e) => setBrochureSettings({ ...brochureSettings, includeQrCode: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <span className="text-slate-200 font-semibold">Include auto-generated website QR code on brochures</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. CREATE APPS SETTINGS (Deployment & Source Code) */}
          {/* ========================================================= */}
          {activeSection === 'create-apps' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-indigo-400" />
                    <span>Mobile & Web App Deployment Management</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select target platforms, configure automated store release pipelines, and export complete source code.
                  </p>
                </div>

                {/* Download Source Code Button */}
                <button
                  type="button"
                  onClick={async () => {
                    const sampleFiles = [
                      { name: 'App.tsx', path: 'src/App.tsx', content: '// Reach Mobile App Root Entry\nimport React from "react";\nexport default function App() { return null; }' },
                      { name: 'package.json', path: 'package.json', content: '{\n  "name": "reach-mobile-app",\n  "version": "1.0.0"\n}' },
                      { name: 'app.json', path: 'app.json', content: '{\n  "expo": { "name": "Reach Mobile App", "slug": "reach-mobile-app" }\n}' }
                    ];
                    await downloadProjectZip('reach-mobile-app', sampleFiles);
                    celebrate();
                    addToast('Downloaded', 'Exported mobile app project source code (.zip)', 'success');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/25 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download source code</span>
                </button>
              </div>

              {/* Target Platforms Check Buttons (for Android, for iOS) */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-white uppercase tracking-wider">
                  App Output Format & Automatic Store Deployment:
                </span>
                <p className="text-xs text-slate-400">
                  Select either one or both output platforms for automatic build packaging and deployment:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* for Android */}
                  <label
                    className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                      appsSettings.targetPlatforms.android
                        ? 'bg-emerald-500/15 border-emerald-400 text-white ring-1 ring-emerald-400/40 shadow-sm'
                        : 'bg-white/[0.03] border-white/10 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={appsSettings.targetPlatforms.android}
                      onChange={(e) =>
                        setAppsSettings({
                          ...appsSettings,
                          targetPlatforms: { ...appsSettings.targetPlatforms, android: e.target.checked },
                        })
                      }
                      className="mt-0.5 w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>for Android</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                          Google Play Store
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Builds signed Android App Bundle (.aab) with universal APK generation for Google Play Store.
                      </div>
                    </div>
                  </label>

                  {/* for iOS */}
                  <label
                    className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                      appsSettings.targetPlatforms.ios
                        ? 'bg-blue-500/15 border-blue-400 text-white ring-1 ring-blue-400/40 shadow-sm'
                        : 'bg-white/[0.03] border-white/10 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={appsSettings.targetPlatforms.ios}
                      onChange={(e) =>
                        setAppsSettings({
                          ...appsSettings,
                          targetPlatforms: { ...appsSettings.targetPlatforms, ios: e.target.checked },
                        })
                      }
                      className="mt-0.5 w-4 h-4 rounded text-blue-500 focus:ring-blue-400"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>for iOS</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                          Apple App Store
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Builds signed `.ipa` archive with Xcode distribution profiles and TestFlight deployment.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step-by-Step Requirements for Google Play Store & Apple App Store */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Google Play Store Requirements */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-extrabold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Google Play Store Deployment Requirements</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">Android 14+</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                    <li><strong>Google Play Console Account</strong>: One-time $25 registration at <span className="text-indigo-300">play.google.com/console</span>.</li>
                    <li><strong>Upload Signed .AAB</strong>: Upload the production Android App Bundle generated by Reach.</li>
                    <li><strong>Target API Level 34+</strong>: Standard requirement automatically configured in `app.json`.</li>
                    <li><strong>App Content & Data Safety</strong>: Disclose camera, auth, and network permissions.</li>
                    <li><strong>Privacy Policy URL</strong>: Hosted link provided automatically by Reach web deployment.</li>
                    <li><strong>Closed Testing Track</strong>: Run internal testing track before promoting to open production release.</li>
                  </ol>
                </div>

                {/* Apple App Store Requirements */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-extrabold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>Apple App Store Deployment Requirements</span>
                    </span>
                    <span className="text-[10px] text-blue-400 font-bold">iOS 17+</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                    <li><strong>Apple Developer Program</strong>: Annual $99 membership at <span className="text-indigo-300">developer.apple.com</span>.</li>
                    <li><strong>App Store Connect Record</strong>: Register app identifier: <code className="text-cyan-300">{appsSettings.bundleId}</code>.</li>
                    <li><strong>Distribution Certificate</strong>: Provisioning profile for App Store distribution.</li>
                    <li><strong>Xcode / EAS Archive</strong>: Upload compiled build via Transporter or fastlane.</li>
                    <li><strong>TestFlight Beta Track</strong>: Test internally with 1 click before final App Review.</li>
                    <li><strong>App Review Guidelines</strong>: Verify terms of service, in-app purchase guidelines, and age ratings.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. CREATE WEBSITES SETTINGS (Google Platform Hosting & Source Code) */}
          {/* ========================================================= */}
          {activeSection === 'create-websites' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-teal-400" />
                    <span>Website Google Platform Deployment & Hosting</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Deploy full responsive websites directly to Google Cloud platforms with custom domain mapping.
                  </p>
                </div>

                {/* Download Source Code Button */}
                <button
                  type="button"
                  onClick={async () => {
                    const sampleFiles = [
                      { name: 'index.html', path: 'index.html', content: '<!doctype html><html><body><div id="root"></div></body></html>' },
                      { name: 'App.tsx', path: 'src/App.tsx', content: '// Reach Responsive Website App\nimport React from "react";\nexport default function App() { return null; }' },
                      { name: 'package.json', path: 'package.json', content: '{\n  "name": "reach-website",\n  "version": "1.0.0"\n}' }
                    ];
                    await downloadProjectZip('reach-website', sampleFiles);
                    celebrate();
                    addToast('Downloaded', 'Exported website source code (.zip)', 'success');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold shadow-md shadow-teal-500/25 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download source code</span>
                </button>
              </div>

              {/* Google Platform Hosting Targets */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-white uppercase tracking-wider">
                  Target Google Deployment Platform:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Google Cloud Run', label: 'Google Cloud Run', desc: 'Serverless container deployment with auto-scale down to zero ($0 idle cost)' },
                    { id: 'Firebase Hosting', label: 'Firebase App Hosting', desc: 'Fast global CDN hosting with automatic Git pull-request previews' },
                    { id: 'Vercel', label: 'Google Cloud Storage + CDN', desc: 'High-speed edge static bucket hosting with zero latency' },
                  ].map((target) => (
                    <label
                      key={target.id}
                      className={`p-3.5 rounded-2xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                        websitesSettings.deploymentTarget === target.id
                          ? 'bg-teal-500/15 border-teal-400 text-white ring-1 ring-teal-400/40 shadow-sm'
                          : 'bg-white/[0.03] border-white/10 text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deploymentTarget"
                        value={target.id}
                        checked={websitesSettings.deploymentTarget === target.id}
                        onChange={() => setWebsitesSettings({ ...websitesSettings, deploymentTarget: target.id as any })}
                        className="mt-0.5 text-teal-500 focus:ring-teal-400"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{target.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{target.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Google Cloud Run Deployment Guide */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    <span>How to Deploy This Website on Google Cloud Run (Step-by-Step):</span>
                  </span>
                  <span className="text-[10px] text-teal-300 font-mono">1-Command Deployment</span>
                </div>

                <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-[11px] text-teal-300">
                    # 1. Build your website package<br />
                    npm run build<br /><br />
                    # 2. Deploy to Google Cloud Run<br />
                    gcloud run deploy my-website --source . --region us-central1 --allow-unauthenticated
                  </div>

                  <p>
                    <strong>Custom Domain Setup:</strong> In Google Cloud Console $\rightarrow$ Cloud Run $\rightarrow$ Manage Custom Domains $\rightarrow$ Map your domain (e.g. <code>yourbrand.com</code>). Google provisions a free managed SSL certificate automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. CREATE BOOKS SETTINGS & ANTI-AI PUBLISHING ENGINE */}
          {/* ========================================================= */}
          {activeSection === 'create-books' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-amber-400" />
                  <span>Book Publishing, Layout & Anti-AI Human Prose Settings</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure default genre style, text alignment, illustration density, art styles, and manuscript publishing standards.
                </p>
              </div>

              {/* Default Genre Options */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-white uppercase tracking-wider">
                  Default Book Genre:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'non-fiction', label: 'Non-Fiction / Business' },
                    { id: 'fiction', label: 'Literary Fiction' },
                    { id: 'kids-books', label: "Children's Book" },
                    { id: 'fantasy-scifi', label: 'Fantasy & Sci-Fi' },
                    { id: 'biography-memoir', label: 'Biography & Memoir' },
                    { id: 'self-help-business', label: 'Self-Help & Growth' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setBooksSettings({ ...booksSettings, defaultGenre: g.id })}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        booksSettings.defaultGenre === g.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                          : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Alignment & Illustrations Count Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Text Alignment */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <span className="block font-bold text-white uppercase tracking-wider text-[11px]">
                    Manuscript Text Alignment
                  </span>
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'justify', label: 'Justify', icon: AlignJustify },
                      { id: 'left', label: 'Left', icon: AlignLeft },
                      { id: 'center', label: 'Center', icon: AlignCenter },
                      { id: 'right', label: 'Right', icon: AlignRight },
                    ].map((align) => {
                      const Icon = align.icon;
                      return (
                        <button
                          key={align.id}
                          type="button"
                          onClick={() => setBooksSettings({ ...booksSettings, defaultAlignment: align.id as any })}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-bold text-xs transition-all ${
                            booksSettings.defaultAlignment === align.id
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{align.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Illustrations Density */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <span className="block font-bold text-white uppercase tracking-wider text-[11px]">
                    Illustrations Per Chapter
                  </span>
                  <div className="flex items-center gap-2">
                    {([2, 5, 8, 10] as const).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBooksSettings({ ...booksSettings, imagesPerChapter: num })}
                        className={`px-3.5 py-2 rounded-xl border font-bold text-xs transition-all ${
                          booksSettings.imagesPerChapter === num
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {num} Images
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Default Illustration Visual Style */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Default Chapter Illustration Style:
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={booksSettings.enableIllustrations}
                      onChange={(e) => setBooksSettings({ ...booksSettings, enableIllustrations: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-slate-300 font-semibold">Enable AI chapter artwork</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'cinematic photorealism',
                    'vintage watercolor',
                    'cartoons',
                    'animals',
                    'futuristic',
                    'modern world',
                    'fantasy & mythical',
                  ].map((style) => (
                    <button
                      key={style}
                      type="button"
                      disabled={!booksSettings.enableIllustrations}
                      onClick={() => setBooksSettings({ ...booksSettings, defaultImageType: style })}
                      className={`px-3 py-1.5 rounded-xl border font-medium text-xs capitalize transition-all disabled:opacity-40 ${
                        booksSettings.defaultImageType === style
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Anti-AI Writing Directive Quality Assurance */}
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Feather className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Anti-AI Human Style Guardrails (Active)
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={booksSettings.antiAiStrictCadence}
                      onChange={(e) => setBooksSettings({ ...booksSettings, antiAiStrictCadence: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <span className="text-amber-300 font-bold">Enforce Anti-AI Guardrails</span>
                  </label>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Book Engine enforces strict human prose patterns: varied sentence cadence, deep sensory immersion, subtext in character dialogue, and total elimination of AI buzzwords (e.g. "delve", "testament", "tapestry", "unwavering").
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-semibold text-amber-300">
                  <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">✓ Varied Cadence</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">✓ Sensory Grounding</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">✓ Dialogue Subtext</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">✓ Zero AI Clichés</div>
                </div>
              </div>

              {/* Supported Export Formats */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Manuscript Export Standard
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>Microsoft Word (.docx)</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Full editorial layout with title page, table of contents, and pagination ready for publishers.
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-rose-400" />
                      <span>Printable Document (.pdf)</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Clean Georgia typography, serif indentation, and page break formatting for print.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 9. LET'S CHAT DIRECTIVE SETTINGS (Cross-Directive & Intelligence) */}
          {/* ========================================================= */}
          {activeSection === 'lets-chat' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <MessageSquareCode className="w-5 h-5 text-fuchsia-400" />
                  <span>Let's Chat Directive & Polymath Conversational Intelligence Settings</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure default intelligence mode, cross-directive artifact synthesis, code generation targets, and automation persistence.
                </p>
              </div>

              {/* Default Chat Mode */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-white uppercase tracking-wider">
                  Default Conversational Mode:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'all', title: 'All-Around Polymath', desc: 'Holistic assistant combining business strategy, technical architecture, and creative copy.' },
                    { id: 'coding', title: 'Coding & Architecture', desc: 'Focuses on production-grade React, TypeScript, Python, backend APIs, and database schemas.' },
                    { id: 'tasks', title: 'Daily Tasks & Execution', desc: 'Time-blocked execution blueprints, daily priority checklists, and team growth workflows.' },
                    { id: 'cross-directive', title: 'Cross-Directive Synergy', desc: 'Transforms assets between directives (e.g. Brochure headlines into mobile app UI screens).' },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                        chatSettings.defaultMode === m.id
                          ? 'bg-fuchsia-500/20 border-fuchsia-400 text-white shadow-sm ring-1 ring-fuchsia-400/50'
                          : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="chatDefaultMode"
                        value={m.id}
                        checked={chatSettings.defaultMode === m.id}
                        onChange={() => setChatSettings({ ...chatSettings, defaultMode: m.id as any })}
                        className="mt-0.5 text-fuchsia-500 focus:ring-fuchsia-400"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{m.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Code Generation Output Style */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
                <span className="block font-bold text-white uppercase tracking-wider text-[11px]">
                  Preferred Code Generation Output Target:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {(['TypeScript / React', 'Python', 'Full Stack'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setChatSettings({ ...chatSettings, codeStyle: style })}
                      className={`px-3.5 py-2 rounded-xl border font-bold transition-all ${
                        chatSettings.codeStyle === style
                          ? 'bg-fuchsia-600 text-white border-fuchsia-400 shadow-md shadow-fuchsia-500/20'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles for Cross-Directive Awareness & Persistence */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
                <span className="block font-bold text-white uppercase tracking-wider text-[11px]">
                  Automation & Live Awareness Flags:
                </span>

                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chatSettings.crossDirectiveAwareness}
                      onChange={(e) => setChatSettings({ ...chatSettings, crossDirectiveAwareness: e.target.checked })}
                      className="w-4 h-4 rounded text-fuchsia-600 focus:ring-fuchsia-400"
                    />
                    <div>
                      <span className="text-white font-bold block">Live Cross-Directive Synchronization</span>
                      <span className="text-[11px] text-slate-400">
                        Automatically inspects current brochures, videos, apps, websites, posts, and leads during conversation requests.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chatSettings.detailedArchitecture}
                      onChange={(e) => setChatSettings({ ...chatSettings, detailedArchitecture: e.target.checked })}
                      className="w-4 h-4 rounded text-fuchsia-600 focus:ring-fuchsia-400"
                    />
                    <div>
                      <span className="text-white font-bold block">Architecture Blueprint Notes</span>
                      <span className="text-[11px] text-slate-400">
                        Includes engineering architecture callouts, error handling strategies, and setup instructions in code solutions.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chatSettings.autoSaveSolutionsToArchive}
                      onChange={(e) => setChatSettings({ ...chatSettings, autoSaveSolutionsToArchive: e.target.checked })}
                      className="w-4 h-4 rounded text-fuchsia-600 focus:ring-fuchsia-400"
                    />
                    <div>
                      <span className="text-white font-bold block">Auto-Save Generated Artifacts & Solutions to Archive</span>
                      <span className="text-[11px] text-slate-400">
                        Automatically stores generated scripts, daily plans, and cross-directive apps in Archive & History.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 9. BRAND PROFILE & AI ENGINE CONNECTIVITY */}
          {/* ========================================================= */}
          {activeSection === 'brand' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <span>Company Identity & AI Diagnostics</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Company Name</label>
                  <input
                    type="text"
                    value={brandInfo.companyName}
                    onChange={(e) => setBrandInfo({ ...brandInfo, companyName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Website URL</label>
                  <input
                    type="text"
                    value={brandInfo.contactInfo.website}
                    onChange={(e) =>
                      setBrandInfo({
                        ...brandInfo,
                        contactInfo: { ...brandInfo.contactInfo, website: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>AI Diagnostics Status</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Gemini 3.8 Flash Engine</span>
                  <span className="text-emerald-400 font-bold">Online</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Gemini Neural Voice Synthesizer</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Action */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 cursor-pointer"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'All Settings Saved!' : 'Save Directive Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
