import React, { useState, useMemo } from 'react';
import {
  Compass,
  ImageIcon,
  FileText,
  Video,
  BookOpen,
  Smartphone,
  Globe,
  BookMarked,
  MessageSquareCode,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  X,
  Sparkles,
  Layers,
  Calendar,
  Clock,
  Code2,
  Download,
  Eye,
  Sliders,
  ChevronRight,
  FolderClock,
  ArrowLeft,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GeneratorDirective, ActivityProject } from '../../types';

interface MyActivitiesFullPageProps {
  onBackToSettings?: () => void;
}

export const MyActivitiesFullPage: React.FC<MyActivitiesFullPageProps> = ({ onBackToSettings }) => {
  const {
    activityProjects,
    deleteActivityProject,
    loadActivityProjectIntoStudio,
    setActiveTab,
    setActiveDirective,
    addToast,
    celebrate,
  } = useApp();

  // Active Location Filter: 'all' or one of the 9 AI Directives
  const [selectedLocation, setSelectedLocation] = useState<GeneratorDirective | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Completed' | 'Active' | 'Published'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectProject, setInspectProject] = useState<ActivityProject | null>(null);

  // All AI Directives Configured as "Locations"
  const directiveLocations: {
    id: GeneratorDirective | 'all';
    label: string;
    sublabel: string;
    icon: React.ElementType;
    color: string;
    accentBg: string;
    borderColor: string;
  }[] = [
    {
      id: 'all',
      label: 'All',
      sublabel: 'Global Activity Feed',
      icon: Layers,
      color: 'text-indigo-400',
      accentBg: 'bg-indigo-500/15',
      borderColor: 'border-indigo-500/30',
    },
    {
      id: 'create-leads',
      label: 'Leads',
      sublabel: 'B2B Leads & Prospecting',
      icon: Compass,
      color: 'text-violet-400',
      accentBg: 'bg-violet-500/15',
      borderColor: 'border-violet-500/30',
    },
    {
      id: 'create-image',
      label: 'Images',
      sublabel: 'Logos, Visuals & Banners',
      icon: ImageIcon,
      color: 'text-pink-400',
      accentBg: 'bg-pink-500/15',
      borderColor: 'border-pink-500/30',
    },
    {
      id: 'create-post',
      label: 'Posts',
      sublabel: 'Social Posts & Copywriting',
      icon: FileText,
      color: 'text-amber-400',
      accentBg: 'bg-amber-500/15',
      borderColor: 'border-amber-500/30',
    },
    {
      id: 'create-video',
      label: 'Videos',
      sublabel: 'Commercial Storyboards & Ads',
      icon: Video,
      color: 'text-cyan-400',
      accentBg: 'bg-cyan-500/15',
      borderColor: 'border-cyan-500/30',
    },
    {
      id: 'create-brochure',
      label: 'Brochures',
      sublabel: 'Tri-Folds, Flyers & Print',
      icon: BookOpen,
      color: 'text-emerald-400',
      accentBg: 'bg-emerald-500/15',
      borderColor: 'border-emerald-500/30',
    },
    {
      id: 'create-apps',
      label: 'Apps',
      sublabel: 'Mobile Architectures & Screens',
      icon: Smartphone,
      color: 'text-blue-400',
      accentBg: 'bg-blue-500/15',
      borderColor: 'border-blue-500/30',
    },
    {
      id: 'create-websites',
      label: 'Websites',
      sublabel: 'Responsive Web Platforms',
      icon: Globe,
      color: 'text-teal-400',
      accentBg: 'bg-teal-500/15',
      borderColor: 'border-teal-500/30',
    },
    {
      id: 'create-books',
      label: 'Books',
      sublabel: 'Novels & Chapter Books',
      icon: BookMarked,
      color: 'text-orange-400',
      accentBg: 'bg-orange-500/15',
      borderColor: 'border-orange-500/30',
    },
    {
      id: 'lets-chat',
      label: 'Chat',
      sublabel: 'Tasks, Solutions & Code',
      icon: MessageSquareCode,
      color: 'text-fuchsia-400',
      accentBg: 'bg-fuchsia-500/15',
      borderColor: 'border-fuchsia-500/30',
    },
  ];

  // Calculate project counts per directive location
  const locationCounts = useMemo(() => {
    const counts: Record<string, number> = { all: activityProjects.length };
    activityProjects.forEach((proj) => {
      counts[proj.directive] = (counts[proj.directive] || 0) + 1;
    });
    return counts;
  }, [activityProjects]);

  // Filter projects by location, search query, and status
  const filteredProjects = useMemo(() => {
    return activityProjects.filter((proj) => {
      const matchLocation = selectedLocation === 'all' || proj.directive === selectedLocation;
      const matchStatus = statusFilter === 'all' || proj.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        proj.title.toLowerCase().includes(query) ||
        proj.description.toLowerCase().includes(query) ||
        (proj.prompt && proj.prompt.toLowerCase().includes(query)) ||
        proj.tags.some((t) => t.toLowerCase().includes(query));

      return matchLocation && matchStatus && matchSearch;
    });
  }, [activityProjects, selectedLocation, statusFilter, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Copied to Clipboard', text.slice(0, 50) + '...', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenInDirective = (project: ActivityProject) => {
    loadActivityProjectIntoStudio(project);
  };

  const handleCreateNewInLocation = (directive: GeneratorDirective) => {
    setActiveTab('studio');
    setActiveDirective(directive);
  };

  const handleExportJson = (project: ActivityProject) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Project Exported', `Downloaded ${project.title} as JSON`, 'success');
  };

  const getDirectiveBadge = (directive: GeneratorDirective) => {
    const loc = directiveLocations.find((l) => l.id === directive);
    if (!loc) return null;
    const Icon = loc.icon;
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${loc.accentBg} ${loc.borderColor} border text-[11px] font-semibold ${loc.color}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{loc.label}</span>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 pb-24 animate-in fade-in duration-300">
      {/* ========================================================= */}
      {/* TOP FULL-PAGE HEADER & NAVIGATION */}
      {/* ========================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 bg-gradient-to-r from-[#111126]/95 via-[#0E0E20]/95 to-[#0A0A16]/98 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/20">
                <FolderClock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Activities</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                    History Location
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Central history hub organized by AI generator directive locations. Inspect, re-open, or export all your generated projects.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons on top right */}
          <div className="flex items-center gap-2.5 shrink-0">
            {onBackToSettings && (
              <button
                type="button"
                onClick={onBackToSettings}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-indigo-400" />
                <span>Back to Settings</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('studio')}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Exit and return to Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Summary Statistics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Activities</span>
            <span className="text-xl font-extrabold text-white mt-0.5 block">{activityProjects.length} Projects</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Locations</span>
            <span className="text-xl font-extrabold text-indigo-300 mt-0.5 block">9 AI Directives</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Outputs</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block">
              {activityProjects.filter((p) => p.status === 'Completed' || p.status === 'Published').length} Ready
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Currently Viewing</span>
            <span className="text-xl font-extrabold text-cyan-300 mt-0.5 block truncate">
              {selectedLocation === 'all' ? 'All' : directiveLocations.find((l) => l.id === selectedLocation)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ON TOP: LIST OF ALL AI DIRECTIVES (LISTED ON TOP AS LOCATIONS) */}
      {/* ========================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>AI Directives</span>
            <span className="text-[10px] font-normal text-slate-500 lowercase">· click any directive to view created projects</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredProjects.length} of {activityProjects.length} projects shown
          </span>
        </div>

        {/* Scrollable Horizontal Locations Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {directiveLocations.map((loc) => {
            const Icon = loc.icon;
            const isSelected = selectedLocation === loc.id;
            const count = locationCounts[loc.id] || 0;

            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => setSelectedLocation(loc.id)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? `bg-white/10 ${loc.borderColor} text-white shadow-lg ring-1 ring-white/20 backdrop-blur-md`
                    : 'bg-[#111122]/80 border-white/10 text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/20'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isSelected ? loc.accentBg : 'bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${loc.color}`} />
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{loc.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isSelected
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : 'bg-white/10 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-normal">{loc.sublabel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SEARCH, STATUS FILTER & CONTROLS BAR */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0F0F20]/90 border border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities by project name, prompt, tags..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          {(['all', 'Completed', 'Active', 'Published'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* PROJECTS GRID: ALL PROJECTS CREATED THROUGH THE SELECTED LOCATION */}
      {/* ========================================================= */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-dashed border-white/15 bg-white/[0.02] space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Projects Found in this Location</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {searchQuery
                ? `No activity projects matched "${searchQuery}". Try clearing search filters.`
                : selectedLocation === 'all'
                ? 'No generation activities have been logged yet.'
                : `You haven't created any projects in ${directiveLocations.find((l) => l.id === selectedLocation)?.label} yet.`}
            </p>
          </div>

          {selectedLocation !== 'all' && (
            <button
              onClick={() => handleCreateNewInLocation(selectedLocation)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Project in {directiveLocations.find((l) => l.id === selectedLocation)?.label}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const isCopied = copiedId === project.id;
            const locationInfo = directiveLocations.find((l) => l.id === project.directive);

            return (
              <div
                key={project.id}
                className="group flex flex-col justify-between p-5 rounded-3xl glass-panel border border-white/10 hover:border-indigo-500/40 bg-gradient-to-br from-[#121226]/90 via-[#0F0F20]/90 to-[#0A0A17]/95 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all space-y-4"
              >
                {/* Project Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {getDirectiveBadge(project.directive)}

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          project.status === 'Completed' || project.status === 'Published'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : project.status === 'Active'
                            ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {project.status}
                      </span>

                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {project.timestamp}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Project Previews & Visuals if available */}
                  {project.preview?.imageUrls && project.preview.imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {project.preview.imageUrls.slice(0, 2).map((imgUrl, idx) => (
                        <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-white/10 group/img">
                          <img src={imgUrl} alt="Generated asset" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Card Footer & Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setInspectProject(project)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Inspect full details & metadata"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportJson(project)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Export project JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteActivityProject(project.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove from activities"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Primary 1-Click Action: Open in Directive Studio */}
                  <button
                    type="button"
                    onClick={() => handleOpenInDirective(project)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <span>Open in {locationInfo?.label || 'Directive'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* FULL-SCREEN INSPECTION MODAL */}
      {/* ========================================================= */}
      {inspectProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl glass-panel border border-white/20 bg-[#0E0E1F] space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getDirectiveBadge(inspectProject.directive)}
                  <span className="text-xs text-slate-400 font-mono">ID: {inspectProject.id}</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">{inspectProject.title}</h2>
                <p className="text-xs text-slate-400">Created: {inspectProject.createdAt} ({inspectProject.timestamp})</p>
              </div>

              <button
                type="button"
                onClick={() => setInspectProject(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Prompt */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Summary</h4>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">{inspectProject.description}</p>
              </div>

              {inspectProject.prompt && (
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Prompt</span>
                  <p className="text-xs text-indigo-200 font-medium">"{inspectProject.prompt}"</p>
                </div>
              )}
            </div>

            {/* Metrics Breakdown */}
            {inspectProject.metrics && inspectProject.metrics.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Specifications</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {inspectProject.metrics.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                      <span className="text-[10px] text-slate-400 uppercase block">{m.label}</span>
                      <span className="text-xs font-bold text-white block mt-0.5">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code / Script Preview if available */}
            {inspectProject.preview?.codePreview && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Code / Script Output</h4>
                  <button
                    onClick={() => handleCopy(inspectProject.preview!.codePreview!, 'modal-code')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    {copiedId === 'modal-code' ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto max-h-48 scrollbar-thin">
                  {inspectProject.preview.codePreview}
                </pre>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleExportJson(inspectProject)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleOpenInDirective(inspectProject);
                  setInspectProject(null);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open in {directiveLocations.find((l) => l.id === inspectProject.directive)?.label || 'Directive'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
