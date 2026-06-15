import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type ApiResponse } from '@/shared/api/client';
import type {
  RoleList,
  RoleDetail,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '@/shared/types';

const ROLES_QUERY_KEY = 'roles';

export function useRoles() {
  return useQuery({
    queryKey: [ROLES_QUERY_KEY],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<RoleList[]>>('/roles');
      return response.data.data;
    },
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: [ROLES_QUERY_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<RoleDetail>>(`/roles/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoleRequest) => {
      const response = await apiClient.post<ApiResponse<RoleDetail>>('/roles', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRoleRequest }) => {
      const response = await apiClient.put<ApiResponse<RoleDetail>>(`/roles/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
    },
  });
}

export function useAssignPermissionsToRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) => {
      await apiClient.put(`/roles/${roleId}/permissions`, permissionIds);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY, variables.roleId] });
    },
  });
}
