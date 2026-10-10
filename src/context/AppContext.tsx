import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  NavTab,
  GeneratorDirective,
  Lead,
  BusinessInfo,
  HistoryItem,
  ToastMessage,
  ChatMessage,
  BrochureData,
  VideoProject,
  PostCampaign,
  ImageAsset,
  DirectiveSettings,
} from '../types';

interface AppStats {
  leadsFound: number;
  emailsSent: number;
  postsCreated: number;
  assetsGenerated: number;
  responseRate: number;
}

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeDirective: GeneratorDirective;
  setActiveDirective: (directive: GeneratorDirective) => void;
  activeSettingsSection: GeneratorDirective | 'general';
  setActiveSettingsSection: (section: GeneratorDirective | 'general') => void;
  
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  toggleChat: () => void;
  
  // Business Profile & Analyzed Site
  businessInfo: BusinessInfo;
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>;
  isAnalyzingSite: boolean;
  setIsAnalyzingSite: (loading: boolean) => void;
  loadSamplePreset: (presetKey: string) => Promise<void>;

  // Directive Settings (Centralized in Settings Tab)
  directiveSettings: DirectiveSettings;
  setDirectiveSettings: React.Dispatch<React.SetStateAction<DirectiveSettings>>;
  updateSocialPlatformLink: (platformKey: string, url: string, enabled?: boolean) => void;

  // Leads & Outreach
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  selectedLeadIds: string[];
  setSelectedLeadIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleLeadSelection: (id: string) => void;
  selectAllLeads: () => void;
  clearLeadSelection: () => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  
  // Cross-module campaign drafts
  attachedAsset: { type: 'brochure' | 'image' | 'video'; name: string; url?: string } | null;
  setAttachedAsset: (asset: { type: 'brochure' | 'image' | 'video'; name: string; url?: string } | null) => void;
  
  // History & Stats
  historyItems: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  stats: AppStats;
  incrementStat: (key: keyof AppStats, delta?: number) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Agent Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, attachmentName?: string) => Promise<void>;
  isAgentTyping: boolean;

  // Utility
  celebrate: () => void;
}

const defaultBusinessInfo: BusinessInfo = {
  companyName: 'AgentReach AI',
  tagline: 'Autonomous AI Marketing & B2B Customer Discovery Engine',
  industry: 'Marketing Technology & AI Automation',
  summary: 'AgentReach helps growth teams and founders autonomously find verified customer leads, draft high-converting email outreach, and create branded images, social posts, videos, and brochures in seconds.',
  valueProposition: 'Automate your customer acquisition funnel from prospect discovery to multi-channel marketing collateral without hiring an agency.',
  services: [
    'Autonomous Customer Lead Discovery',
    'High-Converting Cold Email Outreach',
    'AI Social Media Campaigns & Visuals',
    'Voiceover Commercial Video Ads',
    'Print-Ready Digital Brochures & Flyers',
  ],
  contactInfo: {
    email: 'hello@agentreach.ai',
    phone: '+1 (415) 890-3412',
    address: '548 Market St, San Francisco, CA',
    website: 'https://agentreach.ai',
    twitter: '@agentreach',
    linkedin: 'company/agentreach-ai',
    instagram: '@agentreach.growth',
  },
  targetSegments: [
    {
      name: 'High-Growth Tech Startups',
      description: 'Founders and marketing leads needing fast pipeline without $150k SDR teams.',
      matchScore: 98,
      painPoints: ['Slow outbound prospecting', 'Low email open rates', 'Creative asset bottleneck'],
    },
    {
      name: 'B2B Professional Services',
      description: 'Agencies, consultants, and firms seeking qualified executive leads.',
      matchScore: 94,
      painPoints: ['Inconsistent sales pipeline', 'Time-consuming manual research', 'Client retention'],
    },
    {
      name: 'D2C & Modern Commerce Brands',
      description: 'Need continuous stream of high-converting social posts, flyers, and ad creatives.',
      matchScore: 89,
      painPoints: ['Creative fatigue', 'Rising customer acquisition costs', 'Agency fees'],
    },
  ],
  recommendedCampaign: {
    angle: 'Autonomous Pipeline Acceleration',
    hook: 'Tired of cold outreach that sounds like generic spam templates?',
    primaryBenefit: 'Fill your calendar with 30+ qualified sales calls every month.',
  },
  brandColors: {
    primary: '#6366F1',
    accent: '#EC4899',
    secondary: '#22D3EE',
  },
};

