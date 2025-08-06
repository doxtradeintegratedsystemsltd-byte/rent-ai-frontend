import DueRentsTable from "@/components/admin/due-rents/due-rents-table";
import { GoBackButton } from "@/components/ui/go-back-button";

const DueRentsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <GoBackButton className="self-start" />
      <DueRentsTable />
    </div>
  );
};

export default DueRentsPage;
