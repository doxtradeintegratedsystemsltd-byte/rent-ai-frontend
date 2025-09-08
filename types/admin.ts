export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string | null;
  phoneNumber: string | null;
  createdAt: string;
  properties: number;
  tenants: number;
  rentProcessed: number;
}

export interface AdminsFetchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface AdminsListResponse {
  data: Admin[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface AdminDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  photoUrl: string | null;
  phoneNumber: string | null;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AdminAnalytics {
  properties: {
    all: number;
    current: number;
    previous: number;
  };
  tenants: {
    all: number;
    current: number;
    previous: number;
  };
  payments: {
    all: number;
    current: number;
    previous: number;
  };
  dueProperties: number;
}

export interface AdminDetailsResponse {
  user: AdminDetails;
  analytics: AdminAnalytics;
}

export interface AdminDetailsFetchParams {
  id: string;
  period?: "today" | "thisWeek" | "thisMonth" | "thisYear" | "oldestDate";
}

export interface AdminUpdateRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  photoUrl?: string | null;
}

export interface AdminUpdateResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  photoUrl: string | null;
  phoneNumber: string | null;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AdminCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photoUrl?: string | null;
}

export interface AdminCreateResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  photoUrl: string | null;
  phoneNumber: string | null;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
