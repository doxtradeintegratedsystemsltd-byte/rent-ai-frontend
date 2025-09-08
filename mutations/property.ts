import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/service/api";
import type { ApiResponse } from "@/types/user";
import {
  PropertiesListResponse,
  PropertyCreateRequest,
  PropertyCreateForAdminRequest,
  PropertyCreateResponse,
  PropertyFetchParams,
  PropertySingleResponse,
  PropertyUpdateRequest,
  PropertyUpdateResponse,
} from "@/types/property";

// Types for fetching properties

// Property creation mutation
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      propertyData: PropertyCreateRequest,
    ): Promise<ApiResponse<PropertyCreateResponse>> => {
      const response = await api.post("/properties", propertyData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch properties queries
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      // Also invalidate due rents since new properties might affect due rents
      queryClient.invalidateQueries({ queryKey: ["properties", "due-rents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["super-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
};

// Property creation for admin mutation (super admin creates property for an admin)
export const useCreatePropertyForAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      propertyData: PropertyCreateForAdminRequest,
    ): Promise<ApiResponse<PropertyCreateResponse>> => {
      const response = await api.post("/properties", propertyData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch properties queries
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      // Also invalidate due rents since new properties might affect due rents
      queryClient.invalidateQueries({ queryKey: ["properties", "due-rents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["super-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
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
      if (params?.status) {
        searchParams.append("status", params.status);
      }
      if (params?.adminId) {
        searchParams.append("adminId", params.adminId);
      }

      const url = `/properties${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await api.get(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Fetch due rents (properties with rent-paid status)
export const useFetchDueRents = (
  params?: Omit<PropertyFetchParams, "status">,
) => {
  const dueRentsParams = {
    ...params,
    status: "rent-unpaid" as const,
  };

  return useQuery({
    queryKey: ["properties", "due-rents", dueRentsParams],
    queryFn: async (): Promise<ApiResponse<PropertiesListResponse>> => {
      const searchParams = new URLSearchParams();

      if (dueRentsParams?.page !== undefined) {
        searchParams.append("page", dueRentsParams.page.toString());
      }
      if (dueRentsParams?.pageSize !== undefined) {
        searchParams.append("size", dueRentsParams.pageSize.toString());
      }
      if (dueRentsParams?.search) {
        searchParams.append("search", dueRentsParams.search);
      }
      if (dueRentsParams?.filter && dueRentsParams.filter !== "all") {
        searchParams.append("filter", dueRentsParams.filter);
      }
      if (dueRentsParams?.location && dueRentsParams.location !== "all") {
        searchParams.append("location", dueRentsParams.location);
      }
      if (dueRentsParams?.status) {
        searchParams.append("status", dueRentsParams.status);
      }
      if (dueRentsParams?.adminId) {
        searchParams.append("adminId", dueRentsParams.adminId);
      }

      const url = `/properties${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await api.get(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Fetch single property query
export const useFetchProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async (): Promise<ApiResponse<PropertySingleResponse>> => {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id, // Only run query if id is provided
  });
};

// Property update mutation
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      propertyData,
    }: {
      id: string;
      propertyData: PropertyUpdateRequest;
    }): Promise<ApiResponse<PropertyUpdateResponse>> => {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific property in cache first
      queryClient.setQueryData(
        ["property", variables.id],
        (oldData: ApiResponse<PropertySingleResponse> | undefined) => {
          if (oldData && oldData.data) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                ...data.data,
                // Preserve relationships that might not be in the update response
                createdBy: oldData.data.createdBy,
                currentLease: oldData.data.currentLease,
              },
            };
          }
          return data;
        },
      );

      // Then invalidate and refetch properties list in the background
      queryClient.invalidateQueries({
        queryKey: ["properties"],
        refetchType: "none", // Don't refetch immediately, just mark as stale
      });

      // Also invalidate due rents since property updates might affect rent status
      queryClient.invalidateQueries({
        queryKey: ["properties", "due-rents"],
        refetchType: "none",
      });
    },
  });
};

// Property delete mutation
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string,
    ): Promise<ApiResponse<{ message: string }>> => {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    },
    onSuccess: (data, propertyId) => {
      // Remove the property from the specific property cache
      queryClient.removeQueries({ queryKey: ["property", propertyId] });

      // Update the properties list cache by removing the deleted property
      queryClient.setQueryData(
        ["properties"],
        (oldData: ApiResponse<PropertiesListResponse> | undefined) => {
          if (oldData && oldData.data) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: oldData.data.data.filter(
                  (property) => property.id !== propertyId,
                ),
                totalItems: oldData.data.totalItems - 1,
              },
            };
          }
          return oldData;
        },
      );

      // Also invalidate properties queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["properties"],
        refetchType: "none", // Don't refetch immediately, just mark as stale
      });

      // Also invalidate due rents since deleting a property affects due rents
      queryClient.invalidateQueries({
        queryKey: ["properties", "due-rents"],
        refetchType: "none",
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["super-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
};
