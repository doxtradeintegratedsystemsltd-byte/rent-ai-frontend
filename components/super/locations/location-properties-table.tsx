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
import { useDebounce } from "@/hooks/useDebounce";
import { useFetchProperties } from "@/mutations/property";
import type { Property } from "@/types/property";
import Avatar from "@/components/ui/avatar";
import { getPaymentStatus } from "@/lib/status-util";
import {
  TableSkeleton,
  TableSkeletonPresets,
} from "@/components/ui/table-skeleton";

interface LocationPropertiesTableProps {
  locationId: string;
  title?: string;
  // Base path for property details navigation, defaults to "/super/property" but can be overridden to "/admin/property"
  propertyBasePath?: string;
}
const tableHead = [
  { label: "S/N" },
  { label: "House" },
  { label: "Admin" },
  { label: "Tenant" },
  { label: "Rent Status" },
];
export default function LocationPropertiesTable({
  locationId,
  title,
  propertyBasePath = "/super/property",
}: LocationPropertiesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page, 10) : 1;
  });

  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get("search") || "";
  });

  const itemsPerPage = 20;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const updateURL = useCallback(
    (params: { page?: number; search?: string }) => {
      const current = new URLSearchParams(window.location.search);

      if (params.page && params.page > 1)
        current.set("page", params.page.toString());
      else current.delete("page");

      if (params.search && params.search.trim())
        current.set("search", params.search);
      else current.delete("search");

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${window.location.pathname}${query}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    updateURL({ page: currentPage, search: searchTerm });
  }, [currentPage, searchTerm, updateURL]);

  const { data, isLoading, isError, error } = useFetchProperties({
    page: currentPage - 1,
    pageSize: itemsPerPage,
    search: debouncedSearchTerm || undefined,
    locationId,
  });

  const tableData = useMemo(() => {
    const properties: Property[] = data?.data?.data || [];
    return properties.map((property, index) => ({
      id: property.id,
      serialNumber: (currentPage - 1) * itemsPerPage + index + 1,
      property: property.propertyName,
      propertyImage: property.propertyImage,
      admin: property.createdBy?.firstName
        ? `${property.createdBy.firstName} ${property.createdBy.lastName || ""}`.trim()
        : "Unknown Admin",
      tenant: property.currentLease?.tenant?.firstName
        ? `${property.currentLease.tenant.firstName} ${property.currentLease.tenant.lastName || ""}`.trim()
        : "-",
      rentStatus: property.currentLease?.rentStatus || ("none" as const),
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
          <h2 className="text-lg font-semibold">Error loading houses</h2>
          <p className="text-muted-foreground">
            {error?.message || "Something went wrong. Please try again."}
          </p>
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <p className="text-muted-foreground text-sm uppercase">
            {title || "Houses in Location"}
          </p>
        </div>
        <div className="flex gap-2">
          <SearchInput
            placeholder="Search"
            className="bg-background"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
            <TableRow className="bg-border hover:bg-border">
              {tableHead.map((head, index) => (
                <TableHead key={index}>{head.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((row) => (
                <TableRow
                  key={row.id}
                  className="bg-background hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`${propertyBasePath}/${row.id}`)}
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
                  <TableCell>{row.admin}</TableCell>
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
                <p>No house in this location.</p>
              </TableNoData>
            )}
          </TableBody>
        </Table>
      )}

      {paginationInfo.totalItems > 0 && (
        <Pagination
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          itemsPerPage={paginationInfo.pageSize}
          totalItems={paginationInfo.totalItems}
        />
      )}
    </div>
  );
}
