import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  rightContent?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, rightContent }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
          {icon}
          {title}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {subtitle}
        </p>
      </div>

      {rightContent && (
        <div className="flex items-center gap-3">
          {rightContent}
        </div>
      )}
    </div>
  );
};
