import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  rightContent?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  rightContent,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-black tracking-tight text-white flex items-center gap-2.5 flex-wrap text-[clamp(1.1rem,2vw,2rem)] leading-tight">
          {icon}
          {title}
        </h1>
        <p className="text-[0.68rem] sm:text-xs text-slate-400 mt-1 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {rightContent && (
        <div className="flex items-center gap-3">{rightContent}</div>
      )}
    </div>
  );
};
