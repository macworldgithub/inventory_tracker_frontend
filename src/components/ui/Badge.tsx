import React from 'react';

type BadgeVariant = 'PRICE' | 'TRANSFER' | 'WHOLESALE' | 'COMPLETE' | 'HOLD' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', className = '' }) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'PRICE': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'TRANSFER': return 'bg-brand-500/20 text-brand-300 border-brand-500/30';
      case 'WHOLESALE': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'COMPLETE': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'HOLD': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'bg-surface-elevated text-slate-400 border-surface-border';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${getBadgeColors()} ${className}`}>
      {label}
    </span>
  );
};
