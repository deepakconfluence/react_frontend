import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/shared/stores/auth-store';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  });

  it('should set auth data on login', () => {
    const user = {
      id: '1',
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      isActive: true,
      createdAt: '2024-01-01',
      roles: ['Admin'],
      permissions: ['users.view', 'users.create'],
    };

    useAuthStore.getState().setAuth(user, 'token123', 'refresh123');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.accessToken).toBe('token123');
    expect(state.refreshToken).toBe('refresh123');
  });

  it('should clear auth data on logout', () => {
    useAuthStore.getState().setAuth(
      {
        id: '1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        isActive: true,
        createdAt: '2024-01-01',
        roles: ['Admin'],
        permissions: ['users.view'],
      },
      'token',
      'refresh'
    );

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });

  it('should check permissions correctly', () => {
    useAuthStore.getState().setAuth(
      {
        id: '1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        isActive: true,
        createdAt: '2024-01-01',
        roles: ['Admin'],
        permissions: ['users.view', 'users.create', 'roles.view'],
      },
      'token',
      'refresh'
    );

    expect(useAuthStore.getState().hasPermission('users.view')).toBe(true);
    expect(useAuthStore.getState().hasPermission('users.delete')).toBe(false);
    expect(useAuthStore.getState().hasAnyPermission(['users.view', 'users.delete'])).toBe(true);
    expect(useAuthStore.getState().hasAllPermissions(['users.view', 'users.create'])).toBe(true);
    expect(useAuthStore.getState().hasAllPermissions(['users.view', 'users.delete'])).toBe(false);
  });

  it('should check roles correctly', () => {
    useAuthStore.getState().setAuth(
      {
        id: '1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        isActive: true,
        createdAt: '2024-01-01',
        roles: ['Admin', 'Manager'],
        permissions: [],
      },
      'token',
      'refresh'
    );

    expect(useAuthStore.getState().hasRole('Admin')).toBe(true);
    expect(useAuthStore.getState().hasRole('User')).toBe(false);
  });
});
