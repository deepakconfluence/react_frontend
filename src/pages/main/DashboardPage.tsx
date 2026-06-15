import { useAuthStore } from '@/shared/stores/auth-store';
import { usePermissions } from '@/shared/components/can';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { permissions, roles } = usePermissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.firstName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Your Roles</p>
          <p className="text-2xl font-bold mt-1">{roles.length}</p>
          <div className="flex gap-1 mt-2 flex-wrap">
            {roles.map((role) => (
              <span key={role} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {role}
              </span>
            ))}
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Your Permissions</p>
          <p className="text-2xl font-bold mt-1">{permissions.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Account Status</p>
          <p className="text-2xl font-bold mt-1 text-green-600">Active</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Member Since</p>
          <p className="text-2xl font-bold mt-1">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Your Permissions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {permissions.map((perm) => (
            <div key={perm} className="text-sm px-3 py-1.5 bg-muted rounded">
              {perm}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
