# AgentReach - Autonomous AI Marketing & Customer Growth Agent 🚀

**AgentReach** is an all-in-one AI marketing agent web application that helps businesses discover high-intent customer leads, launch hyper-personalized cold email outreach, and instantly generate multi-channel marketing collateral (realistic/3D images, viral social posts, commercial video ads with neural voiceover, and print-ready brochures).

---

## 🌟 Key Modules & Features

1. **Dashboard & Pipeline Engine**
   - High-level customer acquisition stats (Leads Found, Emails Sent, Social Posts, Assets Built, Reply Rate).
   - Instant 1-click preset business loader (HyperScale SaaS, Lumina Artisan Coffee, Velvet Studio, Nova HealthTech).
   - Global Action Bar for rapid asset generation.
   - Outreach pipeline funnel analytics.

2. **Find Customers (URL Scanner & Lead Enrichment)**
   - Enter any company website URL (e.g. `https://yourbusiness.com`).
   - Automated 5-stage scanning progress: site structure scan, service & product analysis, contact discovery, lead scoring, and personalized outreach angle synthesis.
   - Discovered B2B/B2C leads with fit confidence scores, verified email patterns, LinkedIn roles, and pain points.
   - Quick 1-click batch transfer directly into Email Outreach.

3. **Email Outreach Studio**
   - Split-screen workspace: select recipients on the left, draft and preview cold emails on the right.
   - Tone selector: *Persuasive, Friendly, Formal, Casual, Bold*.
   - Cross-module collateral attachment picker (attach brochures, video ads, or product banners).
   - Auto-generated business sender signature card with logo, phone, website, and socials.
   - Live delivery simulation and status tracking: *Drafted → Sent → Opened → Replied*.

4. **AI Image Studio**
   - Prompt input with curated industry presets.
   - 6 style presets: *Realistic, 3D Render, Minimalist, Illustration, Product Shot, Ad Banner*.
   - Aspect ratio selector: *1:1 Square, 16:9 Landscape, 9:16 Story, 4:5 Portrait*.
   - 4-variation responsive grid with hover actions: Download high-res, Copy prompt, Zoom modal, and "Use in Email Outreach".
   - Creation history strip.

5. **AI Social Media Studio**
   - Platform-native optimization for **LinkedIn, Instagram, X (Twitter), Facebook, and TikTok**.
   - Live platform preview cards mimicking authentic social media feed chrome.
   - Real-time character count with platform boundary warnings.
   - Recommended posting schedules and viral hashtag generation.

6. **AI Commercial Video Studio**
   - Multi-scene storyboard generator with visual descriptions, timings, and commercial badges.
   - Gemini Neural TTS voiceover integration (**Kore, Puck, Fenrir, Zephyr, Charon**) with live voice audio preview!
   - Interactive canvas player with timeline scrubber, animated scene transitions, and audio narration playback.
   - Full script export and video project downloader.

7. **AI Brochure & Flyer Designer**
   - Formats: *Tri-Fold Brochure, Bi-Fold Folio, Modern Flyer, Product Poster*.
   - Live zoomable preview (50% – 125%).
   - Brand color palette customization and auto-synced company positioning.
   - Export to PDF & Print with custom print stylesheet (`window.print()`).

8. **Persistent AI Agent "Reach"**
   - Animated glowing pulsating gradient orb avatar.
   - Confident, helpful, concise, slightly witty growth partner personality.
   - Natural language intent detection that triggers module navigation and pre-fills actions.
   - File attachment support and proactive next-step recommendations.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion v12), Lucide React.
- **Backend**: Node.js + Express with server-side `@google/genai` integration.
- **AI Models**:
  - `gemini-3.8-flash`: Structured customer lead discovery, site analysis, email copywriting, social posts, and storyboards.
  - `gemini-3.8-flash-lite-tts`: Commercial audio voiceover narration generation (`audio/wav`).
  - `gemini-3.1-flash-lite-image`: Marketing image generation.
- **Audio & Visuals**: Web Audio API, HTML5 Canvas, high-res Unsplash commercial imagery, and Canvas Confetti.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed.
- (Optional) `GEMINI_API_KEY` for live model generation (graceful high-fidelity fallbacks are included).

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Building for Production
```bash
npm run build
npm start
```

---

## 🌐 Deploying to Vercel, Render, or Cloud Run

AgentReach is built to deploy seamlessly on Render, Railway, Vercel, Google Cloud Run, or any Node.js hosting platform:
- **Build command**: `npm run build`
- **Start command**: `npm start`
- **Output directory**: `dist`
- **Environment Variables**: Add `GEMINI_API_KEY` and `PORT=3000` in your hosting dashboard.

---

## ❓ Troubleshooting & GitHub FAQs

### Why does opening `index.html` or clicking files on GitHub not show the live website?
1. **GitHub is a code repository, not an automatic web server**: Pushing code to GitHub stores your project files, but does not automatically execute them as a live website.
2. **Cannot double-click `index.html`**: This is a modern React + TypeScript + Node application (`/src/main.tsx`). Web browsers cannot execute `.tsx` files directly without the Vite compiler running. Opening `index.html` directly in a browser via `file://` will produce a blank page.
3. **Requires Node.js runtime**: The app uses an Express backend (`server.ts`) for AI API orchestration and streaming.

### How to view the app:
- **To run locally**: Install [Node.js](https://nodejs.org), run `npm install`, then run `npm run dev`, and visit `http://localhost:3000`.
- **To host publicly for free**: Connect your GitHub repository to [Render.com](https://render.com) (New Web Service → Build: `npm run build` → Start: `npm start`).
