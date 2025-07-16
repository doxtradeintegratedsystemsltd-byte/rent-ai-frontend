import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  className,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show ellipsis logic
      if (currentPage <= 3) {
        // Show first 3 pages, ellipsis, last page
        pages.push(1, 2, 3, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page, ellipsis, last 3 pages
        pages.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push(
          1,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages,
        );
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="text-muted-foreground flex items-center gap-2 text-sm uppercase">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <Icon icon="material-symbols:chevron-left" className="h-8 w-8" />
        </Button>
        <span>Showing</span>
        <span className="text-foreground font-medium">
          {startItem}-{endItem}
        </span>
        <span>of</span>
        <span className="text-foreground font-medium">{totalItems}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          <Icon icon="material-symbols:chevron-right" className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
