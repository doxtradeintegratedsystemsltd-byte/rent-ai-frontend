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
// import AdminsTable from "./admins-table";
// import AddAdminForm from "./add-admin-form";
import { useState } from "react";
import AddLocationForm from "./add-location-form";
import LocationsTable from "./locations-table";

const LocationsTab = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLocationCreated = () => {
    setIsSheetOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="material-symbols:location-on-outline-rounded" size="lg" />
          <h2 className="text-lg font-bold">Locations</h2>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="uppercase">
              <Icon icon="material-symbols:add-2-rounded" size="sm" />
              Add Location
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
                  icon="material-symbols:add-location-outline-rounded"
                  className="mr-2"
                  size="lg"
                />
                Add Location
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <AddLocationForm setIsSubmitted={handleLocationCreated} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <LocationsTable />
    </div>
  );
};

export default LocationsTab;
