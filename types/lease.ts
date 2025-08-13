import { Tenant } from "./tenant";

export interface Lease {
  id: string;
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  leaseStatus: "active" | "inactive" | "expired";
  leaseYears: number;
  leaseCycles: number;
  rentAmount: number;
  rentStatus: "paid" | "unpaid" | "overdue";
  createdById: string;
  paymentId: string;
  nextLeaseId: string | null;
  previousLeaseId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tenant: Tenant;
}
