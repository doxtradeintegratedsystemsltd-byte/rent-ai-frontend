"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, UserType, AuthState } from "@/types/user";

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;

  // Getters/computed values
  getUserRole: () => UserType | null;
  getFullName: () => string;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isTenant: () => boolean;
  hasRole: (role: UserType) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      setUser: (user: User) =>
        set((state) => ({
          user,
          isAuthenticated: !!user,
        })),

      setToken: (token: string) =>
        set((state) => ({
          token,
          isAuthenticated: !!state.user && !!token,
        })),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      login: (user: User, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      updateUser: (updates: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Getters/computed values
      getUserRole: () => {
        const { user } = get();
        return user?.userType || null;
      },

      getFullName: () => {
        const { user } = get();
        if (!user) return "";
        return `${user.firstName} ${user.lastName}`.trim();
      },

      isSuperAdmin: () => {
        const { user } = get();
        return user?.userType === "superAdmin";
      },

      isAdmin: () => {
        const { user } = get();
        return user?.userType === "admin";
      },

      isTenant: () => {
        const { user } = get();
        return user?.userType === "tenant";
      },

      hasRole: (role: UserType) => {
        const { user } = get();
        return user?.userType === role;
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), // Only persist these fields
      skipHydration: false,
    },
  ),
);

// Selectors for better performance (only re-render when specific values change)
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useUserRole = () => useAuthStore((state) => state.getUserRole());
export const useFullName = () => useAuthStore((state) => state.getFullName());

// Role-based selectors
export const useIsSuperAdmin = () =>
  useAuthStore((state) => state.isSuperAdmin());
export const useIsAdmin = () => useAuthStore((state) => state.isAdmin());
export const useIsTenant = () => useAuthStore((state) => state.isTenant());

// Auth actions
export const useAuthActions = () =>
  useAuthStore((state) => ({
    setUser: state.setUser,
    setToken: state.setToken,
    setLoading: state.setLoading,
    login: state.login,
    logout: state.logout,
    updateUser: state.updateUser,
    hasRole: state.hasRole,
  }));

// Helper to get auth state outside of React components
export const getAuthState = () => useAuthStore.getState();

// Helper to check if user is authenticated (can be used in middleware, etc.)
export const isAuthenticated = () => {
  const state = useAuthStore.getState();
  return state.isAuthenticated && !!state.user && !!state.token;
};

// Helper to get current user outside of React components
export const getCurrentUser = () => {
  const state = useAuthStore.getState();
  return state.user;
};

// Helper to get current token outside of React components
export const getCurrentToken = () => {
  const state = useAuthStore.getState();
  return state.token;
};
