import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquareCode,
  Sparkles,
  Send,
  Code2,
  ListTodo,
  Layers,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Smartphone,
  Globe,
  BookMarked,
  Compass,
  Zap,
  Info,
  Maximize2,
  Trash2,
} from 'lucide-react';
import {
  BrochureData,
  VideoProject,
  GeneratedAppProject,
  GeneratedWebsiteProject,
  BookProject,
  Lead,
  BusinessInfo,
  DirectiveSettings,
  GeneratorDirective,
  NavTab,
} from '../../types';

interface LetsChatStudioWorkflowProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  brochure: BrochureData;
  setBrochure: React.Dispatch<React.SetStateAction<BrochureData>>;
  videoProject: VideoProject;
  setVideoProject: React.Dispatch<React.SetStateAction<VideoProject>>;
  generatedPost: { caption: string; hashtags: string[]; bestTime: string };
  setGeneratedPost: React.Dispatch<React.SetStateAction<{ caption: string; hashtags: string[]; bestTime: string }>>;
  appProject: GeneratedAppProject;
  setAppProject: React.Dispatch<React.SetStateAction<GeneratedAppProject>>;
  websiteProject: GeneratedWebsiteProject;
  setWebsiteProject: React.Dispatch<React.SetStateAction<GeneratedWebsiteProject>>;
  bookProject: BookProject;
  leads: Lead[];
  businessInfo: BusinessInfo;
  directiveSettings: DirectiveSettings;
  setActiveDirective: (dir: GeneratorDirective) => void;
  setActiveTab: (tab: NavTab) => void;
  addToast: (title: string, desc?: string, type?: any) => void;
  celebrate: () => void;
}

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  referencedDirectives?: string[];
  generatedArtifact?: {
    targetDirective: GeneratorDirective;
    title: string;
    description: string;
    data: any;
  } | null;
}

