import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Download,
  CheckCircle2,
  FileText,
  Sliders,
  ChevronDown,
  Layers,
  Edit3,
  Feather,
  BookMarked,
  PlusCircle,
  HelpCircle,
  Printer,
  Image as ImageIcon,
  X,
  SlidersHorizontal,
  Eye,
} from 'lucide-react';
import {
  BookGenre,
  BookProject,
  TextAlignment,
  BookImageType,
  ChapterImage,
} from '../../types';

interface BookStudioWorkflowProps {
  bookProject: BookProject;
  setBookProject: React.Dispatch<React.SetStateAction<BookProject>>;
  onGenerateConcept: (genre: BookGenre, focus: string) => Promise<void>;
  onGenerateLayout: (genre: BookGenre, focus: string, title: string, subtitle: string, count: number) => Promise<void>;
  onGenerateChapter: (chapterNumber: number, customNotes?: string) => Promise<void>;
  onRegenerateImage?: (chapterNumber: number, imageId: string, imageIndex: number) => Promise<void>;
  isLoading: boolean;
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  celebrate: () => void;
}

const IMAGE_TYPES: { id: BookImageType; label: string }[] = [
  { id: 'cartoons', label: 'cartoons' },
  { id: 'animals', label: 'animals' },
  { id: 'futuristic', label: 'futuristic' },
  { id: 'modern world', label: 'modern world' },
  { id: 'fantasy & mythical', label: 'fantasy & mythical' },
  { id: 'vintage watercolor', label: 'vintage watercolor' },
  { id: 'cinematic photorealism', label: 'cinematic photorealism' },
];

