import { useMutation } from "@tanstack/react-query";
import api from "@/service/api";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest, AuthResponse, WhoAmIResponse } from "@/types/user";

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      const { user, token } = data.data;

      // Set the token first so subsequent API calls are authenticated
      login(user, token);

      // Fetch updated user data from whoAmI endpoint
      try {
        const whoAmIResponse = await api.get("/users/who-am-i");
        const whoAmIData: WhoAmIResponse = whoAmIResponse.data;

        // Update the store with the complete user data
        const { setUser } = useAuthStore.getState();
        setUser(whoAmIData.data);
      } catch (error) {
        console.error("Failed to fetch user data after login:", error);
        // Still proceed with login even if whoAmI fails
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};
