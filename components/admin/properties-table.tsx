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
import Avatar from "../ui/avatar";
import Pagination from "../ui/pagination";
import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Icon } from "@/components/ui/icon";
import { getFilterLabel, getLocationLabel } from "@/lib/table-utils";
import { useFetchProperties } from "@/mutations/property";
import type { Property } from "@/types/property";
import {
  TableSkeleton,
  TableSkeletonPresets,
} from "@/components/ui/table-skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

const filterItems = [
  { type: "label" as const, label: "Show" },
  {
    label: "All",
    value: "all",
  },
  {
    label: "Rent Paid",
    value: "paid",
  },
  {
    label: "Rent Unpaid",
    value: "unpaid",
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

const PropertiesTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const itemsPerPage = 20;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, isError, error } = useFetchProperties({
    page: currentPage - 1,
    pageSize: itemsPerPage,
    search: debouncedSearchTerm || undefined,
    filter: selectedFilter !== "all" ? selectedFilter : undefined,
    location: selectedLocation !== "all" ? selectedLocation : undefined,
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          <p className="text-muted-foreground uppercase">Properties</p>
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
              label: getLocationLabel(locationItems, selectedLocation),
              icon: "material-symbols:format-line-spacing-rounded",
              arrowIcon: "material-symbols:keyboard-arrow-up-rounded",
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
                <TableHead key={index} className={head.className}>
                  {head.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData && tableData.length > 0 ? (
              tableData.map((row) => (
                <TableRow key={row.id}>
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
                      {row.rentStatus}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground w-6 text-right">
                    <Link href={`/admin/property/${row.id}`}>
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

export default PropertiesTable;
