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
import Profile from "../dashboard/profile/profile";
import EditProfileForm from "../dashboard/profile/edit-profile-form";
import Notifications from "../dashboard/notifications/notifications";

export function Header() {
  const [showEditForm, setShowEditForm] = useState(false);

  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const getBreadcrumbs = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const breadcrumbs = [];

    // Always start with Dashboard
    breadcrumbs.push({
      name: "Dashboard",
      href: "/dashboard",
      isLast: segments.length === 1 && segments[0] === "dashboard",
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

        breadcrumbs.push({
          name,
          href,
          isLast,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="border-border bg-background sticky top-0 z-10 border-b px-8 py-4">
      <div className="flex items-center justify-between">
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
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
                <Avatar src="/images/avatar.png" alt="Admin Avatar" size="md" />
                <div className="flex flex-col">
                  <span className="text-foreground text-xs font-bold">
                    Bala Joseph
                  </span>
                  <span className="text-muted-foreground text-[10px] font-medium">
                    ADMIN
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
              {showEditForm ? <EditProfileForm /> : <Profile />}
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="icon" size={"icon"}>
                <Icon
                  icon="material-symbols:notifications"
                  className="text-foreground"
                />
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
              <Notifications />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
