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
import Avatar from "../../../ui/avatar";
import Pagination from "../../../ui/pagination";
import { useState, useMemo } from "react";
import { Button } from "../../../ui/button";
import { Icon } from "@/components/ui/icon";
import { useRouter } from "next/navigation";
import {
  getFilterLabel,
  getLocationLabel,
  getSortLabel,
  filterTableData,
  getPaginatedData,
} from "@/lib/table-utils";

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

const tableData = [
  {
    id: 1,
    name: "John Doe",
    properties: 3,
    tenants: 8,
    rentsProcessed: "₦12,500,000",
  },
  {
    id: 2,
    name: "Jane Smith",
    properties: 5,
    tenants: 12,
    rentsProcessed: "₦18,750,000",
  },
  {
    id: 3,
    name: "Bob Johnson",
    properties: 2,
    tenants: 6,
    rentsProcessed: "₦8,900,000",
  },
  {
    id: 4,
    name: "Alice Brown",
    properties: 4,
    tenants: 10,
    rentsProcessed: "₦15,200,000",
  },
  {
    id: 5,
    name: "Charlie Davis",
    properties: 6,
    tenants: 15,
    rentsProcessed: "₦22,800,000",
  },
  {
    id: 6,
    name: "David Wilson",
    properties: 1,
    tenants: 3,
    rentsProcessed: "₦4,500,000",
  },
  {
    id: 7,
    name: "Eva Martinez",
    properties: 7,
    tenants: 18,
    rentsProcessed: "₦28,600,000",
  },
  {
    id: 8,
    name: "Frank Miller",
    properties: 3,
    tenants: 9,
    rentsProcessed: "₦11,400,000",
  },
  {
    id: 9,
    name: "Grace Taylor",
    properties: 2,
    tenants: 5,
    rentsProcessed: "₦7,300,000",
  },
  {
    id: 10,
    name: "Henry Anderson",
    properties: 4,
    tenants: 11,
    rentsProcessed: "₦16,900,000",
  },
  {
    id: 11,
    name: "Ivy Thompson",
    properties: 5,
    tenants: 13,
    rentsProcessed: "₦19,800,000",
  },
  {
    id: 12,
    name: "Jack Robinson",
    properties: 8,
    tenants: 20,
    rentsProcessed: "₦35,200,000",
  },
];

const AdminsTable = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("all");
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return filterTableData(tableData, searchTerm, ["name"]);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = getPaginatedData(filteredData, currentPage, itemsPerPage);

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

  const navigateToAdmin = (adminId: number) => {
    router.push(`/dashboard/super/admin/${adminId}`);
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
              Search results for "{searchTerm}"
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
      <div className="h-[585px] overflow-hidden rounded-md border">
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
            {currentData && currentData.length > 0 ? (
              currentData.map((row, index) => (
                <TableRow key={row.id} className="bg-background">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src="/images/avatar.png"
                        alt="Admin Avatar"
                        size="sm"
                      />
                      {row.name}
                    </div>
                  </TableCell>
                  <TableCell>{row.properties}</TableCell>
                  <TableCell>{row.tenants}</TableCell>
                  <TableCell>{row.rentsProcessed}</TableCell>
                  <TableCell className="text-muted-foreground w-6 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateToAdmin(row.id)}
                    >
                      <Icon icon="material-symbols:keyboard-arrow-right" />
                    </Button>
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
      </div>

      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
        />
      )}
    </div>
  );
};

export default AdminsTable;
