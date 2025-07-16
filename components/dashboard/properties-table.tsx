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

const locationItems = [
  { type: "label" as const, label: "Arrange By" },
  {
    label: "All Locations",
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
  { label: "Rent Status", className: "text-center" },
];

const tableData = [
  {
    property: "Axel Home",
    location: "Gwarimpa, Abuja",
    tenant: "John Doe",
    rentStatus: "paid" as const,
  },
  {
    property: "Dominoes House",
    location: "Wuse, Abuja",
    tenant: "Jane Smith",
    rentStatus: "nearDue" as const,
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
    rentStatus: "overdue" as const,
  },
  {
    property: "Ocean View",
    location: "Ikoyi, Lagos",
    tenant: "Charlie Davis",
    rentStatus: "paid" as const,
  },
  {
    property: "Castle Castle",
    location: "Ikeja, Lagos",
    tenant: "David Wilson",
    rentStatus: "nearDue" as const,
  },
  {
    property: "Bull House",
    location: "Asokoro, Abuja",
    tenant: "Eva Martinez",
    rentStatus: "paid" as const,
  },
  {
    property: "Sky Tower",
    location: "Maitama, Abuja",
    tenant: "Frank Miller",
    rentStatus: "overdue" as const,
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
    rentStatus: "paid" as const,
  },
  {
    property: "Modern Apartment",
    location: "Garki, Abuja",
    tenant: "Ivy Thompson",
    rentStatus: "nearDue" as const,
  },
  {
    property: "Luxury Penthouse",
    location: "Oniru, Lagos",
    tenant: "Jack Robinson",
    rentStatus: "overdue" as const,
  },
];

const PropertiesTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return tableData.filter(
      (item) =>
        item.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tenant.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

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

  const getFilterLabel = (): string => {
    const filterItem = filterItems.find(
      (item) => "value" in item && item.value === selectedFilter,
    ) as { label: string; value: string } | undefined;
    return filterItem ? filterItem.label : "ALL";
  };

  const getLocationLabel = (): string => {
    const locationItem = locationItems.find(
      (item) => "value" in item && item.value === selectedLocation,
    ) as { label: string; value: string } | undefined;
    return locationItem ? locationItem.label : "Location";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <p className="text-muted-foreground uppercase">Properties</p>
          <Dropdown
            trigger={{
              label: getFilterLabel(),
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
              label: getLocationLabel(),
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
                <TableCell className="flex items-center gap-2">
                  <Avatar
                    src="/images/property-avatar.png"
                    alt="Property Avatar"
                    size="sm"
                  />
                  {row.property}
                </TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.tenant}</TableCell>
                <TableCell className="flex justify-center">
                  <p className={getPaymentStatus(row.rentStatus)}>
                    {row.rentStatus}
                  </p>
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
