import PaymentsTable from "@/components/admin/payments/payments-table";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="">
        <h2 className="text-lg font-bold">Rent Payments</h2>
        <p className="font-sm text-muted-foreground font-medium">
          All payments recorded automatically & manually recorded on property’s
          page
        </p>
      </div>
      <PaymentsTable />
    </div>
  );
};

export default page;