export const LetsChatStudioWorkflow: React.FC<LetsChatStudioWorkflowProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  brochure,
  setBrochure,
  videoProject,
  setVideoProject,
  generatedPost,
  setGeneratedPost,
  appProject,
  setAppProject,
  websiteProject,
  setWebsiteProject,
  bookProject,
  leads,
  businessInfo,
  directiveSettings,
  setActiveDirective,
  setActiveTab,
  addToast,
  celebrate,
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `### 👋 Welcome to **Let's Chat** — Your Cross-Directive Conversational Intelligence

I'm loaded with real-time awareness of everything created across **Reach - Your AI Agent Platform**.

#### 🚀 What I Can Do For You:
1. **Cross-Directive Synergy**: Ask me: *"From the brochure that was created in brochure directive, create an app of the same cover interface"* and I will extract the exact brochure headline, key features, and brand styling, write the complete code, and let you load it into the Apps directive!
2. **Daily Task Solutions**: Ask me to organize your daily marketing workflows, priority checklists, and execution timelines.
3. **Coding & Programming**: Request complete React, TypeScript, Python, Tailwind, or backend API solutions with syntax highlighting and 1-click copying.
4. **General Questions & Strategy**: Ask any technical, growth, creative writing, or business questions.`,
      timestamp: 'Just now',
      suggestedActions: [
        'From the brochure that was created in brochure directive, create an app of the same cover interface',
        'Prepare our daily tasks solutions for today',
        'Write TypeScript code to automate lead discovery export',
        'Convert our video storyboard script into a viral LinkedIn post',
      ],
      referencedDirectives: ['create-brochure', 'create-apps', 'create-video'],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'all' | 'coding' | 'tasks' | 'cross-directive'>('all');
  const [showProjectsDrawer, setShowProjectsDrawer] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle incoming prompt passed from studio header bar
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt.trim());
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  // Build the comprehensive live projects context to supply to the backend
  const buildProjectsContext = () => ({
    brochure: {
      headline: brochure.headline,
      subheadline: brochure.subheadline,
      aboutText: brochure.aboutText,
      keyFeatures: brochure.keyFeatures,
      stats: brochure.stats,
      specialOffer: brochure.specialOffer,
      testimonial: brochure.testimonial,
      contact: brochure.contact,
    },
    video: {
      title: videoProject.title,
      prompt: videoProject.prompt,
      fullScript: videoProject.fullScript,
      durationLabel: videoProject.durationLabel || `${videoProject.duration}s`,
      scenes: videoProject.scenes.map((s) => ({
        id: s.id,
        title: s.title,
        voiceover: s.voiceover,
        badge: s.badge,
        duration: s.duration,
      })),
    },
    post: {
      caption: generatedPost.caption,
      hashtags: generatedPost.hashtags,
      bestTime: generatedPost.bestTime,
    },
    app: {
      name: appProject.name,
      tagline: appProject.tagline,
      themeColor: appProject.themeColor,
      features: appProject.features,
      screens: appProject.screens,
    },
    website: {
      name: websiteProject.name,
      tagline: websiteProject.tagline,
      sections: websiteProject.sections,
    },
    book: {
      selectedTitle: bookProject.selectedTitle,
      selectedSubtitle: bookProject.selectedSubtitle,
      genre: bookProject.genre,
      briefContent: bookProject.briefContent,
      chapterCount: bookProject.chapters.length,
    },
    leads: leads.slice(0, 5).map((l) => ({
      name: l.name,
      company: l.company,
      role: l.role,
      fitScore: l.fitScore,
      email: l.email,
    })),
    businessInfo: {
      companyName: businessInfo.companyName,
      tagline: businessInfo.tagline,
      valueProposition: businessInfo.valueProposition,
      services: businessInfo.services,
      brandColors: businessInfo.brandColors,
      website: businessInfo.contactInfo?.website,
    },
    socialLinks: directiveSettings.video.socialPlatforms,
  });

  const handleSend = async (userText?: string) => {
    const textToSend = (userText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessageItem = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const projectsContext = buildProjectsContext();
      const res = await fetch('/api/lets-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          projectsContext,
          mode: activeMode,
        }),
      });

      const data = await res.json();
      if (data && data.reply) {
        const assistantMsg: ChatMessageItem = {
          id: `msg-${Date.now()}-assistant`,
          sender: 'assistant',
          text: data.reply,
          timestamp: 'Just now',
          suggestedActions: data.suggestedActions || [],
          referencedDirectives: data.referencedDirectives || [],
          generatedArtifact: data.generatedArtifact || null,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data.generatedArtifact) {
          celebrate();
          addToast('Artifact Generated', `Created ${data.generatedArtifact.title}`, 'success');
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Error in Chat', 'Could not complete request, please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Load into Target Directive (e.g. from brochure -> create-apps)
  const handleLoadArtifact = (artifact: NonNullable<ChatMessageItem['generatedArtifact']>) => {
    celebrate();
    if (artifact.targetDirective === 'create-apps' && artifact.data) {
      setAppProject((prev) => ({
        ...prev,
        name: artifact.data.name || `${businessInfo.companyName} Mobile`,
        tagline: artifact.data.tagline || prev.tagline,
        themeColor: artifact.data.themeColor || prev.themeColor,
        screens: artifact.data.screens?.length ? [...artifact.data.screens, ...prev.screens] : prev.screens,
        activeScreenId: artifact.data.screens?.[0]?.id || prev.activeScreenId,
      }));
      setActiveDirective('create-apps');
      addToast('Loaded into Create Apps', `Switched to Apps directive to preview ${artifact.title}!`, 'success');
    } else if (artifact.targetDirective === 'create-brochure') {
      setActiveDirective('create-brochure');
      addToast('Opening Brochure', 'Loaded project in Create Brochure', 'info');
    } else if (artifact.targetDirective === 'create-video') {
      setActiveDirective('create-video');
      addToast('Opening Video Studio', 'Loaded project in Create Video', 'info');
    } else if (artifact.targetDirective === 'create-post') {
      setActiveDirective('create-post');
      addToast('Opening Social Post', 'Loaded project in Create Post', 'info');
    } else {
      setActiveDirective(artifact.targetDirective);
    }
  };

  const copyCodeToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(id);
    addToast('Code Copied', 'Code snippet copied to clipboard', 'info');
    setTimeout(() => setCopiedCodeIndex(null), 2200);
  };

  // Helper to render markdown message with code block detection & copy buttons
  const renderMessageContent = (text: string, msgId: string) => {
    // Split by code blocks ```
    const parts = text.split(/(```[\s\S]*?```)/g);

    return (
      <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const lines = part.slice(3, -3).trim().split('\n');
            const language = lines[0].trim() || 'typescript';
            const code = lines.slice(1).join('\n');
            const snippetId = `${msgId}-code-${index}`;
            const isCopied = copiedCodeIndex === snippetId;

            return (
              <div
                key={index}
                className="my-3 rounded-2xl overflow-hidden border border-white/15 bg-black/80 shadow-xl"
              >
                <div className="px-4 py-2 bg-white/[0.06] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase">{language}</span>
                  </div>
                  <button
                    onClick={() => copyCodeToClipboard(code, snippetId)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold transition-all cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-300" />}
                    <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-96">
                  <code>{code}</code>
                </pre>
              </div>
            );
          }

          // Format headings and regular text
          const lines = part.split('\n');
          return (
            <div key={index} className="space-y-1.5">
              {lines.map((line, lIdx) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={lIdx} className="text-base font-bold text-white pt-2 pb-1 border-b border-white/10 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>{trimmed.replace('### ', '')}</span>
                    </h3>
                  );
                }
                if (trimmed.startsWith('#### ')) {
                  return (
                    <h4 key={lIdx} className="text-sm font-semibold text-cyan-300 pt-1.5">
                      {trimmed.replace('#### ', '')}
                    </h4>
                  );
                }
                if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- [x] ')) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2 text-slate-300 pl-1">
                      <span className="text-cyan-400 font-bold mt-0.5">☐</span>
                      <span>{trimmed.replace(/- \[[ x]\] /, '')}</span>
                    </div>
                  );
                }
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2 text-slate-300 pl-2">
                      <span className="text-cyan-400">•</span>
                      <span>{trimmed.slice(2)}</span>
                    </div>
                  );
                }
                if (!trimmed) {
                  return <div key={lIdx} className="h-1" />;
                }
                return <p key={lIdx} className="text-slate-200">{line}</p>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header & Cross-Directive Awareness Status Bar */}
      <div className="p-4 rounded-3xl glass-panel border border-white/10 bg-gradient-to-r from-fuchsia-950/40 via-[#101026]/90 to-cyan-950/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/20">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">Let's Chat Studio</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Cross-Directive Synced
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive conversational intelligence with full memory of your brochures, videos, apps, and posts.
            </p>
          </div>
        </div>

        {/* Mode Selector & Project Context Inspector Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-white/[0.06] p-1 rounded-xl border border-white/10">
            {[
              { id: 'all', label: 'All-In-One', icon: Sparkles },
              { id: 'coding', label: 'Coding', icon: Code2 },
              { id: 'tasks', label: 'Daily Tasks', icon: ListTodo },
              { id: 'cross-directive', label: 'Cross-Directive', icon: Layers },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id as any)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeMode === m.id
                      ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowProjectsDrawer(!showProjectsDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showProjectsDrawer ? 'Hide Project Memory' : 'View Project Memory'}</span>
          </button>
        </div>
      </div>

      {/* Cross-Directive Live Project Context Inspector (Shows what other directives did) */}
      {showProjectsDrawer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-3xl glass-panel border border-cyan-500/30 bg-[#0B0B18]/95 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Current Project Assets Known to Let's Chat:</span>
            </span>
            <span className="text-[11px] text-slate-400">Click any card to inject reference into chat</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            {/* Brochure Card */}
            <div
              onClick={() => handleSend(`From the brochure that was created in brochure directive ("${brochure.headline}"), create an app of the same cover interface...`)}
              className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-cyan-300 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Brochure Directive</span>
                </span>
                <span className="text-[9px] text-emerald-400 font-mono">Loaded</span>
              </div>
              <p className="text-slate-200 font-semibold line-clamp-1">{brochure.headline}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{brochure.subheadline}</p>
              <div className="mt-2 text-[10px] text-cyan-400 font-semibold group-hover:underline flex items-center gap-1">
                <span>Transform to App Cover ➔</span>
              </div>
            </div>

            {/* Video Card */}
            <div
              onClick={() => handleSend(`Transform our commercial video storyboard ("${videoProject.title}") into a 3-part marketing email sequence...`)}
              className="p-3 rounded-2xl bg-violet-950/30 border border-violet-500/30 hover:border-violet-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-violet-300 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Directive</span>
                </span>
                <span className="text-[9px] text-cyan-400 font-mono">{videoProject.durationLabel}</span>
              </div>
              <p className="text-slate-200 font-semibold line-clamp-1">{videoProject.title}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{videoProject.fullScript}</p>
              <div className="mt-2 text-[10px] text-violet-400 font-semibold group-hover:underline flex items-center gap-1">
                <span>Adapt Script to Copy ➔</span>
              </div>
            </div>

            {/* Apps Card */}
            <div
              onClick={() => handleSend(`Review the app project screens in Create Apps ("${appProject.name}") and write complete backend authentication and data models in TypeScript...`)}
              className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-blue-300 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Apps Directive</span>
                </span>
                <span className="text-[9px] text-slate-400">{appProject.screens.length} screens</span>
              </div>
              <p className="text-slate-200 font-semibold line-clamp-1">{appProject.name}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{appProject.tagline}</p>
              <div className="mt-2 text-[10px] text-blue-400 font-semibold group-hover:underline flex items-center gap-1">
                <span>Write Backend Logic ➔</span>
              </div>
            </div>

            {/* Social Post Card */}
            <div
              onClick={() => handleSend(`From our current social post, create a full 5-day multi-channel campaign calendar...`)}
              className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Post Directive</span>
                </span>
                <span className="text-[9px] text-amber-400 font-mono">{generatedPost.hashtags.length} tags</span>
              </div>
              <p className="text-slate-200 font-semibold line-clamp-1">{generatedPost.caption}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{generatedPost.bestTime}</p>
              <div className="mt-2 text-[10px] text-amber-400 font-semibold group-hover:underline flex items-center gap-1">
                <span>Expand to Multi-Channel ➔</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Chat Interface Container */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl bg-[#0B0B16]/95 flex flex-col min-h-[560px]">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 max-h-[640px]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-fuchsia-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-fuchsia-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl sm:max-w-3xl rounded-3xl p-4 sm:p-5 ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-600/20 ml-8'
                      : 'bg-white/[0.04] border border-white/10 text-slate-200 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-white/90">
                      {isUser ? 'You' : "Let's Chat Agent"}
                    </span>
                    <span className="text-[10px] text-white/50">{msg.timestamp}</span>
                  </div>

                  {/* Message Body */}
                  {isUser ? (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  ) : (
                    renderMessageContent(msg.text, msg.id)
                  )}

                  {/* Generated Artifact Action Card (e.g. from brochure -> create-apps) */}
                  {msg.generatedArtifact && (
                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-fuchsia-950/60 to-indigo-950/60 border border-fuchsia-500/40 shadow-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-300 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Generated Cross-Directive Artifact</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                          Ready to Preview
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-white">{msg.generatedArtifact.title}</h4>
                      <p className="text-xs text-slate-300">{msg.generatedArtifact.description}</p>

                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleLoadArtifact(msg.generatedArtifact!)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-fuchsia-500/30 transition-all cursor-pointer"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>🚀 Load into {msg.generatedArtifact.targetDirective === 'create-apps' ? 'Create Apps' : msg.generatedArtifact.targetDirective} Directive</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Suggested Action Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Suggested Follow-Ups:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((action, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleSend(action)}
                            className="text-left px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-cyan-200 hover:text-white text-[11px] font-medium transition-all cursor-pointer"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-center text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-cyan-500 flex items-center justify-center text-white">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Let's Chat is analyzing cross-directive projects & synthesizing solution…</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-black/40 space-y-3">
          {/* Quick Prompts Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">Quick Ask:</span>
            {[
              'From the brochure created in brochure directive, create an app of the same cover interface',
              'Prepare our daily tasks solutions for today',
              'Write TypeScript code to export qualified leads to CSV',
              'Convert commercial video script into a 3-part email sequence',
            ].map((qp, qIdx) => (
              <button
                key={qIdx}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white shrink-0 truncate max-w-xs transition-colors cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything, request coding, plan daily tasks, or transform projects across directives..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-fuchsia-500/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
