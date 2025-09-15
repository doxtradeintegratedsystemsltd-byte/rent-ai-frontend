import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/service/api";
import {
  CreateNotificationRequest,
  CreateNotificationResponse,
  NotificationsResponse,
  MarkNotificationAsReadResponse,
} from "@/types/notification";

const ts = Date.now();

export const useCreateNotification = () => {
  return useMutation({
    mutationFn: async (
      notificationData: CreateNotificationRequest,
    ): Promise<CreateNotificationResponse> => {
      const response = await api.post(
        "/leases/send-custom-notification",
        notificationData,
      );
      return response.data;
    },
  });
};

export const useGetNotifications = (
  page: number = 0,
  size: number = 10,
  seen?: boolean,
) => {
  return useQuery({
    queryKey: ["notifications", { page, size, seen }],
    queryFn: async (): Promise<NotificationsResponse> => {
      const seenParam = seen !== undefined ? `&seen=${seen}` : "";
      const response = await api.get(
        `/notifications/user?page=${page}&size=${size}&sort=createdAt&sortOrder=DESC${seenParam}&t=${ts}`,
      );
      return response.data;
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      notificationId: string,
    ): Promise<MarkNotificationAsReadResponse> => {
      const response = await api.put(
        `/notifications/user/mark-read/${notificationId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications-count"],
      });
    },
  });
};

export const useGetUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: async (): Promise<{ count: number }> => {
      const response = await api.get(
        `/notifications/user/unread-count?t=${ts}`,
      );
      return response.data.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.put("/notifications/user/mark-all-read");
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications-count"],
      });
    },
  });
};