const defaultDirectiveSettings: DirectiveSettings = {
  leads: {
    defaultOutreachTone: 'Persuasive',
    autoSendOutreach: false,
    requireLinkedInProfile: true,
    minimumFitScore: 85,
  },
  image: {
    defaultAspectRatio: '1:1',
    highResUpscale: true,
    includeWatermark: false,
  },
  post: {
    defaultTone: 'Insightful & Engaging',
    autoHashtags: true,
    autoScheduleNextBestSlot: true,
  },
  video: {
    visualEra: 'Modern world',
    autoGenerateEnabled: true,
    dailyBatchCount: 3,
    scheduleTime: 'Day',
    socialPlatforms: {
      facebook: { enabled: true, url: 'https://facebook.com/agentreach.official' },
      instagram: { enabled: true, url: 'https://instagram.com/agentreach.growth' },
      tiktok: { enabled: true, url: 'https://tiktok.com/@agentreach' },
      youtube: { enabled: true, url: 'https://youtube.com/@agentreach' },
      linkedin: { enabled: true, url: 'https://linkedin.com/company/agentreach-ai' },
      twitter: { enabled: false, url: 'https://x.com/agentreach' },
    },
  },
  brochure: {
    defaultTemplate: 'tri-fold',
    includeQrCode: true,
    highResPrintBleed: true,
  },
  apps: {
    targetPlatforms: {
      android: true,
      ios: true,
    },
    framework: 'React Native (Expo)',
    bundleId: 'com.reach.ai.app',
    googlePlayReady: true,
    appStoreReady: true,
    authMethod: 'Google OAuth & Email',
  },
  websites: {
    deploymentTarget: 'Google Cloud Run',
    seoOptimized: true,
    responsiveMode: 'desktop-first',
    enableImageOptimization: true,
    domainMapping: 'reach-website.run.app',
  },
};

