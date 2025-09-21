"use client";

import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableNoData,
  TableRow,
} from "@/components/ui/table";
import { getPaymentStatus } from "@/lib/status-util";
import Avatar from "../../ui/avatar";
import Pagination from "../../ui/pagination";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "../../ui/button";
import { Icon } from "@/components/ui/icon";
import { useFetchDueRents } from "@/mutations/property";
import type { Property } from "@/types/property";
import {
  TableSkeleton,
  TableSkeletonPresets,
} from "@/components/ui/table-skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";
import { RentStatus } from "@/types/lease";

const tableHead = [
  { label: "S/N" },
  { label: "House" },
  { label: "Location" },
  { label: "Tenant" },
  { label: "Rent Status" },
];

const DueRentsTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page, 10) : 1;
  });

  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get("search") || "";
  });

  const itemsPerPage = 20;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Function to update URL with current filter state
  const updateURL = useCallback(
    (params: { page?: number; search?: string; location?: string }) => {
      const current = new URLSearchParams(window.location.search);

      // Update or remove parameters
      if (params.page && params.page > 1) {
        current.set("page", params.page.toString());
      } else {
        current.delete("page");
      }

      if (params.search && params.search.trim()) {
        current.set("search", params.search);
      } else {
        current.delete("search");
      }

      if (params.location && params.location !== "all") {
        current.set("location", params.location);
      } else {
        current.delete("location");
      }

      // Update URL without triggering a page reload
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${window.location.pathname}${query}`, { scroll: false });
    },
    [router],
  );

  // Update URL when filters change
  useEffect(() => {
    updateURL({
      page: currentPage,
      search: searchTerm,
    });
  }, [currentPage, searchTerm, updateURL]);

  const { data, isLoading, isError, error } = useFetchDueRents({
    page: currentPage - 1,
    pageSize: itemsPerPage,
    search: debouncedSearchTerm || undefined,
  });

  const tableData = useMemo(() => {
    const properties: Property[] = data?.data?.data || [];
    return properties.map((property, index) => ({
      id: property.id,
      serialNumber: (currentPage - 1) * itemsPerPage + index + 1,
      property: property.propertyName,
      propertyImage: property.propertyImage,
      location: property.location?.name || "-",
      tenant: property.currentLease?.tenant?.firstName
        ? `${property.currentLease.tenant.firstName} ${property.currentLease.tenant.lastName || ""}`.trim()
        : "-",
      rentStatus: property.currentLease?.rentStatus as RentStatus,
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
      <div className="py-8 text-center text-red-600">
        <p>Error loading due rents: {error?.message || "Unknown error"}</p>
      </div>
    );
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <p className="text-muted-foreground uppercase">Due Rents</p>
        </div>
        <div className="flex gap-2">
          <SearchInput
            placeholder="Search"
            className="bg-background"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
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
          {...TableSkeletonPresets.properties}
          rows={10}
          showFilters={false}
          showPagination={false}
          tableHeight="h-full"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
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
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/property/${row.id}`)}
                >
                  <TableCell className="text-muted-foreground">
                    {row.serialNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={row.propertyImage || "/images/property-avatar.png"}
                        alt="House Avatar"
                        size="sm"
                      />
                      {row.property}
                    </div>
                  </TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.tenant}</TableCell>
                  <TableCell>
                    <p className={getPaymentStatus(row.rentStatus)}>
                      {row.rentStatus}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData className="flex flex-col" colSpan={tableHead.length}>
                <p>No house added.</p>
                <p>
                  Click <span className="font-bold">“Add House”</span> to get
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

export default DueRentsTable;
