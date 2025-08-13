import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Reusable Table Skeleton Component
 *
 * A flexible skeleton loading component for tables that can be customized
 * for different table structures and layouts.
 *
 * @example
 * // Basic usage with preset
 * <TableSkeleton {...TableSkeletonPresets.properties} />
 *
 * @example
 * // Custom configuration
 * <TableSkeleton
 *   columns={4}
 *   rows={5}
 *   showFilters={false}
 *   columnConfig={[
 *     { width: "w-32", hasAvatar: true },
 *     { width: "w-24" },
 *     { width: "w-16", hasBadge: true },
 *     { width: "w-8", isRightAligned: true }
 *   ]}
 * />
 */

interface TableSkeletonProps {
  /** Number of columns in the table */
  columns: number;
  /** Number of skeleton rows to display */
  rows?: number;
  /** Whether to show search and filter skeleton above table */
  showFilters?: boolean;
  /** Whether to show pagination skeleton below table */
  showPagination?: boolean;
  /** Custom height for the table container */
  tableHeight?: string;
  /** Column configurations for more specific skeleton shapes */
  columnConfig?: Array<{
    /** Width class for the skeleton placeholder */
    width?: string;
    /** Whether this column has an avatar */
    hasAvatar?: boolean;
    /** Whether this column has a badge/status */
    hasBadge?: boolean;
    /** Whether this column is right-aligned */
    isRightAligned?: boolean;
  }>;
}

export function TableSkeleton({
  columns,
  rows = 8,
  showFilters = true,
  showPagination = true,
  tableHeight = "h-[585px]",
  columnConfig,
}: TableSkeletonProps) {
  // Default column configuration if none provided
  const defaultColumnConfig = Array.from({ length: columns }, (_, index) => {
    if (index === 0) {
      // First column typically has avatar + text
      return { width: "w-24", hasAvatar: true };
    } else if (index === columns - 1) {
      // Last column typically has actions (right-aligned)
      return { width: "w-8", isRightAligned: true };
    } else if (index === columns - 2) {
      // Second to last often has badges/status
      return { width: "w-16", hasBadge: true };
    }
    // Default text columns
    return { width: "w-20" };
  });

  const config = columnConfig || defaultColumnConfig;

  return (
    <div className="flex flex-col gap-4">
      {/* Search and filter skeleton */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      )}

      {/* Table skeleton */}
      <div className={`${tableHeight} overflow-hidden rounded-md border`}>
        <Table>
          <TableHeader>
            <TableRow>
              {config.map((col, index) => (
                <TableHead
                  key={index}
                  className={col.isRightAligned ? "text-right" : ""}
                >
                  <div
                    className={`h-4 ${col.width} animate-pulse rounded bg-gray-200`}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }, (_, i) => (
              <TableRow key={i}>
                {config.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={col.isRightAligned ? "text-right" : ""}
                  >
                    {col.hasAvatar ? (
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                        <div
                          className={`h-4 ${col.width} animate-pulse rounded bg-gray-200`}
                        />
                      </div>
                    ) : col.hasBadge ? (
                      <div
                        className={`h-6 ${col.width} animate-pulse rounded-xl bg-gray-200`}
                      />
                    ) : col.isRightAligned ? (
                      <div
                        className={`ml-auto h-8 ${col.width} animate-pulse rounded bg-gray-200`}
                      />
                    ) : (
                      <div
                        className={`h-4 ${col.width} animate-pulse rounded bg-gray-200`}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      {showPagination && (
        <div className="flex items-center justify-between">
          <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="h-8 w-8 animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Preset configurations for common table types
export const TableSkeletonPresets = {
  /** Standard properties table with avatar, location, tenant, status, and actions */
  properties: {
    columns: 5,
    columnConfig: [
      { width: "w-24", hasAvatar: true },
      { width: "w-32" },
      { width: "w-20" },
      { width: "w-16", hasBadge: true },
      { width: "w-8", isRightAligned: true },
    ] as Array<{
      width?: string;
      hasAvatar?: boolean;
      hasBadge?: boolean;
      isRightAligned?: boolean;
    }>,
  },

  /** Standard users table with avatar, name, email, role, status, and actions */
  users: {
    columns: 6,
    columnConfig: [
      { width: "w-24", hasAvatar: true },
      { width: "w-32" },
      { width: "w-24" },
      { width: "w-20" },
      { width: "w-16", hasBadge: true },
      { width: "w-8", isRightAligned: true },
    ] as Array<{
      width?: string;
      hasAvatar?: boolean;
      hasBadge?: boolean;
      isRightAligned?: boolean;
    }>,
  },

  /** Standard payments table with amount, date, status, method, and actions */
  payments: {
    columns: 5,
    columnConfig: [
      { width: "w-20" },
      { width: "w-24" },
      { width: "w-16", hasBadge: true },
      { width: "w-24" },
      { width: "w-8", isRightAligned: true },
    ] as Array<{
      width?: string;
      hasAvatar?: boolean;
      hasBadge?: boolean;
      isRightAligned?: boolean;
    }>,
  },

  /** Simple list table with just name and actions */
  simple: {
    columns: 2,
    columnConfig: [
      { width: "w-48" },
      { width: "w-8", isRightAligned: true },
    ] as Array<{
      width?: string;
      hasAvatar?: boolean;
      hasBadge?: boolean;
      isRightAligned?: boolean;
    }>,
  },
};
