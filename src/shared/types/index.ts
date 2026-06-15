// ============= Auth Types =============
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// ============= User Management Types =============
export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  roles: string[];
}

export interface UserDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  roles: RoleSummary[];
  permissions: string[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleIds?: string[];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roleIds?: string[];
}

export interface UserListResponse {
  users: UserSummary[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// ============= Role Types =============
export interface RoleSummary {
  id: string;
  name: string;
  description: string;
}

export interface RoleList {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissionCount: number;
  userCount: number;
}

export interface RoleDetail {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string | null;
  permissions: Permission[];
  userCount: number;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissionIds?: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissionIds?: string[];
}

// ============= Permission Types =============
export interface Permission {
  id: string;
  name: string;
  displayName: string;
  module: string;
  description: string;
}

// ============= Common Types =============
export interface PaginationParams {
  page: number;
  pageSize: number;
}
