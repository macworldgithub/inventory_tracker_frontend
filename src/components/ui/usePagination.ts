import { useState, useMemo, useEffect } from 'react';

export function usePagination<T>(items: T[] = [], initialPageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  // Reset to page 1 whenever item length changes significantly or items list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure current page stays within valid bounds
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safeCurrentPage, pageSize]);

  const handlePageChange = (page: number) => {
    const targetPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(targetPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return {
    currentPage: safeCurrentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    setCurrentPage: handlePageChange,
    setPageSize: handlePageSizeChange,
  };
}
