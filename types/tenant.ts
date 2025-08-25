import { Lease } from "./lease";
import { User } from "./user";

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  levelOfEducation: string;
  createdById: string;
  currentLeaseId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: User;
  currentLease: Lease | null;
}

export interface TenantFetchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
  location?: string;
  status?: string;
  adminId?: string;
}

export interface TenantsListResponse {
  totalItems: number;
  data: Tenant[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface AddTenantToPropertyRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  levelOfEducation: string;
  startDate: string;
  propertyId: string;
  leaseCycles: number;
  paymentReceipt: string | null;
  paymentDate: string;
}

export interface AddTenantToPropertyResponse {
  tenant: Tenant;
  lease: {
    id: string;
    tenantId: string;
    propertyId: string;
    startDate: string;
    endDate: string;
    rentAmount: string;
    rentStatus: string;
    createdAt: string;
    updatedAt: string;
  };
  payment?: {
    id: string;
    amount: string;
    paymentDate: string;
    paymentReceipt: string;
    leaseId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface EditTenantRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  levelOfEducation: string;
}

export interface EditTenantResponse {
  tenant: Tenant;
}
