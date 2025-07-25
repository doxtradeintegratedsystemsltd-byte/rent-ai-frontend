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
import Avatar from "../../../ui/avatar";
import Pagination from "../../../ui/pagination";
import { useState, useMemo } from "react";
import { Button } from "../../../ui/button";
import { Icon } from "@/components/ui/icon";
import { useRouter } from "next/navigation";
import {
  getFilterLabel,
  filterTableData,
  getPaginatedData,
} from "@/lib/table-utils";

const filterItems = [
  { type: "label" as const, label: "Show" },
  {
    label: "All",
    value: "all",
  },
  { label: "Occupied", value: "occupied" },
  { label: "Unoccupied", value: "unoccupied" },
  {
    label: "Rent Paid",
    value: "rentPaid",
  },
  {
    label: "Rent Unpaid",
    value: "rentUnpaid",
  },
];

const sortItems = [
  { type: "label" as const, label: "Sort By" },
  {
    label: "Property Name",
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
    label: "Tenant",
    value: "tenant",
  },
  {
    label: "Rent Status",
    value: "rentStatus",
  },
];

const tableHead = [
  { label: "Property" },
  { label: "Location" },
  { label: "Admin" },
  { label: "Tenant" },
  { label: "Rent Status" },
  { label: "", className: "text-right" },
];

const tableData = [
  {
    id: 1,
    property: "Axel Home",
    location: "Gwarimpa, Abuja",
    tenant: "John Doe",
    admin: "Sarah Johnson",
    rentStatus: "paid" as const,
  },
  {
    id: 2,
    property: "Dominoes House",
    location: "Wuse, Abuja",
    tenant: "Jane Smith",
    admin: "Michael Chen",
    rentStatus: "nearDue" as const,
  },
  {
    id: 3,
    property: "Green Acres",
    location: "Lekki, Lagos",
    tenant: "Bob Johnson",
    admin: "Lisa Rodriguez",
    rentStatus: "due" as const,
  },
  {
    id: 4,
    property: "Sunny Villa",
    location: "Victoria Island, Lagos",
    tenant: "Alice Brown",
    admin: "David Thompson",
    rentStatus: "overdue" as const,
  },
  {
    id: 5,
    property: "Ocean View",
    location: "Ikoyi, Lagos",
    tenant: "Charlie Davis",
    admin: "Emma Wilson",
    rentStatus: "paid" as const,
  },
  {
    id: 6,
    property: "Castle Castle",
    location: "Ikeja, Lagos",
    tenant: "David Wilson",
    admin: "James Martinez",
    rentStatus: "nearDue" as const,
  },
  {
    id: 7,
    property: "Bull House",
    location: "Asokoro, Abuja",
    tenant: "Eva Martinez",
    admin: "Rachel Green",
    rentStatus: "paid" as const,
  },
  {
    id: 8,
    property: "Sky Tower",
    location: "Maitama, Abuja",
    tenant: "Frank Miller",
    admin: "Kevin Lee",
    rentStatus: "overdue" as const,
  },
  {
    id: 9,
    property: "Garden Heights",
    location: "Ajah, Lagos",
    tenant: "Grace Taylor",
    admin: "Amanda Clark",
    rentStatus: "due" as const,
  },
  {
    id: 10,
    property: "Royal Residence",
    location: "Banana Island, Lagos",
    tenant: "Henry Anderson",
    admin: "Robert Davis",
    rentStatus: "paid" as const,
  },
  {
    id: 11,
    property: "Modern Apartment",
    location: "Garki, Abuja",
    tenant: "Ivy Thompson",
    admin: "Sophia Brown",
    rentStatus: "nearDue" as const,
  },
  {
    id: 12,
    property: "Luxury Penthouse",
    location: "Oniru, Lagos",
    tenant: "Jack Robinson",
    admin: "Mark Taylor",
    rentStatus: "overdue" as const,
  },
];

const PropertiesTable = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("property");
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    let data = filterTableData(tableData, searchTerm, [
      "property",
      "location",
      "admin",
      "tenant",
    ]);

    // Sort the data
    data.sort((a, b) => {
      const aValue = a[selectedSort as keyof typeof a];
      const bValue = b[selectedSort as keyof typeof b];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue);
      }
      return 0;
    });

    return data;
  }, [searchTerm, selectedSort]);

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

  const navigateToProperty = (propertyId: number) => {
    router.push(`/dashboard/property/${propertyId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <p className="text-muted-foreground text-sm uppercase">Properties</p>
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
              label: getFilterLabel(sortItems, selectedSort),
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
                  <TableCell>{row.admin}</TableCell>
                  <TableCell>{row.tenant}</TableCell>
                  <TableCell>
                    <p className={getPaymentStatus(row.rentStatus)}>
                      {row.rentStatus}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground w-6 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateToProperty(row.id)}
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

export default PropertiesTable;
