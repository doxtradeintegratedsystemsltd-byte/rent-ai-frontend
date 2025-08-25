"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import StatCard from "@/components/ui/stat-card";
import AdminPropertiesTable from "@/components/super/admin/admin-properties-table";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Dropdown } from "@/components/ui/dropdown";
import { GoBackButton } from "@/components/ui/go-back-button";
import { Icon } from "@/components/ui/icon";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import EditAdminForm from "@/components/super/admin/edit-admin-form";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useState } from "react";
import { useFetchAdminDetails, useDeleteAdmin } from "@/mutations/admin";
import { useParams, useRouter } from "next/navigation";
import type { AdminDetailsFetchParams } from "@/types/admin";
import { toast } from "sonner";

// Period options for the dropdown
const periodOptions = [
  { label: "Today", value: "today", period: "day" },
  { label: "This Week", value: "thisWeek", period: "week" },
  { label: "Last Week", value: "lastWeek", period: "week" },
  { label: "This Month", value: "thisMonth", period: "month" },
  { label: "Last Month", value: "lastMonth", period: "month" },
  { label: "This Quarter", value: "thisQuarter", period: "quarter" },
  { label: "Last Quarter", value: "lastQuarter", period: "quarter" },
  { label: "This Year", value: "thisYear", period: "year" },
  { label: "Last Year", value: "lastYear", period: "year" },
  { label: "Last 30 Days", value: "last30Days", period: "30 days" },
  { label: "Last 365 Days", value: "last365Days", period: "365 days" },
  { label: "All Time", value: "oldestDate" },
];

