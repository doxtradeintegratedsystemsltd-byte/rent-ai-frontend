"use client";

import DueRentsTable from "@/components/admin/due-rents/due-rents-table";
import { GoBackButton } from "@/components/ui/go-back-button";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const DueRentsPage = () => {
  useBreadcrumb([
    { name: "Dashboard", href: "/admin" },
    { name: "Due Rents", href: "/admin/due-rents" },
  ]);

  return (
    <div className="flex flex-col gap-4">
      <GoBackButton className="self-start" />
      <DueRentsTable />
    </div>
  );
};

export default DueRentsPage;
