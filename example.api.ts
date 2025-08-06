import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { getCurrentToken, useAuthStore } from "@/store/authStore";
import type { ApiResponse } from "@/types/user";

// Base URL for the backend API
const BASE_URL = "https://rent-ai-backend.onrender.com/api";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getCurrentToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          data: config.data,
          params: config.params,
        },
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status: response.status,
          data: response.data,
        },
      );
    }

    return response;
  },
  (error: AxiosError) => {
    const { response, request, message } = error;

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error("❌ API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: response?.status,
        data: response?.data,
        message,
      });
    }

    // Handle different error scenarios
    if (response) {
      // Server responded with error status
      const status = response.status;
      const errorData = response.data as ApiResponse;

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          console.warn("🔒 Unauthorized access - clearing auth");
          useAuthStore.getState().logout();
          // Optionally redirect to login page
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          break;

        case 403:
          console.warn("🚫 Forbidden access");
          break;

        case 404:
          console.warn("🔍 Resource not found");
          break;

        case 422:
          console.warn("⚠️ Validation error");
          break;

        case 500:
          console.error("🔥 Server error");
          break;

        default:
          console.error(`❌ API Error ${status}`);
      }

      // Return structured error
      return Promise.reject({
        status,
        message: errorData?.message || `Request failed with status ${status}`,
        errors: errorData?.errors || [],
        data: errorData?.data,
      });
    } else if (request) {
      // Network error
      console.error("🌐 Network error - no response received");
      return Promise.reject({
        status: 0,
        message: "Network error - please check your connection",
        errors: ["Network error"],
        data: null,
      });
    } else {
      // Request setup error
      console.error("⚙️ Request setup error:", message);
      return Promise.reject({
        status: 0,
        message: "Request configuration error",
        errors: [message],
        data: null,
      });
    }
  },
);

// Helper function to create API requests with proper typing
export const apiRequest = async <T = any>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Convenience methods for different HTTP verbs
export const apiGet = async <T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({ method: "GET", url, ...config });
};

export const apiPost = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({ method: "POST", url, data, ...config });
};

export const apiPut = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({ method: "PUT", url, data, ...config });
};

export const apiPatch = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({ method: "PATCH", url, data, ...config });
};

export const apiDelete = async <T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({ method: "DELETE", url, ...config });
};

// Export the axios instance for direct use if needed
export default api;

// Export base URL for use in other files
export { BASE_URL };
