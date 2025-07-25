import { useEffect, useRef } from "react";
import {
  useBreadcrumbs,
  setBreadcrumbItems,
  BreadcrumbItem,
} from "@/contexts/breadcrumb-context";

interface UseBreadcrumbOptions {
  items: Omit<BreadcrumbItem, "isLast">[];
}

export function useBreadcrumb({ items }: UseBreadcrumbOptions) {
  const { setBreadcrumbs } = useBreadcrumbs();
  const previousItemsRef = useRef<string>("");

  useEffect(() => {
    // Serialize items to check for deep equality
    const currentItemsJson = JSON.stringify(items);

    // Only update if items have actually changed
    if (previousItemsRef.current !== currentItemsJson) {
      setBreadcrumbItems(setBreadcrumbs, items);
      previousItemsRef.current = currentItemsJson;
    }
  }, [items, setBreadcrumbs]);

  // Clear breadcrumbs when component unmounts
  useEffect(() => {
    return () => {
      setBreadcrumbs([]);
    };
  }, [setBreadcrumbs]);
}

// Helper function for common breadcrumb patterns
export function createBreadcrumbs(
  items: Omit<BreadcrumbItem, "isLast">[],
): Omit<BreadcrumbItem, "isLast">[] {
  // Always start with Dashboard unless it's already included
  const hasDashboard = items.some((item) => item.href === "/dashboard");

  if (!hasDashboard) {
    return [{ name: "Dashboard", href: "/dashboard" }, ...items];
  }

  return items;
}
