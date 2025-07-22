"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { GoBackButton } from "@/components/ui/go-back-button";
import { Icon } from "@/components/ui/icon";
import { getPaymentStatus } from "@/lib/status-util";
import { paymentStatus } from "@/types/status";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import EditPropertyForm from "@/components/dashboard/edit-property-form";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import AddTenantForm from "@/components/dashboard/property/add-tenant-form";
import EditTenantForm from "@/components/dashboard/property/edit-tenant-form";
import AddPaymentForm from "@/components/dashboard/property/add-payment-form";
import { useRouter } from "next/navigation";

const tenantDetailsGrid = [
  {
    label: "Phone",
    value: "08123456789",
  },
  {
    label: "Email",
    value: "aadebayo@gmail.com",
  },
  {
    label: "Level of Education",
    value: "Tertiary",
  },
  {
    label: "Job",
    value: "Accountant",
  },
];

const tenancyDetailsGrid = [
  {
    label: "Start Date",
    value: "January 1, 2025",
  },
  {
    label: "End Date",
    value: "December 31, 2025",
  },
  {
    label: "Rent Amount",
    value: "₦1,000,000",
  },
  {
    label: "Status",
    value: "paid",
  },
];

const PropertyPage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(true);
  const [showTenantDialog, setShowTenantDialog] = useState(false);

  const router = useRouter();

  const tenant = true;

  const handleDeleteProperty = () => {
    // Your delete logic here
    console.log("Item deleted!");
  };

  const handleTenantRemoval = () => {
    // Your tenant removal logic here
    console.log("Tenant removed!");
  };

  const id = 1;
  const propertyId = 1;

  return (
    <>
      <div className="flex flex-col gap-4">
        <GoBackButton className="self-start" />

        <Card className="grid grid-cols-2 gap-8 p-6">
          {/* Property Information */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-4">
                <div className="border-secondary-foreground text-secondary-foreground relative rounded-full border p-2">
                  <Icon icon="material-symbols:home-app-logo" size="lg" />
                </div>
                <h2 className="text-lg font-bold">Axel Home</h2>
              </div>

              {/* Add Tenant Button and Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="ml-auto text-xs font-medium uppercase"
                  >
                    <Icon
                      icon="material-symbols:bookmark-add-outline-rounded"
                      className="mr-2"
                    />
                    Add Tenant
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="flex w-[600px] max-w-[600px] min-w-[600px] flex-col [&>button]:hidden"
                  style={{ width: "600px" }}
                >
                  <SheetHeader className="flex-shrink-0">
                    <SheetClose asChild className="mb-8 text-left">
                      {isSubmitted ? null : (
                        <Button variant="ghost" className="w-fit p-0">
                          <Icon
                            icon="material-symbols:arrow-back"
                            className="mr-2"
                          />
                          Go Back
                        </Button>
                      )}
                    </SheetClose>
                    <SheetTitle className="text-lg font-bold">
                      {isSubmitted ? null : (
                        <>
                          <Icon
                            icon="material-symbols:location-home-outline-rounded"
                            className="mr-2"
                            size="lg"
                          />
                          Add Tenant
                        </>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto pr-2">
                    {isSubmitted ? (
                      <div className="flex h-full flex-col items-center justify-center gap-8 text-center">
                        <div className="bg-muted flex w-full flex-col items-center gap-6 rounded-md border px-8 py-16">
                          <div className="flex h-16 w-16 items-center justify-center">
                            <Image
                              src="/images/check.png"
                              alt="Checkmark"
                              width={64}
                              height={64}
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-foreground text-2xl font-bold">
                              Tenant Assigned
                            </h3>
                            <p className="text-secondary-foreground text-sm font-medium">
                              The tenant will be notified and receive login
                              details in their mail
                            </p>
                          </div>
                        </div>
                        <Button
                          className="w-full uppercase"
                          onClick={() => setIsSubmitted(false)}
                        >
                          GO TO PROPERTY
                        </Button>
                      </div>
                    ) : (
                      <AddTenantForm setIsSubmitted={setIsSubmitted} />
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <Card className="bg-muted flex items-start gap-2 py-6">
              <div className="border-border text-foreground after:bg-secondary-foreground relative mr-1 rounded-full border p-2 after:absolute after:top-full after:left-1/2 after:h-8 after:w-px after:-translate-x-1/2">
                <Icon
                  icon="material-symbols:distance-outline-rounded"
                  size="lg"
                />
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-md font-semibold">Gwarimpa, Abuja</p>
                <p className="text-md">
                  20, Malami Street, GRA, Gwarimpa, Abuja
                </p>
              </div>
            </Card>
            <div className="h-[554px] w-full overflow-hidden rounded-md">
              <Image
                src="/images/full-house.png"
                alt="Property Image"
                width={5290}
                height={5540}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                <span className="bg-muted text-secondary-foreground mr-1 px-3 py-1">
                  Created
                </span>
                By
                <span className="text-foreground mx-1 text-sm font-bold capitalize">
                  Creator's name
                </span>
                On
                <span className="text-foreground ml-1 text-sm font-bold capitalize">
                  December 1, 2024
                </span>
              </p>
            </div>
            <div className="flex gap-4">
              {/* Edit Property Button and Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-xs font-medium uppercase"
                  >
                    <Icon
                      icon="material-symbols:edit-outline-rounded"
                      className="mr-2"
                    />
                    Edit details
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="flex w-[600px] max-w-[600px] min-w-[600px] flex-col [&>button]:hidden"
                  style={{ width: "600px" }}
                >
                  <SheetHeader className="flex-shrink-0">
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
                      <Icon
                        icon="material-symbols:edit-outline-rounded"
                        className="mr-2"
                        size="lg"
                      />
                      Edit Property
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto pr-2">
                    <EditPropertyForm />
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                className="text-xs font-medium uppercase"
                onClick={() => setShowDialog(true)}
              >
                <Icon
                  icon="material-symbols:bookmark-remove-outline-rounded"
                  className="mr-2"
                />
                Remove Property
              </Button>
            </div>
          </div>

          {/* Tenant Information */}
          <Card className="bg-muted flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-md text-muted-foreground font-medium uppercase">
                Tenant
              </h2>
              <div className="flex gap-4">
                {/* Edit Tenant Button and Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-xs font-medium uppercase"
                      disabled={!tenant}
                      size="sm"
                    >
                      <Icon
                        icon="material-symbols:edit-outline-rounded"
                        className="mr-2"
                      />
                      Edit Details
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    className="flex w-[600px] max-w-[600px] min-w-[600px] flex-col [&>button]:hidden"
                    style={{ width: "600px" }}
                  >
                    <SheetHeader className="flex-shrink-0">
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
                        <Icon
                          icon="material-symbols:location-home-outline-rounded"
                          className="mr-2"
                          size="lg"
                        />
                        Edit Tenant
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto pr-2">
                      <EditTenantForm />
                    </div>
                  </SheetContent>
                </Sheet>

                <Button
                  className="text-xs font-medium uppercase"
                  disabled={!tenant}
                  size="sm"
                  onClick={() => setShowTenantDialog(true)}
                >
                  <Icon
                    icon="material-symbols:bookmark-remove-outline-rounded"
                    className="mr-2"
                  />
                  Remove Tenant
                </Button>
              </div>
            </div>
            {tenant ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <div className="bg-border text-foreground relative mr-1 rounded-full p-2">
                      <Icon
                        icon="material-symbols:location-home-outline-rounded"
                        size="lg"
                      />
                    </div>
                    <p className="text-lg font-semibold">Abdul Adebayo</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {tenantDetailsGrid.map((item) => (
                      <div className="flex flex-col gap-1" key={item.label}>
                        <p className="text-muted-foreground text-xs font-medium uppercase">
                          {item.label}
                        </p>
                        <p className="text-foreground text-sm font-medium">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <Card className="bg-background flex flex-col gap-5 rounded-md p-4">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase">Tenancy</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {tenancyDetailsGrid.map((item) => (
                      <div className="flex flex-col gap-1" key={item.label}>
                        <p className="text-muted-foreground text-xs font-medium uppercase">
                          {item.label}
                        </p>
                        <p
                          className={cn(
                            "text-foreground text-sm font-medium",
                            item.label === "Status" &&
                              getPaymentStatus(item.value as paymentStatus),
                          )}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
                <Button
                  className="self-end text-xs font-medium uppercase"
                  onClick={() =>
                    router.push(`/dashboard/property/notification/${id}`)
                  }
                >
                  <Icon
                    icon="material-symbols:send-outline-rounded"
                    className="mr-2"
                  />
                  Send Notification
                </Button>
                <Card className="bg-background flex flex-col gap-6">
                  <div className="flex w-full items-center justify-between">
                    <p className="text-foreground text-xs font-semibold uppercase">
                      Payment History
                    </p>

                    {/* Add Payment Button and Sheet */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs font-medium uppercase"
                        >
                          <Icon
                            icon="material-symbols:add-2-rounded"
                            className="mr-2"
                          />
                          Add Payment
                        </Button>
                      </SheetTrigger>
                      <SheetContent
                        className="flex w-[600px] max-w-[600px] min-w-[600px] flex-col [&>button]:hidden"
                        style={{ width: "600px" }}
                      >
                        <SheetHeader className="flex-shrink-0">
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
                            <Icon
                              icon="material-symbols:contract"
                              className="mr-2"
                              size="lg"
                            />
                            Add Payment
                          </SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto pr-2">
                          <AddPaymentForm />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <div className="border-accent-foreground flex flex-col gap-1 border-l-2 pl-4">
                      <p className="text-muted-foreground text-xs font-medium">
                        January 1, 2025
                      </p>
                      <p className="text-sm font-bold">₦1,000,000</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-medium uppercase"
                    >
                      <Icon
                        icon="material-symbols:download-rounded"
                        className="mr-2"
                      />
                      Receipt
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-accent-foreground text-sm font-medium">
                  <p>No tenant assigned</p>
                  <p>
                    Click <span className="font-bold">“Add Tenant”</span> to
                    assign
                  </p>
                </div>
              </div>
            )}
          </Card>
        </Card>
      </div>

      {/* Confirmation dialog depending on the action */}
      <ConfirmationDialog
        open={showDialog || showTenantDialog}
        onOpenChange={showDialog ? setShowDialog : setShowTenantDialog}
        title={
          showDialog
            ? "Are you sure you want to remove this property?"
            : "Are you sure you want to remove this tenant?"
        }
        subtitle={
          showDialog
            ? "Property and all assigned to it will be permanently removed. This action can not be undone"
            : "Tenant will be removed from the Property and left unassigned. This action can not be undone"
        }
        onConfirm={showDialog ? handleDeleteProperty : handleTenantRemoval}
        confirmText={showDialog ? "Yes, Remove Property" : "Yes, Remove Tenant"}
        cancelText="No, Go Back"
      />
    </>
  );
};

export default PropertyPage;
