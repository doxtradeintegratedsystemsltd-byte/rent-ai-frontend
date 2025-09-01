import { Icon } from "@/components/ui/icon";
import PropertiesTable from "./properties-table";

const PropertiesTab = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="material-symbols:home-app-logo" size="lg" />
          <h2 className="text-lg font-bold">Houses</h2>
        </div>
      </div>
      <PropertiesTable />
    </div>
  );
};

export default PropertiesTab;
