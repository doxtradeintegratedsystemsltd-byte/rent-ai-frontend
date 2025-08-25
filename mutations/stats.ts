import { useQuery } from "@tanstack/react-query";
import api from "@/service/api";
import type {
  DashboardStatsResponse,
  SuperDashboardStatsResponse,
  DashboardStatsParams,
  DashboardPeriod,
} from "@/types/stats";

// Query for fetching dashboard stats
export const useDashboardStats = (period: DashboardPeriod = "thisWeek") => {
  return useQuery({
    queryKey: ["dashboard-stats", period],
    queryFn: async (): Promise<DashboardStatsResponse> => {
      const params: DashboardStatsParams = { period };
      const response = await api.get("/users/dashboard", { params });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Query for fetching super admin dashboard stats
export const useSuperDashboardStats = (
  period: DashboardPeriod = "thisWeek",
) => {
  return useQuery({
    queryKey: ["super-dashboard-stats", period],
    queryFn: async (): Promise<SuperDashboardStatsResponse> => {
      const params: DashboardStatsParams = { period };
      const response = await api.get("/users/dashboard", { params });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
