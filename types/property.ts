import { Lease } from "./lease";
import { User } from "./user";
import { Payment } from "./payment";

export interface PropertyCreateRequest {
  propertyName: string;
  locationId: string;
  propertyAddress: string;
  propertyImage: string;
  leaseYears: number;
  rentAmount: number;
}

export interface PropertyCreateForAdminRequest {
  propertyName: string;
  locationId: string;
  propertyAddress: string;
  propertyImage: string;
  leaseYears: number;
  rentAmount: number;
  adminId: string;
}

export interface PropertyCreateResponse {
  id: string;
  propertyName: string;
  propertyState: string;
  propertyArea: string;
  propertyAddress: string;
  propertyImage: string;
  createdById: string;
  rentAmount: string;
  leaseYears: number;
  currentLeaseId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PropertyFetchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
  location?: string;
  status?: string;
  adminId?: string;
}

export interface Property {
  id: string;
  propertyName: string;
  propertyState: string;
  propertyArea: string;
  propertyAddress: string;
  propertyImage: string;
  createdById: string;
  rentAmount: string;
  leaseYears: number;
  currentLeaseId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: User;
  currentLease: Lease | null;
  payments: Payment[];
  location: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export interface PropertiesListResponse {
  totalItems: number;
  data: Property[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface PropertyUpdateRequest {
  propertyName: string;
  locationId: string;
  propertyAddress: string;
  propertyImage: string;
  leaseYears: number;
  rentAmount: number;
}

export interface PropertyUpdateResponse extends Property {}

export interface PropertySingleResponse extends Property {}
