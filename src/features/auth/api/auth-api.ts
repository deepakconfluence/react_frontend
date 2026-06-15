import { useMutation } from '@tanstack/react-query';
import { apiClient, type ApiResponse } from '@/shared/api/client';
import { useAuthStore } from '@/shared/stores/auth-store';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/shared/types';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/revoke');
    },
    onSettled: () => {
      logout();
    },
  });
}
