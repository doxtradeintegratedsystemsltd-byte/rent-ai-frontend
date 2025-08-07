"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  useIsAuthenticated,
  useUserRole,
  useIsLoading,
} from "@/store/authStore";
import { useEffect } from "react";
import type { UserType } from "@/types/user";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface GlobalAuthGuardProps {
  children: React.ReactNode;
}

// Define all existing routes in your application
const ALL_APP_ROUTES = [
  "/",
  "/forgot-password",
  "/update-password",
  "/unauthorized",
  "/super",
  "/super/admin",
  "/super/payments",
  "/super/property",
  "/admin",
  "/admin/due-rents",
  "/admin/payments",
  "/admin/property",
  "/tenant",
];

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/forgot-password",
  "/update-password",
  "/unauthorized",
];

// Define role-based route mappings
const ROLE_ROUTES: Record<UserType, string[]> = {
  superAdmin: ["/super", "/super/admin", "/super/payments", "/super/property"],
  admin: ["/admin", "/admin/due-rents", "/admin/payments", "/admin/property"],
  tenant: ["/tenant"],
};

// Get default dashboard route for a user role
const getDefaultRoute = (role: UserType): string => {
  switch (role) {
    case "superAdmin":
      return "/super";
    case "admin":
      return "/admin";
    case "tenant":
      return "/tenant";
    default:
      return "/";
  }
};

// Check if a path matches any pattern in the routes array
const isRouteAllowed = (pathname: string, routes: string[]): boolean => {
  return routes.some((route) => {
    // Exact match
    if (pathname === route) return true;
    // Nested route match (e.g., /admin matches /admin/anything)
    if (pathname.startsWith(route + "/")) return true;
    return false;
  });
};

// Check if the route exists in your application
const isAppRoute = (pathname: string): boolean => {
  return ALL_APP_ROUTES.some((route) => {
    // Exact match
    if (pathname === route) return true;
    // Nested route match (e.g., /admin matches /admin/anything)
    if (pathname.startsWith(route + "/")) return true;
    return false;
  });
};

// Check if current path is a public route
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.includes(pathname);
};

// Get allowed routes for a user role
const getAllowedRoutes = (role: UserType): string[] => {
  return ROLE_ROUTES[role] || [];
};

export function GlobalAuthGuard({ children }: GlobalAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const userRole = useUserRole();
  const isLoading = useIsLoading();

  useEffect(() => {
    // Don't redirect while loading auth state
    if (isLoading) return;

    // If user is not authenticated
    if (!isAuthenticated) {
      // Allow access to public routes
      if (isPublicRoute(pathname)) return;

      // If it's not an app route (doesn't exist), let Next.js handle 404
      if (!isAppRoute(pathname)) return;

      // Redirect to login for protected routes that actually exist
      router.push("/");
      return;
    }

    // If user is authenticated
    if (isAuthenticated && userRole) {
      // If user is on a public route (like login page), redirect to their dashboard
      if (isPublicRoute(pathname) && pathname !== "/unauthorized") {
        router.push(getDefaultRoute(userRole));
        return;
      }

      // Check if user has access to the current route
      const allowedRoutes = getAllowedRoutes(userRole);

      // Only redirect to unauthorized if the route exists but user doesn't have access
      if (
        isAppRoute(pathname) && // Route exists in the app
        !isRouteAllowed(pathname, allowedRoutes) && // User doesn't have access
        pathname !== "/unauthorized" // Not already on unauthorized page
      ) {
        // Redirect to unauthorized page if they don't have access
        router.push("/unauthorized");
        return;
      }

      // If route doesn't exist in the app, let Next.js handle 404
      // by not interfering with the rendering
    }
  }, [isAuthenticated, userRole, pathname, router, isLoading]);

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Show loading while redirecting unauthorized users (but not for non-existent routes)
  if (!isAuthenticated && !isPublicRoute(pathname) && isAppRoute(pathname)) {
    return <LoadingSpinner fullScreen />;
  }

  // Show loading while redirecting authenticated users from public routes or unauthorized routes
  if (isAuthenticated && userRole) {
    if (
      (isPublicRoute(pathname) && pathname !== "/unauthorized") ||
      (isAppRoute(pathname) &&
        !isRouteAllowed(pathname, getAllowedRoutes(userRole)) &&
        pathname !== "/unauthorized")
    ) {
      return <LoadingSpinner fullScreen />;
    }
  }

  return <>{children}</>;
}
