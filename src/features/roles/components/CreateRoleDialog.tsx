import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRole } from '@/features/roles/api/roles-api';
import { usePermissionsList } from '@/features/permissions/api/permissions-api';

const createRoleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().min(1, 'Description is required'),
  permissionIds: z.array(z.string()).optional(),
});

type CreateRoleFormData = z.infer<typeof createRoleSchema>;

interface CreateRoleDialogProps {
  onClose: () => void;
}

export function CreateRoleDialog({ onClose }: CreateRoleDialogProps) {
  const createRole = useCreateRole();
  const { data: permissions } = usePermissionsList();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
  });

  const onSubmit = (data: CreateRoleFormData) => {
    createRole.mutate(data, {
      onSuccess: () => onClose(),
    });
  };

  // Group permissions by module
  const permissionsByModule = permissions?.reduce(
    (acc, p) => {
      if (!acc[p.module]) acc[p.module] = [];
      acc[p.module]!.push(p);
      return acc;
    },
    {} as Record<string, typeof permissions>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold">Create New Role</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role Name</label>
            <input
              {...register('name')}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="e.g., Editor, Viewer"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 border rounded-md text-sm"
              rows={2}
              placeholder="Describe what this role can do..."
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Permissions</label>
            <div className="space-y-3 max-h-64 overflow-y-auto border rounded-md p-3">
              {permissionsByModule &&
                Object.entries(permissionsByModule).map(([module, perms]) => (
                  <div key={module}>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                      {module}
                    </h4>
                    <div className="space-y-1 ml-2">
                      {perms?.map((perm) => (
                        <label key={perm.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            value={perm.id}
                            {...register('permissionIds')}
                            className="rounded"
                          />
                          {perm.displayName}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {createRole.isError && (
            <p className="text-sm text-destructive">
              {(createRole.error as Error).message || 'Failed to create role'}
            </p>
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
              type="submit"
              disabled={createRole.isPending}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {createRole.isPending ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
