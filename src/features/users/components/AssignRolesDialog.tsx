import { useState } from 'react';
import { useRoles } from '@/features/roles/api/roles-api';
import { useAssignRolesToUser } from '@/features/users/api/users-api';
import type { UserSummary } from '@/shared/types';

interface AssignRolesDialogProps {
  user: UserSummary;
  onClose: () => void;
}

export function AssignRolesDialog({ user, onClose }: AssignRolesDialogProps) {
  const { data: roles } = useRoles();
  const assignRoles = useAssignRolesToUser();
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    // Pre-select current roles by finding matching role IDs
    roles?.filter((r) => user.roles.includes(r.name)).map((r) => r.id) ?? []
  );

  const handleToggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSave = () => {
    assignRoles.mutate(
      { userId: user.id, roleIds: selectedRoles },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Assign Roles</h2>
        <p className="text-sm text-muted-foreground">
          Assign roles to <strong>{user.fullName}</strong>
        </p>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {roles?.map((role) => (
            <label
              key={role.id}
              className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => handleToggleRole(role.id)}
                  className="rounded"
                />
                <div>
                  <p className="font-medium text-sm">{role.name}</p>
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {role.permissionCount} permissions
              </span>
            </label>
          ))}
        </div>

        {assignRoles.isError && (
          <p className="text-sm text-destructive">Failed to assign roles</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={assignRoles.isPending}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {assignRoles.isPending ? 'Saving...' : 'Save Roles'}
          </button>
        </div>
      </div>
    </div>
  );
}