const AdminPage = () => {
  const params = useParams();
  const router = useRouter();
  const adminId = params.id as string;

  const [selectedPeriod, setSelectedPeriod] =
    useState<AdminDetailsFetchParams["period"]>("thisWeek");
  const [open, setOpen] = useState(false);

  // Fetch admin details with the selected period
  const {
    data: adminResponse,
    isLoading,
    error,
  } = useFetchAdminDetails({
    id: adminId,
    period: selectedPeriod,
  });

  // Delete admin mutation
  const deleteAdminMutation = useDeleteAdmin();

  const adminData = adminResponse?.data;
  const adminUser = adminData?.user;
  const analytics = adminData?.analytics;

  // Set breadcrumb with admin name
  useBreadcrumb([
    { name: "Dashboard", href: "/super" },
    {
      name: adminUser
        ? `${adminUser.firstName} ${adminUser.lastName}`.trim()
        : "Admin",
      href: "",
    },
  ]);

  // Helper function to calculate percentage change and format with color
  const calculatePercentageChange = (
    current: number,
    previous: number,
    prefix: string = "",
  ) => {
    if (previous === 0) {
      // If previous is 0, we can't calculate percentage, so show absolute change
      const change = current - previous;
      const isPositive = change >= 0;
      return (
        <span
          className={`text-sm font-semibold ${isPositive ? "text-[#00BF1D]" : "text-red-600"}`}
        >
          {isPositive ? "↗" : "↘"} {isPositive ? "+" : ""}
          {prefix}
          {change.toLocaleString()}
        </span>
      );
    }

    const percentageChange = ((current - previous) / previous) * 100;
    const isPositive = percentageChange >= 0;

    return (
      <span
        className={`text-sm font-semibold ${isPositive ? "text-[#00BF1D]" : "text-red-600"}`}
      >
        {isPositive ? "↗" : "↘"} {isPositive ? "+" : ""}
        {percentageChange.toFixed(1)}%
      </span>
    );
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value as AdminDetailsFetchParams["period"]);
  };

  // Get the selected period label for display
  const selectedPeriodLabel =
    periodOptions.find((option) => option.value === selectedPeriod)?.label ||
    "This Week";

  const selectedPeriodName =
    periodOptions.find((option) => option.value === selectedPeriod)?.period ||
    "week";

  // Format the stats data
  const statsData = analytics
    ? [
        {
          title: "Properties",
          value: analytics.properties.all,
          subtitle: calculatePercentageChange(
            analytics.properties.current,
            analytics.properties.previous,
          ),
        },
        {
          title: "Tenants",
          value: analytics.tenants.all,
          subtitle: calculatePercentageChange(
            analytics.tenants.current,
            analytics.tenants.previous,
          ),
        },
        {
          title: "Rent Processed",
          value: `₦${analytics.payments.all.toLocaleString()}`,
          subtitle: calculatePercentageChange(
            analytics.payments.current,
            analytics.payments.previous,
            "₦",
          ),
        },
      ]
    : [
        {
          title: "Properties",
          value: 0,
          subtitle: "-",
        },
        {
          title: "Tenants",
          value: 0,
          subtitle: "-",
        },
        {
          title: "Rent Processed",
          value: "₦0",
          subtitle: "-",
        },
      ];

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleConfirm = async () => {
    try {
      await deleteAdminMutation.mutateAsync(adminId);
      toast.success("Admin deleted successfully!");
      setOpen(false);
      // Navigate back to the admins list
      router.push("/super");
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast.error("Failed to delete admin. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="py-8 text-center text-red-600">
        <p>Error loading admin details: {error?.message || "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div>
      <GoBackButton />
      <Card className="bg-muted flex flex-col gap-4">
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-xs font-semibold uppercase">
              Admin
            </p>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                </>
              ) : (
                <>
                  <Avatar
                    src={adminUser?.photoUrl || "/images/avatar.png"}
                    alt="Admin Avatar"
                    size="sm"
                  />
                  <p className="text-lg font-bold">
                    {adminUser
                      ? `${adminUser.firstName} ${adminUser.lastName}`.trim()
                      : "Admin"}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="uppercase" size="sm" variant="outline">
                  <Icon
                    icon="material-symbols:edit-outline-rounded"
                    className="mr-2"
                    size="sm"
                  />
                  Edit Details
                </Button>
              </SheetTrigger>
              <SheetContent
                className="w-[600px] max-w-[600px] min-w-[600px] [&>button]:hidden"
                style={{ width: "600px" }}
              >
                <SheetHeader>
                  <SheetClose asChild className="mb-8 text-left">
                    <Button variant="ghost" className="w-fit p-0">
                      <Icon
                        icon="material-symbols:arrow-back"
                        className="mr-2"
                      />
                      Go Back
                    </Button>
                  </SheetClose>
                  <SheetTitle className="text-lg font-bold">
                    Edit Admin
                  </SheetTitle>
                </SheetHeader>
                <EditAdminForm adminData={adminUser} />
              </SheetContent>
            </Sheet>
            <Button
              className="uppercase"
              size="sm"
              onClick={() => setOpen(true)}
              disabled={deleteAdminMutation.isPending}
            >
              <Icon
                icon="material-symbols:delete-outline-rounded"
                className="mr-2"
                size="sm"
              />
              Remove Admin
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium uppercase">
              Overview
            </p>
            <Dropdown
              trigger={{
                label: selectedPeriodLabel,
                icon: "material-symbols:calendar-month",
                arrowIcon: "material-symbols:keyboard-arrow-down",
                className: "w-[140px] uppercase text-xs font-medium",
              }}
              items={periodOptions}
              onItemSelect={handlePeriodChange}
              selectedValue={selectedPeriod}
              useRadioGroup={true}
            />
          </div>
          <div className="flex w-full items-center gap-8">
            {isLoading
              ? // Loading skeleton
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Card
                      key={index}
                      className="bg-border h-[110px] w-full animate-pulse"
                    />
                  ))
              : statsData.map((stat, index) => (
                  <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    subtitle={stat.subtitle}
                    period={selectedPeriodName}
                  />
                ))}
          </div>
        </div>
        <AdminPropertiesTable />
      </Card>

      <ConfirmationDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Are you sure you want to remove this admin?"
        subtitle="Admin and all properties related will be removed. This action can not be undone"
        onConfirm={handleConfirm}
        confirmText={
          deleteAdminMutation.isPending ? "Deleting..." : "Yes, Remove Admin"
        }
        cancelText="No, Go Back"
        confirmVariant="destructive"
        confirmLoading={deleteAdminMutation.isPending}
        confirmDisabled={deleteAdminMutation.isPending}
      />
    </div>
  );
};

export default AdminPage;
