import { useState } from 'react';
import { useUsers, useDeleteUser } from '@/features/users/api/users-api';
import { Can } from '@/shared/components/can';
import { CreateUserDialog } from '@/features/users/components/CreateUserDialog';
import { EditUserDialog } from '@/features/users/components/EditUserDialog';
import { AssignRolesDialog } from '@/features/users/components/AssignRolesDialog';
import type { UserSummary } from '@/shared/types';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserSummary | null>(null);
  const [assigningRolesUser, setAssigningRolesUser] = useState<UserSummary | null>(null);

  const { data, isLoading, error } = useUsers({ page, pageSize });
  const deleteUser = useDeleteUser();

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading users...</div>;
  }

  if (error) {
    return <div className="text-destructive p-4">Error loading users: {error.message}</div>;
  }

  const totalPages = Math.ceil((data?.totalCount ?? 0) / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users, assign roles, and control access</p>
        </div>
        <Can permission="users.create">
          <button
            type="button"
            onClick={() => setShowCreateDialog(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            + Create User
          </button>
        </Can>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Roles</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{user.fullName}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {user.roles.map((role) => (
                      <span key={role} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Can permission="users.assign-roles">
                    <button
                      type="button"
                      onClick={() => setAssigningRolesUser(user)}
                      className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                    >
                      Roles
                    </button>
                  </Can>
                  <Can permission="users.edit">
                    <button
                      type="button"
                      onClick={() => setEditingUser(user)}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20"
                    >
                      Edit
                    </button>
                  </Can>
                  <Can permission="users.delete">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this user?')) {
                          deleteUser.mutate(user.id);
                        }
                      }}
                      className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20"
                    >
                      Delete
                    </button>
                  </Can>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Total: {data?.totalCount} users</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {showCreateDialog && <CreateUserDialog onClose={() => setShowCreateDialog(false)} />}
      {editingUser && <EditUserDialog user={editingUser} onClose={() => setEditingUser(null)} />}
      {assigningRolesUser && <AssignRolesDialog user={assigningRolesUser} onClose={() => setAssigningRolesUser(null)} />}
    </div>
  );
}
