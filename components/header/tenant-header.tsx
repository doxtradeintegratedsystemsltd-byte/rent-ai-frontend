"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Notifications from "../admin/notifications/notifications";
import { useBreadcrumbs } from "@/contexts/breadcrumb-context";
import Logo from "../ui/logo";

export function TenantHeader() {
  const { breadcrumbs } = useBreadcrumbs();

  const pathname = usePathname();

  // Fallback breadcrumb generation for pages that don't set custom breadcrumbs
  const getFallbackBreadcrumbs = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const fallbackBreadcrumbs = [];

    // Always start with Dashboard
    fallbackBreadcrumbs.push({
      name: "Dashboard",
      href: "/admin",
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
    <header className="border-border bg-background sticky top-0 z-10 flex border-b px-8 py-4">
      <Logo dark className="mr-8" />
      <div className="flex w-full items-center justify-between">
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
          <p className="text-muted-foreground border-accent-foreground hidden border-l-2 py-1 pl-2 text-xs font-medium md:block">
            2:10P.M. • Tuesday, February 5, 2025
          </p>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="icon" size={"icon"}>
                <Icon
                  icon="material-symbols:notifications"
                  className="text-foreground"
                />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-full min-w-full [&>button]:hidden">
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
