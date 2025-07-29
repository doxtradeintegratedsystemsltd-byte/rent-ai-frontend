import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import PropertiesTable from "./properties-table";
import AddPropertyForm from "./add-property-form";

const PropertiesTab = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="material-symbols:home-app-logo" size="lg" />
          <h2 className="text-lg font-bold">Properties</h2>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" className="uppercase">
              <Icon icon="material-symbols:add-2-rounded" size="sm" />
              Add Property
            </Button>
          </SheetTrigger>
          <SheetContent
            className="flex w-[600px] max-w-[600px] min-w-[600px] flex-col [&>button]:hidden"
            style={{ width: "600px" }}
          >
            <SheetHeader className="flex-shrink-0">
              <SheetClose asChild className="mb-8 text-left">
                <Button variant="ghost" className="w-fit p-0">
                  <Icon icon="material-symbols:arrow-back" className="mr-2" />
                  Go Back
                </Button>
              </SheetClose>
              <SheetTitle className="text-lg font-bold">
                <Icon
                  icon="material-symbols:add-home-outline-rounded"
                  className="mr-2"
                  size="lg"
                />
                Add Property
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <AddPropertyForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <PropertiesTable />
    </div>
  );
};

export default PropertiesTab;