export const BookStudioWorkflow: React.FC<BookStudioWorkflowProps> = ({
  bookProject,
  setBookProject,
  onGenerateConcept,
  onGenerateLayout,
  onGenerateChapter,
  onRegenerateImage,
  isLoading,
  addToast,
  celebrate,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedChapterId, setCopiedChapterId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [generatingChapterId, setGeneratingChapterId] = useState<number | null>(null);
  const [regeneratingImageKey, setRegeneratingImageKey] = useState<string | null>(null);
  const [chapterInputs, setChapterInputs] = useState<Record<number, string>>({});
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isManuscriptModalOpen, setIsManuscriptModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<ChapterImage | null>(null);

  // Copy helper
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', label, 'success');
  };

  // Alignment CSS class helper
  const getAlignmentClass = (align: TextAlignment) => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'justify':
      default:
        return 'text-justify';
    }
  };

  // Export handlers (supports alignment and embedded illustrations)
  const handleExport = (format: 'docx' | 'pdf') => {
    setExportMenuOpen(false);
    const completedChapters = bookProject.chapters.filter((c) => c.isGenerated);

    if (completedChapters.length === 0) {
      addToast('No Chapters Generated', 'Generate at least one chapter before exporting.', 'warning');
      return;
    }

    const title = bookProject.selectedTitle || 'Untitled Book';
    const subtitle = bookProject.selectedSubtitle || '';
    const alignment = bookProject.alignment || 'justify';

    let fullManuscript = `${title.toUpperCase()}\n${subtitle}\n\n`;
    fullManuscript += `Genre: ${bookProject.genre.toUpperCase()}\n`;
    fullManuscript += `Alignment: ${alignment}\n`;
    fullManuscript += `Compiled by Reach - Your AI Agent Platform\n`;
    fullManuscript += `--------------------------------------------------------\n\n`;
    fullManuscript += `TABLE OF CONTENTS\n\n`;

    bookProject.chapters.forEach((c) => {
      fullManuscript += `${c.title}${c.subtitle ? ` — ${c.subtitle}` : ''}\n`;
    });
    fullManuscript += `\n--------------------------------------------------------\n\n`;

    bookProject.chapters.forEach((c) => {
      fullManuscript += `\n\n========================================================\n`;
      fullManuscript += `${c.title.toUpperCase()}\n`;
      if (c.subtitle) {
        fullManuscript += `${c.subtitle}\n`;
      }
      fullManuscript += `========================================================\n\n`;
      fullManuscript += c.content || `[Outline: ${c.outline}]\n\n(Content pending generation)`;
      fullManuscript += `\n\n`;
    });

    if (format === 'docx') {
      const htmlDoc = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><title>${title}</title>
        <style>
          body { font-family: 'Georgia', serif; line-height: 1.8; color: #111; margin: 40px; }
          h1 { text-align: center; font-size: 32pt; font-weight: bold; margin-bottom: 8pt; color: #1e1b4b; }
          h2 { text-align: center; font-size: 18pt; font-weight: bold; color: #475569; margin-bottom: 30pt; }
          .chapter-box { page-break-before: always; margin-top: 36pt; }
          .chapter-title { font-size: 26pt; font-weight: bold; color: #0f172a; margin-bottom: 6pt; border-bottom: 2px solid #cbd5e1; padding-bottom: 6pt; }
          .chapter-subtitle { font-size: 16pt; font-weight: bold; color: #b45309; margin-bottom: 24pt; font-style: italic; }
          p { text-indent: 1.5em; margin: 0 0 14pt 0; text-align: ${alignment}; font-size: 12pt; }
          .meta { text-align: center; font-style: italic; color: #64748b; margin-bottom: 40pt; }
          .toc { margin: 30pt 0; padding: 20pt; background: #f8fafc; border: 1px solid #e2e8f0; }
          .figure-card { text-align: center; margin: 26pt auto; max-width: 650px; }
          .figure-img { max-width: 100%; height: auto; border-radius: 6px; border: 1px solid #ddd; }
          .figure-caption { font-size: 10pt; font-style: italic; color: #475569; margin-top: 6pt; }
          .figure-placement { font-size: 9pt; font-weight: bold; color: #d97706; text-transform: uppercase; margin-bottom: 4pt; }
        </style>
        </head>
        <body>
          <h1>${title}</h1>
          <h2>${subtitle}</h2>
          <div class="meta">Genre: ${bookProject.genre} • Anti-AI Literary Manuscript • Alignment: ${alignment.toUpperCase()} • Generated via Reach - Your AI Agent Platform</div>
          <div class="toc">
            <strong>Table of Contents:</strong><br/><br/>
            ${bookProject.chapters.map((c) => `• <strong>${c.title}</strong>${c.subtitle ? ` — <em>${c.subtitle}</em>` : ''}`).join('<br/>')}
          </div>
          ${bookProject.chapters
            .map((c) => {
              const paras = (c.content || c.outline).split('\n\n');
              const images = c.images || [];
              let combinedHtml = `<div class="chapter-box">`;
              combinedHtml += `<div class="chapter-title">${c.title}</div>`;
              if (c.subtitle) {
                combinedHtml += `<div class="chapter-subtitle">${c.subtitle}</div>`;
              }

              paras.forEach((p, pIdx) => {
                combinedHtml += `<p>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;
                if (images.length > 0 && pIdx < images.length) {
                  const img = images[pIdx];
                  combinedHtml += `
                    <div class="figure-card">
                      <div class="figure-placement">${img.placement || `Illustration ${pIdx + 1}`}</div>
                      <img class="figure-img" src="${img.url}" alt="${img.caption}" />
                      <div class="figure-caption">${img.caption}</div>
                    </div>
                  `;
                }
              });

              combinedHtml += `</div>`;
              return combinedHtml;
            })
            .join('')}
        </body>
        </html>
      `;
      const blob = new Blob([htmlDoc], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-manuscript.doc`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('DOCX Exported', `Downloaded "${title}" Word document with formatted titles and illustrations!`, 'success');
      celebrate();
    } else {
      // Print/PDF format
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${title} - Manuscript PDF</title>
              <style>
                @page { margin: 2cm; size: A4; }
                body { font-family: 'Georgia', serif; line-height: 1.8; color: #111; max-width: 820px; margin: 0 auto; padding: 20px; }
                h1 { text-align: center; font-size: 32px; font-weight: bold; margin-top: 60px; margin-bottom: 8px; color: #1e1b4b; }
                h2 { text-align: center; font-size: 18px; font-weight: bold; color: #555; margin-bottom: 40px; }
                .chapter-title { font-size: 26px; font-weight: bold; margin-top: 50px; border-bottom: 2px solid #ddd; padding-bottom: 8px; page-break-before: always; color: #0f172a; }
                .chapter-subtitle { font-size: 16px; font-weight: bold; color: #b45309; margin-top: 4px; margin-bottom: 24px; font-style: italic; }
                p { text-indent: 2em; margin-bottom: 14px; text-align: ${alignment}; font-size: 14px; }
                .toc { margin: 40px 0; padding: 20px; border: 1px solid #ddd; background: #fafafa; }
                .figure-card { text-align: center; margin: 24px auto; max-width: 600px; page-break-inside: avoid; }
                .figure-img { max-width: 100%; border-radius: 8px; border: 1px solid #ddd; }
                .figure-caption { font-size: 12px; font-style: italic; color: #555; margin-top: 6px; }
                .figure-placement { font-size: 11px; font-weight: bold; color: #d97706; text-transform: uppercase; margin-bottom: 4px; }
              </style>
            </head>
            <body>
              <h1>${title}</h1>
              <h2>${subtitle}</h2>
              <div class="toc">
                <strong>Table of Contents</strong><br/><br/>
                ${bookProject.chapters.map((c) => `<div><strong>${c.title}</strong>${c.subtitle ? ` — <em>${c.subtitle}</em>` : ''}</div>`).join('')}
              </div>
              ${bookProject.chapters
                .map((c) => {
                  const paras = (c.content || c.outline).split('\n\n');
                  const images = c.images || [];
                  let html = `<div>`;
                  html += `<div class="chapter-title">${c.title}</div>`;
                  if (c.subtitle) {
                    html += `<div class="chapter-subtitle">${c.subtitle}</div>`;
                  }
                  paras.forEach((p, pIdx) => {
                    html += `<p>${p}</p>`;
                    if (images.length > 0 && pIdx < images.length) {
                      const img = images[pIdx];
                      html += `
                        <div class="figure-card">
                          <div class="figure-placement">${img.placement || `Scene ${pIdx + 1}`}</div>
                          <img class="figure-img" src="${img.url}" alt="${img.caption}" />
                          <div class="figure-caption">${img.caption}</div>
                        </div>
                      `;
                    }
                  });
                  html += `</div>`;
                  return html;
                })
                .join('')}
              <script>
                window.onload = function() { window.print(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        addToast('PDF Print Ready', 'Opened print & PDF dialog with high-res styling!', 'success');
      } else {
        const blob = new Blob([fullManuscript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-manuscript.txt`;
        a.click();
        URL.revokeObjectURL(url);
        addToast('Export Complete', 'Downloaded text manuscript.', 'success');
      }
    }
  };

  const handleCopyAll = () => {
    let full = `# ${bookProject.selectedTitle}\n## ${bookProject.selectedSubtitle}\nGenre: ${bookProject.genre}\nAlignment: ${bookProject.alignment}\n\n`;
    full += `TABLE OF CONTENTS:\n`;
    bookProject.chapters.forEach((c) => {
      full += `• ${c.title}${c.subtitle ? ` — ${c.subtitle}` : ''}\n`;
    });
    full += `\n========================================================\n\n`;

    bookProject.chapters.forEach((c) => {
      full += `# ${c.title.toUpperCase()}\n`;
      if (c.subtitle) {
        full += `## ${c.subtitle}\n`;
      }
      full += `\n${c.content || c.outline}\n\n`;
      if (c.images && c.images.length > 0) {
        c.images.forEach((img, idx) => {
          full += `[Illustration ${idx + 1} (${img.placement}): "${img.caption}"]\n`;
        });
        full += `\n`;
      }
      full += `--------------------------------------------------------\n\n`;
    });
    navigator.clipboard.writeText(full);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
    addToast('Book Copied', 'Copied full manuscript with big bold titles, subtitles, and illustrations to clipboard!', 'success');
  };

  const completedCount = bookProject.chapters.filter((c) => c.isGenerated).length;
  const totalCount = bookProject.chapters.length || bookProject.totalChapters;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ------------------------------------------------------------- */}
      {/* PROGRESS WORKFLOW BREADCRUMB HEADER */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 bg-gradient-to-r from-amber-950/30 via-orange-950/20 to-slate-900/80 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">Reach - Your AI Agent Platform</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Book Studio
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Genre: <span className="text-amber-400 font-semibold capitalize">{bookProject.genre}</span> • Alignment:{' '}
              <span className="text-cyan-400 font-semibold capitalize">{bookProject.alignment}</span> • Images:{' '}
              <span className="text-emerald-400 font-semibold">
                {bookProject.enableImageGeneration ? `${bookProject.imagesPerChapter}/chapter (${bookProject.imageType})` : 'Disabled'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls & Step Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Books Creation Settings Button (Opens Settings Modal) */}
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-300 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Open Books Creation Settings Modal"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Books Creation Settings</span>
          </button>

          {/* Step navigation tabs */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setBookProject((p) => ({ ...p, step: 'ideation' }))}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                bookProject.step === 'ideation'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Concept
            </button>
            <button
              onClick={() => {
                if (bookProject.briefContent) {
                  setBookProject((p) => ({ ...p, step: 'layout' }));
                } else {
                  addToast('Generate Concept First', 'Generate the book concept in Step 1 before configuring layout.', 'info');
                }
              }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                bookProject.step === 'layout'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Layout
            </button>
            <button
              onClick={() => {
                if (bookProject.chapters.length > 0) {
                  setBookProject((p) => ({ ...p, step: 'chapters' }));
                } else {
                  addToast('Generate Layout First', 'Generate the chapters layout in Step 2 first.', 'info');
                }
              }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                bookProject.step === 'chapters'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Drafting
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOOKS CREATION SETTINGS MODAL */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative max-w-xl w-full rounded-2xl glass-panel border border-amber-500/30 bg-[#0E0E1C] shadow-2xl p-6 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Books Creation Settings</h3>
                    <p className="text-xs text-slate-400">
                      Configure text alignment and in-chapter image generation.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Alignment buttons removed from generation interface and put in books creation settings modal */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white block">
                  Alignment:
                </label>
                <div className="relative">
                  <select
                    value={bookProject.alignment}
                    onChange={(e) => {
                      const newAlign = e.target.value as TextAlignment;
                      setBookProject((p) => ({ ...p, alignment: newAlign }));
                      addToast('Alignment Updated', `Manuscript alignment set to ${newAlign}`, 'info');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.07] border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                  >
                    <option value="left" className="bg-slate-900 text-white">left</option>
                    <option value="center" className="bg-slate-900 text-white">center</option>
                    <option value="justify" className="bg-slate-900 text-white">justify</option>
                    <option value="right" className="bg-slate-900 text-white">right</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 2. 'enable images generator' as radio option button */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white block">
                  Enable images generator:
                </label>
                <div className="flex items-center gap-4">
                  <label
                    onClick={() => {
                      setBookProject((p) => ({ ...p, enableImageGeneration: true }));
                      addToast('Images Enabled', `Activated image generation interface`, 'info');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                      bookProject.enableImageGeneration
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="enableImagesGenerator"
                      checked={bookProject.enableImageGeneration}
                      onChange={() => setBookProject((p) => ({ ...p, enableImageGeneration: true }))}
                      className="accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs">Enabled</span>
                  </label>

                  <label
                    onClick={() => {
                      setBookProject((p) => ({ ...p, enableImageGeneration: false }));
                      addToast('Images Disabled', 'Manuscript will generate text-only prose', 'info');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                      !bookProject.enableImageGeneration
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="enableImagesGenerator"
                      checked={!bookProject.enableImageGeneration}
                      onChange={() => setBookProject((p) => ({ ...p, enableImageGeneration: false }))}
                      className="accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs">Disabled</span>
                  </label>
                </div>
              </div>

              {/* 3. If enabled, activate the image generation short settings creation or generation interface page */}
              {bookProject.enableImageGeneration && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-xl bg-white/[0.03] border border-amber-500/30 space-y-4"
                >
                  {/* Select number of images: drop menu of only numbers: 2, 5, 8, 10 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-amber-300 block">
                      Select number of images:
                    </label>
                    <div className="relative max-w-xs">
                      <select
                        value={bookProject.imagesPerChapter}
                        onChange={(e) => {
                          const num = Number(e.target.value) as 2 | 5 | 8 | 10;
                          setBookProject((p) => ({ ...p, imagesPerChapter: num }));
                          addToast('Updated', `Set to ${num} images per chapter`, 'info');
                        }}
                        className="w-full py-2 px-4 rounded-xl bg-white/[0.07] border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                      >
                        <option value={2} className="bg-slate-900 text-white">2</option>
                        <option value={5} className="bg-slate-900 text-white">5</option>
                        <option value={8} className="bg-slate-900 text-white">8</option>
                        <option value={10} className="bg-slate-900 text-white">10</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Choose type of images as optional radio buttons */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-amber-300 block">
                      Choose type of images:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {IMAGE_TYPES.map((type) => {
                        const isSelected = bookProject.imageType === type.id;
                        return (
                          <label
                            key={type.id}
                            onClick={() => {
                              setBookProject((p) => ({ ...p, imageType: type.id }));
                              addToast('Style Selected', type.label, 'info');
                            }}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                                : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="bookImageType"
                              checked={isSelected}
                              onChange={() => setBookProject((p) => ({ ...p, imageType: type.id }))}
                              className="accent-amber-500 cursor-pointer"
                            />
                            <span className="text-xs capitalize truncate">{type.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsModalOpen(false);
                    addToast('Settings Saved', 'Applied book creation settings successfully', 'success');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Save & Apply Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: IDEATION & TITLES DISPLAY */}
      {/* ------------------------------------------------------------- */}
      {bookProject.step === 'ideation' && (
        <section className="space-y-6">
          {/* Main Brief Content Box */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 bg-gradient-to-br from-[#121225]/90 to-[#0A0A16]/95">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Generated Book Concept & Narrative Overview</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onGenerateConcept(bookProject.genre, bookProject.mainFocus)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Regenerate Content</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyText(bookProject.briefContent, 'Book Concept Overview')}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                  title="Copy Concept"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-sm text-slate-200 leading-relaxed bg-white/[0.03] p-5 rounded-2xl border border-white/10 font-serif">
              {bookProject.briefContent || (
                <div className="text-slate-400 italic font-sans py-4 text-center">
                  Click "Generate" in the message box above to synthesize your initial book concept and narrative thesis.
                </div>
              )}
            </div>

            {/* Satisfaction / Add Details / Continue Prompt */}
            {bookProject.briefContent && (
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Is this concept enough, or would you like to add some more, or regenerate?</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDetails(!showAddDetails)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-300 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{showAddDetails ? 'Hide Extra Details' : 'Add Some More'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onGenerateConcept(bookProject.genre, `${bookProject.mainFocus} ${additionalDetails}`)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBookProject((p) => ({ ...p, step: 'layout' }));
                      addToast('Proceeding to Step 2', 'Choose chapter count, book title, and layout.', 'info');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Expandable Add Details Box */}
            <AnimatePresence>
              {showAddDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2 space-y-2 overflow-hidden"
                >
                  <label className="text-xs font-bold text-slate-300 block">
                    Type Additional Plot Points, Specific Characters, or Thematic Directives:
                  </label>
                  <textarea
                    rows={3}
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="e.g. Include an emotional confrontation in chapter 3; emphasize grounded principles; introduce a robotic companion named Orion..."
                    className="w-full p-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400 font-sans"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const mergedFocus = `${bookProject.mainFocus}\n\nAdditional Directives: ${additionalDetails}`;
                        setBookProject((p) => ({ ...p, mainFocus: mergedFocus }));
                        onGenerateConcept(bookProject.genre, mergedFocus);
                        setShowAddDetails(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer"
                    >
                      Update Concept with Details
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggested Book Titles & Subtitles (Individually copyable) */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Suggested Book Titles & Subtitles</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click "Select as Title" or copy individually to use in your book layout.
                </p>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {bookProject.suggestedTitles.length} options
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookProject.suggestedTitles.map((item, idx) => {
                const isSelected = bookProject.selectedTitle === item.title;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white font-serif">{item.title}</div>
                        <div className="text-xs text-amber-300/90 font-medium mt-0.5">{item.subtitle}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            handleCopyText(`${item.title} - ${item.subtitle}`, 'Title & Subtitle');
                            setCopiedIndex(idx);
                            setTimeout(() => setCopiedIndex(null), 2000);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy title & subtitle"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setBookProject((p) => ({
                            ...p,
                            selectedTitle: item.title,
                            selectedSubtitle: item.subtitle,
                          }));
                          addToast('Title Selected', `Set "${item.title}" as active book title!`, 'success');
                        }}
                        className={`font-semibold cursor-pointer transition-colors ${
                          isSelected ? 'text-amber-300' : 'text-slate-400 hover:text-amber-300'
                        }`}
                      >
                        {isSelected ? '✓ Active Title' : 'Select as Title →'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyText(item.title, 'Title')}
                        className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Copy Title Only
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: NUMBER OF CHAPTERS, TITLE & SUBTITLE CONFIGURATION */}
      {/* ------------------------------------------------------------- */}
      {bookProject.step === 'layout' && (
        <section className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6 bg-gradient-to-br from-[#121225]/90 to-[#0A0A16]/95">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>Configure Book Structure & Chapters</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select number of chapters, enter book title and subtitle, then generate layout.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Dropdown list for number of chapters: 5, 10, 15, 20, 25, 30 (clean numbers) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Select number of chapters:
                </label>
                <div className="relative">
                  <select
                    value={bookProject.totalChapters}
                    onChange={(e) =>
                      setBookProject((p) => ({
                        ...p,
                        totalChapters: Number(e.target.value) as 5 | 10 | 15 | 20 | 25 | 30,
                      }))
                    }
                    className="w-full py-3 px-4 rounded-xl bg-white/[0.07] border border-white/15 text-white text-sm font-bold focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                  >
                    {[5, 10, 15, 20, 25, 30].map((num) => (
                      <option key={num} value={num} className="bg-slate-900 text-white">
                        {num}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Book Title Input Box */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Book title:
                </label>
                <input
                  type="text"
                  value={bookProject.selectedTitle}
                  onChange={(e) => setBookProject((p) => ({ ...p, selectedTitle: e.target.value }))}
                  placeholder="Enter book title"
                  className="w-full py-3 px-4 rounded-xl bg-white/[0.07] border border-white/15 text-white text-sm font-bold focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>

              {/* Book Subtitle Input Box */}
              <div className="space-y-2 md:col-span-3">
                <label className="text-xs font-bold text-slate-300 block">
                  Book subtitle:
                </label>
                <input
                  type="text"
                  value={bookProject.selectedSubtitle}
                  onChange={(e) => setBookProject((p) => ({ ...p, selectedSubtitle: e.target.value }))}
                  placeholder="Enter book subtitle"
                  className="w-full py-3 px-4 rounded-xl bg-white/[0.07] border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setBookProject((p) => ({ ...p, step: 'ideation' }))}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                ← Back to Concept
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onGenerateLayout(
                      bookProject.genre,
                      bookProject.mainFocus,
                      bookProject.selectedTitle,
                      bookProject.selectedSubtitle,
                      bookProject.totalChapters
                    )
                  }
                  disabled={isLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Generate Book Layout</span>
                </button>

                {bookProject.chapters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setBookProject((p) => ({ ...p, step: 'chapters' }))}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Generated Chapters Layout Table of Contents */}
          {bookProject.chapters.length > 0 && (
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-amber-400" />
                    <span>
                      Generated Chapters Layout ({bookProject.chapters.length} Chapters)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Introductory contents synthesized according to the number of chapters entered.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onGenerateLayout(
                        bookProject.genre,
                        bookProject.mainFocus,
                        bookProject.selectedTitle,
                        bookProject.selectedSubtitle,
                        bookProject.totalChapters
                      )
                    }
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookProject((p) => ({ ...p, step: 'chapters' }))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {bookProject.chapters.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        {ch.title}
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed font-serif">
                        {ch.outline}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyText(`${ch.title}\n${ch.outline}`, ch.title)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white self-start shrink-0 cursor-pointer"
                      title="Copy chapter outline"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: CHAPTER CONTENT GENERATION & HUMANIZED DRAFTING */}
      {/* ------------------------------------------------------------- */}
      {bookProject.step === 'chapters' && (
        <section className="space-y-6">
          {/* Top Master Controls: Copy All & Export As Menu (NO ALIGNMENT BUTTONS HERE) */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-gradient-to-r from-[#121225] to-[#0A0A16] flex flex-wrap items-center justify-between gap-4 sticky top-4 z-20 shadow-2xl backdrop-blur-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white font-serif">
                  {bookProject.selectedTitle || 'Untitled Book'}
                </h3>
                {completedCount === totalCount && totalCount > 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Book Complete!</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {completedCount} of {totalCount} chapters generated ({progressPercent}%) • Alignment:{' '}
                <span className="text-amber-400 font-semibold capitalize">{bookProject.alignment}</span> • Images:{' '}
                <span className="text-emerald-400 font-semibold">
                  {bookProject.enableImageGeneration ? `${bookProject.imagesPerChapter}/chapter` : 'Off'}
                </span>
              </p>
            </div>

            {/* Top Right Master Actions: Settings Modal Trigger, View Full Manuscript, Copy All & Export As dropdown */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Settings modal trigger */}
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors"
                title="Open Books Creation Settings"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Settings</span>
              </button>

              {/* View Full Formatted Manuscript button */}
              <button
                type="button"
                onClick={() => setIsManuscriptModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors"
                title="View Full Formatted Manuscript"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Full Book</span>
              </button>

              {/* Master Copy All button */}
              <button
                type="button"
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white shadow-sm cursor-pointer transition-all active:scale-95"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy All</span>
              </button>

              {/* Export As dropdown menu (DOCX or PDF) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export As</span>
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>

                <AnimatePresence>
                  {exportMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-slate-900 border border-white/20 shadow-2xl p-1.5 z-30 space-y-1"
                    >
                      <button
                        type="button"
                        onClick={() => handleExport('docx')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-blue-400" />
                        <div>
                          <div>Microsoft Word (.docx)</div>
                          <div className="text-[10px] text-slate-400 font-normal">Formatted big titles & images</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExport('pdf')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Printer className="w-4 h-4 text-rose-400" />
                        <div>
                          <div>Print / PDF (.pdf)</div>
                          <div className="text-[10px] text-slate-400 font-normal">High-res print manuscript</div>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/5 rounded-full h-2 border border-white/10 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Individual Chapter Boxes / Cards */}
          <div className="space-y-6">
            {bookProject.chapters.map((chapter) => {
              const isGeneratingThis = generatingChapterId === chapter.chapterNumber;
              const hasContent = Boolean(chapter.content && chapter.content.trim().length > 0);
              const customInput = chapterInputs[chapter.chapterNumber] || '';
              const chapterImages = chapter.images || [];

              return (
                <div
                  key={chapter.id}
                  className={`p-6 rounded-2xl glass-panel border transition-all ${
                    chapter.isGenerated
                      ? 'border-emerald-500/40 bg-gradient-to-br from-[#101918]/80 to-[#0A0A16]/95'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  {/* Top Bar of Chapter Box: Title, Green Mark on Right, Aligned Buttons on top right */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {chapter.chapterNumber}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-white font-serif">{chapter.title}</h4>
                          {/* Green mark appearing on right side when generated */}
                          {chapter.isGenerated && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Generated</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-serif line-clamp-1 mt-0.5">
                          Outline: {chapter.outline}
                        </div>
                      </div>
                    </div>

                    {/* Aligned Buttons on Top Right Side: Generate Content / Regenerate, Copy */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {/* Generate Content / Regenerate button */}
                      <button
                        type="button"
                        disabled={isGeneratingThis}
                        onClick={async () => {
                          setGeneratingChapterId(chapter.chapterNumber);
                          await onGenerateChapter(chapter.chapterNumber, customInput);
                          setGeneratingChapterId(null);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          hasContent
                            ? 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15'
                            : 'bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95'
                        }`}
                      >
                        {isGeneratingThis ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : hasContent ? (
                          <RefreshCw className="w-3.5 h-3.5" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span>{hasContent ? 'Regenerate' : 'Generate Content'}</span>
                      </button>

                      {/* Copy button (active once content was generated) */}
                      <button
                        type="button"
                        disabled={!hasContent}
                        onClick={() => {
                          if (chapter.content) {
                            let textToCopy = `${chapter.title}\n`;
                            if (chapter.subtitle) textToCopy += `${chapter.subtitle}\n\n`;
                            textToCopy += `${chapter.content}\n\n`;
                            if (chapter.images && chapter.images.length > 0) {
                              chapter.images.forEach((img, idx) => {
                                textToCopy += `[Illustration ${idx + 1}: ${img.caption}]\n`;
                              });
                            }
                            handleCopyText(textToCopy, `${chapter.title} Content`);
                            setCopiedChapterId(chapter.id);
                            setTimeout(() => setCopiedChapterId(null), 2000);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          hasContent
                            ? 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200 hover:text-white cursor-pointer'
                            : 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed opacity-50'
                        }`}
                        title={hasContent ? 'Copy chapter content' : 'Generate content first'}
                      >
                        {copiedChapterId === chapter.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Chapter Content Display: BIG BOLD CHAPTER TITLE & MIDDLE BOLD SUBTITLE */}
                  <div className="py-4">
                    {chapter.content ? (
                      <div className="p-6 sm:p-7 rounded-2xl bg-black/40 border border-white/10 text-slate-200 font-serif leading-relaxed space-y-6 shadow-inner">
                        {/* Status banner with badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-sans border-b border-white/10 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-amber-400 font-semibold">
                              Word Count: {chapter.wordCount || chapter.content.split(/\s+/).length} words
                            </span>
                            <span className="text-cyan-400 font-mono capitalize">
                              Aligned: {bookProject.alignment}
                            </span>
                            {chapterImages.length > 0 && (
                              <span className="text-emerald-400 font-medium">
                                • {chapterImages.length} Illustrations Placed
                              </span>
                            )}
                          </div>
                          <span className="text-emerald-400 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Prose Edited</span>
                          </span>
                        </div>

                        {/* Chapter Headline Block: BIG FONT BOLD TITLE & MIDDLE FONT BOLD SUBTITLE */}
                        <div className={`space-y-2 border-b border-white/10 pb-5 ${getAlignmentClass(bookProject.alignment)}`}>
                          {/* Chapter title in BIG FONT and BOLD */}
                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-serif tracking-tight drop-shadow-sm">
                            {chapter.title}
                          </h2>
                          {/* Subtitle in MIDDLE FONT SIZE and BOLD */}
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-amber-300 font-serif tracking-wide drop-shadow-sm">
                            {chapter.subtitle || 'Where the currents of destiny and consequence converge'}
                          </h3>
                        </div>

                        {/* Prose Body with interleaved Chapter Images placed in required parts based on chapter context */}
                        <div className={`space-y-5 text-sm sm:text-base leading-relaxed text-slate-200 ${getAlignmentClass(bookProject.alignment)}`}>
                          {(() => {
                            const paragraphs = chapter.content.split('\n\n');
                            return paragraphs.map((para, pIdx) => {
                              const matchingImage = chapterImages[pIdx];
                              return (
                                <React.Fragment key={pIdx}>
                                  <p className="whitespace-pre-line leading-relaxed">
                                    {para}
                                  </p>

                                  {/* Interleaved Chapter Image placed at this point in the chapter */}
                                  {matchingImage && (
                                    <div className="my-6 p-4 rounded-2xl bg-white/[0.04] border border-white/15 space-y-3 font-sans max-w-xl mx-auto shadow-xl">
                                      <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-slate-950 aspect-video">
                                        <img
                                          src={matchingImage.url}
                                          alt={matchingImage.caption}
                                          referrerPolicy="no-referrer"
                                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {/* Floating overlay with placement badge & action buttons */}
                                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-300 border border-white/20 uppercase tracking-wider">
                                            {matchingImage.placement || `Illustration ${pIdx + 1}`}
                                          </span>

                                          <div className="flex items-center gap-1.5 pointer-events-auto">
                                            {/* Zoom / Lightbox button */}
                                            <button
                                              type="button"
                                              onClick={() => setLightboxImage(matchingImage)}
                                              className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 cursor-pointer transition-all"
                                              title="Enlarge Image"
                                            >
                                              <Eye className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Regenerate this image button */}
                                            {onRegenerateImage && (
                                              <button
                                                type="button"
                                                onClick={async () => {
                                                  const key = `${chapter.chapterNumber}-${matchingImage.id}`;
                                                  setRegeneratingImageKey(key);
                                                  await onRegenerateImage(chapter.chapterNumber, matchingImage.id, pIdx);
                                                  setRegeneratingImageKey(null);
                                                }}
                                                className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-amber-300 backdrop-blur-md border border-white/20 cursor-pointer transition-all"
                                                title="Regenerate this picture"
                                              >
                                                <RefreshCw
                                                  className={`w-3.5 h-3.5 ${regeneratingImageKey === `${chapter.chapterNumber}-${matchingImage.id}` ? 'animate-spin' : ''}`}
                                                />
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Caption in middle font, italic/serif style */}
                                      <div className="space-y-1">
                                        <div className="text-xs text-amber-200/90 font-serif italic text-center">
                                          "{matchingImage.caption}"
                                        </div>
                                        <div className="text-[10px] text-slate-400 text-center font-mono">
                                          Style: <span className="capitalize">{bookProject.imageType}</span> • Resolution: 1200x800 HD
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </React.Fragment>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-2">
                        <Feather className="w-6 h-6 text-slate-500 mx-auto" />
                        <div className="text-xs font-bold text-slate-400">
                          Chapter prose not generated yet.
                        </div>
                        <div className="text-[11px] text-slate-500 font-serif">
                          Click "Generate Content" above to craft prose with big bold headings, middle bold subtitles, and contextual illustrations.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input box on the bottom of each chapter card */}
                  <div className="pt-3 border-t border-white/10 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 block flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Custom additions / notes for this chapter:</span>
                    </label>
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) =>
                        setChapterInputs({
                          ...chapterInputs,
                          [chapter.chapterNumber]: e.target.value,
                        })
                      }
                      placeholder={`Type specific instructions, character dialogues, or plot points to include in ${chapter.title}...`}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-all font-sans"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FULL MANUSCRIPT READER MODAL (Read & Copy Entire Formatted Book) */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isManuscriptModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-white/20 bg-[#0C0C1A] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between gap-4 bg-black/40">
                <div>
                  <h3 className="text-base font-extrabold text-white font-serif">
                    {bookProject.selectedTitle || 'Untitled Book'} — Complete Formatted Manuscript
                  </h3>
                  <p className="text-xs text-slate-400">
                    All generated chapters assembled with big bold titles, subtitles, and placed illustrations.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Book</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExport('pdf')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsManuscriptModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 sm:p-10 overflow-y-auto space-y-12 font-serif text-slate-200">
                {/* Title & Subtitle Cover block */}
                <div className="text-center space-y-3 py-8 border-b border-white/10">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                    {bookProject.selectedTitle}
                  </h1>
                  <h2 className="text-xl sm:text-2xl font-bold text-amber-300">
                    {bookProject.selectedSubtitle}
                  </h2>
                  <div className="text-xs text-slate-400 font-sans uppercase tracking-widest pt-2">
                    Genre: {bookProject.genre} • Reach - Your AI Agent Platform
                  </div>
                </div>

                {/* Chapters */}
                {bookProject.chapters.map((ch) => (
                  <div key={ch.id} className="space-y-6 border-b border-white/10 pb-10">
                    {/* Big font bold title & middle font bold subtitle */}
                    <div className={`space-y-2 ${getAlignmentClass(bookProject.alignment)}`}>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        {ch.title}
                      </h2>
                      {ch.subtitle && (
                        <h3 className="text-base sm:text-lg font-bold text-amber-300">
                          {ch.subtitle}
                        </h3>
                      )}
                    </div>

                    {/* Prose & placed illustrations */}
                    <div className={`space-y-5 leading-relaxed text-slate-200 ${getAlignmentClass(bookProject.alignment)}`}>
                      {ch.content ? (
                        ch.content.split('\n\n').map((para, pIdx) => {
                          const img = ch.images?.[pIdx];
                          return (
                            <React.Fragment key={pIdx}>
                              <p className="whitespace-pre-line">{para}</p>
                              {img && (
                                <div className="my-6 max-w-lg mx-auto text-center space-y-2 font-sans">
                                  <div className="overflow-hidden rounded-xl border border-white/15 aspect-video bg-black">
                                    <img src={img.url} alt={img.caption} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="text-xs italic text-amber-200 font-serif">
                                    "{img.caption}"
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <p className="italic text-slate-500 font-sans">[Chapter content pending generation]</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal for chapter illustrations */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-3xl w-full rounded-3xl overflow-hidden glass-panel border border-white/20 bg-[#0C0C18] shadow-2xl p-5 space-y-4">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video max-h-[65vh]">
              <img src={lightboxImage.url} alt={lightboxImage.caption} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {lightboxImage.placement}
                </span>
                <p className="text-xs text-slate-200 font-serif italic max-w-lg">
                  "{lightboxImage.caption}"
                </p>
              </div>

              <a
                href={lightboxImage.url}
                target="_blank"
                rel="noreferrer"
                download="chapter-illustration.jpg"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Illustration</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
