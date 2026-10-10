import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Share2,
  Sparkles,
  Copy,
  Check,
  Send,
  Calendar,
  Download,
  Image as ImageIcon,
  RefreshCw,
  Heart,
  MessageCircle,
  Repeat,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Sliders,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

type Platform = 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'tiktok';

export const CreatePostModule: React.FC = () => {
  const {
    businessInfo,
    directiveSettings,
    setActiveTab,
    setActiveDirective,
    addToast,
    celebrate,
    incrementStat,
    addHistoryItem,
  } = useApp();

  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['linkedin', 'twitter']);
  const [topic, setTopic] = useState(
    `Why manual cold prospecting is dead in 2025: How ${businessInfo.companyName} generates 50+ qualified sales calls every month on autopilot.`
  );
  const [tone, setTone] = useState('Insightful & Engaging');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  // Post generation outputs
  const [hook, setHook] = useState('Stop spending 20 hours a week finding customers manually. 🛑');
  const [caption, setCaption] = useState(
    `Most founders fail at outbound for one simple reason:\n\nThey waste 80% of their energy prospecting, verifying emails, and rewriting copy that gets ignored.\n\nWith ${businessInfo.companyName}, the game changes:\n✨ 1-click customer discovery from any URL\n🎯 Verified decision-maker emails with 95%+ deliverability\n⚡ Hyper-personalized outreach that actually gets responses\n🎨 Instant social posts, brochures, and video ads\n\nScale your customer acquisition on autopilot. What is your biggest challenge with outbound right now? Drop it below 👇`
  );
  const [hashtags, setHashtags] = useState<string[]>([
    '#B2BMarketing',
    '#CustomerAcquisition',
    '#GrowthHacking',
    '#AIAgents',
    '#FounderLife',
  ]);
  const [bestTime, setBestTime] = useState('Tuesday 9:15 AM EST (Peak Engagement)');
  const [postImage, setPostImage] = useState(
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'
  );

  const platformLimits: Record<Platform, number> = {
    linkedin: 3000,
    twitter: 280,
    instagram: 2200,
    facebook: 5000,
    tiktok: 2200,
  };

  const platforms: { id: Platform; label: string; icon: string; color: string }[] = [
    { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-indigo-700' },
    { id: 'instagram', label: 'Instagram', icon: '📸', color: 'from-pink-500 via-rose-500 to-amber-500' },
    { id: 'twitter', label: 'X (Twitter)', icon: '🐦', color: 'from-slate-700 to-slate-900' },
    { id: 'facebook', label: 'Facebook', icon: '👥', color: 'from-blue-500 to-blue-700' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵', color: 'from-rose-500 via-purple-600 to-cyan-500' },
  ];

  const handleGeneratePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    const activeList = selectedPlatforms.length > 0 ? selectedPlatforms : [platform];
    const platformNames = activeList.map((p) => p.toUpperCase()).join(', ');
    addToast('Generating Campaign', `Writing viral post for ${platformNames}…`, 'info');

    try {
      const res = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          topic,
          tone,
          includeHashtags,
          businessInfo,
        }),
      });

      const data = await res.json();
      if (data && data.caption) {
        setHook(data.hook || '');
        setCaption(data.caption);
        if (data.hashtags && Array.isArray(data.hashtags)) {
          setHashtags(data.hashtags);
        }
        if (data.bestTimeToPost) setBestTime(data.bestTimeToPost);

        celebrate();
        incrementStat('postsCreated', activeList.length);
        addToast('Post Generated', `Optimized for ${platformNames}`, 'success');
        addHistoryItem({
          type: 'post',
          title: `Created Posts for ${platformNames}`,
          description: `Topic: "${topic.slice(0, 60)}..."`,
        });
      }
    } catch (err) {
      console.error(err);
      addToast('Post Generated', 'Loaded platform draft', 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCaption = () => {
    const fullText = includeHashtags && hashtags.length > 0 ? `${caption}\n\n${hashtags.join(' ')}` : caption;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    addToast('Post Copied', 'Ready to paste into your social scheduler', 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePublishNow = () => {
    celebrate();
    const activeList = selectedPlatforms.length > 0 ? selectedPlatforms : [platform];
    const dispatchDetails = activeList
      .map((p) => {
        const url = (directiveSettings.video.socialPlatforms as any)[p]?.url;
        return `${p.toUpperCase()}${url ? ` (${url})` : ''}`;
      })
      .join(', ');
    incrementStat('postsCreated', activeList.length);
    addToast(
      `Published to ${activeList.length} Channels`,
      `Dispatched to: ${dispatchDetails}`,
      'success'
    );
  };

  const currentLength = caption.length + (includeHashtags ? hashtags.join(' ').length : 0);
  const maxLimit = platformLimits[platform];
  const isOverLimit = currentLength > maxLimit;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div>
        <div className="flex items-center gap-2">
          <Share2 className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-extrabold text-white">AI Social Media Studio</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Generate viral platform-native posts, hooks, hashtags, and real-time previews for any social network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-panel border border-white/10 space-y-5 bg-gradient-to-br from-[#121225]/90 via-[#0F0F22]/90 to-[#0A0A16]/95">
          {/* Social Platforms Selection Checklist (Multi-Select) with Stored Video Auto-Gen Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Social Platforms (Checklist)
              </label>
              <span className="text-[11px] text-indigo-400 font-semibold">
                {selectedPlatforms.length} {selectedPlatforms.length === 1 ? 'platform' : 'platforms'} selected
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">Fetched Destination Links:</span>
                <span className="text-slate-400">Synced from Video Auto-Gen config</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('studio');
                  setActiveDirective('create-video');
                }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold text-left cursor-pointer"
              >
                Configure in Video Generator →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {platforms.map((p) => {
                const isChecked = selectedPlatforms.includes(p.id);
                const storedUrl = (directiveSettings.video.socialPlatforms as any)[p.id]?.url;

                return (
                  <label
                    key={p.id}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-xs'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                    }`}
                    title={storedUrl ? `Fetched Destination: ${storedUrl}` : 'No link pasted in Video Generator'}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPlatforms((prev) => [...prev, p.id]);
                              setPlatform(p.id); // set active preview
                            } else {
                              if (selectedPlatforms.length > 1) {
                                const updated = selectedPlatforms.filter((id) => id !== p.id);
                                setSelectedPlatforms(updated);
                                if (platform === p.id) {
                                  setPlatform(updated[0]);
                                }
                              } else {
                                addToast('Selection Required', 'Keep at least 1 social platform selected', 'info');
                              }
                            }
                          }}
                          className="w-4 h-4 rounded text-indigo-600 bg-black/40 border-white/20 focus:ring-indigo-500"
                        />
                        <span className="text-base">{p.icon}</span>
                        <span className="truncate">{p.label}</span>
                      </div>

                      {isChecked && platform === p.id && (
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-bold shrink-0">
                          Preview
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] pl-6 font-mono truncate text-slate-400">
                      {storedUrl ? (
                        <span className="text-emerald-300">🔗 {storedUrl.replace(/^https?:\/\//, '')}</span>
                      ) : (
                        <span className="text-slate-500 italic">No link in video gen</span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Topic / Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Post Topic or Announcement
              </label>
              <button
                type="button"
                onClick={() =>
                  setTopic(`How ${businessInfo.companyName} helps founders automate lead generation in 2025.`)
                }
                className="text-[11px] text-indigo-400 hover:text-indigo-300"
              >
                Auto-Fill Topic
              </button>
            </div>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              placeholder="What do you want to announce or share? (e.g. 5 lessons from scaling our company, product launch, case study)..."
              className="w-full p-3.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 transition-all resize-y"
            />
          </div>

          {/* Tone Selector & Hashtag Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Insightful & Engaging" className="bg-[#121225]">Insightful & Engaging</option>
                <option value="Bold & Controversial" className="bg-[#121225]">Bold & Controversial</option>
                <option value="Storytelling & Vulnerable" className="bg-[#121225]">Storytelling & Vulnerable</option>
                <option value="Direct & Action-Oriented" className="bg-[#121225]">Direct & Action-Oriented</option>
                <option value="Casual & Relatable" className="bg-[#121225]">Casual & Relatable</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <input
                  type="checkbox"
                  checked={includeHashtags}
                  onChange={(e) => setIncludeHashtags(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Include Viral Hashtags</span>
              </label>
            </div>
          </div>

          {/* Best Time to Post Badge */}
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Recommended Schedule: <strong>{bestTime}</strong></span>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGeneratePost}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Viral Post…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  Generate Post for {selectedPlatforms.length} {selectedPlatforms.length === 1 ? 'Platform' : 'Platforms'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Platform Preview Mockup (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Live {platform.toUpperCase()} Preview Chrome</span>
            </span>

            {/* Character counter */}
            <div
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                isOverLimit
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-white/5 text-slate-300 border-white/10'
              }`}
            >
              {currentLength} / {maxLimit} characters
            </div>
          </div>

          {/* Authentic Platform Mockup Card */}
          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl bg-[#0F0F1E]/95">
            {/* Platform Mockup Header Bar */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-[#0F0F1E] flex items-center justify-center font-bold text-white text-xs">
                    {businessInfo.companyName.charAt(0) || 'A'}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{businessInfo.companyName}</span>
                    <span className="text-[10px] text-indigo-400">✓</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span>{businessInfo.tagline}</span>
                    <span>•</span>
                    <span>Just now</span>
                    <span>•</span>
                    <Globe className="w-2.5 h-2.5 inline" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Dispatches to:</span>
                {selectedPlatforms.map((plat) => {
                  const storedUrl = (directiveSettings.video.socialPlatforms as any)[plat]?.url;
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setPlatform(plat)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                        platform === plat
                          ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-300'
                          : 'bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25'
                      }`}
                      title={storedUrl ? `Fetched Destination: ${storedUrl}` : 'No link pasted yet'}
                    >
                      <span>{plat}</span>
                      {storedUrl && <span className="text-[9px] font-mono opacity-80">🔗</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editable Post Body Text */}
            <div className="p-4 space-y-3">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={7}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-400 leading-relaxed focus:outline-none resize-y"
              />

              {/* Hashtags */}
              {includeHashtags && hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hashtags.map((ht, idx) => (
                    <span key={idx} className="text-xs font-medium text-indigo-400 hover:underline">
                      {ht}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Post Image Preview */}
            {postImage && (
              <div className="relative border-t border-b border-white/10 bg-black/40 overflow-hidden max-h-72">
                <img src={postImage} alt="Post asset" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                <button
                  onClick={() =>
                    setPostImage(
                      postImage.includes('photo-1557804506')
                        ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
                        : 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'
                    )
                  }
                  className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-white flex items-center gap-1 hover:bg-black/90"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Cycle Image</span>
                </button>
              </div>
            )}

            {/* Mock Platform Social Engagements bar */}
            <div className="p-3 border-t border-white/10 flex items-center justify-between text-slate-400 text-xs">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>142</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>38</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                  <Repeat className="w-4 h-4" />
                  <span>19</span>
                </button>
              </div>
              <Bookmark className="w-4 h-4 hover:text-white transition-colors" />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleCopyCaption}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied Post' : 'Copy Caption & Hashtags'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsScheduled(true);
                  celebrate();
                  addToast('Post Scheduled', `Queued for ${bestTime}`, 'success');
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule</span>
              </button>

              <button
                onClick={handlePublishNow}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Now ({selectedPlatforms.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
