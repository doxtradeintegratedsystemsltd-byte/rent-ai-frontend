import { UserRole } from "@/types/user";

export const isAdmin = (role?: UserRole) =>
  role === "admin" || role === "superadmin";
export const isTenant = (role?: UserRole) => role === "tenant";
export const isSuperAdmin = (role?: UserRole) => role === "superadmin";

export const canManageUsers = (role?: UserRole) =>
  isAdmin(role) || isSuperAdmin(role);
export const canViewAllProperties = (role?: UserRole) => isSuperAdmin(role);
