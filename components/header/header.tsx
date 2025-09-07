"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Profile from "../admin/profile/profile";
import EditProfileForm from "../admin/profile/edit-profile-form";
import Notifications from "../admin/notifications/notifications";
import { useBreadcrumbs } from "@/contexts/breadcrumb-context";
import { useUser } from "@/store/authStore";
import { useGetUnreadNotificationsCount } from "@/mutations/notification";

export function Header() {
  const [showEditForm, setShowEditForm] = useState(false);
  const { breadcrumbs } = useBreadcrumbs();

  const pathname = usePathname();

  const user = useUser();
  const { data: countData } = useGetUnreadNotificationsCount();
  // Normalize to a number to avoid rendering a literal 0 via short-circuit
  const count = Number(countData?.count ?? 0);

  // Fallback breadcrumb generation for pages that don't set custom breadcrumbs
  const getFallbackBreadcrumbs = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const fallbackBreadcrumbs = [];

    // Always start with Dashboard
    fallbackBreadcrumbs.push({
      name: "Dashboard",
      href: "/admin",
      isLast: segments.length === 1 && segments[0] === "admin",
    });

    // Add segments after dashboard
    if (segments.length > 1) {
      for (let i = 1; i < segments.length; i++) {
        const segment = segments[i];
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;

        // Convert kebab-case to Title Case
        const name = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        fallbackBreadcrumbs.push({
          name,
          href,
          isLast,
        });
      }
    }

    return fallbackBreadcrumbs;
  };

  // Use custom breadcrumbs if available, otherwise fall back to auto-generated ones
  const displayBreadcrumbs =
    breadcrumbs.length > 0 ? breadcrumbs : getFallbackBreadcrumbs(pathname);

  return (
    <header className="border-border bg-background sticky top-0 z-10 border-b px-8 py-4">
      <div className="flex items-center justify-between">
        <nav className="flex items-center space-x-2 text-sm">
          {displayBreadcrumbs.map((breadcrumb) => (
            <div key={breadcrumb.href} className="flex items-center">
              {breadcrumb.isLast ? (
                <span className="text-foreground text-lg font-bold">
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {breadcrumb.name}
                </Link>
              )}
              {!breadcrumb.isLast && (
                <span className="text-muted-foreground mx-2">›</span>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex cursor-pointer items-center space-x-2">
                <Avatar
                  src={user?.photoUrl}
                  name={user?.firstName + " " + user?.lastName}
                  alt="Admin Avatar"
                  size="md"
                />
                <div className="flex flex-col">
                  <span className="text-foreground text-xs font-bold">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-muted-foreground text-[10px] font-medium uppercase">
                    {user?.userType}
                  </span>
                </div>
              </div>
            </SheetTrigger>
            <SheetContent
              className="w-[600px] max-w-[600px] min-w-[600px] [&>button]:hidden"
              style={{ width: "600px" }}
            >
              <SheetHeader>
                <SheetClose asChild className="mb-8 text-left">
                  <Button
                    variant="ghost"
                    className="w-fit p-0"
                    onClick={() => setShowEditForm(false)}
                  >
                    <Icon icon="material-symbols:arrow-back" className="mr-2" />
                    Go Back
                  </Button>
                </SheetClose>
                <div className="flex items-center">
                  <SheetTitle className="text-lg font-bold">
                    {showEditForm ? (
                      <>Edit Profile</>
                    ) : (
                      <>
                        <Icon
                          icon="material-symbols:account-circle-outline"
                          className="mr-2"
                        />
                        Profile
                      </>
                    )}
                  </SheetTitle>
                  {!showEditForm && (
                    <Button
                      className="ml-auto uppercase"
                      size="sm"
                      onClick={() => setShowEditForm(true)}
                    >
                      <Icon
                        icon="material-symbols:edit-outline-rounded"
                        className="mr-2"
                        size="sm"
                      />
                      Edit Details
                    </Button>
                  )}
                </div>
              </SheetHeader>
              {user &&
                (showEditForm ? <EditProfileForm /> : <Profile user={user} />)}
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="icon" size={"icon"} className="relative">
                <Icon
                  icon="material-symbols:notifications"
                  className="text-foreground"
                />
                {count > 0 && (
                  <span className="bg-destructive text-background absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
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
                    Go Back
                  </Button>
                </SheetClose>
                <SheetTitle className="text-lg font-bold">
                  <Icon
                    icon="material-symbols:notifications"
                    className="mr-2"
                  />
                  Notifications
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto pr-2">
                <Notifications />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
