import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type ApiResponse } from '@/shared/api/client';
import type {
  UserListResponse,
  UserDetail,
  CreateUserRequest,
  UpdateUserRequest,
  PaginationParams,
} from '@/shared/types';

const USERS_QUERY_KEY = 'users';

export function useUsers(params: PaginationParams) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<UserListResponse>>('/users', {
        params: { page: params.page, pageSize: params.pageSize },
      });
      return response.data.data;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<UserDetail>>(`/users/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await apiClient.post<ApiResponse<UserDetail>>('/users', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserRequest }) => {
      const response = await apiClient.put<ApiResponse<UserDetail>>(`/users/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}

export function useAssignRolesToUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleIds }: { userId: string; roleIds: string[] }) => {
      await apiClient.put(`/users/${userId}/roles`, roleIds);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY, variables.userId] });
    },
  });
}
