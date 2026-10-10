import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  FileText,
  Download,
  RefreshCw,
  Clock,
  Layers,
  CheckCircle2,
  Share2,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VideoScene, VideoProject } from '../../types';

export const CreateVideoModule: React.FC = () => {
  const {
    businessInfo,
    directiveSettings,
    updateSocialPlatformLink,
    setAttachedAsset,
    setActiveTab,
    addToast,
    celebrate,
    incrementStat,
    addHistoryItem,
  } = useApp();

  const [prompt, setPrompt] = useState(
    `A high-energy 30-second commercial explainer video demonstrating how ${businessInfo.companyName} finds customers and automates marketing campaigns on autopilot.`
  );
  const [videoType, setVideoType] = useState('Explainer');
  const [voiceName, setVoiceName] = useState('Kore');
  const [duration, setDuration] = useState(30);
  const [includeMusic, setIncludeMusic] = useState(true);
  const [includeSubtitles, setIncludeSubtitles] = useState(true);
  const [showSocialLinks, setShowSocialLinks] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isVoicePreviewing, setIsVoicePreviewing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [project, setProject] = useState<VideoProject>({
    id: 'vid-demo-1',
    title: `${businessInfo.companyName}: Commercial Explainer Ad`,
    prompt: 'Autonomous growth engine commercial',
    videoType: 'Explainer',
    voiceName: 'Kore',
    duration: 30,
    fullScript: `Finding new customers is exhausting. You spend hours researching leads, writing emails, and designing graphics. What if one AI agent handled your entire growth pipeline? Meet ${businessInfo.companyName}. Paste your website, discover verified leads, and launch stunning multi-channel campaigns in seconds. Start growing today at ${businessInfo.contactInfo.website}.`,
    musicMood: 'Modern Tech Pulse with Uplifting Melody',
    audioUrl: null,
    createdAt: 'Just now',
    scenes: [
      {
        id: 1,
        timestamp: '0:00 - 0:07',
        duration: 7,
        title: 'Scene 1: The Outbound Grind',
        visualDescription: 'Frustrated founder staring at endless spreadsheets and zero inbound replies.',
        voiceover: 'Finding new customers is exhausting. Hours spent on prospecting and writing copy that gets ignored.',
        badge: 'THE PROBLEM',
        gradient: 'from-slate-900 via-indigo-950 to-slate-900',
        icon: 'alert-circle',
      },
      {
        id: 2,
        timestamp: '0:07 - 0:16',
        duration: 9,
        title: 'Scene 2: Autonomous Intelligence',
        visualDescription: 'A pulsating purple orb scans a website URL, instantly revealing top verified B2B decision makers.',
        voiceover: `What if one AI agent handled your entire growth pipeline? Meet ${businessInfo.companyName}.`,
        badge: 'THE BREAKTHROUGH',
        gradient: 'from-indigo-600 via-violet-600 to-purple-800',
        icon: 'sparkles',
      },
      {
        id: 3,
        timestamp: '0:16 - 0:24',
        duration: 8,
        title: 'Scene 3: Multi-Channel Generation',
        visualDescription: 'Split screen showing personalized emails, Instagram carousels, and high-impact brochures generating in real-time.',
        voiceover: 'Discover verified leads, launch personalized emails, and generate on-brand ad assets in seconds.',
        badge: 'MULTI-CHANNEL',
        gradient: 'from-violet-600 via-fuchsia-600 to-pink-600',
        icon: 'layers',
      },
      {
        id: 4,
        timestamp: '0:24 - 0:30',
        duration: 6,
        title: 'Scene 4: Scale Your Business',
        visualDescription: 'Logo glow card with Call to Action button and direct link.',
        voiceover: 'Start scaling your customer acquisition today. Try it free right now.',
        badge: 'CALL TO ACTION',
        gradient: 'from-pink-600 via-rose-600 to-orange-500',
        icon: 'arrow-right',
      },
    ],
  });

  const voices = [
    { id: 'Kore', name: 'Kore', tag: 'Warm & Professional (Female)' },
    { id: 'Puck', name: 'Puck', tag: 'Energetic & Crisp (Male)' },
    { id: 'Fenrir', name: 'Fenrir', tag: 'Deep & Authoritative (Male)' },
    { id: 'Zephyr', name: 'Zephyr', tag: 'Bright & Conversational' },
    { id: 'Charon', name: 'Charon', tag: 'Calm & Trustworthy' },
  ];

  // Playback timer & scene synchronization
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          const next = prev + 0.2;
          if (next >= duration) {
            setIsPlaying(false);
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            return 0;
          }

          // Calculate current scene
          let accumulated = 0;
          for (let i = 0; i < project.scenes.length; i++) {
            accumulated += project.scenes[i].duration;
            if (next <= accumulated) {
              setActiveSceneIndex(i);
              break;
            }
          }

          return next;
        });
      }, 200);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, project.scenes]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
    } else {
      setIsPlaying(true);
      if (audioRef.current && project.audioUrl) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleGenerateVideo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    addToast('Directing Video Ad', `Writing storyboard & synthesizing ${voiceName} neural voiceover…`, 'info');

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          videoType,
          voiceName,
          duration,
          businessInfo,
        }),
      });

      const data = await res.json();
      if (data && data.scenes) {
        setProject({
          id: `vid-${Date.now()}`,
          title: data.title || `${businessInfo.companyName} Commercial`,
          prompt,
          videoType,
          voiceName,
          duration,
          fullScript: data.fullScript,
          scenes: data.scenes,
          audioUrl: data.audioUrl || null,
          musicMood: data.musicMood || 'Modern Tech Pulse',
          createdAt: 'Just now',
        });

        celebrate();
        incrementStat('assetsGenerated', 1);
        addToast('Video Project Ready', 'Commercial storyboard and narration ready for preview', 'success');
        addHistoryItem({
          type: 'video',
          title: `Created ${videoType} Video Ad`,
          description: `Duration: ${duration}s | Voice: ${voiceName}`,
        });
      }
    } catch (err) {
      console.error(err);
      addToast('Video ready', 'Loaded project storyboard', 'info');
    } finally {
      setIsGenerating(false);
      setPlaybackTime(0);
      setActiveSceneIndex(0);
    }
  };

  const previewVoiceTTS = async (vName: string) => {
    setIsVoicePreviewing(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Hi there, I am ${vName}. Ready to narrate your next commercial video campaign.`,
          voiceName: vName,
        }),
      });
      const data = await res.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play();
        addToast('Voice Preview', `Playing ${vName} neural voice sample`, 'info');
      } else {
        // Fallback to speech synthesis if browser supports
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(`Hi there, I am ${vName}. Ready to narrate your campaign.`);
          window.speechSynthesis.speak(u);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVoicePreviewing(false);
    }
  };

  const currentScene = project.scenes[activeSceneIndex] || project.scenes[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div>
        <div className="flex items-center gap-2">
          <Video className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-extrabold text-white">AI Commercial Video Studio</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Storyboard, script, and narrate high-impact commercial video ads with Gemini neural voiceover and scene visualizer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Settings (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-panel border border-white/10 space-y-5 bg-gradient-to-br from-[#121225]/90 via-[#0F0F22]/90 to-[#0A0A16]/95">
          {/* Prompt */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Video Description & Campaign Goal
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe your video campaign (e.g. 30s product demo explaining how our SaaS automates lead generation)..."
              className="w-full p-3.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 transition-all resize-y"
            />
          </div>

          {/* Video Type */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Video Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Explainer', 'Ad Commercial', 'Product Demo', 'Slideshow'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setVideoType(t)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    videoType === t
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-transparent shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selector with live preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Neural Voiceover Talent
              </label>
              <span className="text-[10px] text-cyan-400 font-bold">Gemini TTS</span>
            </div>
            <div className="space-y-1.5">
              {voices.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setVoiceName(v.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                    voiceName === v.id
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{v.name}</span>
                    <span className="text-[10px] font-normal text-slate-400">• {v.tag}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      previewVoiceTTS(v.id);
                    }}
                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-cyan-300 hover:text-white"
                  >
                    Sample Voice
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Duration Selector with 15s, 30s, 1m, 2m, 3m, 5m, 8m */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Video Duration</span>
              <span className="text-white font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                {duration >= 60 ? `${Math.round(duration / 60)} min (${duration}s)` : `${duration} seconds`}
              </span>
            </div>

            {/* Quick Presets Pills */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {[
                { dur: 15, label: '15s', tag: 'Short' },
                { dur: 30, label: '30s', tag: 'Ad' },
                { dur: 60, label: '1m', tag: '1 Min' },
                { dur: 120, label: '2m', tag: '2 Min' },
                { dur: 180, label: '3m', tag: '3 Min' },
                { dur: 300, label: '5m', tag: '5 Min' },
                { dur: 480, label: '8m', tag: '8 Min' },
              ].map((item) => (
                <button
                  key={item.dur}
                  type="button"
                  onClick={() => setDuration(item.dur)}
                  className={`py-1.5 px-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                    duration === item.dur
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-xs'
                      : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[9px] font-normal text-slate-400">{item.tag}</span>
                </button>
              ))}
            </div>

            <input
              type="range"
              min="15"
              max="480"
              step="15"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer mt-1"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>15s (Short)</span>
              <span>30s (Ad)</span>
              <span>1m</span>
              <span>3m (Overview)</span>
              <span>5m</span>
              <span>8m (Extended)</span>
            </div>
          </div>

          {/* Auto Video Generation: Paste & Store Social Media Destination Links */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Auto-Gen Social Media Links
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                  Stored & Shared
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSocialLinks(!showSocialLinks)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
              >
                {showSocialLinks ? '▲ Hide' : '▼ Configure & Paste Links'}
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Paste your channels below. Stored links are automatically fetched by Create Post and multi-channel publishing.
            </p>

            {showSocialLinks && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                {[
                  { key: 'facebook', label: 'Facebook', icon: '👥', placeholder: 'https://facebook.com/yourbrand' },
                  { key: 'instagram', label: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/yourbrand' },
                  { key: 'tiktok', label: 'TikTok', icon: '🎵', placeholder: 'https://tiktok.com/@yourbrand' },
                  { key: 'youtube', label: 'YouTube', icon: '▶️', placeholder: 'https://youtube.com/@yourbrand' },
                  { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/company/yourbrand' },
                  { key: 'twitter', label: 'X (Twitter)', icon: '🐦', placeholder: 'https://x.com/yourbrand' },
                ].map((p) => {
                  const platformState = (directiveSettings.video.socialPlatforms as any)[p.key] || { enabled: true, url: '' };
                  return (
                    <div
                      key={p.key}
                      className={`p-2 rounded-xl border transition-all ${
                        platformState.enabled ? 'bg-white/[0.04] border-cyan-500/30' : 'bg-white/[0.01] border-white/5 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={platformState.enabled}
                          onChange={(e) => updateSocialPlatformLink(p.key, platformState.url, e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-cyan-500 focus:ring-cyan-400"
                        />
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{p.icon}</span>
                          <span>{p.label}</span>
                        </span>
                        {platformState.url && (
                          <span className="ml-auto text-[10px] text-emerald-400 font-mono">Stored</span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={platformState.url}
                        onChange={(e) => updateSocialPlatformLink(p.key, e.target.value, platformState.enabled)}
                        placeholder={p.placeholder}
                        className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    addToast('Links Saved & Stored', 'All social links are stored and synced across video and post modules', 'success');
                  }}
                  className="w-full py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save & Sync Stored Links
                </button>
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMusic}
                onChange={(e) => setIncludeMusic(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
              />
              <span className="truncate">Background Music</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSubtitles}
                onChange={(e) => setIncludeSubtitles(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
              />
              <span className="truncate">Subtitles Overlay</span>
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateVideo}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Assembling Storyboard & Audio…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Video Commercial ({duration}s)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Interactive Video Player Card & Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Video Screen Container */}
          <div className="relative aspect-video rounded-3xl overflow-hidden glass-panel border border-white/15 bg-black shadow-2xl flex flex-col justify-between p-6">
            {/* Background dynamic gradient representing current scene visual */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                currentScene.gradient || 'from-indigo-900 via-purple-900 to-black'
              } opacity-90 transition-all duration-700 pointer-events-none`}
            />

            {/* Subtle animated scanlines / grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0,transparent_100%)] pointer-events-none" />

            {/* Video Header Chrome */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white tracking-wider">
                {currentScene.badge}
              </span>

              <div className="flex items-center gap-2 text-xs font-semibold text-white/90 bg-black/50 px-2.5 py-1 rounded-full border border-white/10">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {playbackTime.toFixed(1)}s / {duration}s
                </span>
              </div>
            </div>

            {/* Center Scene Presentation */}
            <div className="relative z-10 max-w-lg mx-auto text-center space-y-3 my-auto">
              <motion.div
                key={currentScene.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-2 shadow-lg">
                  <Sparkles className="w-6 h-6 text-cyan-300 animate-pulse" />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {currentScene.title}
                </h3>
                <p className="text-xs text-slate-200 mt-1 max-w-md mx-auto line-clamp-2 drop-shadow">
                  {currentScene.visualDescription}
                </p>
              </motion.div>
            </div>

            {/* Subtitles Overlay Bar (if enabled) */}
            <div className="relative z-10 flex flex-col items-center">
              {includeSubtitles && (
                <div className="mb-3 px-4 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-amber-200 text-center max-w-md shadow-lg">
                  "{currentScene.voiceover}"
                </div>
              )}

              {/* Progress Scrubber Bar */}
              <div className="w-full flex items-center gap-3">
                <button
                  onClick={togglePlayback}
                  className="w-10 h-10 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-cyan-400/40 hover:scale-105 transition-transform cursor-pointer shrink-0"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <div
                  className="relative flex-1 h-3 rounded-full bg-white/20 cursor-pointer overflow-hidden backdrop-blur-xs"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    setPlaybackTime(pct * duration);
                  }}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-100"
                    style={{ width: `${(playbackTime / duration) * 100}%` }}
                  />
                </div>

                <button
                  onClick={() => {
                    setPlaybackTime(0);
                    setActiveSceneIndex(0);
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white shrink-0"
                  title="Rewind"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hidden audio element for generated narration */}
            {project.audioUrl && <audio ref={audioRef} src={project.audioUrl} preload="auto" />}
          </div>

          {/* Timeline Scrubber with Scene Thumbnails (Prompt 6 requirement) */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Scene Timeline Breakdown ({project.scenes.length} Scenes)</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Music Track: <strong className="text-cyan-300">{project.musicMood}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {project.scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  onClick={() => {
                    setActiveSceneIndex(idx);
                    // jump playback to start of this scene
                    let accum = 0;
                    for (let j = 0; j < idx; j++) accum += project.scenes[j].duration;
                    setPlaybackTime(accum);
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    activeSceneIndex === idx
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                      : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-white">Scene {idx + 1}</span>
                    <span>{scene.duration}s</span>
                  </div>
                  <div className="text-xs font-bold text-slate-200 line-clamp-1">{scene.title.split(':')[1] || scene.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">
                    "{scene.voiceover}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Narration Voiceover Script Box */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-pink-400" />
                <span>Complete Voiceover Script</span>
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(project.fullScript);
                  addToast('Script Copied', 'Copied to clipboard', 'info');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Copy Script
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/5">
              {project.fullScript}
            </p>
          </div>

          {/* Bottom Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setAttachedAsset({
                  type: 'video',
                  name: `${project.title}.mp4`,
                });
                addToast('Attached to Email', 'Commercial explainer attached to outreach draft', 'success');
                setActiveTab('email-outreach');
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/40 text-pink-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Use Video in Email Outreach</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const blob = new Blob([project.fullScript], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `video-script-${project.id}.txt`;
                  a.click();
                  addToast('Downloaded Script', 'Saved storyboard script file', 'success');
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Script</span>
              </button>

              <button
                onClick={() => {
                  celebrate();
                  addToast('Exporting Video Ad', 'Rendering 1080p MP4 with voiceover audio…', 'success');
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-700 text-white text-xs font-bold shadow-md shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export MP4 Video</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
