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
import Avatar from "../../ui/avatar";
import Pagination from "../../ui/pagination";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "../../ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { getSortLabel } from "@/lib/table-utils";
import { useFetchAdmins } from "@/mutations/admin";
import type { Admin } from "@/types/admin";
import {
  TableSkeleton,
  TableSkeletonPresets,
} from "@/components/ui/table-skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";

const arrangeByOptions = [
  { type: "label" as const, label: "Arrange By" },
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Oldest",
    value: "oldest",
  },
  {
    label: "Name",
    value: "name",
  },
  { label: "Rents Processed", value: "rentsProcessed" },
];

const tableHead = [
  { label: "Admin" },
  { label: "Properties" },
  { label: "Tenants" },
  { label: "Rent Processed" },
  { label: "", className: "text-right" },
];

const AdminsTable = () => {
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

  const [selectedSort, setSelectedSort] = useState(() => {
    return searchParams.get("sort") || "newest";
  });

  const itemsPerPage = 20;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Function to update URL with current filter state
  const updateURL = useCallback(
    (params: { page?: number; search?: string; sort?: string }) => {
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

      if (params.sort && params.sort !== "newest") {
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
      sort: selectedSort,
    });
  }, [currentPage, searchTerm, selectedSort, updateURL]);

  const { data, isLoading, isError, error } = useFetchAdmins({
    page: currentPage - 1,
    pageSize: itemsPerPage,
    search: debouncedSearchTerm || undefined,
  });

  const tableData = useMemo(() => {
    const admins: Admin[] = data?.data?.data || [];
    return admins.map((admin) => ({
      id: admin.id,
      name: `${admin.firstName} ${admin.lastName}`.trim(),
      email: admin.email,
      photoUrl: admin.photoUrl,
      properties: admin.properties,
      tenants: admin.tenants,
      rentsProcessed: formatCurrency(admin.rentProcessed),
      createdAt: admin.createdAt,
    }));
  }, [data]);

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
        <p>Error loading admins: {error?.message || "Unknown error"}</p>
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

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <p className="text-muted-foreground text-sm uppercase">Admins</p>
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
              label: getSortLabel(arrangeByOptions, selectedSort),
              icon: "material-symbols:format-line-spacing-rounded",
              arrowIcon: "material-symbols:keyboard-arrow-up-rounded",
              className: "bg-background",
            }}
            items={arrangeByOptions}
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
          {...TableSkeletonPresets.users}
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
                <TableHead key={index} className={head.className}>
                  {head.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData && tableData.length > 0 ? (
              tableData.map((row) => (
                <TableRow key={row.id} className="bg-background">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={row.photoUrl || "/images/avatar.png"}
                        alt="Admin Avatar"
                        size="sm"
                      />
                      <p className="font-medium">{row.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{row.properties}</TableCell>
                  <TableCell>{row.tenants}</TableCell>
                  <TableCell>{row.rentsProcessed}</TableCell>
                  <TableCell className="text-muted-foreground w-6 text-right">
                    <Link href={`/super/admin/${row.id}`}>
                      <Button variant="ghost" size="icon" asChild>
                        <span>
                          <Icon icon="material-symbols:keyboard-arrow-right" />
                        </span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData className="flex flex-col" colSpan={tableHead.length}>
                <p>No property managers added.</p>
                <p>
                  Click <span className="font-bold">“Add Admin</span> to get
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

export default AdminsTable;
