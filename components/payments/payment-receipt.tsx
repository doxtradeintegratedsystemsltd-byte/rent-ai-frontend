"use client";

import { formatCurrency, formatLongDate } from "@/lib/formatters";
import { Payment } from "@/types/payment";
import Logo from "../ui/logo";

const PaymentReceipt = ({ payment }: { payment: Payment }) => {
  const date = new Date();
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-8 flex w-full justify-around">
        <Logo dark />
        <p className="text-bold">{date.toLocaleDateString()}</p>
      </div>
      <div className="bg-muted flex w-full items-center justify-between p-8">
        <div className="w-full">
          <h2 className="text-2xl font-bold">Rent Payment</h2>
        </div>
        <p className="text-background bg-secondary-foreground rounded-md px-2 py-1 text-lg font-semibold uppercase">
          Receipt
        </p>
      </div>
      <div className="flex flex-col gap-6 p-8">
        <div className="">
          <p className="text-muted-foreground text-lg font-medium uppercase">
            House
          </p>
          <p className="text-xl font-bold">
            {payment.lease?.property?.propertyName ?? "—"}
            {payment.lease?.property?.propertyAddress
              ? `, ${payment.lease.property.propertyAddress}`
              : ""}
            {payment.lease?.property?.location?.name
              ? `, ${payment.lease.property.location.name}`
              : ""}
          </p>
        </div>
        <div className="">
          <p className="text-muted-foreground text-lg font-medium uppercase">
            Tenant
          </p>
          <p className="text-xl font-bold">
            {(payment.lease?.tenant?.firstName ?? "").toString()}{" "}
            {(payment.lease?.tenant?.lastName ?? "").toString()}
          </p>
        </div>
        <div className="">
          <p className="text-muted-foreground text-lg font-medium uppercase">
            Amount Paid
          </p>
          <p className="text-xl font-bold">
            {typeof payment.amount === "number"
              ? formatCurrency(payment.amount)
              : "—"}
          </p>
        </div>
        <div className="">
          <p className="text-muted-foreground text-lg font-medium uppercase">
            Date Paid
          </p>
          <p className="text-xl font-bold">
            {payment.createdAt
              ? formatLongDate(payment.createdAt)
              : payment.paymentDate
                ? formatLongDate(payment.paymentDate)
                : "—"}
          </p>
        </div>
        <div className="">
          <p className="text-muted-foreground text-lg font-medium uppercase">
            Received By
          </p>
          <p className="text-xl font-bold">
            {(payment.createdBy?.firstName ?? "").toString()}{" "}
            {(payment.createdBy?.lastName ?? "").toString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
