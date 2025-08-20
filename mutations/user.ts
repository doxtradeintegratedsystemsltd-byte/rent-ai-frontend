import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserRequest, WhoAmIResponse } from "@/types/user";
import api from "@/service/api";
import { useAuthActions } from "@/store/authStore";

export const useWhoAmI = () => {
  return useQuery({
    queryKey: ["whoAmI"],
    queryFn: async (): Promise<WhoAmIResponse> => {
      const response = await api.get(`/users/who-am-i`);
      return response.data;
    },
  });
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthActions();

  return useMutation({
    mutationFn: async (data: UpdateUserRequest): Promise<WhoAmIResponse> => {
      const response = await api.put(`/users/profile`, data);
      return response.data;
    },
    onSuccess: (response) => {
      // Update the Zustand store with the new user data
      updateUser(response.data);

      // Also invalidate any queries that might be using the old whoAmI data
      queryClient.invalidateQueries({ queryKey: ["whoAmI"] });
    },
  });
};
