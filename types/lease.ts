import { Tenant } from "./tenant";
import { Property } from "./property";
import { User } from "./user";

export enum RentStatus {
  Paid = "paid",
  OverDue = "overDue",
  NearDue = "nearDue",
  Due = "due",
}

export interface Lease {
  id: string;
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  leaseStatus: "active" | "inactive" | "in-active" | "expired"; // include "in-active" variant returned by backend
  leaseYears: number;
  leaseCycles: number;
  rentAmount: number;
  rentStatus: RentStatus; // include "overDue" variant and "none"
  createdById: string;
  paymentId: string;
  nextLeaseId: string | null;
  previousLeaseId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tenant?: Tenant;
  property?: Property;
}

// Tenant lease payment information
export interface TenantLeasePayment {
  id: string;
  type: "manual" | "automated" | "paystack"; // backend returns "paystack" for automated gateway payments
  amount: number;
  reference: string | null;
  status: "completed" | "pending" | "failed";
  receiptUrl: string | null;
  leaseId: string;
  createdById: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Enhanced lease with payment and tenant details for tenant view
export interface TenantLeaseDetail {
  id: string;
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  leaseStatus: "active" | "inactive" | "in-active" | "expired"; // include variant
  leaseYears: number;
  leaseCycles: number;
  rentAmount: number;
  rentStatus: "paid" | "unpaid" | "overdue" | "overDue";
  createdById: string;
  paymentId: string;
  nextLeaseId: string | null;
  previousLeaseId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  previousLease: TenantLeaseDetail | null;
  nextLease: TenantLeaseDetail | null;
  payment: TenantLeasePayment;
  tenant: Tenant;
  createdBy: User;
}

// Property information for tenant lease view
export interface TenantPropertyInfo {
  id: string;
  propertyName: string;
  propertyState: string;
  propertyArea: string;
  propertyAddress: string;
  propertyImage: string;
  createdById: string;
  rentAmount: string;
  leaseYears: number;
  currentLeaseId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  currentLease: TenantLeaseDetail;
  createdBy: User;
}

// Response for tenant lease information
export interface TenantLeaseResponse {
  statusCode: number;
  status: "success" | "error";
  message: string;
  data: TenantPropertyInfo;
}
