import Card from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminsTab from "./admins/admins-tab";
import PropertiesTab from "./properties/properties-tab";
import TenantsTab from "./tenants/tenants-tab";

const SuperTabs = () => {
  return (
    <Card className="bg-muted">
      <Tabs defaultValue="admins">
        <div className="mb-4 border-b-2">
          <TabsList className="w-[400px]">
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="properties">Houses</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
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
      </Tabs>
    </Card>
  );
};

export default SuperTabs;
