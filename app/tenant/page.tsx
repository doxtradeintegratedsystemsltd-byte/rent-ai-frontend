"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { getPaymentStatus } from "@/lib/status-util";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import TenantProfile from "@/components/tenant/tenant-profile";
import PropertyManagerProfile from "@/components/tenant/property-manager-profile";
import PayRentContent from "@/components/tenant/pay-rent-content";
import { useAuthActions, useUser } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useFetchTenantLease } from "@/mutations/tenant";
import { formatCurrency } from "@/lib/formatters";
import { paymentStatus } from "@/types/status";
import TenantNotifications from "@/components/tenant/tenant-notifications";
import { useSearchParams } from "next/navigation";
import { useGetPaymentStatusByReference } from "@/mutations/payment";

// (duplicate imports removed)

const TenantHomepage = () => {
  const [isPropertyExpanded, setIsPropertyExpanded] = useState(false);

  const { logout } = useAuthActions();
  const router = useRouter();

  const user = useUser();
  const {
    data: leaseData,
    isLoading: isLeaseLoading,
    error: leaseError,
  } = useFetchTenantLease();

  const searchParams = useSearchParams();
  const reference = searchParams?.get("reference") || undefined;
  const [openPayRent, setOpenPayRent] = useState(false);
  const [refPaymentStatus, setRefPaymentStatus] = useState<
    "completed" | "pending" | "failed" | undefined
  >(undefined);
  const { mutate: fetchPaymentStatus, isPending: isCheckingStatus } =
    useGetPaymentStatusByReference();

  // Auto open Pay Rent sheet if reference present
  useEffect(() => {
    if (reference) {
      setOpenPayRent(true);
      fetchPaymentStatus(reference, {
        onSuccess: (resp) => {
          setRefPaymentStatus(
            resp?.data?.status as "completed" | "pending" | "failed",
          );
        },
      });
    }
  }, [reference, fetchPaymentStatus]);

  // Prepare tenant details from user data
  const tenantDetails = user?.tenant
    ? [
        {
          label: "Phone",
          value: user.tenant.phoneNumber || "N/A",
        },
        {
          label: "Email",
          value: user.tenant.email || "N/A",
        },
        {
          label: "Level of Education",
          value: user.tenant.levelOfEducation || "N/A",
        },
      ]
    : [];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const togglePropertySection = () => {
    setIsPropertyExpanded(!isPropertyExpanded);
  };

  // Helper function to calculate days until lease end
  const calculateDaysUntilEnd = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useBreadcrumb([{ name: "Tenant Dashboard", href: "/tenant" }]);

  // Show loading state
  if (isLeaseLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Icon
            icon="material-symbols:loading"
            className="mb-4 animate-spin text-4xl"
          />
          <p>Loading tenant information...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (leaseError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Icon
            icon="material-symbols:error"
            className="text-destructive mb-4 text-4xl"
          />
          <p>Error loading tenant information</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="bg-border text-foreground relative mr-1 rounded-full p-2">
              <Icon
                icon="material-symbols:location-home-outline-rounded"
                size="lg"
              />
            </div>
            <p className="text-lg font-semibold">
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="border-foreground ml-auto inline-flex rounded-none border-b-1 p-0 px-1 text-[10px] uppercase md:hidden"
                >
                  Profile
                  <Icon
                    icon="material-symbols:arrow-right-alt-rounded"
                    size="xs"
                  />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full max-w-full min-w-full [&>button]:hidden">
                <SheetHeader>
                  <SheetClose asChild className="mb-8 text-left">
                    <Button variant="ghost" className="w-fit p-0">
                      <Icon
                        icon="material-symbols:arrow-back"
                        className="mr-2"
                      />
                      Go back
                    </Button>
                  </SheetClose>
                  <SheetTitle className="flex flex-col items-start">
                    <div className="bg-border text-foreground relative mr-1 rounded-full p-2">
                      <Icon
                        icon="material-symbols:location-home-outline-rounded"
                        size="lg"
                      />
                    </div>
                    <p className="mt-3 font-semibold">
                      {user
                        ? `${user.firstName} ${user.lastName}`
                        : "Loading..."}
                    </p>
                  </SheetTitle>
                </SheetHeader>
                <TenantProfile tenantDetails={tenantDetails} />
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden grid-cols-2 gap-4 md:grid">
            {tenantDetails.map((item) => (
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
        <div className="flex flex-col">
          <p className="text-muted-foreground mb-1 hidden text-xs font-medium uppercase md:block">
            Property
          </p>
          <Card className="flex flex-col gap-4">
            <p className="text-muted-foreground mb-1 block text-xs font-medium uppercase md:hidden">
              Property
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  <div className="border-secondary-foreground text-secondary-foreground relative rounded-full border p-1 sm:p-2">
                    <Icon
                      icon="material-symbols:home-app-logo"
                      className="h-4 w-4 sm:h-6 sm:w-6"
                    />
                  </div>
                  <h2 className="font-bold md:text-lg">
                    {leaseData?.data?.propertyName || "Loading..."}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 md:hidden"
                  onClick={togglePropertySection}
                >
                  <Icon
                    icon={
                      isPropertyExpanded
                        ? "material-symbols:keyboard-arrow-up"
                        : "material-symbols:keyboard-arrow-down"
                    }
                    size="sm"
                  />
                </Button>
              </div>

              {/* Property details - expandable on mobile */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out md:block ${
                  isPropertyExpanded
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <Card className="bg-muted flex items-start gap-2 py-6">
                    <div className="border-border text-foreground after:bg-secondary-foreground relative rounded-full border p-2 after:absolute after:top-full after:left-1/2 after:h-8 after:w-px after:-translate-x-1/2 md:mr-1">
                      <Icon
                        icon="material-symbols:distance-outline-rounded"
                        size="lg"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <p className="text-md font-semibold">
                        {leaseData?.data?.propertyArea || "Loading..."},{" "}
                        {leaseData?.data?.propertyState || ""}
                      </p>
                      <p className="md:text-md text-xs">
                        {leaseData?.data?.propertyAddress ||
                          "Loading address..."}
                      </p>
                    </div>
                  </Card>
                  <div className="h-[452px] w-full overflow-hidden rounded-md">
                    <Image
                      src={
                        leaseData?.data?.propertyImage ||
                        "/images/full-house.png"
                      }
                      alt="Property Image"
                      width={5290}
                      height={5540}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="secondary">
                <Icon
                  icon="material-symbols:supervised-user-circle-outline"
                  size="sm"
                />
                Property Manager
                <Icon icon="material-symbols:keyboard-arrow-right" size="sm" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[600px] max-w-[600px] min-w-[600px] [&>button]:hidden"
              style={{ width: "600px" }}
            >
              <SheetHeader>
                <SheetClose asChild className="mb-8 text-left">
                  <Button variant="ghost" className="w-fit p-0">
                    <Icon icon="material-symbols:arrow-back" className="mr-2" />
                    Go back
                  </Button>
                </SheetClose>
                <SheetTitle className="flex items-center text-lg font-bold">
                  <Icon
                    icon="material-symbols:supervised-user-circle-outline"
                    className="mr-2"
                  />
                  Property Manager
                </SheetTitle>
              </SheetHeader>

              <PropertyManagerProfile
                manager={
                  leaseData?.data?.currentLease?.createdBy ||
                  leaseData?.data?.createdBy
                }
                isLoading={isLeaseLoading}
              />
            </SheetContent>
          </Sheet>
          <Button size="sm" variant="secondary" onClick={handleLogout}>
            <Icon icon="material-symbols:logout" />
            Logout
          </Button>
        </div>
      </div>
      <Card className="bg-muted flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase">Tenancy</p>
          <div className="flex w-full items-center gap-4">
            <div className="flex w-full flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Start Date
              </p>
              <p className="text-sm font-medium">
                {leaseData?.data?.currentLease?.startDate
                  ? formatDate(leaseData.data.currentLease.startDate)
                  : "Loading..."}
              </p>
            </div>
            <div className="flex w-full flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                End Date
              </p>
              <p className="text-sm font-medium">
                {leaseData?.data?.currentLease?.endDate
                  ? formatDate(leaseData.data.currentLease.endDate)
                  : "Loading..."}
              </p>
            </div>
          </div>
          <div className="bg-accent flex flex-col items-center justify-center gap-1 rounded-md p-2">
            <p className="text-xs font-medium uppercase">Due In</p>
            <p className="text-lg font-bold uppercase">
              {leaseData?.data?.currentLease?.endDate
                ? `${calculateDaysUntilEnd(leaseData.data.currentLease.endDate)} Days`
                : "Loading..."}
            </p>
          </div>
          <div className="flex w-full items-center gap-4">
            <div className="flex w-full flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Rent Amount
              </p>
              <p className="text-sm font-medium">
                {leaseData?.data?.currentLease?.rentAmount
                  ? formatCurrency(leaseData.data.currentLease.rentAmount)
                  : "Loading..."}
              </p>
            </div>
            <div className="flex w-full flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Status
              </p>
              <p
                className={getPaymentStatus(
                  (leaseData?.data?.currentLease
                    ?.rentStatus as paymentStatus) || "paid",
                )}
              >
                {leaseData?.data?.currentLease?.rentStatus
                  ? leaseData.data.currentLease.rentStatus
                      .charAt(0)
                      .toUpperCase() +
                    leaseData.data.currentLease.rentStatus.slice(1)
                  : "Loading..."}
              </p>
            </div>
          </div>
        </div>
        <Sheet open={openPayRent} onOpenChange={setOpenPayRent}>
          <SheetTrigger asChild>
            <Button className="w-full text-xs uppercase">
              <Icon
                icon="material-symbols:account-balance-outline-rounded"
                size="sm"
              />
              Pay Rent
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-full min-w-full md:w-[600px] md:max-w-[600px] md:min-w-[600px] [&>button]:hidden">
            <SheetHeader>
              <SheetClose asChild className="mb-8 text-left">
                <Button variant="ghost" className="w-fit p-0">
                  <Icon icon="material-symbols:arrow-back" className="mr-2" />
                  Go back
                </Button>
              </SheetClose>
              <SheetTitle className="flex items-center text-lg font-bold">
                <Icon
                  icon="material-symbols:account-balance-outline-rounded"
                  className="mr-2"
                />
                Pay Rent
              </SheetTitle>
            </SheetHeader>
            {isCheckingStatus && reference && (
              <div className="text-muted-foreground mb-4 text-xs">
                Verifying payment status...
              </div>
            )}
            <PayRentContent
              leaseData={leaseData?.data}
              paymentStatus={refPaymentStatus}
            />
          </SheetContent>
        </Sheet>
        <Card className="bg-background flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase">Payment History</p>
          {leaseData?.data?.currentLease?.payment ? (
            <div className="border-accent flex items-center justify-between border-l-2 pl-4">
              <div className="flex flex-col">
                <p className="text-muted-foreground text-xs font-medium">
                  {formatDate(leaseData.data.currentLease.payment.paymentDate)}
                </p>
                <p className="text-sm font-bold">
                  {formatCurrency(leaseData.data.currentLease.payment.amount)}
                </p>
              </div>
              {leaseData.data.currentLease.payment.receiptUrl && (
                <Button
                  variant="ghost"
                  className="text-xs uppercase"
                  onClick={() =>
                    leaseData.data.currentLease.payment.receiptUrl &&
                    window.open(
                      leaseData.data.currentLease.payment.receiptUrl,
                      "_blank",
                    )
                  }
                >
                  <Icon icon="material-symbols:download-rounded" size="sm" />
                  Receipt
                </Button>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No payment history available
            </p>
          )}
        </Card>
      </Card>
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="flex-1" size="sm" variant="secondary">
              <Icon
                icon="material-symbols:supervised-user-circle-outline"
                size="sm"
              />
              Property Manager
              <Icon icon="material-symbols:keyboard-arrow-right" size="sm" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-full min-w-full [&>button]:hidden">
            <SheetHeader>
              <SheetClose asChild className="mb-8 text-left">
                <Button variant="ghost" className="w-fit p-0">
                  <Icon icon="material-symbols:arrow-back" className="mr-2" />
                  Go back
                </Button>
              </SheetClose>
              <SheetTitle className="flex items-center text-lg font-bold">
                <Icon
                  icon="material-symbols:supervised-user-circle-outline"
                  className="mr-2"
                />
                Property Manager
              </SheetTitle>
            </SheetHeader>

            <PropertyManagerProfile
              manager={
                leaseData?.data?.currentLease?.createdBy ||
                leaseData?.data?.createdBy
              }
              isLoading={isLeaseLoading}
            />
          </SheetContent>
        </Sheet>
        <Button className="flex-1" size="sm" variant="secondary">
          <Icon icon="material-symbols:logout" />
          Logout
        </Button>
      </div>
      <Card className="bg-muted hidden flex-col gap-4 md:flex">
        <div className="flex items-center gap-2">
          <Icon icon="material-symbols:notifications" className="mr-2" />
          <p className="text-lg font-bold">Notifications</p>
        </div>
        <TenantNotifications />
      </Card>
    </div>
  );
};

export default TenantHomepage;
