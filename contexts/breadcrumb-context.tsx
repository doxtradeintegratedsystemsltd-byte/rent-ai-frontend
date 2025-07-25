"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface BreadcrumbItem {
  name: string;
  href: string;
  isLast?: boolean;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined,
);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
}

// Helper function to set breadcrumbs with automatic isLast marking
export function setBreadcrumbItems(
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void,
  items: Omit<BreadcrumbItem, "isLast">[],
) {
  const breadcrumbsWithLast = items.map((item, index) => ({
    ...item,
    isLast: index === items.length - 1,
  }));
  setBreadcrumbs(breadcrumbsWithLast);
}