const initialLeads: Lead[] = [
  {
    id: 'lead-init-1',
    name: 'Sarah Montgomery',
    role: 'VP of Growth & Revenue Operations',
    company: 'CloudForge Systems',
    email: 's.montgomery@cloudforge.io',
    linkedin: 'linkedin.com/in/sarahmontgomery-growth',
    location: 'San Francisco, CA',
    fitScore: 98,
    matchReason: 'Currently hiring outbound SDRs; actively seeking AI automation tools for prospecting.',
    suggestedAngle: 'Show how automated lead discovery cut acquisition cost by 64% for Cloud infrastructure teams.',
    status: 'New',
  },
  {
    id: 'lead-init-2',
    name: 'Marcus Sterling',
    role: 'Head of Demand Generation',
    company: 'Apex Logistics Tech',
    email: 'marcus@apexlogistics.com',
    linkedin: 'linkedin.com/in/marcussterling-demand',
    location: 'Austin, TX',
    fitScore: 94,
    matchReason: 'Recently secured Series A funding; scaling outbound marketing pipeline from scratch.',
    suggestedAngle: 'Offer a 14-day pipeline generation blueprint with zero SDR overhead.',
    status: 'New',
  },
  {
    id: 'lead-init-3',
    name: 'Elena Rostova',
    role: 'Director of Marketing Operations',
    company: 'Aura MedTech Solutions',
    email: 'e.rostova@auramedtech.com',
    linkedin: 'linkedin.com/in/elenarostova-med',
    location: 'Boston, MA',
    fitScore: 91,
    matchReason: 'Struggling with multi-channel creative production for regional clinic outreach.',
    suggestedAngle: 'Demonstrate automated social post and brochure generation tailored to healthcare compliance.',
    status: 'New',
  },
  {
    id: 'lead-init-4',
    name: 'Julian Thorne',
    role: 'Managing Partner',
    company: 'Vanguard Venture Studio',
    email: 'jthorne@vanguardvs.com',
    linkedin: 'linkedin.com/in/julianthorne-vc',
    location: 'New York, NY',
    fitScore: 89,
    matchReason: 'Oversees 18 portfolio companies looking for cost-efficient go-to-market tooling.',
    suggestedAngle: 'Pitch portfolio-wide licensing for turnkey client prospecting and creative production.',
    status: 'New',
  },
  {
    id: 'lead-init-5',
    name: 'Amara Okafor',
    role: 'Chief Commercial Officer',
    company: 'Solaris Energy Grid',
    email: 'amara.o@solarisgrid.energy',
    linkedin: 'linkedin.com/in/amaraokafor',
    location: 'Denver, CO',
    fitScore: 86,
    matchReason: 'Expanding renewable energy installations to commercial property portfolios.',
    suggestedAngle: 'Focus on high-converting B2B property manager outreach sequences.',
    status: 'New',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('studio');
  const [activeDirective, setActiveDirective] = useState<GeneratorDirective>('create-leads');
  const [activeSettingsSection, setActiveSettingsSection] = useState<GeneratorDirective | 'general'>('create-video');

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(() => {
    try {
      const saved = localStorage.getItem('reach_business_info');
      return saved ? JSON.parse(saved) : defaultBusinessInfo;
    } catch {
      return defaultBusinessInfo;
    }
  });

  const [directiveSettings, setDirectiveSettings] = useState<DirectiveSettings>(() => {
    try {
      const saved = localStorage.getItem('reach_directive_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultDirectiveSettings,
          ...parsed,
          video: {
            ...defaultDirectiveSettings.video,
            ...(parsed.video || {}),
            socialPlatforms: {
              ...defaultDirectiveSettings.video.socialPlatforms,
              ...(parsed.video?.socialPlatforms || {}),
            },
          },
        };
      }
      return defaultDirectiveSettings;
    } catch {
      return defaultDirectiveSettings;
    }
  });

  // Persist directiveSettings and businessInfo to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('reach_directive_settings', JSON.stringify(directiveSettings));
    } catch (e) {
      console.warn('Failed to persist directiveSettings', e);
    }
  }, [directiveSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('reach_business_info', JSON.stringify(businessInfo));
    } catch (e) {
      console.warn('Failed to persist businessInfo', e);
    }
  }, [businessInfo]);

  const updateSocialPlatformLink = (platformKey: string, url: string, enabled?: boolean) => {
    setDirectiveSettings((prev) => {
      const currentPlatform = (prev.video.socialPlatforms as any)[platformKey] || { enabled: true, url: '' };
      const updated = {
        ...prev,
        video: {
          ...prev.video,
          socialPlatforms: {
            ...prev.video.socialPlatforms,
            [platformKey]: {
              ...currentPlatform,
              url,
              enabled: enabled !== undefined ? enabled : currentPlatform.enabled,
            },
          },
        },
      };
      return updated;
    });
  };
  const [isAnalyzingSite, setIsAnalyzingSite] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>(['lead-init-1', 'lead-init-2']);
  
  const [attachedAsset, setAttachedAsset] = useState<{ type: 'brochure' | 'image' | 'video'; name: string; url?: string } | null>(null);

  const [stats, setStats] = useState<AppStats>({
    leadsFound: 148,
    emailsSent: 64,
    postsCreated: 29,
    assetsGenerated: 83,
    responseRate: 38.4,
  });

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: 'hist-1',
      type: 'lead_scan',
      title: 'Scanned Website: agentreach.ai',
      description: 'Discovered 5 high-intent prospective customer leads with 92% average match score.',
      timestamp: '10 minutes ago',
    },
    {
      id: 'hist-2',
      type: 'email_campaign',
      title: 'Outreach Sequence: CloudForge & Apex',
      description: 'Drafted 2 personalized emails targeting VP of Growth & Demand Gen.',
      timestamp: '25 minutes ago',
    },
    {
      id: 'hist-3',
      type: 'image',
      title: 'Created 4 Marketing Visuals',
      description: 'Futuristic 3D Gradient & Workspace Product Banners.',
      timestamp: '1 hour ago',
    },
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'agent',
      text: "Hi 👋 I'm **Reach**, your AI marketing agent. Use the top buttons to Create Leads, Images, Posts, Videos, or Brochures, or tell me what to generate right here.",
      timestamp: 'Just now',
      suggestedActions: [
        'Create Leads',
        'Create Image',
        'Create Post',
        'Create Video',
        'Create Brochure',
      ],
    },
  ]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-[#0B0B14]', 'text-[#F1F5F9]');
      document.body.classList.remove('bg-[#F8FAFC]', 'text-[#0F172A]');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-[#0B0B14]', 'text-[#F1F5F9]');
      document.body.classList.add('bg-[#F8FAFC]', 'text-[#0F172A]');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const celebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366F1', '#8B5CF6', '#EC4899', '#22D3EE'],
    });
  };

  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const incrementStat = (key: keyof AppStats, delta: number = 1) => {
    setStats((prev) => ({
      ...prev,
      [key]: key === 'responseRate' ? Number((prev.responseRate + delta).toFixed(1)) : prev[key] + delta,
    }));
  };

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `hist-${Date.now()}`,
      timestamp: 'Just now',
    };
    setHistoryItems((prev) => [newItem, ...prev]);
  };

  const toggleLeadSelection = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  const selectAllLeads = () => {
    setSelectedLeadIds(leads.map((l) => l.id));
  };

  const clearLeadSelection = () => {
    setSelectedLeadIds([]);
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  };

  const loadSamplePreset = async (presetKey: string) => {
    setIsAnalyzingSite(true);
    addToast('Loading Preset Business', `Analyzing intelligence for ${presetKey}...`, 'info');
    
    try {
      const res = await fetch('/api/analyze-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `https://${presetKey}.com`, samplePreset: presetKey }),
      });
      const data = await res.json();
      if (data && data.companyName) {
        setBusinessInfo(data);
        if (data.leads && Array.isArray(data.leads)) {
          setLeads(data.leads);
          setSelectedLeadIds(data.leads.slice(0, 3).map((l: Lead) => l.id));
        }
        incrementStat('leadsFound', data.leads?.length || 5);
        addHistoryItem({
          type: 'lead_scan',
          title: `Analyzed ${data.companyName}`,
          description: `Extracted ${data.services?.length || 4} offerings and ${data.leads?.length || 5} prospective leads.`,
        });
        addToast('Site Intelligence Ready', `Discovered prospective buyers for ${data.companyName}!`, 'success');
      }
    } catch (err) {
      console.error('Preset loading error:', err);
      addToast('Scan Notice', 'Loaded default profile successfully', 'info');
    } finally {
      setIsAnalyzingSite(false);
    }
  };

  const sendChatMessage = async (text: string, attachmentName?: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
      attachmentName,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsAgentTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          currentContext: {
            activeDirective,
            companyName: businessInfo.companyName,
            leadCount: leads.length,
          },
        }),
      });

      const data = await res.json();
      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: data.reply || "I'm ready! What marketing goal shall we tackle next?",
        timestamp: 'Just now',
        intent: data.intent,
        suggestedActions: data.suggestedActions || ['Create Leads', 'Create Image', 'Create Post', 'Create Video'],
      };
      setChatMessages((prev) => [...prev, agentMsg]);

      // Direct intent switching
      if (data.intent === 'find_customers' || data.intent === 'draft_email') {
        setActiveTab('studio');
        setActiveDirective('create-leads');
      } else if (data.intent === 'create_image') {
        setActiveTab('studio');
        setActiveDirective('create-image');
      } else if (data.intent === 'create_post') {
        setActiveTab('studio');
        setActiveDirective('create-post');
      } else if (data.intent === 'create_video') {
        setActiveTab('studio');
        setActiveDirective('create-video');
      } else if (data.intent === 'create_brochure') {
        setActiveTab('studio');
        setActiveDirective('create-brochure');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'agent',
          text: "I'm right here! You can use the top directive buttons to Create Leads, Images, Posts, Videos, or Brochures.",
          timestamp: 'Just now',
          suggestedActions: ['Create Leads', 'Create Image', 'Create Post', 'Create Video'],
        },
      ]);
    } finally {
      setIsAgentTyping(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeDirective,
        setActiveDirective,
        activeSettingsSection,
        setActiveSettingsSection,
        theme,
        toggleTheme,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isChatOpen,
        setIsChatOpen,
        toggleChat,
        businessInfo,
        setBusinessInfo,
        directiveSettings,
        setDirectiveSettings,
        updateSocialPlatformLink,
        isAnalyzingSite,
        setIsAnalyzingSite,
        loadSamplePreset,
        leads,
        setLeads,
        selectedLeadIds,
        setSelectedLeadIds,
        toggleLeadSelection,
        selectAllLeads,
        clearLeadSelection,
        updateLeadStatus,
        attachedAsset,
        setAttachedAsset,
        historyItems,
        addHistoryItem,
        stats,
        incrementStat,
        toasts,
        addToast,
        removeToast,
        chatMessages,
        sendChatMessage,
        isAgentTyping,
        celebrate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
