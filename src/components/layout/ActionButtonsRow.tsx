import React from 'react';
import { motion } from 'motion/react';
import { Image, FileText, Video, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';

interface ActionButtonsRowProps {
  compact?: boolean;
  className?: string;
  onActionClick?: (tab: NavTab) => void;
}

export const ActionButtonsRow: React.FC<ActionButtonsRowProps> = ({
  compact = false,
  className = '',
  onActionClick,
}) => {
  const { setActiveTab } = useApp();

  const handleRoute = (tab: NavTab) => {
    setActiveTab(tab);
    if (onActionClick) {
      onActionClick(tab);
    }
  };

  const actionItems: {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    gradient: string;
    glowColor: string;
    description: string;
  }[] = [
    {
      id: 'create-image',
      label: 'Images',
      icon: Image,
      gradient: 'from-pink-500 via-rose-500 to-amber-500',
      glowColor: 'group-hover:shadow-[0_0_25px_rgba(244,63,94,0.4)]',
      description: 'Realistic, 3D, & Ad Banners',
    },
    {
      id: 'create-post',
      label: 'Posts',
      icon: FileText,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      glowColor: 'group-hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]',
      description: 'LinkedIn, X, IG & TikTok',
    },
    {
      id: 'create-video',
      label: 'Videos',
      icon: Video,
      gradient: 'from-violet-600 via-indigo-600 to-cyan-500',
      glowColor: 'group-hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]',
      description: 'Scripts, Scenes & Neural Voice',
    },
    {
      id: 'create-brochure',
      label: 'Brochures',
      icon: BookOpen,
      gradient: 'from-cyan-500 via-teal-500 to-emerald-500',
      glowColor: 'group-hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]',
      description: 'Tri-Folds, Flyers & Print PDFs',
    },
  ];

  if (compact) {
    return (
      <div className={`grid grid-cols-2 gap-2 ${className}`}>
        {actionItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoute(item.id)}
              className="group relative flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all text-left overflow-hidden"
            >
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shrink-0 shadow-sm`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {item.description}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Quick Generation Studio</span>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-400">
          Pick an asset type to generate instantly
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {actionItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoute(item.id)}
              className={`group relative flex flex-col p-4 rounded-2xl bg-white/[0.05] dark:bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 transition-all text-left overflow-hidden backdrop-blur-md cursor-pointer ${item.glowColor}`}
            >
              {/* Subtle gradient background sheen on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}
              />

              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  AI Ready
                </span>
              </div>

              <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors">
                {item.label}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-400 mt-1 line-clamp-1">
                {item.description}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
