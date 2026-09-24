import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showPageSizeSelector?: boolean;
  showDetails?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100],
  className = "",
  showPageSizeSelector = true,
  showDetails = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  if (totalItems === 0) {
    return (
      <div
        className={`p-3 border-t border-surface-border bg-surface-elevated/40 text-xs text-slate-400 text-center ${className}`}
      >
        No records available
      </div>
    );
  }

  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, currentPage), safeTotalPages);

  const startItem = (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  // Helper to generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = isMobile ? 1 : 5;

    if (safeTotalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, safePage - 1);
      let end = Math.min(safeTotalPages - 1, safePage + 1);

      if (safePage <= 3) {
        start = 2;
        end = 4;
      } else if (safePage >= safeTotalPages - 2) {
        start = safeTotalPages - 3;
        end = safeTotalPages - 1;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < safeTotalPages - 1) {
        pages.push("...");
      }

      pages.push(safeTotalPages);
    }

    return pages;
  };

  return (
    <div
      className={`p-3 border-t border-surface-border bg-surface-elevated/60 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between text-xs text-slate-300 font-medium ${className}`}
    >
      {/* Details & Page Size */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        {showDetails && (
          <div className="leading-relaxed">
            Showing{" "}
            <span className="font-bold text-white font-mono">{startItem}</span>{" "}
            to <span className="font-bold text-white font-mono">{endItem}</span>{" "}
            of{" "}
            <span className="font-bold text-white font-mono">{totalItems}</span>{" "}
            entries
          </div>
        )}

        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2 sm:border-l sm:border-surface-border/80 sm:pl-4">
            <span className="text-slate-400">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-surface-card border border-surface-border rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-brand-500 font-mono text-xs cursor-pointer"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex w-full min-w-0 items-center justify-center gap-1 sm:ml-auto sm:w-auto sm:gap-1.5">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={safePage <= 1}
          title="First Page"
          className="hidden p-1.5 rounded-md bg-surface-card border border-surface-border hover:bg-surface-subtle hover:text-white disabled:opacity-40 disabled:hover:bg-surface-card disabled:cursor-not-allowed transition-colors text-slate-400 sm:block"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          title="Previous Page"
          className="shrink-0 p-1.5 rounded-md bg-surface-card border border-surface-border hover:bg-surface-subtle hover:text-white disabled:opacity-40 disabled:hover:bg-surface-card disabled:cursor-not-allowed transition-colors text-slate-400"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex min-w-0 items-center gap-1 font-mono">
          {getPageNumbers().map((p, idx) => {
            if (typeof p === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="shrink-0 px-1.5 py-1 text-slate-500 sm:px-2"
                >
                  ...
                </span>
              );
            }

            const isCurrent = p === safePage;
            return (
              <button
                key={`page-${p}`}
                onClick={() => onPageChange(p)}
                className={`h-7 min-w-[28px] shrink-0 rounded-md px-2 font-semibold text-xs transition-all flex items-center justify-center ${
                  isCurrent
                    ? "bg-brand-600 text-white font-bold shadow-sm shadow-brand-500/30 border border-brand-400/40"
                    : "bg-surface-card border border-surface-border text-slate-300 hover:bg-surface-subtle hover:text-white"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= safeTotalPages}
          title="Next Page"
          className="shrink-0 p-1.5 rounded-md bg-surface-card border border-surface-border hover:bg-surface-subtle hover:text-white disabled:opacity-40 disabled:hover:bg-surface-card disabled:cursor-not-allowed transition-colors text-slate-400"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(safeTotalPages)}
          disabled={safePage >= safeTotalPages}
          title="Last Page"
          className="hidden p-1.5 rounded-md bg-surface-card border border-surface-border hover:bg-surface-subtle hover:text-white disabled:opacity-40 disabled:hover:bg-surface-card disabled:cursor-not-allowed transition-colors text-slate-400 sm:block"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
