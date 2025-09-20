export interface LocationCreateRequest {
  name: string;
}

export interface Location {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  propertiesCount?: number;
}

export interface LocationsListResponse {
  totalItems: number;
  data: Location[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface LocationCreateResponse extends Location {}

export interface LocationsFetchParams {
  page?: number; // zero-based
  pageSize?: number;
  search?: string;
  sortOrder?: "ASC" | "DESC";
}
