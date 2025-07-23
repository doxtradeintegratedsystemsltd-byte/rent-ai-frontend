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
import { useState, useMemo } from "react";
import { Button } from "../../ui/button";
import { Icon } from "@/components/ui/icon";
import {
  getLocationLabel,
  filterTableData,
  getPaginatedData,
} from "@/lib/table-utils";

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

const tableData = [
  {
    property: "Axel Home",
    location: "Gwarimpa, Abuja",
    tenant: "John Doe",
    rentStatus: "due" as const,
  },
  {
    property: "Dominoes House",
    location: "Wuse, Abuja",
    tenant: "Jane Smith",
    rentStatus: "due" as const,
  },
  {
    property: "Green Acres",
    location: "Lekki, Lagos",
    tenant: "Bob Johnson",
    rentStatus: "due" as const,
  },
  {
    property: "Sunny Villa",
    location: "Victoria Island, Lagos",
    tenant: "Alice Brown",
    rentStatus: "due" as const,
  },
  {
    property: "Ocean View",
    location: "Ikoyi, Lagos",
    tenant: "Charlie Davis",
    rentStatus: "due" as const,
  },
  {
    property: "Castle Castle",
    location: "Ikeja, Lagos",
    tenant: "David Wilson",
    rentStatus: "due" as const,
  },
  {
    property: "Bull House",
    location: "Asokoro, Abuja",
    tenant: "Eva Martinez",
    rentStatus: "due" as const,
  },
  {
    property: "Sky Tower",
    location: "Maitama, Abuja",
    tenant: "Frank Miller",
    rentStatus: "due" as const,
  },
  {
    property: "Garden Heights",
    location: "Ajah, Lagos",
    tenant: "Grace Taylor",
    rentStatus: "due" as const,
  },
  {
    property: "Royal Residence",
    location: "Banana Island, Lagos",
    tenant: "Henry Anderson",
    rentStatus: "due" as const,
  },
  {
    property: "Modern Apartment",
    location: "Garki, Abuja",
    tenant: "Ivy Thompson",
    rentStatus: "due" as const,
  },
  {
    property: "Luxury Penthouse",
    location: "Oniru, Lagos",
    tenant: "Jack Robinson",
    rentStatus: "due" as const,
  },
];

const DueRentsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return filterTableData(tableData, searchTerm, [
      "property",
      "location",
      "tenant",
    ]);
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

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-bold">Due Rents</h1>
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
      <div className="h-[570px] overflow-hidden rounded-md border">
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
                <TableRow key={index}>
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
                    <Button variant="ghost" size="icon">
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

export default DueRentsTable;
