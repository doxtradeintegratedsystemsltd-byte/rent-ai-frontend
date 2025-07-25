import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import PropertiesTable from "./properties-table";

const PropertiesTab = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="material-symbols:home-app-logo" size="lg" />
          <h2 className="text-lg font-bold">Properties</h2>
        </div>
        <Button size="sm" className="uppercase">
          <Icon icon="material-symbols:add-2-rounded" size="sm" />
          Add Property
        </Button>
      </div>
      <PropertiesTable />
    </div>
  );
};

export default PropertiesTab;
