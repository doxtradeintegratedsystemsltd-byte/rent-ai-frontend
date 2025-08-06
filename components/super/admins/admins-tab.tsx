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
import AdminsTable from "./admins-table";
import AddAdminForm from "./add-admin-form";

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
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" className="uppercase">
              <Icon icon="material-symbols:add-2-rounded" size="sm" />
              Add Admin
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
                  icon="material-symbols:supervised-user-circle-outline"
                  className="mr-2"
                  size="lg"
                />
                Add Admin
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <AddAdminForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <AdminsTable />
    </div>
  );
};

export default AdminsTab;
