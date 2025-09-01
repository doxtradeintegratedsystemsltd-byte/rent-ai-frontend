import { RentStatus } from "@/types/lease";
import { Property } from "@/types/property";

export function getPaymentStatus(status: RentStatus | "none") {
  const baseClasses =
    "border uppercase font-medium text-[10px] px-2 py-0.5 rounded-xl w-20 text-center";

  const statusClasses = {
    [RentStatus.Paid]: "bg-paid-bg text-paid-text border-paid-border",
    [RentStatus.NearDue]:
      "bg-neardue-bg text-neardue-text border-neardue-border",
    [RentStatus.Due]: "bg-due-bg text-due-text border-due-border",
    [RentStatus.OverDue]:
      "bg-overdue-bg text-overdue-text border-overdue-border",
    none: "bg-gray-200 text-gray-800 border-gray-300",
  };

  return `${statusClasses[status]} ${baseClasses}`;
}

export function getBookingStatusLabel(
  status: "pending" | "approved" | "rejected",
) {
  return {
    pending: "Pending Approval",
    approved: "Approved",
    rejected: "Rejected",
  }[status];
}

export const getPropertyStatus = (
  property: Property,
): "occupied" | "vacant" => {
  return property.currentLease ? "occupied" : "vacant";
};
