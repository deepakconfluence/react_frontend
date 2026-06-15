import { useQuery } from '@tanstack/react-query';
import { apiClient, type ApiResponse } from '@/shared/api/client';
import type { Permission } from '@/shared/types';

const PERMISSIONS_QUERY_KEY = 'permissions';

export function usePermissionsList() {
  return useQuery({
    queryKey: [PERMISSIONS_QUERY_KEY],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Permission[]>>('/permissions');
      return response.data.data;
    },
  });
}

export function usePermissionsByModule(module: string) {
  return useQuery({
    queryKey: [PERMISSIONS_QUERY_KEY, 'module', module],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Permission[]>>(`/permissions/module/${module}`);
      return response.data.data;
    },
    enabled: !!module,
  });
}

export function useMyPermissions() {
  return useQuery({
    queryKey: [PERMISSIONS_QUERY_KEY, 'my'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<string[]>>('/permissions/my-permissions');
      return response.data.data;
    },
  });
}
