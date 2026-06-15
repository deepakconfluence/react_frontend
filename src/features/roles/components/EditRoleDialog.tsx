import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateRole } from '@/features/roles/api/roles-api';
import type { RoleList } from '@/shared/types';

const editRoleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().min(1, 'Description is required'),
});

type EditRoleFormData = z.infer<typeof editRoleSchema>;

interface EditRoleDialogProps {
  role: RoleList;
  onClose: () => void;
}

export function EditRoleDialog({ role, onClose }: EditRoleDialogProps) {
  const updateRole = useUpdateRole();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditRoleFormData>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      name: role.name,
      description: role.description,
    },
  });

  const onSubmit = (data: EditRoleFormData) => {
    updateRole.mutate(
      { id: role.id, data },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Edit Role</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role Name</label>
            <input
              {...register('name')}
              className="w-full px-3 py-2 border rounded-md text-sm"
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
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          {updateRole.isError && (
            <p className="text-sm text-destructive">Failed to update role</p>
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
              disabled={updateRole.isPending}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {updateRole.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
