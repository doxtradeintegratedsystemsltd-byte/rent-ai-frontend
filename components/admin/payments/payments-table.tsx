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
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Button } from "../../ui/button";
import { Icon } from "@/components/ui/icon";
import { useGetPayments } from "@/mutations/payment";
import { Payment } from "@/types/payment";
import { formatCurrency, formatDate, formatLongDate } from "@/lib/formatters";
import usePrint, { PrintStyles } from "@/hooks/usePrint";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TableSkeleton,
  TableSkeletonPresets,
} from "@/components/ui/table-skeleton";

const tableHead = [
  { label: "S/N" },
  { label: "House" },
  { label: "Tenant" },
  { label: "Amount" },
  { label: "Date" },
  { label: "", className: "text-right" },
];

const PaymentsTable = () => {
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

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const itemsPerPage = 20;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Function to update URL with current filter state
  const updateURL = useCallback(
    (params: { page?: number; search?: string }) => {
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
    });
  }, [currentPage, searchTerm, updateURL]);

  // Fetch payments data with server-side pagination
  const { data, isLoading, isError, error } = useGetPayments({
    page: currentPage - 1,
    pageSize: itemsPerPage,
    search: debouncedSearchTerm || undefined,
  });

  const tableData = useMemo(() => {
    const payments: Payment[] = data?.data?.data || [];
    return payments.map((payment, index) => ({
      ...payment,
      serialNumber: (currentPage - 1) * itemsPerPage + index + 1,
      propertyName: payment.lease.property.propertyName,
      tenantName: `${payment.lease.tenant.firstName} ${payment.lease.tenant.lastName}`,
      formattedAmount: formatCurrency(payment.amount),
      formattedDate: formatDate(payment.paymentDate),
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

  // Print setup
  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrint(receiptRef, {
    documentTitle: "Payment Receipt",
    additionalClass: PrintStyles.receipt,
    pageMargin: "10mm",
  });

  if (isError) {
    return (
      <div className="py-8 text-center text-red-600">
        <p>Error loading payments: {error?.message || "Unknown error"}</p>
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

  const handlePrintReceipt = (payment: Payment) => {
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
            placeholder="Search house, tenant, amount, or date"
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
              tableData.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-muted-foreground">
                    {payment.serialNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={
                          payment.lease.property.propertyImage ||
                          "/images/property-avatar.png"
                        }
                        alt="House Avatar"
                        size="sm"
                      />
                      {payment.propertyName}
                    </div>
                  </TableCell>
                  <TableCell>{payment.tenantName}</TableCell>
                  <TableCell>{payment.formattedAmount}</TableCell>
                  <TableCell>{payment.formattedDate}</TableCell>
                  <TableCell className="w-6 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrintReceipt(payment)}
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
const PaymentReceipt = ({ payment }: { payment: Payment }) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="bg-muted flex w-full items-center justify-between p-8">
        <div className="w-full">
          <Icon icon="material-symbols:material-symbols:contract-outline-rounded" />
          <h2 className="text-2xl font-bold">Rent Payment</h2>
        </div>
        <p className="text-background bg-secondary-foreground rounded-md px-2 py-1 text-lg font-semibold uppercase">
          Receipt
        </p>
      </div>
      <div className="flex flex-col gap-6 p-8">
        <div className="">
          <p className="text-muted-foreground text-lg font-medium uppercase">
            Property
          </p>
          <p className="text-xl font-bold">
            {payment.lease.property.propertyName},{" "}
            {payment.lease.property.propertyAddress},{" "}
            {payment.lease.property.propertyArea},{" "}
            {payment.lease.property.propertyState}
          </p>
        </div>
        <div className="">
          <p className="text-muted-foreground text-lg font-medium uppercase">
            Tenant
          </p>
          <p className="text-xl font-bold">
            {payment.lease.tenant.firstName} {payment.lease.tenant.lastName}
          </p>
        </div>
        <div className="">
          <p className="text-muted-foreground text-lg font-medium uppercase">
            Amount Paid
          </p>
          <p className="text-xl font-bold">{formatCurrency(payment.amount)}</p>
        </div>
        <div className="">
          <p className="text-muted-foreground text-lg font-medium uppercase">
            Date Paid
          </p>
          <p className="text-xl font-bold">
            {formatLongDate(payment.createdAt)}
          </p>
        </div>
        <div className="">
          <p className="text-muted-foreground text-lg font-medium uppercase">
            Received By
          </p>
          <p className="text-xl font-bold">
            {payment.createdBy.firstName} {payment.createdBy.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};
