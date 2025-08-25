"use client";

import { useState } from "react";
import PropertiesTable from "@/components/admin/properties-table";
import PropertyManagement from "@/components/admin/property-management";
import DashboardStats from "@/components/admin/stats";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const DashboardPage = () => {
  useBreadcrumb([{ name: "Dashboard", href: "/admin" }]);

  const [dueRentsCount, setDueRentsCount] = useState(0);
  return (
    <div className="flex flex-col gap-8">
      <DashboardStats setDueRentsCount={setDueRentsCount} />
      <PropertyManagement dueRentsCount={dueRentsCount} />
      <PropertiesTable />
    </div>
  );
};

export default DashboardPage;
