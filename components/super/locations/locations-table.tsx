"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableNoData,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Pagination from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Dropdown } from "@/components/ui/dropdown";
import { getSortLabel } from "@/lib/table-utils";
import {
  TableSkeleton,
  TableSkeletonPresets,
} from "@/components/ui/table-skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetchLocations } from "@/mutations/locations";
import type { Location } from "@/types/locations";
import { formatDate } from "@/lib/formatters";

const arrangeByOptions = [
  { type: "label" as const, label: "Arrange By" },
  { label: "Newest", value: "DESC" },
  { label: "Oldest", value: "ASC" },
];

const tableHead = [
  { label: "S/N" },
  { label: "Location" },
  { label: "Houses" },
  { label: "Created" },
];

const LocationsTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page, 10) : 1;
  });
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || "",
  );
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">(
    () => (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC",
  );

  const itemsPerPage = 20;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const updateURL = useCallback(
    (params: {
      page?: number;
      search?: string;
      sortOrder?: "ASC" | "DESC";
    }) => {
      const current = new URLSearchParams(window.location.search);

      if (params.page && params.page > 1)
        current.set("page", params.page.toString());
      else current.delete("page");

      if (params.search && params.search.trim())
        current.set("search", params.search);
      else current.delete("search");

      if (params.sortOrder && params.sortOrder !== "DESC")
        current.set("sortOrder", params.sortOrder);
      else current.delete("sortOrder");

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${window.location.pathname}${query}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    updateURL({ page: currentPage, search: searchTerm, sortOrder });
  }, [currentPage, searchTerm, sortOrder, updateURL]);

  const { data, isLoading, isError, error } = useFetchLocations({
    page: currentPage - 1,
    pageSize: itemsPerPage,
    search: debouncedSearchTerm || undefined,
    sortOrder,
  });

  const tableData = useMemo(() => {
    const locations: Location[] = data?.data?.data || [];
    return locations.map((loc, index) => ({
      id: loc.id,
      serialNumber: (currentPage - 1) * itemsPerPage + index + 1,
      name: loc.name,
      propertiesCount: loc.propertiesCount ?? 0,
      createdAt: loc.createdAt,
    }));
  }, [data, currentPage, itemsPerPage]);

  const paginationInfo = useMemo(() => {
    return {
      totalItems: data?.data?.totalItems || 0,
      totalPages: data?.data?.totalPages || 0,
      currentPage: (data?.data?.currentPage || 0) + 1,
      pageSize: data?.data?.pageSize || itemsPerPage,
    };
  }, [data, itemsPerPage]);

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Icon
          icon="material-symbols:error-outline"
          size="xl"
          className="text-red-600"
        />
        <div className="text-center">
          <h2 className="text-lg font-semibold">Error loading locations</h2>
          <p className="text-muted-foreground">
            {error?.message || "Something went wrong. Please try again."}
          </p>
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSortChange = (value: string) => {
    setSortOrder((value as "ASC" | "DESC") || "DESC");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <p className="text-muted-foreground text-sm uppercase">Locations</p>
        </div>
        <div className="flex gap-2">
          <SearchInput
            placeholder="Search"
            className="bg-background"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <Dropdown
            trigger={{
              label: getSortLabel(arrangeByOptions, sortOrder),
              icon: "material-symbols:format-line-spacing-rounded",
              arrowIcon: "material-symbols:keyboard-arrow-up-rounded",
              className: "bg-background",
            }}
            items={arrangeByOptions}
            selectedValue={sortOrder}
            onItemSelect={handleSortChange}
            useRadioGroup={true}
            align="end"
          />
        </div>
      </div>
      {searchTerm && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs uppercase">
            Showing{" "}
            <span className="text-foreground font-medium capitalize">
              Search results for &quot;{searchTerm}&quot;
            </span>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground text-xs"
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
          >
            <Icon icon="material-symbols:close-rounded" />
            Close search
          </Button>
        </div>
      )}

      {isLoading ? (
        <TableSkeleton
          {...TableSkeletonPresets.simple}
          rows={10}
          showFilters={false}
          showPagination={false}
          tableHeight=""
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-border hover:bg-border">
              {tableHead.map((head, index) => (
                <TableHead key={index}>{head.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData && tableData.length > 0 ? (
              tableData.map((row) => (
                <TableRow
                  key={row.id}
                  className="bg-background hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/super/location/${row.id}`)}
                >
                  <TableCell className="text-muted-foreground">
                    {row.serialNumber}
                  </TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.propertiesCount}</TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData className="flex flex-col" colSpan={tableHead.length}>
                <p>No locations added.</p>
                <p>
                  Click <span className="font-bold">“Add Location”</span> to get
                  started.
                </p>
              </TableNoData>
            )}
          </TableBody>
        </Table>
      )}

      {paginationInfo.totalItems > 0 && (
        <Pagination
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={paginationInfo.pageSize}
          totalItems={paginationInfo.totalItems}
        />
      )}
    </div>
  );
};

export default LocationsTable;
