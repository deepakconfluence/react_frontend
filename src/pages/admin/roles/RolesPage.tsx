import { useState } from 'react';
import { useRoles, useDeleteRole } from '@/features/roles/api/roles-api';
import { Can } from '@/shared/components/can';
import { CreateRoleDialog } from '@/features/roles/components/CreateRoleDialog';
import { EditRoleDialog } from '@/features/roles/components/EditRoleDialog';
import { RolePermissionsDialog } from '@/features/roles/components/RolePermissionsDialog';
import type { RoleList } from '@/shared/types';

export default function RolesPage() {
  const { data: roles, isLoading, error } = useRoles();
  const deleteRole = useDeleteRole();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleList | null>(null);
  const [managingPermissionsRole, setManagingPermissionsRole] = useState<RoleList | null>(null);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading roles...</div>;
  }

  if (error) {
    return <div className="text-destructive p-4">Error loading roles: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">Define roles and assign permissions to control access</p>
        </div>
        <Can permission="roles.create">
          <button
            type="button"
            onClick={() => setShowCreateDialog(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            + Create Role
          </button>
        </Can>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles?.map((role) => (
          <div key={role.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {role.name}
                  {role.isSystem && (
                    <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">System</span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{role.permissionCount} permissions</span>
              <span>{role.userCount} users</span>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Can permission="roles.assign-permissions">
                <button
                  type="button"
                  onClick={() => setManagingPermissionsRole(role)}
                  className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                >
                  Permissions
                </button>
              </Can>
              {!role.isSystem && (
                <>
                  <Can permission="roles.edit">
                    <button
                      type="button"
                      onClick={() => setEditingRole(role)}
                      className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20"
                    >
                      Edit
                    </button>
                  </Can>
                  <Can permission="roles.delete">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete role "${role.name}"?`)) {
                          deleteRole.mutate(role.id);
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20"
                    >
                      Delete
                    </button>
                  </Can>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCreateDialog && <CreateRoleDialog onClose={() => setShowCreateDialog(false)} />}
      {editingRole && <EditRoleDialog role={editingRole} onClose={() => setEditingRole(null)} />}
      {managingPermissionsRole && (
        <RolePermissionsDialog role={managingPermissionsRole} onClose={() => setManagingPermissionsRole(null)} />
      )}
    </div>
  );
}
