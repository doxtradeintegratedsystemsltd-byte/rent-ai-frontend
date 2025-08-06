import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import TenantsTable from "./tenants-table";

const TenantsTab = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            icon="material-symbols:location-home-outline-rounded"
            size="lg"
          />
          <h2 className="text-lg font-bold">Tenants</h2>
        </div>
        <Button size="sm" className="uppercase">
          <Icon icon="material-symbols:add-2-rounded" size="sm" />
          Add Tenant
        </Button>
      </div>
      <TenantsTable />
    </div>
  );
};

export default TenantsTab;
