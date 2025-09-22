"use client";

import { useState } from "react";
// import PropertiesTable from "@/components/admin/properties-table";
import PropertyManagement from "@/components/admin/property-management";
import DashboardStats from "@/components/admin/stats";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import AdminLocationsTable from "@/components/admin/locations/admin-locations-table";

const DashboardPage = () => {
  useBreadcrumb([{ name: "Dashboard", href: "/admin" }]);

  const [dueRentsCount, setDueRentsCount] = useState(0);
  return (
    <div className="flex flex-col gap-8">
      <DashboardStats setDueRentsCount={setDueRentsCount} />
      <PropertyManagement dueRentsCount={dueRentsCount} />
      <AdminLocationsTable />
    </div>
  );
};

export default DashboardPage;
