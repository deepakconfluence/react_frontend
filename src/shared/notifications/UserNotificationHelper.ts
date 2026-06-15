/**
 * Replaces Angular `UserNotificationHelper.ts`.
 * Stub — wire real notification mapping when the API contract is finalized.
 */
export interface AppNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  url?: string;
}

export const userNotificationHelper = {
  format(raw: { notification: { data: Record<string, unknown>; severity: number } }): AppNotification {
    const { data } = raw.notification;
    return {
      id: String(data.id ?? ''),
      title: String(data.title ?? 'Notification'),
      description: String(data.message ?? ''),
      createdAt: String(data.creationTime ?? new Date(0).toISOString()),
      read: false,
      url: typeof data.url === 'string' ? data.url : undefined,
    };
  },
};
