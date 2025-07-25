"use client";
import SuperDashboardStats from "@/components/dashboard/super/super-dashboard-stats";
import SuperTabs from "@/components/dashboard/super/super-tabs";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const page = () => {
  useBreadcrumb({
    items: [{ name: "Dashboard", href: "/dashboard/super" }],
  });

  return (
    <div className="flex flex-col gap-8">
      <SuperDashboardStats />
      <SuperTabs />
    </div>
  );
};

export default page;
