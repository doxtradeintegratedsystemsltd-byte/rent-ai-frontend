import PropertiesTable from "@/components/admin/properties-table";
import PropertyManagement from "@/components/admin/property-management";
import DashboardStats from "@/components/admin/stats";

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <DashboardStats />
      <PropertyManagement />
      <PropertiesTable />
    </div>
  );
};

export default DashboardPage;
