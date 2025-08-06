import { useMutation } from "@tanstack/react-query";
import api from "@/service/api";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest, AuthResponse } from "@/types/user";

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      const { user, token } = data.data;
      login(user, token);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};
