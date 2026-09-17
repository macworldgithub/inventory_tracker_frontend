import React from 'react';

interface ProgressBarProps {
  items: { percentage: number; colorClass: string; title?: string }[];
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ items, className = '' }) => {
  return (
    <div className={`w-full h-2 rounded-full bg-surface-subtle overflow-hidden flex ${className}`}>
      {items.map((item, index) => (
        <div 
          key={index}
          style={{ width: `${item.percentage}%` }} 
          className={`h-full ${item.colorClass}`}
          title={item.title}
        />
      ))}
    </div>
  );
};
