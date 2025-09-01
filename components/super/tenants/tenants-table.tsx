"use client";

import { Dropdown } from "@/components/ui/dropdown";
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
import { getFilterLabel, getSortLabel } from "@/lib/table-utils";
import { useFetchTenants } from "@/mutations/tenant";
import type { Tenant } from "@/types/tenant";
import {
  TableSkeleton,
  TableSkeletonPresets,
} from "@/components/ui/table-skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";

const filterItems = [
  { type: "label" as const, label: "Show" },
  {
    label: "All",
    value: "all",
  },
  {
    label: "With House",
    value: "with-property",
  },
  {
    label: "Without House",
    value: "without-property",
  },
  {
    label: "Rent Paid",
    value: "rent-paid",
  },
  {
    label: "Rent Unpaid",
    value: "rent-unpaid",
  },
];

const sortItems = [
  { type: "label" as const, label: "Sort By" },
  {
    label: "Tenant Name",
    value: "name",
  },
  {
    label: "House",
    value: "property",
  },
  {
    label: "Location",
    value: "location",
  },
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Rent Status",
    value: "rent-status",
  },
];

const tableHead = [
  { label: "S/N" },
  { label: "Tenant" },
  { label: "House" },
  { label: "Location" },
  { label: "Admin" },
  { label: "Rent Status" },
];

const TenantsTable = () => {
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

  const [selectedFilter, setSelectedFilter] = useState(() => {
    return searchParams.get("status") || "all";
  });

  const [selectedSort, setSelectedSort] = useState(() => {
    return searchParams.get("sort") || "name";
  });

  const itemsPerPage = 20;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Function to update URL with current filter state
  const updateURL = useCallback(
    (params: {
      page?: number;
      search?: string;
      status?: string;
      sort?: string;
    }) => {
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

      if (params.status && params.status !== "all") {
        current.set("status", params.status);
      } else {
        current.delete("status");
      }

      if (params.sort && params.sort !== "name") {
        current.set("sort", params.sort);
      } else {
        current.delete("sort");
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
      status: selectedFilter,
      sort: selectedSort,
    });
  }, [currentPage, searchTerm, selectedFilter, selectedSort, updateURL]);

  const { data, isLoading, isError, error } = useFetchTenants({
    page: currentPage - 1,
    pageSize: itemsPerPage,
    search: debouncedSearchTerm || undefined,
    status: selectedFilter !== "all" ? selectedFilter : undefined,
    sort: selectedSort,
  });

  const tableData = useMemo(() => {
    const tenants: Tenant[] = data?.data?.data || [];
    return tenants.map((tenant, index) => ({
      id: tenant.id,
      serialNumber: (currentPage - 1) * itemsPerPage + index + 1,
      propertyId: tenant.currentLease?.property?.id || null,
      tenant: `${tenant.firstName} ${tenant.lastName}`,
      property: tenant.currentLease?.property?.propertyName || "No House",
      location: tenant.currentLease?.property
        ? `${tenant.currentLease.property.propertyArea}, ${tenant.currentLease.property.propertyState}`
        : "N/A",
      admin: tenant.createdBy?.firstName
        ? `${tenant.createdBy.firstName} ${tenant.createdBy.lastName || ""}`.trim()
        : "Unknown Admin",
      rentStatus: tenant.currentLease?.rentStatus || ("none" as const),
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
        <p>Error loading tenants: {error?.message || "Unknown error"}</p>
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

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <p className="text-muted-foreground text-sm uppercase">Tenants</p>
          <Dropdown
            trigger={{
              label: getFilterLabel(filterItems, selectedFilter),
              icon: "material-symbols:filter-list-rounded",
              arrowIcon: "material-symbols:keyboard-arrow-down-rounded",
            }}
            items={filterItems}
            selectedValue={selectedFilter}
            onItemSelect={handleFilterChange}
            useRadioGroup={true}
          />
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
              label: getSortLabel(sortItems, selectedSort),
              icon: "material-symbols:format-line-spacing-rounded",
              arrowIcon: "material-symbols:keyboard-arrow-up-rounded",
              className: "bg-background",
            }}
            items={sortItems}
            selectedValue={selectedSort}
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
          {...TableSkeletonPresets.properties}
          rows={10}
          showFilters={false}
          showPagination={false}
          tableHeight="h-full"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-border">
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
                  onClick={() => {
                    if (row.propertyId) {
                      router.push(`/super/property/${row.propertyId}`);
                    }
                  }}
                >
                  <TableCell className="text-muted-foreground">
                    {row.serialNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={row.tenant} alt="Tenant Avatar" size="sm" />
                      {row.tenant}
                    </div>
                  </TableCell>
                  <TableCell>{row.property}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.admin}</TableCell>
                  <TableCell>
                    <p className={getPaymentStatus(row.rentStatus)}>
                      {row.rentStatus}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData className="flex flex-col" colSpan={tableHead.length}>
                <p>No tenants found.</p>
                <p>
                  Click{" "}
                  <span className="font-bold">&quot;Add Tenant&quot;</span> to
                  get started.
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

export default TenantsTable;
