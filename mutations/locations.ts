import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/service/api";
import type { ApiResponse } from "@/types/user";
import type {
  LocationCreateRequest,
  LocationCreateResponse,
} from "@/types/locations";
import { useQuery } from "@tanstack/react-query";
import type {
  LocationsFetchParams,
  LocationsListResponse,
} from "@/types/locations";
import type { LocationSingleResponse } from "@/types/locations";

// Create location
export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: LocationCreateRequest,
    ): Promise<ApiResponse<LocationCreateResponse>> => {
      const response = await api.post("/locations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["super-dashboard-stats"] });
    },
  });
};

// Fetch locations (paginated)
export const useFetchLocations = (params?: LocationsFetchParams) => {
  return useQuery({
    queryKey: ["locations", params],
    queryFn: async (): Promise<ApiResponse<LocationsListResponse>> => {
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
      if (params?.sortOrder) {
        searchParams.append("sortOrder", params.sortOrder);
      }
      if (params?.adminId) {
        searchParams.append("adminId", params.adminId);
      }

      const url = `/locations${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await api.get(url);
      return response.data;
    },
  });
};

// Fetch single location details
export const useFetchLocation = (id?: string) => {
  return useQuery({
    queryKey: ["location", id],
    queryFn: async (): Promise<ApiResponse<LocationSingleResponse>> => {
      const response = await api.get(`/locations/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
