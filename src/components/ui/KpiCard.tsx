import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  variant?: 'default' | 'amber' | 'red' | 'emerald';
  iconColorClass?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  subtext, 
  icon, 
  variant = 'default',
  iconColorClass
}) => {
  const getContainerStyles = () => {
    switch (variant) {
      case 'amber':
        return 'glass-card border border-amber-500/20 bg-amber-500/5';
      case 'red':
        return 'glass-card border border-red-500/20 bg-red-500/5';
      case 'emerald':
        return 'glass-card border border-emerald-500/20 bg-emerald-500/5';
      default:
        return 'glass-card border border-surface-border';
    }
  };

  const getTitleStyles = () => {
    switch (variant) {
      case 'amber': return 'text-amber-300';
      case 'red': return 'text-red-300';
      case 'emerald': return 'text-emerald-300';
      default: return 'text-slate-400';
    }
  };

  const getValueStyles = () => {
    switch (variant) {
      case 'amber': return 'text-amber-400';
      case 'red': return 'text-red-400';
      case 'emerald': return 'text-emerald-400';
      default: return 'text-white';
    }
  };

  return (
    <div className={`p-4 rounded-xl ${getContainerStyles()}`}>
      <div className={`text-[11px] font-medium flex items-center justify-between ${getTitleStyles()}`}>
        <span className="uppercase">{title}</span>
        <div className={iconColorClass}>
          {icon}
        </div>
      </div>
      <div className={`text-2xl font-black font-mono mt-1 ${getValueStyles()}`}>
        {value}
      </div>
      <div className="text-[10px] text-slate-400 mt-1 font-mono">
        {subtext}
      </div>
    </div>
  );
};
