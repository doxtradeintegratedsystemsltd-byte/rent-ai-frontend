import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import AdminsTable from "./admins-table";

const AdminsTab = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            icon="material-symbols:supervised-user-circle-outline"
            size="lg"
          />
          <h2 className="text-lg font-bold">Admins (Property Managers)</h2>
        </div>
        <Button size="sm" className="uppercase">
          <Icon icon="material-symbols:add-2-rounded" size="sm" />
          Add Admin
        </Button>
      </div>
      <AdminsTable />
    </div>
  );
};

export default AdminsTab;
