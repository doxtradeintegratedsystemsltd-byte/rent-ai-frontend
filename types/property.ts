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
