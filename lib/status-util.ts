export function getPaymentStatus(
  status: "paid" | "nearDue" | "due" | "overdue",
) {
  const baseClasses =
    "border uppercase font-medium text-[10px] px-2 py-0.5 rounded-xl w-20 text-center";

  const statusClasses = {
    paid: "bg-paid-bg text-paid-text border-paid-border",
    nearDue: "bg-neardue-bg text-neardue-text border-neardue-border",
    due: "bg-due-bg text-due-text border-due-border",
    overdue: "bg-overdue-bg text-overdue-text border-overdue-border",
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
