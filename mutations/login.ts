import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/service/api";
import { useAuthStore } from "@/store/authStore";
import type {
  LoginRequest,
  AuthResponse,
  WhoAmIResponse,
  ForgotPasswordRequest,
  ApiResponse,
  ResetPasswordRequest,
  VerifyPasswordResetLinkRequest,
  VerifyPasswordResetLinkResponse,
} from "@/types/user";

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

// Forgot Password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (
      payload: ForgotPasswordRequest,
    ): Promise<ApiResponse> => {
      const response = await api.post("/auth/forgot-password", payload);
      return response.data;
    },
  });
};

// Reset Password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (payload: ResetPasswordRequest): Promise<ApiResponse> => {
      const response = await api.post("/auth/reset-password", payload);
      return response.data;
    },
  });
};

// Verify Password Reset Link
export const useVerifyPasswordResetLink = () => {
  return useMutation({
    mutationFn: async (
      payload: VerifyPasswordResetLinkRequest,
    ): Promise<VerifyPasswordResetLinkResponse> => {
      const response = await api.post(
        "/auth/verify-password-reset-link",
        payload,
      );
      return response.data;
    },
  });
};

// Query variant (preferred) for verifying password reset link
export const useVerifyPasswordResetLinkQuery = (
  token?: string,
  userId?: string,
) => {
  return useQuery({
    queryKey: ["verify-password-reset-link", token, userId],
    queryFn: async () => {
      const response = await api.post("/auth/verify-password-reset-link", {
        token,
        userId,
      } as VerifyPasswordResetLinkRequest);
      return response.data as VerifyPasswordResetLinkResponse;
    },
    enabled: Boolean(token && userId),
    retry: false, // Don't retry invalid/expired links automatically
  });
};
