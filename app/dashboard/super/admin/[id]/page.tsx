"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import StatCard from "@/components/dashboard/stat-card";
import AdminPropertiesTable from "@/components/dashboard/super/admin/admin-properties-table";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { YearPicker } from "@/components/ui/date-picker";
import { GoBackButton } from "@/components/ui/go-back-button";
import { Icon } from "@/components/ui/icon";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import EditAdminForm from "@/components/dashboard/super/admin/edit-admin-form";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useState } from "react";

const statsData = [
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

const AdminPage = () => {
  useBreadcrumb({
    items: [
      { name: "Dashboard", href: "/dashboard/super" },
      { name: "Admin", href: "" },
    ],
  });

  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleConfirm = () => {
    // Handle the confirmation action here
    setOpen(false);
  };

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
              <Avatar src="/images/avatar.png" alt="Admin Avatar" size="sm" />
              <p className="text-lg font-bold">Bala Joseph</p>
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
                <EditAdminForm />
              </SheetContent>
            </Sheet>
            <Button
              className="uppercase"
              size="sm"
              onClick={() => setOpen(true)}
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
            <YearPicker placeholder="THIS YEAR" className="w-[120px]" />
          </div>
          <div className="flex w-full items-center gap-8">
            {statsData.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
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
        confirmText="Yes, Remove Admin"
        cancelText="No, Go Back"
      />
    </div>
  );
};

export default AdminPage;
