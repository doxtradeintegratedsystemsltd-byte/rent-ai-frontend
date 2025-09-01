import PaymentsTable from "@/components/admin/payments/payments-table";

const page = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="">
        <h2 className="text-lg font-bold">Rent Payments</h2>
        <p className="font-sm text-muted-foreground font-medium">
          All payments recorded automatically &amp; manually recorded on
          house&rsquo;s page
        </p>
      </div>
      <PaymentsTable />
    </div>
  );
};

export default page;
