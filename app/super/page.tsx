"use client";
import SuperDashboardStats from "@/components/super/super-dashboard-stats";
import SuperTabs from "@/components/super/super-tabs";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SuperDashboardPage = () => {
  useBreadcrumb({
    items: [{ name: "Dashboard", href: "/super" }],
  });

  return (
    <div className="flex flex-col gap-8">
      <SuperDashboardStats />
      <SuperTabs />
    </div>
  );
};

export default SuperDashboardPage;
