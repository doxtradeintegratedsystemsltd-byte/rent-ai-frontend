import { Lease } from "./lease";
import { User } from "./user";

export interface PropertyCreateRequest {
  propertyName: string;
  propertyState: string;
  propertyArea: string;
  propertyAddress: string;
  propertyImage: string;
  leaseYears: number;
  rentAmount: number;
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
  propertyState: string;
  propertyArea: string;
  propertyAddress: string;
  propertyImage: string;
  leaseYears: number;
  rentAmount: number;
}

export interface PropertyUpdateResponse extends Property {}

export interface PropertySingleResponse extends Property {}
