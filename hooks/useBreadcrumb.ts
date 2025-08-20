"use client";

import { useEffect, useRef } from "react";
import { useBreadcrumbs, BreadcrumbItem } from "@/contexts/breadcrumb-context";

export function useBreadcrumb(items: Omit<BreadcrumbItem, "isLast">[]) {
  const { setBreadcrumbs } = useBreadcrumbs();
  const previousItemsRef = useRef<string>("");

  useEffect(() => {
    // Serialize items to check for deep equality
    const currentItemsJson = JSON.stringify(items);

    // Only update if items have actually changed
    if (previousItemsRef.current !== currentItemsJson) {
      // Process items to add isLast property
      const breadcrumbsWithLast = items.map((item, index) => ({
        ...item,
        isLast: index === items.length - 1,
      }));

      setBreadcrumbs(breadcrumbsWithLast);
      previousItemsRef.current = currentItemsJson;
    }
  }, [items, setBreadcrumbs]);
}

// Helper function for common breadcrumb patterns
export function createBreadcrumbs(
  items: Omit<BreadcrumbItem, "isLast">[],
): Omit<BreadcrumbItem, "isLast">[] {
  // Always start with Dashboard unless it's already included
  const hasDashboard = items.some((item) => item.href === "/admin");

  if (!hasDashboard) {
    return [{ name: "Dashboard", href: "/admin" }, ...items];
  }

  return items;
}
