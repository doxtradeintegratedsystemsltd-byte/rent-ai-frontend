"use client";

import React from "react";
import Card from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminsTab from "./admins/admins-tab";
import PropertiesTab from "./properties/properties-tab";
import TenantsTab from "./tenants/tenants-tab";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DueRentsTab from "./due-rents/due-rents";
const SuperTabs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTabFromQuery = searchParams.get("tab") || "admins";
  const [value, setValue] = React.useState(activeTabFromQuery);

  React.useEffect(() => {
    if (activeTabFromQuery !== value) {
      setValue(activeTabFromQuery);
    }
  }, [activeTabFromQuery, value]);

  const handleChange = (next: string) => {
    setValue(next);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Card className="bg-muted">
      <Tabs value={value} onValueChange={handleChange}>
        <div className="mb-4 border-b-2">
          <TabsList className="w-[400px]">
            <TabsTrigger value="admins" asChild>
              <Link href="?tab=admins" scroll={false} replace>
                Admins
              </Link>
            </TabsTrigger>
            <TabsTrigger value="properties" asChild>
              <Link href="?tab=properties" scroll={false} replace>
                Houses
              </Link>
            </TabsTrigger>
            <TabsTrigger value="tenants" asChild>
              <Link href="?tab=tenants" scroll={false} replace>
                Tenants
              </Link>
            </TabsTrigger>
            <TabsTrigger value="due-rents" asChild>
              <Link href="?tab=due-rents" scroll={false} replace>
                Due Rents
              </Link>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="admins">
          <AdminsTab />
        </TabsContent>
        <TabsContent value="properties">
          <PropertiesTab />
        </TabsContent>
        <TabsContent value="tenants">
          <TenantsTab />
        </TabsContent>
        <TabsContent value="due-rents">
          <DueRentsTab />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SuperTabs;
