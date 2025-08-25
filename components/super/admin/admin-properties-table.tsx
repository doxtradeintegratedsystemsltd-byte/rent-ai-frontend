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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getPaymentStatus } from "@/lib/status-util";
import Avatar from "../../ui/avatar";
import Pagination from "../../ui/pagination";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "../../ui/button";
import { Icon } from "@/components/ui/icon";
import { getFilterLabel, getLocationLabel } from "@/lib/table-utils";
import AddPropertyForm from "../properties/add-property-form";
import Link from "next/link";
import { useFetchProperties } from "@/mutations/property";
import type { Property } from "@/types/property";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  TableSkeleton,
  TableSkeletonPresets,
} from "@/components/ui/table-skeleton";

const filterItems = [
  { type: "label" as const, label: "Show" },
  {
    label: "All",
    value: "all",
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

const locationItems = [
  { type: "label" as const, label: "Arrange By" },
  {
    label: "Locations",
    value: "all",
  },
  {
    label: "Downtown",
    value: "downtown",
  },
  {
    label: "Uptown",
    value: "uptown",
  },
  { label: "Suburbs", value: "suburbs" },
];

const tableHead = [
  { label: "Property" },
  { label: "Location" },
  { label: "Tenant" },
  { label: "Rent Status" },
  { label: "", className: "text-right" },
];

const AdminPropertiesTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const adminId = params.id as string;

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

  const [selectedLocation, setSelectedLocation] = useState(() => {
    return searchParams.get("location") || "all";
  });

  const itemsPerPage = 20;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Function to update URL with current filter state
  const updateURL = useCallback(
    (params: {
      page?: number;
      search?: string;
      status?: string;
      location?: string;
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
      status: selectedFilter,
      location: selectedLocation,
    });
  }, [currentPage, searchTerm, selectedFilter, selectedLocation, updateURL]);

  const { data, isLoading, isError, error } = useFetchProperties({
    page: currentPage - 1,
    pageSize: itemsPerPage,
    search: debouncedSearchTerm || undefined,
    status: selectedFilter !== "all" ? selectedFilter : undefined,
    location: selectedLocation !== "all" ? selectedLocation : undefined,
    adminId: adminId, // Always include adminId to filter by this admin
  });

  const tableData = useMemo(() => {
    const properties: Property[] = data?.data?.data || [];
    return properties.map((property) => ({
      id: property.id,
      property: property.propertyName,
      location: `${property.propertyArea}, ${property.propertyState}`,
      tenant: property.currentLease?.tenant?.firstName
        ? `${property.currentLease.tenant.firstName} ${property.currentLease.tenant.lastName || ""}`.trim()
        : "No Tenant",
      rentStatus:
        property.currentLease?.rentStatus === "paid"
          ? ("paid" as const)
          : property.currentLease?.rentStatus === "overdue"
            ? ("overdue" as const)
            : property.currentLease?.rentStatus === "unpaid"
              ? ("due" as const)
              : ("due" as const),
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
        <p>Error loading properties: {error?.message || "Unknown error"}</p>
      </div>
    );
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    setCurrentPage(1);
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    setCurrentPage(1);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <p className="text-muted-foreground text-sm uppercase">Properties</p>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="uppercase">
                <Icon
                  icon="material-symbols:add-2-rounded"
                  className="mr-2"
                  size="sm"
                />
                Add Property
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[600px] max-w-[600px] min-w-[600px] [&>button]:hidden"
              style={{ width: "600px" }}
            >
              <SheetHeader>
                <SheetClose asChild className="mb-8 text-left">
                  <Button variant="ghost" className="w-fit p-0">
                    <Icon icon="material-symbols:arrow-back" className="mr-2" />
                    Go Back
                  </Button>
                </SheetClose>
                <SheetTitle className="text-lg font-bold">
                  <Icon
                    icon="material-symbols:add-home-outline-rounded"
                    className="mr-2"
                    size="lg"
                  />
                  Add Property
                </SheetTitle>
              </SheetHeader>
              <AddPropertyForm adminId={adminId} />
            </SheetContent>
          </Sheet>
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
              label: getFilterLabel(filterItems, selectedFilter),
              icon: "material-symbols:filter-list-rounded",
              arrowIcon: "material-symbols:keyboard-arrow-down-rounded",
              className: "bg-background",
            }}
            items={filterItems}
            selectedValue={selectedFilter}
            onItemSelect={handleFilterChange}
            useRadioGroup={true}
          />
          <Dropdown
            trigger={{
              label: getLocationLabel(locationItems, selectedLocation),
              icon: "material-symbols:format-line-spacing-rounded",
              arrowIcon: "material-symbols:keyboard-arrow-up-rounded",
              className: "bg-background",
            }}
            items={locationItems}
            selectedValue={selectedLocation}
            onItemSelect={handleLocationChange}
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
      <Table>
        <TableHeader>
          <TableRow className="bg-border">
            {tableHead.map((head, index) => (
              <TableHead key={index} className={head.className}>
                {head.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton
              {...TableSkeletonPresets.properties}
              rows={10}
              showFilters={false}
              showPagination={false}
              tableHeight="h-full"
            />
          ) : tableData && tableData.length > 0 ? (
            tableData.map((row) => (
              <TableRow key={row.id} className="bg-background">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar
                      src="/images/property-avatar.png"
                      alt="Property Avatar"
                      size="sm"
                    />
                    {row.property}
                  </div>
                </TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.tenant}</TableCell>
                <TableCell>
                  <p className={getPaymentStatus(row.rentStatus)}>
                    {row.rentStatus === "paid"
                      ? "Paid"
                      : row.rentStatus === "overdue"
                        ? "Overdue"
                        : "Due"}
                  </p>
                </TableCell>
                <TableCell className="text-muted-foreground w-6 text-right">
                  <Link href={`/super/property/${row.id}`}>
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
              <p>No property added.</p>
              <p>
                Click <span className="font-bold">“Add Property”</span> to get
                started.
              </p>
            </TableNoData>
          )}
        </TableBody>
      </Table>

      {paginationInfo.totalItems > 0 && !isLoading && (
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
};

export default AdminPropertiesTable;
