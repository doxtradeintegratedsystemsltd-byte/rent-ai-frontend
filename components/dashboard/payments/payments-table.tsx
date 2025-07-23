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
import Avatar from "../../ui/avatar";
import Pagination from "../../ui/pagination";
import { useState, useMemo, useRef } from "react";
import { Button } from "../../ui/button";
import { Icon } from "@/components/ui/icon";
import usePrint, { PrintStyles } from "@/hooks/usePrint";
import { filterTableData, getPaginatedData } from "@/lib/table-utils";

const tableHead = [
  { label: "Property" },
  { label: "Tenant" },
  { label: "Amount" },
  { label: "Date" },
  { label: "", className: "text-right" },
];

const tableData = [
  {
    id: 1,
    property: "Axel Home",
    tenant: "John Doe",
    amount: "₦1,000,000",
    date: "Jul, 15, 2025",
  },
  {
    id: 2,
    property: "Dominoes House",
    tenant: "Jane Smith",
    amount: "₦1,000,000",
    date: "Jul, 16, 2025",
  },
  {
    id: 3,
    property: "Green Acres",
    tenant: "Bob Johnson",
    amount: "₦1,000,000",
    date: "Jul, 17, 2025",
  },
  {
    id: 4,
    property: "Sunny Villa",
    tenant: "Alice Brown",
    amount: "₦1,000,000",
    date: "Jul, 18, 2025",
  },
  {
    id: 5,
    property: "Ocean View",
    tenant: "Charlie Davis",
    amount: "₦1,000,000",
    date: "Jul, 19, 2025",
  },
  {
    id: 6,
    property: "Castle Castle",
    tenant: "David Wilson",
    amount: "₦1,000,000",
    date: "Jul, 20, 2025",
  },
  {
    id: 7,
    property: "Bull House",
    tenant: "Eva Martinez",
    amount: "₦1,000,000",
    date: "Jul, 21, 2025",
  },
  {
    id: 8,
    property: "Sky Tower",
    tenant: "Frank Miller",
    amount: "₦1,000,000",
    date: "Jul, 22, 2025",
  },
  {
    id: 9,
    property: "Garden Heights",
    tenant: "Grace Taylor",
    amount: "₦1,000,000",
    date: "Jul, 23, 2025",
  },
  {
    id: 10,
    property: "Royal Residence",
    tenant: "Henry Anderson",
    amount: "₦1,000,000",
    date: "Aug, 01, 2025",
  },
  {
    id: 11,
    property: "Modern Apartment",
    tenant: "Ivy Thompson",
    amount: "₦1,000,000",
    date: "Aug, 02, 2025",
  },
  {
    id: 12,
    property: "Luxury Penthouse",
    tenant: "Jack Robinson",
    amount: "₦1,000,000",
    date: "Aug, 03, 2025",
  },
  {
    id: 13,
    property: "Sunset Manor",
    tenant: "Kelly White",
    amount: "₦1,000,000",
    date: "Aug, 04, 2025",
  },
  {
    id: 14,
    property: "Golden Heights",
    tenant: "Liam Brown",
    amount: "₦1,000,000",
    date: "Aug, 05, 2025",
  },
  {
    id: 15,
    property: "Crystal Palace",
    tenant: "Maya Johnson",
    amount: "₦1,000,000",
    date: "Aug, 06, 2025",
  },
  {
    id: 16,
    property: "Pine Ridge",
    tenant: "Noah Davis",
    amount: "₦1,000,000",
    date: "Aug, 07, 2025",
  },
  {
    id: 17,
    property: "Blue Bay",
    tenant: "Olivia Wilson",
    amount: "₦1,000,000",
    date: "Aug, 08, 2025",
  },
  {
    id: 18,
    property: "Silver Springs",
    tenant: "Peter Martinez",
    amount: "₦1,000,000",
    date: "Aug, 09, 2025",
  },
  {
    id: 19,
    property: "Emerald Court",
    tenant: "Quinn Anderson",
    amount: "₦1,000,000",
    date: "Aug, 10, 2025",
  },
  {
    id: 20,
    property: "Rose Garden",
    tenant: "Rachel Thompson",
    amount: "₦1,000,000",
    date: "Aug, 11, 2025",
  },
  {
    id: 21,
    property: "Diamond Tower",
    tenant: "Samuel Clark",
    amount: "₦1,000,000",
    date: "Aug, 12, 2025",
  },
  {
    id: 22,
    property: "Maple Leaf",
    tenant: "Tina Rodriguez",
    amount: "₦1,000,000",
    date: "Aug, 13, 2025",
  },
  {
    id: 23,
    property: "Ivory Castle",
    tenant: "Victor Lewis",
    amount: "₦1,000,000",
    date: "Aug, 14, 2025",
  },
  {
    id: 24,
    property: "Coral Reef",
    tenant: "Wendy Lee",
    amount: "₦1,000,000",
    date: "Aug, 15, 2025",
  },
  {
    id: 25,
    property: "Thunder Peak",
    tenant: "Xavier Walker",
    amount: "₦1,000,000",
    date: "Aug, 16, 2025",
  },
  {
    id: 26,
    property: "Moonlight Villa",
    tenant: "Yara Hall",
    amount: "₦1,000,000",
    date: "Aug, 17, 2025",
  },
  {
    id: 27,
    property: "Starlight Towers",
    tenant: "Zack Allen",
    amount: "₦1,000,000",
    date: "Aug, 18, 2025",
  },
  {
    id: 28,
    property: "Harmony House",
    tenant: "Aria Young",
    amount: "₦1,000,000",
    date: "Aug, 19, 2025",
  },
  {
    id: 29,
    property: "Phoenix Plaza",
    tenant: "Blake King",
    amount: "₦1,000,000",
    date: "Aug, 20, 2025",
  },
  {
    id: 30,
    property: "Serenity Park",
    tenant: "Chloe Wright",
    amount: "₦1,000,000",
    date: "Aug, 21, 2025",
  },
  {
    id: 31,
    property: "Liberty Square",
    tenant: "Dylan Lopez",
    amount: "₦1,000,000",
    date: "Aug, 22, 2025",
  },
  {
    id: 32,
    property: "Victory Heights",
    tenant: "Emma Hill",
    amount: "₦1,000,000",
    date: "Aug, 23, 2025",
  },
];

const PaymentsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<
    (typeof tableData)[0] | null
  >(null);
  const itemsPerPage = 10;

  // Print setup
  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrint(receiptRef, {
    documentTitle: "Payment Receipt",
    additionalClass: PrintStyles.receipt,
    pageMargin: "10mm",
  });

  const filteredData = useMemo(() => {
    return filterTableData(tableData, searchTerm, ["property", "tenant"]);
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

  const handlePrintReceipt = (payment: (typeof tableData)[0]) => {
    setSelectedPayment(payment);
    // Small delay to ensure the state is updated before printing
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
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
                  <TableCell>{row.tenant}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell className="w-6 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrintReceipt(row)}
                      className="uppercase"
                    >
                      <Icon icon="material-symbols:print" />
                      Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData className="flex flex-col" colSpan={tableHead.length}>
                <p>
                  No rent payment history yet. Payment will be recorded
                  automatically when tenant pays or you manually record a
                  payment on a property’s page.
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

      {/* Hidden Receipt Component for Printing */}
      <div className="hidden">
        {selectedPayment && (
          <div ref={receiptRef}>
            <PaymentReceipt payment={selectedPayment} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsTable;

// Receipt Component for Printing
const PaymentReceipt = ({ payment }: { payment: (typeof tableData)[0] }) => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="mx-auto max-w-md bg-white p-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">PAYMENT RECEIPT</h1>
        <p className="mt-2 text-sm text-gray-600">Rent Management System</p>
      </div>

      <div className="mb-4 border-t border-b border-gray-300 py-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Receipt No:</p>
            <p className="text-gray-900">
              #{payment.id.toString().padStart(6, "0")}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Date:</p>
            <p className="text-gray-900">{payment.date}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-4">
          <p className="mb-1 font-semibold text-gray-700">Property:</p>
          <p className="text-gray-900">{payment.property}</p>
        </div>

        <div className="mb-4">
          <p className="mb-1 font-semibold text-gray-700">Tenant:</p>
          <p className="text-gray-900">{payment.tenant}</p>
        </div>

        <div className="mb-4">
          <p className="mb-1 font-semibold text-gray-700">Payment Type:</p>
          <p className="text-gray-900">Monthly Rent</p>
        </div>
      </div>

      <div className="mb-6 border-t border-gray-300 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">
            Total Amount:
          </span>
          <span className="text-xl font-bold text-gray-900">
            {payment.amount}
          </span>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        <p>Thank you for your payment!</p>
        <p className="mt-1">Generated on {currentDate}</p>
      </div>
    </div>
  );
};
