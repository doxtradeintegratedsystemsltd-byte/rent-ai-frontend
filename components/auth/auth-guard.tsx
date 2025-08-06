"use client";

import { useRouter } from "next/navigation";
import { useIsAuthenticated, useUserRole } from "@/store/authStore";
import { useEffect } from "react";
import type { UserType } from "@/types/user";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserType[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  allowedRoles = [],
  requireAuth = true,
  redirectTo,
}: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const userRole = useUserRole();

  useEffect(() => {
    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push("/");
      return;
    }

    // If user is authenticated but doesn't have the required role
    if (isAuthenticated && allowedRoles.length > 0 && userRole) {
      if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on user role
        const defaultRedirect = redirectTo || getDefaultRedirect(userRole);
        router.push(defaultRedirect);
        return;
      }
    }
  }, [
    isAuthenticated,
    userRole,
    allowedRoles,
    requireAuth,
    redirectTo,
    router,
  ]);

  // Helper function to get default redirect based on user role
  const getDefaultRedirect = (role: UserType): string => {
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

  // Show loading or nothing while checking auth
  if (requireAuth && !isAuthenticated) {
    return <LoadingSpinner fullScreen />;
  }

  // Show loading while checking role permissions
  if (isAuthenticated && allowedRoles.length > 0 && userRole) {
    if (!allowedRoles.includes(userRole)) {
      return <LoadingSpinner fullScreen />;
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
}

// Convenience components for specific roles
export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={["superAdmin"]}>{children}</AuthGuard>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={["admin"]}>{children}</AuthGuard>;
}

export function TenantGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={["tenant"]}>{children}</AuthGuard>;
}
