import { TenantHeader } from "@/components/header/tenant-header";
import React from "react";

const TenantLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col overflow-hidden">
        <TenantHeader />
        <main className="flex-1 overflow-auto px-6 py-4">{children}</main>
      </div>
    </div>
  );
};

export default TenantLayout;
