"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { GoBackButton } from "@/components/ui/go-back-button";
import { Icon } from "@/components/ui/icon";
import { getPaymentStatus } from "@/lib/status-util";
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
import EditPropertyForm from "@/components/admin/edit-property-form";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import AddTenantForm from "@/components/admin/property/add-tenant-form";
import EditTenantForm from "@/components/admin/property/edit-tenant-form";
import AddPaymentForm from "@/components/admin/property/add-payment-form";
import { useRouter, useParams } from "next/navigation";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useFetchProperty, useDeleteProperty } from "@/mutations/property";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { formatLongDate, formatCurrency } from "@/lib/formatters";
import { useRemoveTenantFromProperty } from "@/mutations/tenant";
import { RentStatus } from "@/types/lease";

const PropertyPage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showEditPropertySheet, setShowEditPropertySheet] = useState(false);
  const [showAddTenantSheet, setShowAddTenantSheet] = useState(false);
  const [showEditTenantSheet, setShowEditTenantSheet] = useState(false);
  const [showAddPaymentSheet, setShowAddPaymentSheet] = useState(false);
  const [showTenantDialog, setShowTenantDialog] = useState(false);

  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  // Fetch property data
  const {
    data: propertyResponse,
    isLoading,
    isError,
    error,
  } = useFetchProperty(propertyId);

  const deleteProperty = useDeleteProperty();

  const removeTenant = useRemoveTenantFromProperty();

  const property = propertyResponse?.data;

  // Dynamic tenant details grid
  const tenantDetailsGrid = property?.currentLease?.tenant
    ? [
        {
          label: "Phone",
          value: property.currentLease.tenant.phoneNumber || "Not provided",
        },
        {
          label: "Email",
          value: property.currentLease.tenant.email || "Not provided",
        },
        {
          label: "Level of Education",
          value:
            property.currentLease.tenant.levelOfEducation || "Not provided",
        },
      ]
    : [];

  // Dynamic tenancy details grid
  const tenancyDetailsGrid = property?.currentLease
    ? [
        {
          label: "Start Date",
          value: property.currentLease.startDate
            ? new Date(property.currentLease.startDate).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )
            : "Not set",
        },
        {
          label: "End Date",
          value: property.currentLease.endDate
            ? new Date(property.currentLease.endDate).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )
            : "Not set",
        },
        {
          label: "Rent Amount",
          value: `₦${parseFloat(property.currentLease.rentAmount.toString()).toLocaleString()}`,
        },
        {
          label: "Status",
          value: property.currentLease.rentStatus,
        },
      ]
    : [
        {
          label: "Lease Years",
          value: `${property?.leaseYears || 0} years`,
        },
        {
          label: "Rent Amount",
          value: `₦${parseFloat(property?.rentAmount || "0").toLocaleString()}`,
        },
        {
          label: "Status",
          value: "No active lease",
        },
      ];

  useBreadcrumb([
    { name: "Dashboard", href: "/super" },
    { name: property?.propertyName || "Property", href: "#" },
  ]);

  const tenant = !!property?.currentLease?.tenant;

  const handleDeleteProperty = async () => {
    try {
      await deleteProperty.mutateAsync(propertyId);
      toast.success("Property deleted successfully!");

      // Close the dialog
      setShowDialog(false);

      // Navigate back to properties list
      router.push("/admin");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property. Please try again.");
    }
  };

  const handleTenantRemoval = async () => {
    try {
      if (!property?.currentLeaseId) {
        toast.error("No lease found to remove tenant from.");
        return;
      }
      await removeTenant.mutateAsync(property.currentLeaseId);
      toast.success("Tenant removed successfully!");
      setShowTenantDialog(false);
    } catch (error) {
      console.error("Error removing tenant:", error);
      toast.error("Failed to remove tenant. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <LoadingSpinner />
        <p className="text-muted-foreground">Loading house details...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Icon
          icon="material-symbols:error-outline"
          size="xl"
          className="text-red-600"
        />
        <div className="text-center">
          <h2 className="text-lg font-semibold">Error loading house</h2>
          <p className="text-muted-foreground">
            {error?.message || "Something went wrong. Please try again."}
          </p>
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  // Property not found
  if (!property) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Icon
          icon="material-symbols:home-outline"
          size="xl"
          className="text-muted-foreground"
        />
        <div className="text-center">
          <h2 className="text-lg font-semibold">House not found</h2>
          <p className="text-muted-foreground">
            The house you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

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
                <h2 className="text-lg font-bold">{property?.propertyName}</h2>
              </div>

              {/* Add Tenant Button and Sheet */}
              {!property?.currentLease && (
                <Sheet
                  open={showAddTenantSheet}
                  onOpenChange={(open) => {
                    setShowAddTenantSheet(open);
                  }}
                >
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
                        <Button variant="ghost" className="w-fit p-0">
                          <Icon
                            icon="material-symbols:arrow-back"
                            className="mr-2"
                          />
                          Go Back
                        </Button>
                      </SheetClose>
                      <SheetTitle className="text-lg font-bold">
                        <>
                          <Icon
                            icon="material-symbols:location-home-outline-rounded"
                            className="mr-2"
                            size="lg"
                          />
                          Add Tenant
                        </>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto pr-2">
                      <AddTenantForm
                        rentAmount={parseFloat(property?.rentAmount) || 0}
                        propertyId={propertyId}
                        onSuccess={() => {
                          setShowAddTenantSheet(false);
                        }}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
            <Card className="bg-muted flex items-start gap-2 py-6">
              <div className="border-border text-foreground after:bg-secondary-foreground relative mr-1 rounded-full border p-2 after:absolute after:top-full after:left-1/2 after:h-8 after:w-px after:-translate-x-1/2">
                <Icon
                  icon="material-symbols:distance-outline-rounded"
                  size="lg"
                />
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-md font-semibold">
                  {property?.propertyArea}, {property?.propertyState}
                </p>
                <p className="text-md">{property?.propertyAddress}</p>
              </div>
            </Card>
            <div className="h-[554px] w-full overflow-hidden rounded-md">
              <Image
                src={property?.propertyImage || ""}
                alt={`${property?.propertyName || "Property"} Image`}
                width={5290}
                height={5540}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                <span className="bg-border text-secondary-foreground mr-1 px-3 py-1">
                  Created
                </span>
                By
                <span className="text-foreground mx-1 text-sm font-bold capitalize">
                  {property?.createdBy?.firstName}{" "}
                  {property?.createdBy?.lastName}
                </span>
                On
                <span className="text-foreground ml-1 text-sm font-bold capitalize">
                  {property?.createdAt && formatLongDate(property.createdAt)}
                </span>
              </p>
            </div>
            <div className="flex gap-4">
              {/* Edit Property Button and Sheet */}
              <Sheet
                open={showEditPropertySheet}
                onOpenChange={setShowEditPropertySheet}
              >
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
                    {property && (
                      <EditPropertyForm
                        property={property}
                        onSuccess={() => setShowEditPropertySheet(false)}
                      />
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                className="text-xs font-medium uppercase"
                onClick={() => setShowDialog(true)}
                disabled={deleteProperty.isPending}
              >
                {deleteProperty.isPending ? (
                  <>
                    <Icon
                      icon="material-symbols:progress-activity"
                      className="mr-2 animate-spin"
                    />
                    Removing...
                  </>
                ) : (
                  <>
                    <Icon
                      icon="material-symbols:bookmark-remove-outline-rounded"
                      className="mr-2"
                    />
                    Remove Property
                  </>
                )}
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
                <Sheet
                  open={showEditTenantSheet}
                  onOpenChange={setShowEditTenantSheet}
                >
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
                      <EditTenantForm
                        tenant={property?.currentLease?.tenant}
                        onSuccess={() => setShowEditTenantSheet(false)}
                      />
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
                    <p className="text-lg font-semibold">
                      {property?.currentLease?.tenant
                        ? `${property.currentLease.tenant.firstName} ${property.currentLease.tenant.lastName || ""}`.trim()
                        : "No tenant assigned"}
                    </p>
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
                              getPaymentStatus(item.value as RentStatus),
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
                    router.push(`/super/property/notification/${propertyId}`)
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
                    <Sheet
                      open={showAddPaymentSheet}
                      onOpenChange={setShowAddPaymentSheet}
                    >
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
                          <AddPaymentForm
                            rentAmount={parseFloat(property?.rentAmount) || 0}
                            leaseId={property?.currentLeaseId || ""}
                            onSuccess={() => setShowAddPaymentSheet(false)}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  {property?.payments && property.payments.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {property.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex w-full items-center justify-between"
                        >
                          <div className="border-accent-foreground flex flex-col gap-1 border-l-2 pl-4">
                            <p className="text-muted-foreground text-xs font-medium">
                              {formatLongDate(payment.paymentDate)}
                            </p>
                            <p className="text-sm font-bold">
                              {formatCurrency(payment.amount)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-medium uppercase"
                            onClick={() =>
                              payment.receiptUrl &&
                              window.open(payment.receiptUrl, "_blank")
                            }
                            disabled={!payment.receiptUrl}
                          >
                            <Icon
                              icon="material-symbols:download-rounded"
                              className="mr-2"
                            />
                            Receipt
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-16 w-full items-center justify-center">
                      <p className="text-muted-foreground text-sm">
                        No payment history available
                      </p>
                    </div>
                  )}
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
            ? "Are you sure you want to remove this house?"
            : "Are you sure you want to remove this tenant?"
        }
        subtitle={
          showDialog
            ? "House and all assigned to it will be permanently removed. This action can not be undone"
            : "Tenant will be removed from the House and left unassigned. This action can not be undone"
        }
        onConfirm={showDialog ? handleDeleteProperty : handleTenantRemoval}
        confirmText={showDialog ? "Yes, Remove House" : "Yes, Remove Tenant"}
        cancelText="No, Go Back"
        confirmLoading={showDialog ? deleteProperty.isPending : false}
        confirmVariant="destructive"
      />
    </>
  );
};

export default PropertyPage;
