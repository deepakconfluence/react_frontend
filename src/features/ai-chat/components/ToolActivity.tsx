import { Loader2, CheckCircle2, Wrench } from 'lucide-react';

export interface ToolActivityItem {
  name: string;
  phase: string; // "start" | "done"
  summary: string | null;
}

const LABELS: Record<string, string> = {
  list_roles: 'Looking up roles',
  get_role: 'Loading role',
  list_users: 'Looking up users',
  get_user: 'Loading user',
  list_permissions: 'Looking up permissions',
  create_user: 'Creating user',
  create_role: 'Creating role',
  assign_roles_to_user: 'Assigning roles',
  assign_permissions_to_role: 'Granting permissions',
};

function label(name: string) {
  return LABELS[name] ?? name;
}

export function ToolActivity({ items }: { items: ToolActivityItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <div
          key={`${item.name}-${i}`}
          className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground"
        >
          {item.phase === 'done' ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
          ) : (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
          )}
          <Wrench className="h-3 w-3 shrink-0 opacity-60" />
          <span className="truncate">
            {item.phase === 'done' && item.summary ? item.summary : `${label(item.name)}…`}
          </span>
        </div>
      ))}
    </div>
  );
}
