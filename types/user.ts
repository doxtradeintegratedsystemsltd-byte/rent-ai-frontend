// Base User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  photoUrl: string | null;
  phoneNumber: string | null;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// User types enum
export type UserType = "superAdmin" | "admin" | "tenant";

// Authentication response interface
export interface AuthResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// Who Am I response interface
export interface WhoAmIResponse {
  statusCode: number;
  status: string;
  message: string;
  data: User;
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  statusCode: number;
  status: "success" | "error";
  message: string;
  data?: T;
  errors?: string[];
}

// Login request interface
export interface LoginRequest {
  email: string;
  password: string;
}

// User creation/update interfaces
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: UserType;
  tenantId?: string | null;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: UserType;
  tenantId?: string | null;
  phoneNumber?: string | null;
  photoUrl?: string | null;
}

// Password related interfaces
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// User profile interface (with computed properties)
export interface UserProfile extends User {
  fullName: string;
  isActive: boolean;
}

// Auth context state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Role-based user interfaces for type safety
export interface SuperAdminUser extends User {
  userType: "superAdmin";
  tenantId: null;
}

export interface AdminUser extends User {
  userType: "admin";
  tenantId: string;
}

export interface TenantUser extends User {
  userType: "tenant";
  tenantId: string;
}

// User table/list interfaces
export interface UserListResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserFilters {
  userType?: UserType;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof User;
  sortOrder?: "asc" | "desc";
}

// JWT token payload interface
export interface JWTPayload {
  id: string;
  role: UserType;
  email: string;
  iat: number;
  exp: number;
}

// User permissions interface
export interface UserPermissions {
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewAllUsers: boolean;
  canManageProperties: boolean;
  canViewReports: boolean;
  canManagePayments: boolean;
}

// User session interface
export interface UserSession {
  user: User;
  token: string;
  expiresAt: Date;
  permissions: UserPermissions;
}
