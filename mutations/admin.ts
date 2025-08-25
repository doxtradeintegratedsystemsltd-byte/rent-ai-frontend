import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/service/api";
import type { ApiResponse } from "@/types/user";
import {
  AdminsListResponse,
  AdminsFetchParams,
  AdminDetailsResponse,
  AdminDetailsFetchParams,
  AdminUpdateRequest,
  AdminUpdateResponse,
  AdminCreateRequest,
  AdminCreateResponse,
} from "@/types/admin";

// Fetch all admins query with pagination
export const useFetchAdmins = (params?: AdminsFetchParams) => {
  return useQuery({
    queryKey: ["admins", params],
    queryFn: async (): Promise<ApiResponse<AdminsListResponse>> => {
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

      const url = `/users/admins${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;

      const response = await api.get(url);
      return response.data;
    },
  });
};

// Fetch single admin details with analytics
export const useFetchAdminDetails = (params: AdminDetailsFetchParams) => {
  return useQuery({
    queryKey: ["admin", params.id, params.period],
    queryFn: async (): Promise<ApiResponse<AdminDetailsResponse>> => {
      const searchParams = new URLSearchParams();

      if (params.period) {
        searchParams.append("period", params.period);
      }

      const url = `/users/admins/${params.id}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;

      const response = await api.get(url);
      return response.data;
    },
    enabled: !!params.id, // Only run query if id is provided
  });
};

// Update admin details
export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: AdminUpdateRequest;
    }): Promise<ApiResponse<AdminUpdateResponse>> => {
      const response = await api.put(`/users/admins/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate admin details query
      queryClient.invalidateQueries({ queryKey: ["admin", variables.id] });
      // Also invalidate admins list query
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

// Delete admin
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<ApiResponse<null>> => {
      const response = await api.delete(`/users/admins/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate admins list query to refresh the table
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

// Create admin
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: AdminCreateRequest,
    ): Promise<ApiResponse<AdminCreateResponse>> => {
      const response = await api.post("/auth/admin", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate admins list query to refresh the table
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};
