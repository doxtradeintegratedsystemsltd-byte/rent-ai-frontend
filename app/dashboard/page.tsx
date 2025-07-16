import PropertiesTable from "@/components/dashboard/properties-table";
import PropertyManagement from "@/components/dashboard/property-management";
import DashboardStats from "@/components/dashboard/stats";

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
