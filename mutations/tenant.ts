/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { PropertySingleResponse } from "@/types/property"; // Corrected import path
import { TenantLeaseResponse } from "@/types/lease";

// Fetch tenant lease information query; include tenantId in key so data resets on account switch
export const useFetchTenantLease = (tenantId?: string | null) => {
  return useQuery({
    queryKey: ["tenant", "lease", tenantId || "anonymous"],
    queryFn: async (): Promise<TenantLeaseResponse> => {
      const response = await api.get("/leases/tenant");
      return response.data;
    },
    enabled: !!tenantId, // don't run until we know which tenant (prevents flashing stale data)
    staleTime: 0, // force refetch on mount for each tenant session
    gcTime: 5 * 60 * 1000,
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

      // Handle sort and sortOrder parameters
      if (params?.sort) {
        const sortOrder = params.sortOrder || "ASC"; // Default to ASC

        searchParams.append("sort", params.sort);
        searchParams.append("sortOrder", sortOrder);
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
          if (!oldData || !oldData.data || !data.data) return oldData;

          const existingPayments = oldData.data.payments || [];
          // Backend tenant-create response structure may include payment info inline (data.payment) or only paymentId inside lease
          const responsePayment: any = (data as any).data.payment;

          // Construct a Payment-like object if we have minimal payment fields; else skip
          let constructedPayment = undefined as any;
          if (responsePayment) {
            // If backend already returns payment object with needed fields
            constructedPayment = {
              id: responsePayment.id,
              type: "manual" as const,
              amount: parseFloat(responsePayment.amount?.toString() || "0"),
              reference: null,
              status: "completed" as const,
              receiptUrl:
                responsePayment.paymentReceipt ||
                responsePayment.receiptUrl ||
                null,
              leaseId: responsePayment.leaseId || data.data.lease.id,
              // createdById not present on partial lease shape returned here, fallback to property creator
              createdById: oldData.data.createdById,
              paymentDate:
                responsePayment.paymentDate || new Date().toISOString(),
              createdAt: responsePayment.createdAt || new Date().toISOString(),
              updatedAt: responsePayment.updatedAt || new Date().toISOString(),
              deletedAt: null,
              createdBy: oldData.data.createdBy, // reuse property creator (best effort)
              lease: {
                ...data.data.lease,
                rentAmount: data.data.lease.rentAmount,
                tenant: data.data.tenant,
                property: {
                  ...oldData.data,
                },
              },
            };
          } else if ((data.data.lease as any)?.paymentId) {
            // Fallback: create synthetic payment with placeholders if only paymentId present
            constructedPayment = {
              id: (data.data.lease as any).paymentId,
              type: "manual" as const,
              amount: parseFloat(
                (data.data.lease as any).rentAmount?.toString() || "0",
              ),
              reference: null,
              status: "completed" as const,
              receiptUrl: null,
              leaseId: data.data.lease.id,
              createdById: oldData.data.createdById,
              paymentDate:
                (variables as any).paymentDate || new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deletedAt: null,
              createdBy: oldData.data.createdBy,
              lease: {
                ...data.data.lease,
                tenant: data.data.tenant,
                property: {
                  ...oldData.data,
                },
              },
            };
          }

          const mergedPayments = constructedPayment
            ? existingPayments.some((p) => p.id === constructedPayment.id)
              ? existingPayments
              : [constructedPayment, ...existingPayments]
            : existingPayments;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              currentLease: {
                ...data.data.lease,
                // Attach tenant so UI can read currentLease.tenant.* immediately
                tenant: data.data.tenant,
              } as any,
              currentLeaseId: data.data.lease.id,
              payments: mergedPayments,
            },
          };
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

      // Invalidate dashboard stats so UI reflects new tenant
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["super-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
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

      // Invalidate dashboard stats to reflect tenant changes
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["super-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
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

      // Optimistically update the specific property to remove current lease
      queryClient.setQueryData(["property"], (oldUnknown: any) => oldUnknown);
      // We need propertyId but only have leaseId here; optionally a broader invalidate for all properties
      queryClient.invalidateQueries({
        queryKey: ["property"],
        refetchType: "none",
      });

      // Invalidate dashboard stats to reflect tenant removal
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["super-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};
