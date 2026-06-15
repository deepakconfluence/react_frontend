/**
 * Format a date for display. Replaces Angular `moment-format.pipe.ts`.
 * Uses Intl instead of moment to avoid the legacy moment dependency.
 */
export function formatDate(value: string | number | Date | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (value == null) return '';
  try {
    const d = new Date(value);
    return new Intl.DateTimeFormat(undefined, opts ?? { dateStyle: 'medium' }).format(d);
  } catch {
    return String(value);
  }
}

export function formatDateTime(value: string | number | Date | null | undefined): string {
  return formatDate(value, { dateStyle: 'medium', timeStyle: 'short' });
}
