"use client";
import { useState } from "react";
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
import { useAuthActions } from "@/store/authStore";
import { useRouter } from "next/navigation";

const tenantDetails = [
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

const notificationsData = [
  {
    id: 1,
    date: "JAN 1, 2025",
    time: "10:00AM",
    title: "Rent Due",
    content: "",
    isUnread: true,
    isExpanded: false,
  },
  {
    id: 2,
    date: "JAN 1, 2024",
    time: "10:00AM",
    title: "Rent Paid",
    content:
      "You successfully paid rent of ₦1,000,000 and tenancy is extended till December 31, 2024",
    isUnread: false,
    isExpanded: true,
  },
  {
    id: 3,
    date: "JAN 1, 2024",
    time: "10:00AM",
    title: "Rent Due",
    content: "",
    isUnread: false,
    isExpanded: false,
  },
];

const TenantHomepage = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [isPropertyExpanded, setIsPropertyExpanded] = useState(false);

  const { logout } = useAuthActions();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleNotification = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isExpanded: !notification.isExpanded }
          : notification,
      ),
    );
  };

  const togglePropertySection = () => {
    setIsPropertyExpanded(!isPropertyExpanded);
  };

  useBreadcrumb({
    items: [{ name: "Tenant Dashboard", href: "/tenant" }],
  });
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
            <p className="text-lg font-semibold">Abdul Adebayo</p>
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
                    <p className="mt-3 font-semibold">Abdul Adebayo</p>
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
                  <h2 className="font-bold md:text-lg">Axel Home</h2>
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
                      <p className="text-md font-semibold">Gwarimpa, Abuja</p>
                      <p className="md:text-md text-xs">
                        20, Malami Street, GRA, Gwarimpa, Abuja
                      </p>
                    </div>
                  </Card>
                  <div className="h-[452px] w-full overflow-hidden rounded-md">
                    <Image
                      src="/images/full-house.png"
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

              <PropertyManagerProfile />
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
              <p className="text-sm font-medium">January 1, 2025</p>
            </div>
            <div className="flex w-full flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                End Date
              </p>
              <p className="text-sm font-medium">December 31, 2025</p>
            </div>
          </div>
          <div className="bg-accent flex flex-col items-center justify-center gap-1 rounded-md p-2">
            <p className="text-xs font-medium uppercase">Due In</p>
            <p className="text-lg font-bold uppercase">300 Days</p>
          </div>
          <div className="flex w-full items-center gap-4">
            <div className="flex w-full flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Rent Amount
              </p>
              <p className="text-sm font-medium">₦1,000,000</p>
            </div>
            <div className="flex w-full flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Status
              </p>
              <p className={getPaymentStatus("paid")}>Paid</p>
            </div>
          </div>
        </div>
        <Sheet>
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

            <PayRentContent />
          </SheetContent>
        </Sheet>
        <Card className="bg-background flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase">Payment History</p>
          <div className="border-accent flex items-center justify-between border-l-2 pl-4">
            <div className="flex flex-col">
              <p className="text-muted-foreground text-xs font-medium">
                January 1, 2025
              </p>
              <p className="text-sm font-bold">₦1,000,000</p>
            </div>
            <Button variant="ghost" className="text-xs uppercase">
              <Icon icon="material-symbols:download-rounded" size="sm" />
              Receipt
            </Button>
          </div>
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

            <PropertyManagerProfile />
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

        {/* Notification items */}
        <div className="flex flex-col gap-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className="bg-background">
              <div className="flex flex-col gap-3">
                {/* Header with date, time and unread status */}
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                    <span>{notification.date}</span>
                    <span>•</span>
                    <span>{notification.time}</span>
                  </div>
                  {notification.isUnread && (
                    <span className="bg-border rounded px-3 py-1 text-xs font-medium uppercase">
                      UNREAD
                    </span>
                  )}
                </div>

                {/* Title and expand/collapse button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted-foreground h-2 w-2 rounded-full"></div>
                    <span className="text-sm font-medium">
                      {notification.title}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleNotification(notification.id)}
                  >
                    <Icon
                      icon={
                        notification.isExpanded
                          ? "material-symbols:keyboard-arrow-up"
                          : "material-symbols:keyboard-arrow-down"
                      }
                      size="sm"
                    />
                  </Button>
                </div>

                {/* Expandable content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    notification.isExpanded && notification.content
                      ? "max-h-32 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-accent-foreground ml-0.5 border-l-2 py-2 pl-4 text-xs">
                    {notification.content}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TenantHomepage;
