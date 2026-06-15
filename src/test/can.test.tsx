import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAuthStore } from '@/shared/stores/auth-store';
import { Can } from '@/shared/components/can';

describe('Can Component', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: '1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        isActive: true,
        createdAt: '2024-01-01',
        roles: ['Admin'],
        permissions: ['users.view', 'users.create'],
      },
      accessToken: 'token',
      refreshToken: 'refresh',
      isAuthenticated: true,
    });
  });

  it('should render children when user has permission', () => {
    render(
      <Can permission="users.view">
        <button>View Users</button>
      </Can>
    );

    expect(screen.getByText('View Users')).toBeInTheDocument();
  });

  it('should not render children when user lacks permission', () => {
    render(
      <Can permission="users.delete">
        <button>Delete User</button>
      </Can>
    );

    expect(screen.queryByText('Delete User')).not.toBeInTheDocument();
  });

  it('should render fallback when user lacks permission', () => {
    render(
      <Can permission="users.delete" fallback={<span>No Access</span>}>
        <button>Delete User</button>
      </Can>
    );

    expect(screen.queryByText('Delete User')).not.toBeInTheDocument();
    expect(screen.getByText('No Access')).toBeInTheDocument();
  });

  it('should work with "any" mode for multiple permissions', () => {
    render(
      <Can permission={['users.view', 'users.delete']} mode="any">
        <button>Action</button>
      </Can>
    );

    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('should work with "all" mode for multiple permissions', () => {
    render(
      <Can permission={['users.view', 'users.delete']} mode="all">
        <button>Action</button>
      </Can>
    );

    expect(screen.queryByText('Action')).not.toBeInTheDocument();
  });
});
