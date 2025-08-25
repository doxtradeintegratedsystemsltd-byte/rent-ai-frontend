import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/service/api";
import type { ApiResponse } from "@/types/user";
import {
  AddTenantToPropertyRequest,
  AddTenantToPropertyResponse,
  EditTenantRequest,
  EditTenantResponse,
  TenantFetchParams,
  TenantsListResponse,
} from "@/types/tenant";
import { PropertySingleResponse } from "@/types/property";
import { TenantLeaseResponse } from "@/types/lease";

// Fetch tenant lease information query
export const useFetchTenantLease = () => {
  return useQuery({
    queryKey: ["tenant", "lease"],
    queryFn: async (): Promise<TenantLeaseResponse> => {
      const response = await api.get("/leases/tenant");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Fetch all tenants query with pagination
export const useFetchTenants = (params?: TenantFetchParams) => {
  return useQuery({
    queryKey: ["tenants", params],
    queryFn: async (): Promise<ApiResponse<TenantsListResponse>> => {
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

      const url = `/tenants${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await api.get(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Add tenant to property mutation
export const useAddTenantToProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      tenantData: AddTenantToPropertyRequest,
    ): Promise<ApiResponse<AddTenantToPropertyResponse>> => {
      const response = await api.post("/tenants", tenantData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific property in cache to reflect the new tenant
      queryClient.setQueryData(
        ["property", variables.propertyId],
        (oldData: ApiResponse<PropertySingleResponse> | undefined) => {
          if (oldData && oldData.data && data.data) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                currentLease: data.data.lease,
                currentLeaseId: data.data.lease.id,
              },
            };
          }
          return oldData;
        },
      );

      // Invalidate properties list to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["properties"],
        refetchType: "none",
      });

      // Invalidate tenants list to reflect new tenant
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
        refetchType: "none",
      });

      // Optionally invalidate the specific property query to get fresh data
      queryClient.invalidateQueries({
        queryKey: ["property", variables.propertyId],
        refetchType: "none",
      });

      // Invalidate due rents since adding a tenant affects property lease status
      queryClient.invalidateQueries({
        queryKey: ["properties", "due-rents"],
        refetchType: "none",
      });
    },
  });
};

// Edit tenant mutation
export const useEditTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tenantId,
      tenantData,
    }: {
      tenantId: string;
      tenantData: EditTenantRequest;
    }): Promise<ApiResponse<EditTenantResponse>> => {
      const response = await api.put(`/tenants/${tenantId}`, tenantData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate specific queries to ensure consistency and immediate refetch
      queryClient.invalidateQueries({
        queryKey: ["tenant", variables.tenantId],
      });

      // Invalidate tenants list to reflect updated tenant information
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });

      // Invalidate properties list to reflect updated tenant information
      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });

      // Invalidate all property queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["property"],
      });

      // Invalidate due rents since tenant updates might affect rent status
      queryClient.invalidateQueries({
        queryKey: ["properties", "due-rents"],
      });
    },
  });
};

// Remove tenant from property mutation
export const useRemoveTenantFromProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      leaseId: string,
    ): Promise<ApiResponse<{ message: string }>> => {
      const response = await api.delete(`/leases/remove-tenant/${leaseId}`);
      return response.data;
    },
    onSuccess: (data, leaseId) => {
      // Invalidate tenants list to reflect tenant removal
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });

      // Invalidate properties list to reflect tenant removal
      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });

      // Invalidate all property queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["property"],
      });

      // Invalidate tenant-related queries
      queryClient.invalidateQueries({
        queryKey: ["tenant"],
      });

      // Invalidate lease-related queries if they exist
      queryClient.invalidateQueries({
        queryKey: ["lease"],
      });

      // Invalidate due rents since removing a tenant affects lease and rent status
      queryClient.invalidateQueries({
        queryKey: ["properties", "due-rents"],
      });
    },
  });
};
