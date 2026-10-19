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
  ActivityProject,
  SettingsSectionId,
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
  activeSettingsSection: SettingsSectionId;
  setActiveSettingsSection: (section: SettingsSectionId) => void;
  
  // My Activities (History & Project Location)
  activityProjects: ActivityProject[];
  setActivityProjects: React.Dispatch<React.SetStateAction<ActivityProject[]>>;
  addActivityProject: (project: Omit<ActivityProject, 'id' | 'timestamp' | 'createdAt'>) => void;
  deleteActivityProject: (id: string) => void;
  loadActivityProjectIntoStudio: (project: ActivityProject) => void;
  
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
  books: {
    defaultGenre: 'non-fiction',
    defaultAlignment: 'justify',
    enableIllustrations: true,
    imagesPerChapter: 2,
    defaultImageType: 'cinematic photorealism',
    antiAiStrictCadence: true,
  },
  chat: {
    defaultMode: 'all',
    crossDirectiveAwareness: true,
    codeStyle: 'TypeScript / React',
    detailedArchitecture: true,
    autoSaveSolutionsToArchive: true,
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

const initialActivityProjects: ActivityProject[] = [
  // 1. Create Leads Location
  {
    id: 'act-lead-1',
    directive: 'create-leads',
    title: 'Enterprise CloudForge ICP Prospecting Scan',
    description: 'Extracted 5 verified B2B decision-makers with 95% average fit score and personalized outreach hooks.',
    prompt: 'Find high-intent VP Growth & Demand Gen leads for CloudForge Systems',
    timestamp: '15 mins ago',
    createdAt: '2026-10-12 10:05',
    status: 'Completed',
    tags: ['B2B Leads', 'Verified Emails', 'Cloud Infrastructure'],
    metrics: [{ label: 'Leads Found', value: 5 }, { label: 'Avg Fit Score', value: '95%' }],
    preview: { leadsCount: 5, statsHighlight: '95% Fit Rate' },
  },
  {
    id: 'act-lead-2',
    directive: 'create-leads',
    title: 'Aura MedTech Regional Clinic Outreach Scan',
    description: 'Discovered healthcare operations directors seeking automated patient communications.',
    prompt: 'Scan regional healthcare clinics needing operational outreach',
    timestamp: '2 hours ago',
    createdAt: '2026-10-12 08:20',
    status: 'Completed',
    tags: ['MedTech', 'Regional Outreach'],
    metrics: [{ label: 'Leads Found', value: 8 }, { label: 'Avg Fit Score', value: '91%' }],
  },
  // 2. Create Image Location
  {
    id: 'act-img-1',
    directive: 'create-image',
    title: 'Minimal Modern Vector Logo & Emblem Suite',
    description: 'Clean geometric brand mark in 1:1 aspect ratio with responsive dark/light silhouettes.',
    prompt: 'Minimal modern vector logo emblem for AI customer growth platform',
    timestamp: '40 mins ago',
    createdAt: '2026-10-12 09:40',
    status: 'Completed',
    tags: ['Logo Design', 'Vector', '1:1 Square'],
    metrics: [{ label: 'Variations', value: 4 }, { label: 'Aspect Ratio', value: '1:1' }],
    preview: {
      imageUrls: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
      ],
    },
  },
  {
    id: 'act-img-2',
    directive: 'create-image',
    title: 'High-Converting 3D Dashboard Mockups',
    description: 'Neon volumetric workspace rendering demonstrating conversion acceleration.',
    prompt: '3D Render futuristic analytics dashboard glow',
    timestamp: 'Yesterday',
    createdAt: '2026-10-11 16:30',
    status: 'Rendered',
    tags: ['3D Render', 'Product Shot'],
    metrics: [{ label: 'Resolution', value: '4K' }],
  },
  // 3. Create Post Location
  {
    id: 'act-post-1',
    directive: 'create-post',
    title: 'Multi-Channel Launch Campaign: LinkedIn & X',
    description: 'Viral hook: "Stop spending 20 hours a week finding customers manually." Multi-platform copy with optimal posting schedules.',
    prompt: 'Announcing autonomous pipeline growth engine',
    timestamp: '1 hour ago',
    createdAt: '2026-10-12 09:20',
    status: 'Published',
    tags: ['LinkedIn', 'Twitter/X', 'Viral Hook'],
    metrics: [{ label: 'Platforms', value: 'LinkedIn, X' }, { label: 'Best Time', value: 'Tue 9:15 AM' }],
    preview: { platforms: ['linkedin', 'twitter'] },
  },
  {
    id: 'act-post-2',
    directive: 'create-post',
    title: 'Instagram & TikTok Founder Case Study Reel Post',
    description: 'Visual carousel and snappy captions highlighting 10x pipeline creation in 48 hours.',
    prompt: 'Founder case study highlighting 10x pipeline creation',
    timestamp: '3 hours ago',
    createdAt: '2026-10-12 07:15',
    status: 'Completed',
    tags: ['Instagram', 'TikTok', 'Growth Story'],
    metrics: [{ label: 'Hashtags', value: '#GrowthHacking' }],
  },
  // 4. Create Video Location
  {
    id: 'act-vid-1',
    directive: 'create-video',
    title: 'Commercial Story Spotlight (3-Minute Ad)',
    description: 'Multi-scene cinematic commercial storyboard with Kore neural voice narration, synchronized audio cues, and modern corporate aesthetic.',
    prompt: 'Commercial Schematic video ad for AgentReach AI (Modern world)',
    timestamp: '25 mins ago',
    createdAt: '2026-10-12 09:55',
    status: 'Completed',
    tags: ['Commercial Spotlight', '3min', 'Modern World', 'Kore Voice'],
    metrics: [{ label: 'Duration', value: '3min (180s)' }, { label: 'Scenes', value: 5 }, { label: 'Voiceover', value: 'Kore (Neural TTS)' }],
    preview: { durationLabel: '3min', scenesCount: 5 },
  },
  {
    id: 'act-vid-2',
    directive: 'create-video',
    title: 'Rapid Explainer Video (1-Minute)',
    description: 'Dynamic explainer breakdown showing URL scanning, lead extraction, and 1-click email sequence.',
    prompt: '1-minute product explainer breakdown',
    timestamp: 'Yesterday',
    createdAt: '2026-10-11 14:10',
    status: 'Completed',
    tags: ['Explainer', '1min', 'Puck Voice'],
    metrics: [{ label: 'Duration', value: '1min' }, { label: 'Scenes', value: 3 }],
  },
  // 5. Create Brochure Location
  {
    id: 'act-brochure-1',
    directive: 'create-brochure',
    title: 'Executive Tri-Fold Brand & Services Folio',
    description: 'Print-ready marketing brochure featuring 3 service pillars, client testimonials, ROI stats, and contact QR code.',
    prompt: 'Marketing brochure for AgentReach AI customer discovery engine',
    timestamp: '50 mins ago',
    createdAt: '2026-10-12 09:30',
    status: 'Completed',
    tags: ['Tri-Fold', 'Print-Ready', 'Brand Colors', 'PDF Export'],
    metrics: [{ label: 'Format', value: 'Tri-Fold' }, { label: 'Key Pillars', value: 3 }, { label: 'Print Mode', value: 'CMYK / 300 DPI' }],
    preview: { template: 'Tri-Fold' },
  },
  {
    id: 'act-brochure-2',
    directive: 'create-brochure',
    title: 'Modern Product One-Pager & Flyer',
    description: 'Sleek bi-fold sales leave-behind with high-contrast value proposition and executive summary.',
    prompt: 'Bi-fold leave-behind sheet for enterprise pitches',
    timestamp: '2 days ago',
    createdAt: '2026-10-10 11:00',
    status: 'Completed',
    tags: ['Bi-Fold', 'Sales Collateral'],
    metrics: [{ label: 'Template', value: 'Bi-Fold' }],
  },
  // 6. Create Apps Location
  {
    id: 'act-app-1',
    directive: 'create-apps',
    title: 'AgentReach Mobile Client & Pipeline Portal',
    description: 'React Native (Expo) multi-screen app architecture targeting Android & iOS with Google OAuth, push notifications, and Stripe checkout.',
    prompt: 'Full mobile app for customer discovery and growth pipeline',
    timestamp: '30 mins ago',
    createdAt: '2026-10-12 09:50',
    status: 'Active',
    tags: ['Android', 'iOS', 'Expo', 'React Native'],
    metrics: [{ label: 'Screens', value: 4 }, { label: 'Integrations', value: 5 }, { label: 'Bundle ID', value: 'com.reach.ai.app' }],
    preview: { screensCount: 4, platforms: ['Android', 'iOS'] },
  },
  {
    id: 'act-app-2',
    directive: 'create-apps',
    title: 'LeadPulse Offline Field Companion',
    description: 'Lightweight sales field companion with SQLite caching and biometric sign-in.',
    prompt: 'Sales team field companion with offline lead sync',
    timestamp: 'Yesterday',
    createdAt: '2026-10-11 11:45',
    status: 'Completed',
    tags: ['Mobile App', 'Offline Sync'],
    metrics: [{ label: 'Screens', value: 3 }],
  },
  // 7. Create Websites Location
  {
    id: 'act-web-1',
    directive: 'create-websites',
    title: 'AgentReach Next-Gen Cloud Platform Website',
    description: 'Responsive desktop & mobile website with Hero, Feature matrix, Testimonials, Interactive Demo, and Google Cloud Run deployment config.',
    prompt: 'Modern high-converting responsive website with imported brand pictures',
    timestamp: '15 mins ago',
    createdAt: '2026-10-12 10:05',
    status: 'Published',
    tags: ['Responsive Web', 'Cloud Run', 'SEO Optimized', 'Tailwind'],
    metrics: [{ label: 'Sections', value: 5 }, { label: 'Responsive', value: 'Desktop & Mobile' }, { label: 'Deploy Target', value: 'Cloud Run' }],
    preview: { statsHighlight: 'SEO 98/100' },
  },
  {
    id: 'act-web-2',
    directive: 'create-websites',
    title: 'Growth Agency High-Converting Landing Page',
    description: 'Minimalist B2B conversion page with live lead calculator and Calendly integration.',
    prompt: 'Conversion landing page for outbound agency',
    timestamp: '2 days ago',
    createdAt: '2026-10-10 15:20',
    status: 'Completed',
    tags: ['Landing Page', 'High Conversion'],
    metrics: [{ label: 'Sections', value: 4 }],
  },
  // 8. Create Books Location
  {
    id: 'act-book-1',
    directive: 'create-books',
    title: 'The Silent Horizon: A Novel of Secret Alliances',
    description: '5-chapter ensemble narrative exploring human conscience and hidden technological thresholds. Justified typography with cinematic photorealism illustrations.',
    prompt: 'A gripping exploration of resilience, secret alliances, and breakthroughs',
    timestamp: '45 mins ago',
    createdAt: '2026-10-12 09:35',
    status: 'Active',
    tags: ['Fiction', '5 Chapters', 'Justify Alignment', 'Illustrated'],
    metrics: [{ label: 'Chapters', value: 5 }, { label: 'Genre', value: 'Fiction' }, { label: 'Illustrations', value: '2 per chapter' }],
    preview: { chaptersCount: 5, genre: 'Fiction' },
  },
  {
    id: 'act-book-2',
    directive: 'create-books',
    title: 'The Outbound Blueprint: Scalable Enterprise Growth',
    description: '10-chapter non-fiction business playbook detailing automated cold outreach systems.',
    prompt: 'Comprehensive non-fiction playbook on automated sales',
    timestamp: 'Yesterday',
    createdAt: '2026-10-11 09:00',
    status: 'Completed',
    tags: ['Non-Fiction', '10 Chapters', 'Business'],
    metrics: [{ label: 'Chapters', value: 10 }, { label: 'Genre', value: 'Business' }],
  },
  // 9. Let's Chat Location
  {
    id: 'act-chat-1',
    directive: 'lets-chat',
    title: 'Cross-Directive App Conversion: Brochure to Mobile UI',
    description: 'Synthesized brochure headlines, color scheme (#6366F1), and key features into complete React Native mobile app cover code.',
    prompt: 'from the brochure that was created in brochure directive, create an app of the same cover interface',
    timestamp: '10 mins ago',
    createdAt: '2026-10-12 10:10',
    status: 'Completed',
    tags: ['Cross-Directive', 'Code Generation', 'React Native'],
    metrics: [{ label: 'Referenced', value: 'Brochure → Apps' }, { label: 'Language', value: 'TypeScript' }],
    preview: { codePreview: 'import React from "react";\nimport { View, Text, StyleSheet } from "react-native";\n// Generated from Brochure Cover Interface...' },
  },
  {
    id: 'act-chat-2',
    directive: 'lets-chat',
    title: 'Daily Marketing Task Solutions & Timetable',
    description: 'Prioritized morning lead extraction, noon social post rollout, and afternoon video storyboard production.',
    prompt: 'Prepare our daily tasks solutions for today across all marketing directives',
    timestamp: '1 hour ago',
    createdAt: '2026-10-12 09:20',
    status: 'Completed',
    tags: ['Daily Tasks', 'Productivity', 'Directives Plan'],
    metrics: [{ label: 'Tasks Solved', value: 6 }],
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('studio');
  const [activeDirective, setActiveDirective] = useState<GeneratorDirective>('create-leads');
  const [activeSettingsSection, setActiveSettingsSection] = useState<SettingsSectionId>('create-video');

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

  // Activity Projects State (Centralized History Location per Directive)
  const [activityProjects, setActivityProjects] = useState<ActivityProject[]>(() => {
    try {
      const saved = localStorage.getItem('reach_user_activities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return initialActivityProjects;
    } catch {
      return initialActivityProjects;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('reach_user_activities', JSON.stringify(activityProjects));
    } catch (e) {
      console.warn('Failed to persist activityProjects', e);
    }
  }, [activityProjects]);

  const addActivityProject = (project: Omit<ActivityProject, 'id' | 'timestamp' | 'createdAt'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newProj: ActivityProject = {
      ...project,
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: 'Just now',
      createdAt: dateStr,
    };
    setActivityProjects((prev) => [newProj, ...prev]);
  };

  const deleteActivityProject = (id: string) => {
    setActivityProjects((prev) => prev.filter((p) => p.id !== id));
    addToast('Activity Removed', 'Deleted project from history location.', 'info');
  };

  const loadActivityProjectIntoStudio = (project: ActivityProject) => {
    setActiveDirective(project.directive);
    setActiveTab('studio');
    celebrate();
    addToast('Opened in Directive', `Loaded "${project.title}" in ${project.directive}!`, 'success');
  };

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `hist-${Date.now()}`,
      timestamp: 'Just now',
    };
    setHistoryItems((prev) => [newItem, ...prev]);

    // Map history item type to generator directive location so every generation activity goes to its generator location
    const typeToDirective: Record<string, GeneratorDirective> = {
      lead_scan: 'create-leads',
      email_campaign: 'create-leads',
      image: 'create-image',
      post: 'create-post',
      video: 'create-video',
      brochure: 'create-brochure',
      app: 'create-apps',
      website: 'create-websites',
      book: 'create-books',
      chat: 'lets-chat',
    };

    const directive = typeToDirective[item.type] || 'create-leads';
    addActivityProject({
      directive,
      title: item.title,
      description: item.description,
      status: 'Completed',
      tags: [directive.replace('create-', ''), 'Generated Activity'],
    });
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
        activityProjects,
        setActivityProjects,
        addActivityProject,
        deleteActivityProject,
        loadActivityProjectIntoStudio,
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
