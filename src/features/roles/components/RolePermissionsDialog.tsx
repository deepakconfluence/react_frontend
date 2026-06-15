import { useState, useEffect } from 'react';
import { useRole, useAssignPermissionsToRole } from '@/features/roles/api/roles-api';
import { usePermissionsList } from '@/features/permissions/api/permissions-api';
import type { RoleList } from '@/shared/types';

interface RolePermissionsDialogProps {
  role: RoleList;
  onClose: () => void;
}

export function RolePermissionsDialog({ role, onClose }: RolePermissionsDialogProps) {
  const { data: roleDetail } = useRole(role.id);
  const { data: allPermissions } = usePermissionsList();
  const assignPermissions = useAssignPermissionsToRole();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (roleDetail) {
      setSelectedPermissions(roleDetail.permissions.map((p) => p.id));
    }
  }, [roleDetail]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = (module: string) => {
    const modulePermissions = allPermissions?.filter((p) => p.module === module) ?? [];
    const moduleIds = modulePermissions.map((p) => p.id);
    const allSelected = moduleIds.every((id) => selectedPermissions.includes(id));

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !moduleIds.includes(id)));
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...moduleIds])]);
    }
  };

  const handleSave = () => {
    assignPermissions.mutate(
      { roleId: role.id, permissionIds: selectedPermissions },
      { onSuccess: () => onClose() }
    );
  };

  // Group permissions by module
  const permissionsByModule = allPermissions?.reduce(
    (acc, p) => {
      if (!acc[p.module]) acc[p.module] = [];
      acc[p.module]!.push(p);
      return acc;
    },
    {} as Record<string, typeof allPermissions>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold">Manage Permissions</h2>
          <p className="text-sm text-muted-foreground">
            Role: <strong>{role.name}</strong>
          </p>
        </div>

        <div className="space-y-4">
          {permissionsByModule &&
            Object.entries(permissionsByModule).map(([module, perms]) => {
              const moduleIds = perms?.map((p) => p.id) ?? [];
              const allSelected = moduleIds.every((id) => selectedPermissions.includes(id));
              const someSelected = moduleIds.some((id) => selectedPermissions.includes(id));

              return (
                <div key={module} className="border rounded-md p-3">
                  <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected && !allSelected;
                      }}
                      onChange={() => handleSelectAll(module)}
                      className="rounded"
                    />
                    <span className="text-sm font-semibold">{module}</span>
                  </label>
                  <div className="space-y-1 ml-6">
                    {perms?.map((perm) => (
                      <label key={perm.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => handleTogglePermission(perm.id)}
                          className="rounded"
                        />
                        <span>{perm.displayName}</span>
                        <span className="text-xs text-muted-foreground">({perm.name})</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="text-sm text-muted-foreground">
          {selectedPermissions.length} permissions selected
        </div>

        {assignPermissions.isError && (
          <p className="text-sm text-destructive">Failed to update permissions</p>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={assignPermissions.isPending}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {assignPermissions.isPending ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
}
