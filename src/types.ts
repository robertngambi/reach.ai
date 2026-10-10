export type NavTab = 
  | 'studio'
  | 'dashboard'
  | 'find-customers'
  | 'email-outreach'
  | 'create-image'
  | 'create-post'
  | 'create-video'
  | 'create-brochure'
  | 'history'
  | 'settings';

export type GeneratorDirective = 
  | 'create-leads'
  | 'create-image'
  | 'create-post'
  | 'create-video'
  | 'create-brochure'
  | 'create-apps'
  | 'create-websites'
  | 'create-books'
  | 'lets-chat';

export interface Lead {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  linkedin: string;
  location?: string;
  fitScore: number;
  matchReason: string;
  suggestedAngle: string;
  status: 'New' | 'Selected' | 'Emailed' | 'Opened' | 'Replied';
}

export interface TargetSegment {
  name: string;
  description: string;
  matchScore: number;
  painPoints: string[];
}

export interface BusinessInfo {
  companyName: string;
  tagline: string;
  industry: string;
  summary: string;
  valueProposition: string;
  services: string[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    website: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  targetSegments: TargetSegment[];
  recommendedCampaign?: {
    angle: string;
    hook: string;
    primaryBenefit: string;
  };
  brandColors: {
    primary: string;
    accent: string;
    secondary: string;
  };
}

export interface ImageAsset {
  id: string;
  url: string;
  title: string;
  badge?: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  createdAt: string;
}

export interface PostCampaign {
  id: string;
  platform: 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'tiktok';
  topic: string;
  hook: string;
  caption: string;
  hashtags: string[];
  bestTimeToPost: string;
  callToAction: string;
  imageUrl?: string;
  estimatedReachScore?: number;
  createdAt: string;
}

export interface VideoScene {
  id: number;
  timestamp: string;
  duration: number;
  title: string;
  visualDescription: string;
  voiceover: string;
  badge: string;
  gradient?: string;
  icon?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  prompt: string;
  videoType: string;
  voiceName: string;
  duration: number;
  durationLabel?: string;
  fullScript: string;
  scenes: VideoScene[];
  audioUrl?: string | null;
  musicMood: string;
  createdAt: string;
}

export interface BrochureData {
  headline: string;
  subheadline: string;
  aboutText: string;
  keyFeatures: {
    title: string;
    description: string;
    icon: string;
  }[];
  stats: {
    value: string;
    label: string;
  }[];
  specialOffer: {
    title: string;
    description: string;
    badge: string;
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
}

export interface VideoAutomationSettings {
  visualEra: 'Ancient style' | '20th century' | 'Modern world' | 'Cartoons' | 'Cyberpunk';
  autoGenerateEnabled: boolean;
  dailyBatchCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  scheduleTime: 'Day' | 'Night' | 'Both (24/7)';
  socialPlatforms: {
    facebook: { enabled: boolean; url: string };
    instagram: { enabled: boolean; url: string };
    tiktok: { enabled: boolean; url: string };
    youtube: { enabled: boolean; url: string };
    linkedin: { enabled: boolean; url: string };
    twitter: { enabled: boolean; url: string };
  };
}

export interface DirectiveSettings {
  leads: {
    defaultOutreachTone: string;
    autoSendOutreach: boolean;
    requireLinkedInProfile: boolean;
    minimumFitScore: number;
  };
  image: {
    defaultAspectRatio: string;
    highResUpscale: boolean;
    includeWatermark: boolean;
  };
  post: {
    defaultTone: string;
    autoHashtags: boolean;
    autoScheduleNextBestSlot: boolean;
  };
  video: VideoAutomationSettings;
  brochure: {
    defaultTemplate: 'tri-fold' | 'bi-fold' | 'flyer' | 'poster';
    includeQrCode: boolean;
    highResPrintBleed: boolean;
  };
  apps: {
    targetPlatforms: {
      android: boolean;
      ios: boolean;
    };
    framework: 'React Native (Expo)' | 'Flutter' | 'Capacitor PWA';
    bundleId: string;
    googlePlayReady: boolean;
    appStoreReady: boolean;
    authMethod: 'Google OAuth & Email' | 'Biometric' | 'Guest Only';
  };
  websites: {
    deploymentTarget: 'Google Cloud Run' | 'Firebase Hosting' | 'Vercel';
    seoOptimized: boolean;
    responsiveMode: 'desktop-first' | 'mobile-first';
    enableImageOptimization: boolean;
    domainMapping: string;
  };
}

export interface GeneratedFile {
  name: string;
  path: string;
  language: string;
  content: string;
  size?: string;
  status: 'queued' | 'writing' | 'completed';
}

export interface AppFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  badge?: string;
}

export interface GeneratedAppProject {
  id: string;
  name: string;
  tagline: string;
  category: string;
  prompt: string;
  previewMode: 'mobile' | 'web';
  themeColor: string;
  files: GeneratedFile[];
  features: AppFeature[];
  screens: {
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    components: string[];
  }[];
  activeScreenId: string;
  sourceCodeZipName: string;
  createdAt: string;
}

export interface GeneratedWebsiteProject {
  id: string;
  name: string;
  tagline: string;
  prompt: string;
  previewMode: 'mobile' | 'web';
  heroImage: string;
  importedImages: { id: string; url: string; label: string }[];
  themeColor: string;
  files: GeneratedFile[];
  features: AppFeature[];
  sections: {
    id: string;
    name: string;
    headline: string;
    description: string;
    ctaText?: string;
  }[];
  sourceCodeZipName: string;
  createdAt: string;
}

export interface ChapterImage {
  id: string;
  url: string;
  caption: string;
  prompt: string;
  placement: string;
}

export interface BookChapter {
  id: number;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  outline: string;
  userPromptNotes?: string;
  content?: string;
  wordCount?: number;
  isGenerated: boolean;
  status: 'pending' | 'generating' | 'completed';
  images?: ChapterImage[];
}

export type BookGenre = 'fiction' | 'non-fiction' | 'kids-books' | 'fantasy-scifi' | 'biography-memoir' | 'self-help-business' | string;

export type TextAlignment = 'left' | 'center' | 'justify' | 'right';

export type BookImageType =
  | 'cartoons'
  | 'animals'
  | 'futuristic'
  | 'modern world'
  | 'fantasy & mythical'
  | 'vintage watercolor'
  | 'cinematic photorealism';

export interface BookProject {
  id: string;
  genre: BookGenre;
  mainFocus: string;
  suggestedTitles: { title: string; subtitle: string }[];
  selectedTitle: string;
  selectedSubtitle: string;
  briefContent: string;
  step: 'ideation' | 'layout' | 'chapters';
  totalChapters: 5 | 10 | 15 | 20 | 25 | 30;
  chapters: BookChapter[];
  isComplete: boolean;
  createdAt: string;

  // Book Settings
  alignment: TextAlignment;
  enableImageGeneration: boolean;
  imagesPerChapter: 2 | 5 | 8 | 10;
  imageType: BookImageType;
}

export interface HistoryItem {
  id: string;
  type: 'lead_scan' | 'email_campaign' | 'image' | 'post' | 'video' | 'brochure' | 'app' | 'website' | 'book';
  title: string;
  description: string;
  timestamp: string;
  meta?: any;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  intent?: string;
  suggestedActions?: string[];
  attachmentName?: string;
}
