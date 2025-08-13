import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/service/api";
import type { ApiResponse } from "@/types/user";
import {
  PropertiesListResponse,
  Property,
  PropertyCreateRequest,
  PropertyCreateResponse,
} from "@/types/property";

// Types for fetching properties
export interface PropertyFetchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
  location?: string;
}

// Property creation mutation
export const useCreateProperty = () => {
  return useMutation({
    mutationFn: async (
      propertyData: PropertyCreateRequest,
    ): Promise<ApiResponse<PropertyCreateResponse>> => {
      const response = await api.post("/properties", propertyData);
      return response.data;
    },
  });
};

// Fetch all properties query with pagination
export const useFetchProperties = (params?: PropertyFetchParams) => {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: async (): Promise<ApiResponse<PropertiesListResponse>> => {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.pageSize !== undefined) {
        searchParams.append("size", params.pageSize.toString());
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }
      if (params?.filter && params.filter !== "all") {
        searchParams.append("filter", params.filter);
      }
      if (params?.location && params.location !== "all") {
        searchParams.append("location", params.location);
      }

      const url = `/properties${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await api.get(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
