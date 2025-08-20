"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  useIsAuthenticated,
  useUserRole,
  useIsLoading,
} from "@/store/authStore";
import { useEffect, useState } from "react";
import type { UserType } from "@/types/user";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface GlobalAuthGuardProps {
  children: React.ReactNode;
}

/** ---------- ROUTE CONFIG ---------- **/

// Public routes (accessible without login)
const PUBLIC_ROUTES = new Set([
  "/",
  "/forgot-password",
  "/update-password",
  "/unauthorized",
]);

// Role-based route access
const ROLE_ROUTES: Record<UserType, (string | RegExp)[]> = {
  superAdmin: [
    "/super",
    "/super/admin",
    "/super/payments",
    "/super/property",
    /^\/super\/property\/[^/]+$/, // dynamic example
  ],
  admin: [
    "/admin",
    "/admin/due-rents",
    "/admin/payments",
    "/admin/property",
    /^\/admin\/property\/[^/]+$/,
    /^\/admin\/property\/notification\/[^/]+$/,
  ],
  tenant: ["/tenant"], // add tenant subroutes as needed
};

// Default dashboard per role
const DEFAULT_ROUTE: Record<UserType, string> = {
  superAdmin: "/super",
  admin: "/admin",
  tenant: "/tenant",
};

/** ---------- HELPERS ---------- **/

const isPublicRoute = (pathname: string) => PUBLIC_ROUTES.has(pathname);

const isRouteAllowed = (pathname: string, routes: (string | RegExp)[]) =>
  routes.some((route) =>
    typeof route === "string"
      ? pathname === route || pathname.startsWith(route + "/")
      : route.test(pathname),
  );

/** ---------- MAIN COMPONENT ---------- **/

export function GlobalAuthGuard({ children }: GlobalAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const userRole = useUserRole();
  const isLoading = useIsLoading();
  const [hasHydrated, setHasHydrated] = useState(false);

  // Handle hydration
  useEffect(() => setHasHydrated(true), []);

  useEffect(() => {
    if (!hasHydrated || isLoading) return;

    // Not authenticated → redirect if route is protected
    if (!isAuthenticated) {
      if (!isPublicRoute(pathname)) {
        router.replace("/");
      }
      return;
    }

    // Authenticated but role missing → fallback
    if (!userRole || !ROLE_ROUTES[userRole]) {
      router.replace("/");
      return;
    }

    const allowedRoutes = ROLE_ROUTES[userRole];

    // On public route (like login) → send to dashboard
    if (isPublicRoute(pathname) && pathname !== "/unauthorized") {
      router.replace(DEFAULT_ROUTE[userRole]);
      return;
    }

    // On protected route → check role access
    if (
      !isRouteAllowed(pathname, allowedRoutes) &&
      pathname !== "/unauthorized"
    ) {
      router.replace("/unauthorized");
      return;
    }
  }, [hasHydrated, isLoading, isAuthenticated, userRole, pathname, router]);

  /** ---------- LOADING STATES ---------- **/

  if (!hasHydrated || isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // While redirecting, avoid flashing protected content
  if (!isAuthenticated && !isPublicRoute(pathname)) {
    return <LoadingSpinner fullScreen />;
  }

  if (isAuthenticated && userRole) {
    const allowedRoutes = ROLE_ROUTES[userRole] ?? [];
    if (
      (isPublicRoute(pathname) && pathname !== "/unauthorized") ||
      (!isRouteAllowed(pathname, allowedRoutes) && pathname !== "/unauthorized")
    ) {
      return <LoadingSpinner fullScreen />;
    }
  }

  return <>{children}</>;
}
