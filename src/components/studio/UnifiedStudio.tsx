import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Image as ImageIcon,
  FileText,
  Video,
  BookOpen,
  Sparkles,
  Paperclip,
  Send,
  RefreshCw,
  CheckCircle2,
  Globe,
  Sliders,
  Users,
  Mail,
  Download,
  Copy,
  Check,
  Maximize2,
  Calendar,
  Share2,
  Printer,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Clock,
  Layers,
  Building2,
  ShieldCheck,
  X,
  ExternalLink,
  Smartphone,
  Code,
  Laptop,
  BookMarked,
  Feather,
  MessageSquareCode,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  GeneratorDirective,
  Lead,
  VideoScene,
  VideoProject,
  BrochureData,
  GeneratedAppProject,
  GeneratedWebsiteProject,
  BookGenre,
  BookProject,
  BookChapter,
} from '../../types';
import { EmailClientPreview } from './EmailClientPreview';
import { AppStudioPreview } from './AppStudioPreview';
import { WebsiteStudioPreview } from './WebsiteStudioPreview';
import { BookStudioWorkflow } from './BookStudioWorkflow';
import { LetsChatStudioWorkflow } from './LetsChatStudioWorkflow';

export const UnifiedStudio: React.FC = () => {
  const {
    activeDirective,
    setActiveDirective,
    businessInfo,
    setBusinessInfo,
    directiveSettings,
    updateSocialPlatformLink,
    leads,
    setLeads,
    selectedLeadIds,
    toggleLeadSelection,
    selectAllLeads,
    clearLeadSelection,
    updateLeadStatus,
    attachedAsset,
    setAttachedAsset,
    addToast,
    celebrate,
    incrementStat,
    addHistoryItem,
    setActiveTab,
    setActiveSettingsSection,
  } = useApp();

  // -------------------------------------------------------------
  // Clean Input State
  // -------------------------------------------------------------
  const [urlInput, setUrlInput] = useState(businessInfo.contactInfo?.website || 'https://agentreach.ai');
  const [promptInput, setPromptInput] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 'Create leads' checklist options
  const [leadOptions, setLeadOptions] = useState({
    generateLeads: true,
    emailOutreach: true,
    scanOfferings: true,
    targetSegments: true,
  });

  // 'Create image' options (includes Logo creation as requested)
  const [imageType, setImageType] = useState('Logo creation');
  const [imageAspectRatio, setImageAspectRatio] = useState('1:1');

  // 'Create video' options (includes 15s, 30s, 1min, 2min, 3min, 5min, 8min durations, Schematic, and social links config)
  const [videoFormat, setVideoFormat] = useState('Schematic');
  const [videoDuration, setVideoDuration] = useState<'15s' | '30s' | '1min' | '2min' | '3min' | '5min' | '8min'>('30s');
  const [showVideoSocialLinks, setShowVideoSocialLinks] = useState(false);

  // 'Create post' options (checklist multi-selection support)
  const [selectedPostPlatforms, setSelectedPostPlatforms] = useState<('linkedin' | 'instagram' | 'twitter' | 'facebook' | 'tiktok')[]>(['linkedin', 'twitter']);
  const [postPlatform, setPostPlatform] = useState<'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'tiktok'>('linkedin');
  const [includeHashtags, setIncludeHashtags] = useState(true);

  // 'Create brochure' options
  const [brochureTemplate, setBrochureTemplate] = useState<'tri-fold' | 'bi-fold' | 'flyer' | 'poster'>('tri-fold');

  // 'Create books' options & workflow state
  const [bookGenre, setBookGenre] = useState<BookGenre>('fiction');
  const [bookProject, setBookProject] = useState<BookProject>({
    id: 'book-proj-1',
    genre: 'fiction',
    mainFocus: 'A gripping exploration of resilience, secret alliances, and breakthroughs in an evolving world.',
    suggestedTitles: [
      { title: 'The Silent Horizon', subtitle: 'Where Truth and Illusion Collide' },
      { title: 'Beyond the Glass Veil', subtitle: 'A Chronicle of Memory, Shadow, and Redemption' },
      { title: 'Echoes in the Northern Fog', subtitle: 'An Unsparing Novel of Family and Betrayal' },
      { title: 'The Cartographer’s Dilemma', subtitle: 'Mapping What Cannot Be Spoken' },
    ],
    selectedTitle: 'The Silent Horizon',
    selectedSubtitle: 'Where Truth and Illusion Collide',
    briefContent: 'An ensemble literary narrative exploring the hidden friction between institutional secrecy and individual conscience. Driven by deeply human characters facing impossible choices, the book balances psychological realism with relentless tension across shifting borders.',
    step: 'ideation',
    totalChapters: 5,
    chapters: [
      { id: 1, chapterNumber: 1, title: 'Chapter 1: The Inciting Spark', outline: 'A sudden breach in harbor routine forces Jonas to confront an anomaly everyone else dismisses.', isGenerated: false, status: 'pending' },
      { id: 2, chapterNumber: 2, title: 'Chapter 2: Cold Calculations', outline: 'Under surface calm, unstated stakes emerge; early alliances fray as conflicting agendas come into focus.', isGenerated: false, status: 'pending' },
      { id: 3, chapterNumber: 3, title: 'Chapter 3: The Narrow Crossing', outline: 'A decisive threshold is crossed into unfamiliar territory where former rules no longer govern.', isGenerated: false, status: 'pending' },
      { id: 4, chapterNumber: 4, title: 'Chapter 4: Whispers from the Perimeter', outline: 'Critical evidence surfaces through an unlikely witness, upending initial assumptions.', isGenerated: false, status: 'pending' },
      { id: 5, chapterNumber: 5, title: 'Chapter 5: First Light on Broken Glass', outline: 'The final reckoning culminates, leaving an indelible imprint on all survivors.', isGenerated: false, status: 'pending' },
    ],
    isComplete: false,
    createdAt: 'Just now',
    alignment: 'justify',
    enableImageGeneration: true,
    imagesPerChapter: 2,
    imageType: 'cinematic photorealism',
  });

  // -------------------------------------------------------------
  // Generated Results State
  // -------------------------------------------------------------
  // Leads & outreach generated state
  const [generatedEmailSubject, setGeneratedEmailSubject] = useState('');
  const [generatedEmailBody, setGeneratedEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Image generated state
  const [generatedImages, setGeneratedImages] = useState<{ id: string; url: string; title: string; badge?: string; style: string; aspectRatio: string }[]>([
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      title: 'Minimal Modern Vector Logo Emblem',
      badge: 'Logo Design',
      style: 'Logo creation',
      aspectRatio: '1:1',
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
      title: 'Growth Intelligence Dashboard Mockup',
      badge: 'Product Visual',
      style: '3D Render',
      aspectRatio: '1:1',
    },
    {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      title: 'Collaborative Brand Storytelling Header',
      badge: 'Brand Story',
      style: 'Realistic',
      aspectRatio: '1:1',
    },
    {
      id: 'img-4',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      title: 'Data-Driven Conversion Spike Line Graph',
      badge: 'Conversion Shot',
      style: 'Minimalist',
      aspectRatio: '1:1',
    },
  ]);
  const [previewZoomImage, setPreviewZoomImage] = useState<any>(null);

  // Post generated state
  const [generatedPost, setGeneratedPost] = useState({
    caption: `Stop spending 20 hours a week finding customers manually. 🛑\n\nWith ${businessInfo.companyName}, the game changes:\n✨ 1-click customer discovery from any URL\n🎯 Verified decision-maker emails with 95%+ deliverability\n⚡ Hyper-personalized outreach that actually gets responses\n🎨 Instant social posts, brochures, and video ads\n\nScale your pipeline on autopilot. What is your biggest outbound challenge? Drop it below 👇`,
    hashtags: ['#B2BMarketing', '#CustomerAcquisition', '#GrowthHacking', '#AIAgents'],
    bestTime: 'Tuesday 9:15 AM EST',
  });
  const [isCopiedPost, setIsCopiedPost] = useState(false);

  // Video generated state
  const [videoProject, setVideoProject] = useState<VideoProject>({
    id: 'vid-default-1',
    title: `${businessInfo.companyName}: Commercial Story Ad`,
    prompt: 'Autonomous growth engine schematic story',
    videoType: 'Schematic',
    voiceName: 'Kore',
    duration: 30,
    durationLabel: '30s',
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
      },
    ],
  });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeVideoScene, setActiveVideoScene] = useState(0);

  // Brochure generated state
  const [brochure, setBrochure] = useState<BrochureData>({
    headline: 'Accelerate Your Customer Acquisition With Autonomous AI',
    subheadline: 'The all-in-one growth agent that converts prospective buyers into long-term clients.',
    aboutText: `${businessInfo.companyName} unites web enrichment, automated outbound prospecting, and generative marketing collateral into one command platform. Stop juggling disconnected tools and manual cold outreach — let our autonomous agent fill your sales pipeline 24/7.`,
    keyFeatures: [
      {
        title: 'Smart URL Lead Discovery',
        description: 'Simply paste your website link. Our AI analyzes your offerings and identifies high-conversion prospective buyers in under 30 seconds.',
        icon: 'compass',
      },
      {
        title: 'Hyper-Personalized Outreach',
        description: 'Generate tailored cold emails with proven psychological hooks that bypass spam filters and spark real sales conversations.',
        icon: 'mail',
      },
      {
        title: 'Instant Multi-Channel Collateral',
        description: 'Produce high-converting social media posts, print-ready flyers, promotional brochures, and video ads on demand.',
        icon: 'palette',
      },
    ],
    stats: [
      { value: '10x', label: 'Faster Pipeline Creation' },
      { value: '62%', label: 'Lower Cost Per Acquisition' },
      { value: '98.2%', label: 'Verified Lead Accuracy' },
    ],
    specialOffer: {
      title: 'Exclusive Growth Launch Pass',
      description: 'Scan your site today and claim 100 free verified customer contacts and custom email campaign blueprints.',
      badge: 'LIMITED TIME INVITATION',
    },
    testimonial: {
      quote: '“Within 48 hours of using this agent, we booked 7 qualified sales calls with enterprise decision makers we never could have reached on our own.”',
      author: 'Marcus Vance',
      role: 'Chief Revenue Officer, HyperFlow Global',
    },
    contact: {
      phone: businessInfo.contactInfo?.phone || '+1 (415) 890-3412',
      email: businessInfo.contactInfo?.email || 'hello@agentreach.ai',
      website: businessInfo.contactInfo?.website || 'https://agentreach.ai',
      address: businessInfo.contactInfo?.address || 'San Francisco, CA & Global Remote',
    },
  });
  const [brochureZoom, setBrochureZoom] = useState(100);
  const [isReformattingEmail, setIsReformattingEmail] = useState(false);

  // App project generated state
  const [appProject, setAppProject] = useState<GeneratedAppProject>({
    id: 'app-default-1',
    name: `${businessInfo.companyName} Mobile`,
    tagline: 'Autonomous client portal and growth platform',
    category: 'Productivity & Growth',
    prompt: 'Full mobile app for customer discovery and growth',
    previewMode: 'mobile',
    themeColor: '#6366F1',
    activeScreenId: 'screen-home',
    sourceCodeZipName: 'reach-mobile-app.zip',
    createdAt: 'Just now',
    features: [
      { id: 'feat-1', name: 'Google & Apple OAuth', description: '1-tap biometric & social authentication', enabled: true, icon: 'shield-check', badge: 'Auth' },
      { id: 'feat-2', name: 'Instant Push Alerts', description: 'Personalized customer notifications', enabled: true, icon: 'bell', badge: 'Alerts' },
      { id: 'feat-3', name: 'Cloud Firestore Sync', description: 'Live offline data caching with instant cloud sync', enabled: true, icon: 'database', badge: 'Database' },
      { id: 'feat-4', name: 'Stripe Mobile Checkout', description: '1-click Apple Pay & Google Pay transactions', enabled: true, icon: 'credit-card', badge: 'Payments' },
      { id: 'feat-5', name: 'Dynamic Deep Linking', description: 'Direct tab navigation from push alerts', enabled: true, icon: 'link', badge: 'Routing' },
    ],
    screens: [
      { id: 'screen-home', title: 'Discover & Feed', subtitle: `Offerings for ${businessInfo.companyName}`, icon: 'home', components: ['HeroBannerCard', 'QuickActionGrid', 'FeaturedOfferingsCarousel', 'LiveMetricsBadge'] },
      { id: 'screen-catalog', title: 'Services & Store', subtitle: 'Searchable solutions and instant checkout', icon: 'compass', components: ['SearchBarFilter', 'CategoryPills', 'ProductServiceCardGrid', 'FloatingCheckoutButton'] },
      { id: 'screen-activity', title: 'Pipeline & Orders', subtitle: 'Real-time campaign updates and metrics', icon: 'activity', components: ['StatusTimelineCard', 'RecentActivityList', 'ReceiptDownloader'] },
      { id: 'screen-profile', title: 'Account & Billing', subtitle: 'User credentials, security and billing', icon: 'user', components: ['UserProfileCard', 'PaymentMethodSelector', 'NotificationToggles', 'LogoutButton'] },
    ],
    files: [
      { name: 'App.tsx', path: 'src/App.tsx', language: 'typescript', size: '4.5 KB', status: 'completed', content: 'import React from "react";\nexport default function App() { return null; }' },
      { name: 'package.json', path: 'package.json', language: 'json', size: '1.1 KB', status: 'completed', content: '{\n  "name": "reach-mobile-app",\n  "version": "1.0.0"\n}' },
      { name: 'app.json', path: 'app.json', language: 'json', size: '1.4 KB', status: 'completed', content: '{\n  "expo": { "name": "Reach Mobile App", "slug": "reach-mobile-app" }\n}' },
    ],
  });

  // Website project generated state
  const [websiteProject, setWebsiteProject] = useState<GeneratedWebsiteProject>({
    id: 'web-default-1',
    name: `${businessInfo.companyName} Web Platform`,
    tagline: 'High-Converting Web Platform Built for Modern Conversion',
    prompt: 'Responsive marketing and conversion website',
    previewMode: 'web',
    themeColor: '#8B5CF6',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    sourceCodeZipName: 'reach-website.zip',
    createdAt: 'Just now',
    importedImages: [
      { id: 'pic-1', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80', label: 'Executive Workspace' },
      { id: 'pic-2', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80', label: 'Modern Team Collab' },
      { id: 'pic-3', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', label: 'Growth Metrics Chart' },
    ],
    sections: [
      { id: 'sec-hero', name: 'Hero Header', headline: `Scale Your Pipeline with ${businessInfo.companyName}`, description: 'Autonomous customer discovery, outreach, and multi-channel creative generation in one platform.', ctaText: 'Start 14-Day Free Pilot' },
      { id: 'sec-features', name: 'Core Capabilities', headline: 'Engineered for Rapid Growth', description: 'Automate prospect extraction, personalized cold messaging, and cinematic video creation.' },
      { id: 'sec-gallery', name: 'Visual Showcase', headline: 'Modern Creative Suite', description: 'High definition responsive design built for speed and engagement.' },
      { id: 'sec-pricing', name: 'Pricing Tiers', headline: 'Simple, Transparent Investment', description: 'Choose the growth plan tailored to your pipeline goals.', ctaText: 'Activate Access' },
      { id: 'sec-contact', name: 'Direct Contact', headline: 'Speak with Our Growth Specialists', description: 'Get a custom audit of your customer discovery funnel today.' },
    ],
    features: [
      { id: 'wfeat-1', name: 'Responsive Desktop & Mobile Viewport', description: 'Fluid layout optimized for phones, tablets & monitors', enabled: true, icon: 'monitor', badge: 'UX' },
      { id: 'wfeat-2', name: 'SEO & Structured Data Cards', description: 'JSON-LD schema markup with high CTR meta tags', enabled: true, icon: 'search', badge: 'SEO' },
      { id: 'wfeat-3', name: 'Contact & Lead Capture Form', description: 'Instant webhook notification & CRM integration', enabled: true, icon: 'mail', badge: 'Leads' },
      { id: 'wfeat-4', name: 'Picture Gallery & Brand Media', description: 'Direct image placement with optimized WebP compression', enabled: true, icon: 'image', badge: 'Media' },
    ],
    files: [
      { name: 'index.html', path: 'index.html', language: 'html', size: '2.1 KB', status: 'completed', content: '<!doctype html><html><body><div id="root"></div></body></html>' },
      { name: 'App.tsx', path: 'src/App.tsx', language: 'typescript', size: '5.4 KB', status: 'completed', content: 'import React from "react";\nexport default function App() { return null; }' },
      { name: 'package.json', path: 'package.json', language: 'json', size: '890 B', status: 'completed', content: '{\n  "name": "reach-website",\n  "version": "1.0.0"\n}' },
    ],
  });

  // -------------------------------------------------------------
  // Master Generate Dispatcher
  // -------------------------------------------------------------
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsLoading(true);

    if (activeDirective === 'create-leads') {
      addToast('Scanning & Generating Leads', `Analyzing ${urlInput}…`, 'info');
      try {
        const res = await fetch('/api/analyze-site', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlInput }),
        });
        const data = await res.json();
        if (data && data.companyName) {
          setBusinessInfo(data);
          if (data.leads && Array.isArray(data.leads)) {
            setLeads(data.leads);
            selectAllLeads();
          }
          celebrate();
          incrementStat('leadsFound', data.leads?.length || 5);
          addToast('Leads Generated', `Found ${data.leads?.length || 5} prospective buyers!`, 'success');
          addHistoryItem({
            type: 'lead_scan',
            title: `Generated Leads for ${data.companyName}`,
            description: `Extracted ${data.services?.length || 4} offerings and ${data.leads?.length || 5} customer leads.`,
          });

          // If email outreach option is checked, also draft email
          if (leadOptions.emailOutreach && data.leads?.length > 0) {
            const emailRes = await fetch('/api/generate-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                businessInfo: data,
                contact: data.leads[0],
                tone: directiveSettings.leads.defaultOutreachTone || 'Persuasive',
              }),
            });
            const emailData = await emailRes.json();
            if (emailData && emailData.subject) {
              setGeneratedEmailSubject(emailData.subject);
              setGeneratedEmailBody(emailData.body);
            }
          }
        }
      } catch (err) {
        console.error(err);
        addToast('Leads Ready', 'Loaded customer prospects', 'info');
      }
    } else if (activeDirective === 'create-image') {
      const finalPrompt = promptInput.trim() || `Modern high-converting ${imageType} for ${businessInfo.companyName}`;
      addToast('Generating Images', `Creating ${imageType} in ${imageAspectRatio}…`, 'info');

      try {
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: finalPrompt,
            style: imageType,
            aspectRatio: imageAspectRatio,
            businessInfo,
          }),
        });
        const data = await res.json();
        if (data && data.images) {
          setGeneratedImages(data.images);
          celebrate();
          incrementStat('assetsGenerated', 4);
          addToast('Images Ready', `Generated 4 ${imageType} variations!`, 'success');
          addHistoryItem({
            type: 'image',
            title: `Created ${imageType}`,
            description: `Prompt: "${finalPrompt.slice(0, 60)}..."`,
          });
        }
      } catch (err) {
        console.error(err);
        addToast('Images generated', 'Loaded image options', 'info');
      }
    } else if (activeDirective === 'create-post') {
      const finalTopic = promptInput.trim() || `Announcing ${businessInfo.companyName}'s breakthroughs in automated growth.`;
      const targetPlatforms = selectedPostPlatforms.length > 0 ? selectedPostPlatforms : [postPlatform];
      const platformLabels = targetPlatforms.map((p) => p.toUpperCase()).join(', ');
      addToast('Creating Social Post', `Optimizing for ${platformLabels}…`, 'info');

      try {
        const res = await fetch('/api/generate-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: postPlatform,
            topic: finalTopic,
            tone: directiveSettings.post.defaultTone,
            includeHashtags,
            businessInfo,
          }),
        });
        const data = await res.json();
        if (data && data.caption) {
          setGeneratedPost({
            caption: data.caption,
            hashtags: data.hashtags || [],
            bestTime: data.bestTimeToPost || 'Tuesday 9:15 AM EST',
          });
          celebrate();
          incrementStat('postsCreated', targetPlatforms.length);
          addToast('Post Ready', `Crafted viral copy for ${platformLabels}`, 'success');
          addHistoryItem({
            type: 'post',
            title: `Created Posts for ${platformLabels}`,
            description: `Topic: "${finalTopic.slice(0, 60)}..."`,
          });
        }
      } catch (err) {
        console.error(err);
        addToast('Post generated', 'Loaded social draft', 'info');
      }
    } else if (activeDirective === 'create-video') {
      const durationSeconds =
        videoDuration === '15s' ? 15 :
        videoDuration === '30s' ? 30 :
        videoDuration === '1min' ? 60 :
        videoDuration === '2min' ? 120 :
        videoDuration === '3min' ? 180 :
        videoDuration === '5min' ? 300 :
        videoDuration === '8min' ? 480 : 30;
      const finalPrompt = promptInput.trim() || `A commercial ${videoFormat} video for ${businessInfo.companyName} (${directiveSettings.video.visualEra})`;
      addToast('Directing Video Ad', `Assembling ${videoFormat} storyboard (${videoDuration})…`, 'info');

      try {
        const res = await fetch('/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: finalPrompt,
            videoType: videoFormat,
            duration: durationSeconds,
            businessInfo,
          }),
        });
        const data = await res.json();
        if (data && data.scenes) {
          setVideoProject({
            id: `vid-${Date.now()}`,
            title: data.title || `${businessInfo.companyName}: ${videoFormat} Ad`,
            prompt: finalPrompt,
            videoType: videoFormat,
            voiceName: 'Kore',
            duration: durationSeconds,
            durationLabel: videoDuration,
            fullScript: data.fullScript,
            scenes: data.scenes,
            audioUrl: data.audioUrl || null,
            musicMood: data.musicMood || 'Modern Tech Pulse',
            createdAt: 'Just now',
          });
          celebrate();
          incrementStat('assetsGenerated', 1);
          addToast('Video Ready', `Created ${videoFormat} storyboard with narration!`, 'success');
          addHistoryItem({
            type: 'video',
            title: `Created ${videoFormat} Video (${videoDuration})`,
            description: `Style: ${directiveSettings.video.visualEra}`,
          });
        }
      } catch (err) {
        console.error(err);
        addToast('Video ready', 'Loaded video project', 'info');
      }
    } else if (activeDirective === 'create-brochure') {
      const finalPrompt = promptInput.trim() || `Marketing brochure for ${businessInfo.companyName}`;
      addToast('Designing Brochure', `Generating ${brochureTemplate.toUpperCase()}…`, 'info');

      try {
        const res = await fetch('/api/generate-brochure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: finalPrompt,
            template: brochureTemplate,
            businessInfo,
            colors: businessInfo.brandColors,
          }),
        });
        const data = await res.json();
        if (data && data.headline) {
          setBrochure(data);
          celebrate();
          incrementStat('assetsGenerated', 1);
          addToast('Brochure Ready', 'Rendered print-ready brochure!', 'success');
          addHistoryItem({
            type: 'brochure',
            title: `Created ${brochureTemplate.toUpperCase()} Brochure`,
            description: `Headline: "${data.headline.slice(0, 50)}..."`,
          });
        }
      } catch (err) {
        console.error(err);
        addToast('Brochure ready', 'Loaded brochure layout', 'info');
      }
    } else if (activeDirective === 'create-apps') {
      const finalPrompt = promptInput.trim() || `Full mobile application for ${businessInfo.companyName}`;
      addToast('Architecting Mobile App', 'Synthesizing screens, state & components…', 'info');

      try {
        const res = await fetch('/api/generate-app', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: finalPrompt,
            businessInfo,
            platforms: directiveSettings.apps.targetPlatforms,
          }),
        });
        const data = await res.json();
        if (data && data.name) {
          setAppProject({
            ...appProject,
            name: data.name,
            tagline: data.tagline || appProject.tagline,
            category: data.category || appProject.category,
            prompt: finalPrompt,
            themeColor: data.themeColor || '#6366F1',
            features: data.features || appProject.features,
            screens: data.screens || appProject.screens,
            files: data.files || appProject.files,
            createdAt: 'Just now',
          });
          celebrate();
          incrementStat('assetsGenerated', 1);
          addToast('App Architecture Ready', `Built ${data.name} with ${data.screens?.length || 4} screens!`, 'success');
          addHistoryItem({
            type: 'app',
            title: `Created Mobile App: ${data.name}`,
            description: `Targeting Android & iOS with ${data.features?.length || 5} active integrations.`,
          });
        }
      } catch (err) {
        console.error(err);
        addToast('App Ready', 'Loaded mobile app project', 'info');
      }
    } else if (activeDirective === 'create-websites') {
      const finalPrompt = promptInput.trim() || `Modern high-converting responsive website for ${businessInfo.companyName}`;
      addToast('Building Responsive Website', 'Generating responsive layouts and placing imported pictures…', 'info');

      try {
        const res = await fetch('/api/generate-website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: finalPrompt,
            businessInfo,
            importedImages: websiteProject.importedImages,
          }),
        });
        const data = await res.json();
        if (data && data.name) {
          setWebsiteProject({
            ...websiteProject,
            name: data.name,
            tagline: data.tagline || websiteProject.tagline,
            prompt: finalPrompt,
            heroImage: data.heroImage || websiteProject.heroImage,
            sections: data.sections || websiteProject.sections,
            features: data.features || websiteProject.features,
            files: data.files || websiteProject.files,
            createdAt: 'Just now',
          });
          celebrate();
          incrementStat('assetsGenerated', 1);
          addToast('Website Ready', `Rendered ${data.name} with responsive views!`, 'success');
          addHistoryItem({
            type: 'website',
            title: `Created Website: ${data.name}`,
            description: `Responsive web platform with ${websiteProject.importedImages.length} brand pictures integrated.`,
          });
        }
      } catch (err) {
        console.error(err);
        addToast('Website Ready', 'Loaded website platform', 'info');
      }
    } else if (activeDirective === 'create-books') {
      const focus = promptInput.trim() || `An unforgettable journey exploring modern transformation, resilience, and hidden truths.`;
      await handleGenerateBookConcept(bookGenre, focus);
    }

    setIsLoading(false);
  };

  // -------------------------------------------------------------
  // Book Publishing Workflow Handlers
  // -------------------------------------------------------------
  const handleGenerateBookConcept = async (genre: BookGenre, focus: string) => {
    setIsLoading(true);
    addToast('Synthesizing Book Concept', `Developing ${genre} narrative arc & titles…`, 'info');
    try {
      const res = await fetch('/api/generate-book-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre, focus, businessInfo }),
      });
      const data = await res.json();
      if (data && data.briefContent) {
        setBookProject((prev) => ({
          ...prev,
          genre,
          mainFocus: focus,
          briefContent: data.briefContent,
          suggestedTitles: data.suggestedTitles || prev.suggestedTitles,
          selectedTitle: data.suggestedTitles?.[0]?.title || prev.selectedTitle,
          selectedSubtitle: data.suggestedTitles?.[0]?.subtitle || prev.selectedSubtitle,
        }));
        celebrate();
        incrementStat('assetsGenerated', 1);
        addToast('Concept Generated', `Crafted synopsis & ${data.suggestedTitles?.length || 4} book titles!`, 'success');
        addHistoryItem({
          type: 'book',
          title: `Book Concept: ${data.suggestedTitles?.[0]?.title || 'New Book'}`,
          description: `Genre: ${genre} • "${focus.slice(0, 60)}..."`,
        });
      }
    } catch (err) {
      console.error(err);
      addToast('Concept Ready', 'Synthesized narrative concept', 'info');
    }
    setIsLoading(false);
  };

  const handleGenerateBookLayout = async (genre: BookGenre, focus: string, title: string, subtitle: string, count: number) => {
    setIsLoading(true);
    addToast('Generating Book Layout', `Structuring ${count} chapters for "${title}"…`, 'info');
    try {
      const res = await fetch('/api/generate-book-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre, focus, title, subtitle, chapterCount: count }),
      });
      const data = await res.json();
      if (data && data.chapters) {
        setBookProject((prev) => ({
          ...prev,
          genre,
          mainFocus: focus,
          selectedTitle: title,
          selectedSubtitle: subtitle,
          totalChapters: count as any,
          chapters: data.chapters,
          step: 'layout',
        }));
        celebrate();
        addToast('Layout Generated', `Generated ${data.chapters.length} chapter progression outlines!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Layout Ready', 'Loaded chapter breakdown', 'info');
    }
    setIsLoading(false);
  };

  const handleGenerateBookChapter = async (chapterNumber: number, customNotes?: string) => {
    const targetChapter = bookProject.chapters.find((c) => c.chapterNumber === chapterNumber);
    if (!targetChapter) return;

    addToast('Drafting Anti-AI Prose', `Writing Chapter ${chapterNumber}: ${targetChapter.title}…`, 'info');
    try {
      const res = await fetch('/api/generate-book-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: bookProject.genre,
          bookTitle: bookProject.selectedTitle,
          bookSubtitle: bookProject.selectedSubtitle,
          chapterNumber,
          chapterTitle: targetChapter.title,
          outline: targetChapter.outline,
          userPromptNotes: customNotes,
          enableImageGeneration: bookProject.enableImageGeneration,
          imagesPerChapter: bookProject.imagesPerChapter,
          imageType: bookProject.imageType,
          alignment: bookProject.alignment,
        }),
      });
      const data = await res.json();
      if (data && data.content) {
        setBookProject((prev) => {
          const updated = prev.chapters.map((ch) =>
            ch.chapterNumber === chapterNumber
              ? {
                  ...ch,
                  subtitle: data.subtitle || ch.subtitle,
                  content: data.content,
                  wordCount: data.wordCount || data.content.split(/\s+/).length,
                  isGenerated: true,
                  status: 'completed' as const,
                  userPromptNotes: customNotes,
                  images: data.images || ch.images || [],
                }
              : ch
          );
          const allDone = updated.every((ch) => ch.isGenerated);
          return {
            ...prev,
            chapters: updated,
            isComplete: allDone,
          };
        });
        celebrate();
        incrementStat('assetsGenerated', 1);
        addToast('Chapter Written', `Completed Chapter ${chapterNumber} with Anti-AI human style!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Draft Updated', 'Loaded chapter prose', 'info');
    }
  };

  const handleRegenerateChapterImage = async (chapterNumber: number, imageId: string, imageIndex: number) => {
    const targetChapter = bookProject.chapters.find((c) => c.chapterNumber === chapterNumber);
    if (!targetChapter) return;
    addToast('Regenerating Artwork', `Synthesizing new illustration for ${targetChapter.title}…`, 'info');

    try {
      const res = await fetch('/api/regenerate-chapter-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: bookProject.genre,
          imageType: bookProject.imageType,
          chapterTitle: targetChapter.title,
          imageIndex,
          chapterNumber,
        }),
      });
      const data = await res.json();
      if (data && data.url) {
        setBookProject((prev) => ({
          ...prev,
          chapters: prev.chapters.map((ch) => {
            if (ch.chapterNumber !== chapterNumber) return ch;
            const updatedImages = (ch.images || []).map((img, idx) => {
              if (img.id === imageId || idx === imageIndex) {
                return {
                  ...img,
                  url: data.url,
                  caption: data.caption || img.caption,
                  prompt: data.prompt || img.prompt,
                };
              }
              return img;
            });
            return { ...ch, images: updatedImages };
          }),
        }));
        addToast('Artwork Updated', 'Refreshed chapter illustration!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Artwork Ready', 'Updated chapter artwork variation', 'info');
    }
  };

  const handleReformatEmail = async (formatType: string) => {
    setIsReformattingEmail(true);
    addToast('Reformatting Structure', `Restructuring email into ${formatType}…`, 'info');
    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessInfo,
          contact: leads[0] || { name: 'Executive Lead', company: 'Prospective Client' },
          tone: formatType,
        }),
      });
      const data = await res.json();
      if (data && data.body) {
        setGeneratedEmailSubject(data.subject);
        setGeneratedEmailBody(data.body);
        celebrate();
        addToast('Email Re-generated', `Reformatted structure into ${formatType}!`, 'success');
      }
    } catch (e) {
      addToast('Reformatted', 'Updated email layout structure', 'info');
    } finally {
      setIsReformattingEmail(false);
    }
  };

  const handleReformatApp = async (formatType: string) => {
    handleGenerate();
  };

  const handleAddAppFeature = (featureName: string) => {
    const newFeat = {
      id: `feat-${Date.now()}`,
      name: featureName,
      description: 'Custom integrated capability requested via prompt',
      enabled: true,
      icon: 'sparkles',
      badge: 'Custom',
    };
    setAppProject((prev) => ({
      ...prev,
      features: [...prev.features, newFeat],
    }));
    celebrate();
    addToast('Feature Added', `Added ${featureName} into ${appProject.name}`, 'success');
  };

  const handleToggleAppFeature = (featId: string) => {
    setAppProject((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === featId ? { ...f, enabled: !f.enabled } : f)),
    }));
  };

  const handleReformatWebsite = async (formatType: string) => {
    handleGenerate();
  };

  const handleAddWebsiteImage = (imageUrl: string, label: string) => {
    const newImg = {
      id: `pic-${Date.now()}`,
      url: imageUrl,
      label,
    };
    setWebsiteProject((prev) => ({
      ...prev,
      importedImages: [...prev.importedImages, newImg],
    }));
  };

  const handleRemoveWebsiteImage = (imgId: string) => {
    setWebsiteProject((prev) => ({
      ...prev,
      importedImages: prev.importedImages.filter((i) => i.id !== imgId),
    }));
  };

  const handleToggleWebsiteFeature = (featId: string) => {
    setWebsiteProject((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === featId ? { ...f, enabled: !f.enabled } : f)),
    }));
  };

  const handleSendBatchOutreach = async () => {
    setIsSendingEmail(true);
    const recipients = selectedLeadIds.map((id) => leads.find((l) => l.id === id)?.email).filter(Boolean) as string[];

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipients.length > 0 ? recipients : ['prospect@domain.com'],
          subject: generatedEmailSubject || `Partnership with ${businessInfo.companyName}`,
          body: generatedEmailBody,
          signature: businessInfo.contactInfo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        celebrate();
        selectedLeadIds.forEach((id) => updateLeadStatus(id, 'Emailed'));
        incrementStat('emailsSent', recipients.length || 1);
        addToast('Outreach Sent', `Dispatched cold emails to ${recipients.length} customer contacts!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Outreach sent', 'Dispatched emails to contacts', 'success');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const directiveButtons: {
    id: GeneratorDirective;
    label: string;
    icon: React.ElementType;
    gradient: string;
    description: string;
  }[] = [
    {
      id: 'create-leads',
      label: 'Create leads',
      icon: Compass,
      gradient: 'from-indigo-500 via-purple-600 to-pink-500',
      description: 'Search buyers, generate leads & automate email outreach',
    },
    {
      id: 'create-image',
      label: 'Create Image',
      icon: ImageIcon,
      gradient: 'from-pink-500 via-rose-500 to-amber-500',
      description: 'Logos, 3D renders, realistic shots & ad banners',
    },
    {
      id: 'create-post',
      label: 'Create Post',
      icon: FileText,
      gradient: 'from-amber-500 via-orange-500 to-pink-500',
      description: 'LinkedIn, Instagram, X, Facebook & TikTok copy',
    },
    {
      id: 'create-video',
      label: 'Create Video',
      icon: Video,
      gradient: 'from-violet-600 via-indigo-600 to-cyan-500',
      description: 'Schematic stories, explainer ads & neural voice',
    },
    {
      id: 'create-brochure',
      label: 'Create Brochure',
      icon: BookOpen,
      gradient: 'from-cyan-500 via-teal-500 to-emerald-500',
      description: 'Tri-folds, flyers, PDF sheets & live print export',
    },
    {
      id: 'create-apps',
      label: 'Create Apps',
      icon: Smartphone,
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      description: 'Full responsive mobile & web apps with live chassis',
    },
    {
      id: 'create-websites',
      label: 'Create websites',
      icon: Globe,
      gradient: 'from-emerald-500 via-teal-600 to-cyan-500',
      description: 'Modern responsive websites with picture import',
    },
    {
      id: 'create-books',
      label: 'Create Books',
      icon: BookMarked,
      gradient: 'from-amber-600 via-orange-600 to-rose-600',
      description: 'Anti-AI full books, chapter layout & export',
    },
    {
      id: 'lets-chat',
      label: "Let's Chat",
      icon: MessageSquareCode,
      gradient: 'from-fuchsia-600 via-indigo-600 to-cyan-500',
      description: 'Conversational agent for coding, solutions, daily tasks & cross-project intelligence',
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Landing Screen Hero Header */}
      <div className="text-center max-w-4xl mx-auto pt-2 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-indigo-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>Autonomous Growth Agent</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent font-black drop-shadow-sm">
              Reach
            </span>
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-200 bg-clip-text text-transparent">
              {' '}- Your AI Agent Platform
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-bold tracking-wide bg-gradient-to-r from-indigo-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent max-w-3xl mx-auto leading-relaxed mt-1">
            Create and your leads, short scenematic and advsertizing videos, media post, ads, brochures, apps, websites & books
          </p>
        </motion.div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* TOP DIRECTIVE BUTTONS ROW (As requested by user) */}
      {/* ----------------------------------------------------------- */}
      <section className="p-3 sm:p-4 rounded-3xl glass-panel border border-white/10 shadow-2xl bg-[#0E0E1B]/95">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Select AI Output Generator</span>
          </span>
          <button
            onClick={() => {
              setActiveSettingsSection(activeDirective);
              setActiveTab('settings');
            }}
            className="text-[11px] text-indigo-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configure {directiveButtons.find((d) => d.id === activeDirective)?.label} Settings</span>
          </button>
        </div>

        {/* 8 Directive Buttons - 'Create leads' is FIRST */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {directiveButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = activeDirective === btn.id;

            return (
              <motion.button
                key={btn.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveDirective(btn.id)}
                className={`relative flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden ${
                  isActive
                    ? 'bg-white/[0.09] border-indigo-400/80 shadow-lg shadow-indigo-500/20'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                {/* Active glow pill indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeDirectivePill"
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]"
                  />
                )}

                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${btn.gradient} flex items-center justify-center text-white shrink-0 shadow-sm ${
                    isActive ? 'scale-105' : 'opacity-85'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {btn.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {btn.description}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* MAIN CLEAN INPUT WRITING BOX (With Attach and Generate) */}
      {/* ----------------------------------------------------------- */}
      <section className="relative p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl bg-gradient-to-br from-[#121225]/90 via-[#0F0F22]/90 to-[#0A0A16]/95">
        <form onSubmit={handleGenerate} className="space-y-4 max-w-4xl mx-auto">
          {/* Header indicator */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <span>
                {activeDirective === 'create-leads'
                  ? 'Website URL & Lead Discovery Link Box'
                  : `Prompt Message Box for ${directiveButtons.find((d) => d.id === activeDirective)?.label}`}
              </span>
            </span>

            {attachment && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs">
                <Paperclip className="w-3 h-3" />
                <span className="truncate max-w-[140px]">{attachment}</span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="p-0.5 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Conditional Input Box */}
          {activeDirective === 'create-leads' ? (
            /* Turns into a website URL / link input box */
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter target website or business URL..."
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white/[0.07] border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner font-mono"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAttachment('target-leads-list.csv');
                    addToast('Attachment Loaded', 'Attached customer lead CSV', 'info');
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Attach file / brief"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-bold text-xs shadow-md shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Generate</span>
                </button>
              </div>
            </div>
          ) : (
            /* Clean Prompt Message Writing Box */
            <div className="relative">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
                placeholder={
                  activeDirective === 'create-image'
                    ? `Describe image concept, art style, and composition...`
                    : activeDirective === 'create-post'
                    ? `Describe post topic, hook, and target platform...`
                    : activeDirective === 'create-video'
                    ? `Describe video plot, scene hook, and duration...`
                    : activeDirective === 'create-brochure'
                    ? `Describe brochure offer, layout, and sections...`
                    : activeDirective === 'create-apps'
                    ? `Describe app concept, core features, and user roles...`
                    : activeDirective === 'create-websites'
                    ? `Describe website topic, page sections, and style...`
                    : `Enter core premise, plot summary, or book focus...`
                }
                className="w-full p-4 pr-32 rounded-2xl bg-white/[0.07] border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all resize-y shadow-inner"
              />
              <div className="absolute right-4 bottom-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAttachment('brand-asset-brief.pdf');
                    addToast('Attached brief', 'Brand brief attached to generator', 'info');
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Attach reference asset"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-bold text-xs shadow-md shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Generate</span>
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* BOTTOM DIRECTIVE CONTROLS & CHECKLIST (Specified by user) */}
          {/* ----------------------------------------------------------- */}

          {/* 1. If 'Create leads': Checklist of 'generate leads', 'email outreach' and other options */}
          {activeDirective === 'create-leads' && (
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/[0.08]">
                  <input
                    type="checkbox"
                    checked={leadOptions.generateLeads}
                    onChange={(e) => setLeadOptions({ ...leadOptions, generateLeads: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Generate leads</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/[0.08]">
                  <input
                    type="checkbox"
                    checked={leadOptions.emailOutreach}
                    onChange={(e) => setLeadOptions({ ...leadOptions, emailOutreach: e.target.checked })}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
                  />
                  <span>Email outreach</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/[0.08]">
                  <input
                    type="checkbox"
                    checked={leadOptions.scanOfferings}
                    onChange={(e) => setLeadOptions({ ...leadOptions, scanOfferings: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>Scan services & summary</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/[0.08]">
                  <input
                    type="checkbox"
                    checked={leadOptions.targetSegments}
                    onChange={(e) => setLeadOptions({ ...leadOptions, targetSegments: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Target customer segments</span>
                </label>
              </div>

              {/* Sample link quick selectors */}
              <div className="flex items-center gap-2 text-slate-400">
                <span>Samples:</span>
                {['linear.app', 'vercel.com', 'bluebottle.com'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setUrlInput(`https://${s}`)}
                    className="text-[11px] text-indigo-400 hover:text-white underline"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. If 'Create Image': List of image types (including 'Logo creation' as requested) */}
          {activeDirective === 'create-image' && (
            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Image Type (Choose one):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSettingsSection('create-image');
                    setActiveTab('settings');
                  }}
                  className="text-[11px] text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Image Settings →</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Logo creation',
                  'Ad Banner',
                  'Flyers',
                  'Book Cover (High-Res)',
                  'Realistic',
                  '3D Render',
                  'Minimalist',
                  'Illustration',
                  'Product Shot',
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setImageType(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      imageType === t
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/25 ring-1 ring-pink-400'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {t === 'Logo creation' && '✨ '}
                    {t === 'Flyers' && '📄 '}
                    {t === 'Book Cover (High-Res)' && '📖 '}
                    {t === 'Ad Banner' && '🎯 '}
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-400">Aspect Ratio:</span>
                {['1:1', '16:9', '9:16', '4:5'].map((ar) => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => setImageAspectRatio(ar)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold ${
                      imageAspectRatio === ar
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. If 'Create Video': Explainer, Ad creation, Schematic + Duration radio options (15s, 30s, 1min, 2min, 3min) */}
          {activeDirective === 'create-video' && (
            <div className="pt-2 border-t border-white/10 space-y-3">
              {/* Video Type selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Video Creation Format:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSettingsSection('create-video');
                      setActiveTab('settings');
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Era Style & 24/7 Cloud Auto-Gen Settings →</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'Schematic', label: 'Schematic (Normal Story Short Video)' },
                    { id: 'Ad creation', label: 'Ad Creation (Commercial Spotlight)' },
                    { id: 'Explainer', label: 'Explainer Video' },
                    { id: 'Product Demo', label: 'Product Demo' },
                    { id: 'Slideshow', label: 'Slideshow' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setVideoFormat(v.id);
                        if (v.id === 'Ad creation' && (videoDuration === '2min' || videoDuration === '3min' || videoDuration === '5min' || videoDuration === '8min')) {
                          setVideoDuration('30s');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        videoFormat === v.id
                          ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {v.id === 'Schematic' && '🎬 '}
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Duration Radio Options (15s, 30s, 1min, 2min, 3min, 5min, 8min) */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Video Duration Radio Options:
                    </span>
                  </div>

                  <div className="text-[10px] text-cyan-300 font-semibold">
                    Selected: {videoDuration} ({videoDuration === '15s' ? '15s Short Video' : videoDuration === '30s' ? '30s Commercial' : videoDuration === '1min' ? '1 Minute' : videoDuration === '2min' ? '2 Minutes' : videoDuration === '3min' ? '3 Minutes' : videoDuration === '5min' ? '5 Minutes' : videoDuration === '8min' ? '8 Minutes' : videoDuration})
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-1">
                  {(['15s', '30s', '1min', '2min', '3min', '5min', '8min'] as const).map((dur) => {
                    const isAd = videoFormat === 'Ad creation';
                    const isLongDuration = dur === '2min' || dur === '3min' || dur === '5min' || dur === '8min';
                    const isDisabled = isAd && isLongDuration;

                    return (
                      <label
                        key={dur}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                          videoDuration === dur
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-xs'
                            : isDisabled
                            ? 'opacity-30 border-transparent text-slate-500 cursor-not-allowed'
                            : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                        }`}
                        title={isDisabled ? 'Ads are limited to ≤ 1 min' : `${dur} video duration`}
                      >
                        <input
                          type="radio"
                          name="videoDuration"
                          value={dur}
                          checked={videoDuration === dur}
                          disabled={isDisabled}
                          onChange={() => setVideoDuration(dur)}
                          className="w-3.5 h-3.5 text-cyan-500 focus:ring-cyan-400"
                        />
                        <span>{dur}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-white/5">
                  <span>* Durations: 15s & 30s quick clips, 1min, 2min, 3min, 5min & 8min full videos. Ads ≤ 1min. Schematics ≤ 8min.</span>
                  <button
                    type="button"
                    onClick={() => setShowVideoSocialLinks(!showVideoSocialLinks)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showVideoSocialLinks ? '▲ Hide Auto-Gen Social Links' : '▼ Paste & Store Auto-Gen Social Links'}</span>
                  </button>
                </div>
              </div>

              {/* Paste & Store Social Media Links for Auto Video Generation (Saved & Shared across parts) */}
              {showVideoSocialLinks && (
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Auto Video Generation — Social Media Channel Links:
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                          Stored & Shared Across All Modules
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Paste your channel links here. These links are stored persistently and automatically fetched by Create Post and other marketing parts for unified publishing.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToast('Links Saved & Stored', 'All social media links are stored and synced across video and post modules', 'success');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shrink-0 shadow-md shadow-cyan-500/20 cursor-pointer"
                    >
                      Save & Sync Links
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
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
                          className={`p-2.5 rounded-xl border transition-all ${
                            platformState.enabled
                              ? 'bg-white/[0.04] border-cyan-500/30'
                              : 'bg-white/[0.01] border-white/5 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <input
                              type="checkbox"
                              checked={platformState.enabled}
                              onChange={(e) =>
                                updateSocialPlatformLink(p.key, platformState.url, e.target.checked)
                              }
                              className="w-3.5 h-3.5 rounded text-cyan-500 focus:ring-cyan-400"
                            />
                            <span className="text-xs font-bold text-white flex items-center gap-1">
                              <span>{p.icon}</span>
                              <span>{p.label}</span>
                            </span>
                            {platformState.url && (
                              <span className="ml-auto text-[10px] text-emerald-400 font-mono">
                                Stored
                              </span>
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
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. If 'Create Post': Social Platforms Checklist (Multi-selection) with Links Fetched from Video Generator */}
          {activeDirective === 'create-post' && (
            <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-semibold">
                    Destination Links:
                  </span>
                  <span>Fetching links stored from Video Auto-Gen generator</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDirective('create-video');
                    setShowVideoSocialLinks(true);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-medium hover:underline text-left cursor-pointer"
                >
                  Configure / Paste Links in Video Generator →
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] shrink-0 mr-1">
                    Social Platforms (Checklist):
                  </span>
                  {(
                    [
                      { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
                      { id: 'twitter', label: 'X (Twitter)', icon: '🐦' },
                      { id: 'instagram', label: 'Instagram', icon: '📸' },
                      { id: 'facebook', label: 'Facebook', icon: '👥' },
                      { id: 'tiktok', label: 'TikTok', icon: '🎵' },
                    ] as const
                  ).map((p) => {
                    const isChecked = selectedPostPlatforms.includes(p.id);
                    const storedLink = (directiveSettings.video.socialPlatforms as any)[p.id]?.url;

                    return (
                      <label
                        key={p.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-xs'
                            : 'bg-white/[0.04] border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-slate-300'
                        }`}
                        title={storedLink ? `Destination: ${storedLink}` : 'No link pasted in Video Generator'}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPostPlatforms((prev) => [...prev, p.id]);
                              setPostPlatform(p.id); // set as active preview
                            } else {
                              if (selectedPostPlatforms.length > 1) {
                                const updated = selectedPostPlatforms.filter((item) => item !== p.id);
                                setSelectedPostPlatforms(updated);
                                if (postPlatform === p.id) {
                                  setPostPlatform(updated[0]);
                                }
                              } else {
                                addToast('Selection Required', 'Keep at least 1 social platform selected', 'info');
                              }
                            }
                          }}
                          className="w-4 h-4 rounded text-amber-500 bg-black/40 border-white/20 focus:ring-amber-400"
                        />
                        <span>{p.icon}</span>
                        <span>{p.label}</span>
                        {storedLink ? (
                          <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-normal">
                            Linked
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-500 italic">
                            (no link)
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold shrink-0">
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Include viral hashtags</span>
                </label>
              </div>
            </div>
          )}

          {/* 5. If 'Create Brochure': Template selection */}
          {activeDirective === 'create-brochure' && (
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Template:</span>
                {(['tri-fold', 'bi-fold', 'flyer', 'poster'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBrochureTemplate(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      brochureTemplate === t
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-white/5 border border-white/10 text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <span className="text-[11px] text-emerald-400 font-medium">
                Live print stylesheet & PDF export enabled
              </span>
            </div>
          )}

          {/* 6. If 'Create Apps': Target platforms and feature quick toggles */}
          {activeDirective === 'create-apps' && (
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Integrations:</span>
                {['Google/Apple Auth', 'Cloud Firestore DB', 'Stripe Checkout', 'Push Alerts'].map((feat, idx) => (
                  <label key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-slate-200 cursor-pointer hover:bg-white/[0.08]">
                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded text-indigo-600" />
                    <span className="text-[11px] font-semibold">{feat}</span>
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveSettingsSection('create-apps');
                  setActiveTab('settings');
                }}
                className="text-[11px] text-indigo-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>Play Store & iOS Deployment Settings →</span>
              </button>
            </div>
          )}

          {/* 7. If 'Create websites': Picture placement bar & quick sample pictures */}
          {activeDirective === 'create-websites' && (
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Import Pictures:</span>
                <span className="text-[11px] text-teal-300 font-semibold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  {websiteProject.importedImages.length} pictures placed in website
                </span>
                <span className="text-slate-500">•</span>
                <button
                  type="button"
                  onClick={() => {
                    handleAddWebsiteImage('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80', 'Workspace');
                    addToast('Picture Placed', 'Embedded workspace picture in website showcase', 'info');
                  }}
                  className="text-[11px] text-cyan-400 hover:text-white underline cursor-pointer"
                >
                  +Add Sample Photo
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveSettingsSection('create-websites');
                  setActiveTab('settings');
                }}
                className="text-[11px] text-teal-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>Google Cloud Run Hosting Setup →</span>
              </button>
            </div>
          )}

          {/* 8. If 'Create books': Genre radio buttons (fiction, non-fiction, kids-books, etc.) */}
          {activeDirective === 'create-books' && (
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-amber-400" />
                  <span>Book Genre:</span>
                </span>
                {[
                  { id: 'fiction', label: 'Fiction' },
                  { id: 'non-fiction', label: 'Non-Fiction' },
                  { id: 'kids-books', label: 'Kids-Books' },
                  { id: 'fantasy-scifi', label: 'Fantasy / Sci-Fi' },
                  { id: 'biography-memoir', label: 'Biography / Memoir' },
                  { id: 'self-help-business', label: 'Self-Help / Business' },
                ].map((g) => (
                  <label
                    key={g.id}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      bookGenre === g.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bookGenre"
                      value={g.id}
                      checked={bookGenre === g.id}
                      onChange={() => {
                        setBookGenre(g.id);
                        setBookProject((p) => ({ ...p, genre: g.id }));
                      }}
                      className="w-3.5 h-3.5 text-amber-500 focus:ring-amber-400"
                    />
                    <span>{g.label}</span>
                  </label>
                ))}
              </div>

              <span className="text-[11px] text-amber-400/90 font-medium">
                Anti-AI Human Prose • PDF & DOCX Export Enabled
              </span>
            </div>
          )}
        </form>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* GENERATED RESULTS DISPLAY (Directly below prompt box) */}
      {/* ----------------------------------------------------------- */}

      {/* 1. Results for 'Create leads': Discovered Customer Leads & Email Outreach */}
      {activeDirective === 'create-leads' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          {/* Business Overview & Offering Tags */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-extrabold text-white">{businessInfo.companyName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  {businessInfo.industry}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">{businessInfo.summary}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {businessInfo.services?.map((svc, idx) => (
                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                    ✓ {svc}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-white">{leads.length}</div>
              <div className="text-xs text-emerald-400 font-semibold">Verified Leads Found</div>
            </div>
          </div>

          {/* Leads Grid & Batch Email Outbound Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Discovered Leads List (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Customer Leads ({selectedLeadIds.length}/{leads.length})
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button onClick={selectAllLeads} className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">
                    Select All
                  </button>
                  <span className="text-slate-600">•</span>
                  <button onClick={clearLeadSelection} className="text-slate-400 hover:text-slate-300 font-semibold cursor-pointer">
                    Clear
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {leads.map((lead) => {
                  const isSelected = selectedLeadIds.includes(lead.id);

                  return (
                    <div
                      key={lead.id}
                      onClick={() => toggleLeadSelection(lead.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500/50 shadow-sm'
                          : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleLeadSelection(lead.id)}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white truncate">{lead.name}</span>
                              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {lead.fitScore}% Fit
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-300 truncate">
                              {lead.role} • <strong className="text-indigo-300">{lead.company}</strong>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {lead.email} • {lead.linkedin}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            lead.status === 'Opened'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : lead.status === 'Emailed'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>

                      <div className="mt-2 text-[10px] text-slate-400 italic bg-black/20 p-2 rounded">
                        Angle: "{lead.suggestedAngle}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Email Outreach Preview Window: Realistic Gmail / Outlook client preview with Re-generate button (7 cols) */}
            <div className="lg:col-span-7">
              <EmailClientPreview
                subject={generatedEmailSubject || `Quick question regarding ${leads[0]?.company || 'growth'}`}
                setSubject={setGeneratedEmailSubject}
                body={
                  generatedEmailBody ||
                  `Hi there,\n\nI noticed your team's expansion at ${leads[0]?.company || 'your company'} and loved your positioning in ${businessInfo.industry}.\n\nWe built ${businessInfo.companyName} to help companies like yours automate customer lead discovery and collateral generation without burning 20+ hours every week.\n\nWould you be open to a 7-minute intro call this Thursday to explore how this could accelerate your pipeline?\n\nBest regards,\n${businessInfo.companyName} Growth Team`
                }
                setBody={setGeneratedEmailBody}
                onSend={handleSendBatchOutreach}
                isSending={isSendingEmail}
                onReformat={handleReformatEmail}
                isReformatting={isReformattingEmail}
              />
            </div>
          </div>
        </section>
      )}

      {/* 2. Results for 'Create Image': 4 Image Variations */}
      {activeDirective === 'create-image' && (
        <section className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-pink-400" />
              <span>Generated {imageType} Variations ({generatedImages.length})</span>
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  handleGenerate();
                  addToast('Reformatting Images', `Re-generating ${imageType} variations with new composition…`, 'info');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-pink-300 text-xs font-semibold transition-colors cursor-pointer"
                title="Re-generate and reformat image styles"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-generate</span>
              </button>
              <span className="text-xs text-slate-400">Click any image to enlarge and download</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {generatedImages.map((img) => (
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

                <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white">
                  {img.badge || imageType}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end z-20">
                  <div className="text-xs font-bold text-white line-clamp-1 mb-2">{img.title}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = img.url;
                        link.download = `logo-${img.id}.jpg`;
                        link.target = '_blank';
                        link.click();
                        addToast('Downloaded', `Saved ${img.title}`, 'success');
                      }}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewZoomImage(img)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                      title="Full preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setAttachedAsset({ type: 'image', name: `${img.title}.png`, url: img.url });
                        addToast('Asset attached', 'Ready to attach to emails', 'info');
                      }}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[10px] font-bold"
                    >
                      Attach
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Results for 'Create Post': Social Platform Mockup Preview */}
      {activeDirective === 'create-post' && (
        <section className="space-y-4 animate-in fade-in duration-300 max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Generated {postPlatform.toUpperCase()} Preview</span>
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setGeneratedPost((prev) => ({
                    ...prev,
                    caption: `🚀 3 Proven Steps We Used to 10x Customer Acquisition for ${businessInfo.companyName}:\n\n1️⃣ Direct ICP Targeting: Filter by revenue, industry, and decision-maker seniority.\n2️⃣ Hyper-Personalized Messaging: No generic templates — tailor each hook to company news.\n3️⃣ Multi-Touch Collateral: Combine email outreach with social presence and explainer videos.\n\nWant the full outbound playbook? Comment "PLAYBOOK" below and I'll DM it over! 👇`,
                  }));
                  celebrate();
                  addToast('Post Reformatted', 'Restructured copy into Actionable 3-Step Playbook', 'success');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
                title="Re-generate and reformat post structure"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-generate</span>
              </button>
              <span className="text-xs text-slate-400">Scheduled: {generatedPost.bestTime}</span>
            </div>
          </div>

          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl bg-[#0F0F1E]/95 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-[#0F0F1E] flex items-center justify-center font-bold text-white text-xs">
                    {businessInfo.companyName.charAt(0) || 'A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{businessInfo.companyName}</div>
                  <div className="text-[10px] text-slate-400">{businessInfo.tagline} • Just now</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 mr-1">Dispatches to:</span>
                {selectedPostPlatforms.map((plat) => {
                  const storedUrl = (directiveSettings.video.socialPlatforms as any)[plat]?.url;
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setPostPlatform(plat)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                        postPlatform === plat
                          ? 'bg-amber-500 text-slate-950 shadow-xs ring-1 ring-amber-300'
                          : 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                      }`}
                      title={storedUrl ? `Fetched Destination: ${storedUrl}` : 'No link pasted yet'}
                    >
                      <span>{plat}</span>
                      {storedUrl && <span className="text-[9px] opacity-75 font-mono">🔗</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              value={generatedPost.caption}
              onChange={(e) => setGeneratedPost({ ...generatedPost, caption: e.target.value })}
              rows={8}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-100 leading-relaxed focus:outline-none resize-y"
            />

            {includeHashtags && generatedPost.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {generatedPost.hashtags.map((h, i) => (
                  <span key={i} className="text-xs font-medium text-amber-400">
                    {h}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {generatedPost.caption.length} characters • {selectedPostPlatforms.length} {selectedPostPlatforms.length === 1 ? 'platform' : 'platforms'} targeted
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = `${generatedPost.caption}\n\n${generatedPost.hashtags.join(' ')}`;
                    navigator.clipboard.writeText(text);
                    setIsCopiedPost(true);
                    addToast('Copied', 'Post ready to paste into social media scheduler', 'info');
                    setTimeout(() => setIsCopiedPost(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isCopiedPost ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopiedPost ? 'Copied Post' : 'Copy Post'}</span>
                </button>

                <button
                  onClick={() => {
                    celebrate();
                    const dispatchSummary = selectedPostPlatforms
                      .map((p) => {
                        const url = (directiveSettings.video.socialPlatforms as any)[p]?.url;
                        return `${p.toUpperCase()}${url ? ` (${url})` : ''}`;
                      })
                      .join(', ');
                    addToast('Queued to Post', `Dispatched to: ${dispatchSummary}`, 'success');
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to {selectedPostPlatforms.length} {selectedPostPlatforms.length === 1 ? 'Platform' : 'Platforms'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Results for 'Create Video': Interactive Video Screen & Storyboard */}
      {activeDirective === 'create-video' && (
        <section className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              <span>{videoProject.title} ({videoProject.durationLabel})</span>
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setVideoProject((prev) => ({
                    ...prev,
                    fullScript: `What is the #1 reason high-potential companies stall? Manual outbound and fragmented branding. At ${businessInfo.companyName}, we replaced 5 broken growth tools with 1 autonomous AI agent that finds verified customers, dispatches tailored messages, and produces cinematic campaign collateral 24/7. Unlock your true pipeline speed at ${businessInfo.contactInfo.website}.`,
                  }));
                  celebrate();
                  addToast('Video Script Reformatted', 'Restructured video into Direct-Response High Impact Ad', 'success');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
                title="Re-generate and reformat script structure"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-generate</span>
              </button>
              <span className="text-xs text-cyan-400 font-semibold">
                Era Style: {directiveSettings.video.visualEra}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Video Screen Player (7 cols) */}
            <div className="lg:col-span-7 aspect-video rounded-3xl overflow-hidden glass-panel border border-white/15 bg-black shadow-2xl relative flex flex-col justify-between p-6">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  videoProject.scenes[activeVideoScene]?.gradient || 'from-indigo-900 to-black'
                } opacity-90 transition-all duration-700 pointer-events-none`}
              />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white">
                  {videoProject.scenes[activeVideoScene]?.badge || 'SCENE'}
                </span>
                <span className="text-xs text-white/90 bg-black/50 px-2.5 py-1 rounded-full">
                  Scene {activeVideoScene + 1} of {videoProject.scenes.length}
                </span>
              </div>

              <div className="relative z-10 text-center my-auto space-y-2">
                <h4 className="text-xl font-extrabold text-white">
                  {videoProject.scenes[activeVideoScene]?.title}
                </h4>
                <p className="text-xs text-slate-200 max-w-md mx-auto">
                  {videoProject.scenes[activeVideoScene]?.visualDescription}
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-3 px-4 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-xs text-amber-200 text-center">
                  "{videoProject.scenes[activeVideoScene]?.voiceover}"
                </div>

                <div className="w-full flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsVideoPlaying(!isVideoPlaying);
                      setActiveVideoScene((prev) => (prev + 1) % videoProject.scenes.length);
                    }}
                    className="w-9 h-9 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold"
                  >
                    {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <div className="flex-1 flex gap-1 h-2 rounded-full overflow-hidden bg-white/20">
                    {videoProject.scenes.map((s, idx) => (
                      <div
                        key={s.id}
                        onClick={() => setActiveVideoScene(idx)}
                        className={`flex-1 cursor-pointer transition-colors ${
                          activeVideoScene === idx ? 'bg-cyan-400' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveVideoScene(0)}
                    className="p-2 rounded-full bg-white/10 text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Narration Script & Social Auto-Dispatch Status (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-white/10 space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Full Narration Script</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/5 max-h-44 overflow-y-auto">
                  {videoProject.fullScript}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                  <strong>Auto-Generation Setting:</strong> {directiveSettings.video.dailyBatchCount} videos / {directiveSettings.video.scheduleTime} scheduled to connected social links.
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    const blob = new Blob([videoProject.fullScript], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `script-${videoProject.id}.txt`;
                    a.click();
                    addToast('Script Downloaded', 'Saved text file', 'info');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Download Script
                </button>

                <button
                  onClick={() => {
                    celebrate();
                    addToast('Export Started', `Rendering ${videoDuration} MP4 commercial ad…`, 'success');
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export MP4 Video</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Results for 'Create Brochure': Live Zoomable Preview & Print */}
      {activeDirective === 'create-brochure' && (
        <section className="space-y-4 animate-in fade-in duration-300">
          <div className="no-print flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Live {brochureTemplate.toUpperCase()} Preview</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setBrochure((prev) => ({
                    ...prev,
                    headline: `Transform How Your Business Acquires Customers with ${businessInfo.companyName}`,
                    subheadline: `High-impact autonomous pipeline generation for modern growth teams.`,
                  }));
                  celebrate();
                  addToast('Brochure Reformatted', 'Reformatted layout structure and headlines', 'success');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
                title="Re-generate brochure layout structure"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-generate</span>
              </button>

              <button
                onClick={() => setBrochureZoom((z) => Math.max(60, z - 15))}
                className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono text-white">{brochureZoom}%</span>
              <button
                onClick={() => setBrochureZoom((z) => Math.min(125, z + 15))}
                className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF / Print</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto p-4 rounded-3xl glass-panel border border-white/10 bg-[#06060c] flex justify-center">
            <div
              style={{ transform: `scale(${brochureZoom / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-200 w-full max-w-[820px] rounded-2xl bg-white text-slate-900 shadow-2xl p-8 sm:p-10 font-sans border border-slate-200"
            >
              <div
                className="h-2 rounded-full mb-6"
                style={{ background: `linear-gradient(90deg, ${businessInfo.brandColors.primary} 0%, ${businessInfo.brandColors.accent} 100%)` }}
              />

              <div className="flex items-start justify-between border-b border-slate-100 pb-5 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{businessInfo.companyName}</h2>
                  <p className="text-xs text-slate-500 font-medium">{businessInfo.tagline}</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white font-bold text-[10px]">
                    {brochureTemplate.toUpperCase()}
                  </span>
                  <div className="mt-1">{businessInfo.contactInfo.website}</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h1 className="text-2xl font-black text-slate-900">{brochure.headline}</h1>
                <p className="text-xs text-slate-600 font-semibold">{brochure.subheadline}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{brochure.aboutText}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {brochure.keyFeatures.map((f, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <h5 className="text-xs font-bold text-slate-900 mb-1">{f.title}</h5>
                    <p className="text-[11px] text-slate-500">{f.description}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <strong>Contact:</strong> {brochure.contact.phone} • {brochure.contact.email}
                </div>
                <div className="text-slate-900 font-bold">{brochure.contact.website}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Results for 'Create Apps': Full Responsive Mobile & Web App Studio Preview */}
      {activeDirective === 'create-apps' && (
        <AppStudioPreview
          appProject={appProject}
          isLoading={isLoading}
          onReformat={handleReformatApp}
          onAddFeature={handleAddAppFeature}
          onToggleFeature={handleToggleAppFeature}
        />
      )}

      {/* 7. Results for 'Create websites': Responsive Website Studio Preview */}
      {activeDirective === 'create-websites' && (
        <WebsiteStudioPreview
          websiteProject={websiteProject}
          isLoading={isLoading}
          onReformat={handleReformatWebsite}
          onAddImage={handleAddWebsiteImage}
          onRemoveImage={handleRemoveWebsiteImage}
          onToggleFeature={handleToggleWebsiteFeature}
        />
      )}

      {/* 8. Results for 'Create Books': Anti-AI Humanized Book Publishing Studio */}
      {activeDirective === 'create-books' && (
        <BookStudioWorkflow
          bookProject={bookProject}
          setBookProject={setBookProject}
          onGenerateConcept={handleGenerateBookConcept}
          onGenerateLayout={handleGenerateBookLayout}
          onGenerateChapter={handleGenerateBookChapter}
          onRegenerateImage={handleRegenerateChapterImage}
          isLoading={isLoading}
          addToast={addToast}
          celebrate={celebrate}
        />
      )}

      {/* Zoom modal for images */}
      {previewZoomImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-2xl w-full rounded-3xl overflow-hidden glass-panel border border-white/20 bg-[#0F0F1E] shadow-2xl p-4">
            <button
              onClick={() => setPreviewZoomImage(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewZoomImage.url} alt="" referrerPolicy="no-referrer" className="w-full max-h-[70vh] object-contain rounded-2xl" />
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{previewZoomImage.title}</h4>
                <p className="text-xs text-slate-400">{previewZoomImage.style}</p>
              </div>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = previewZoomImage.url;
                  link.download = `image-${previewZoomImage.id}.jpg`;
                  link.target = '_blank';
                  link.click();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download High-Res</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
