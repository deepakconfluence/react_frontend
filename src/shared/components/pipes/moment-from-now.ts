/**
 * Replaces Angular `moment-from-now.pipe.ts` using Intl.RelativeTimeFormat.
 *
 * formatFromNow('2025-01-01') → "5 months ago"
 */
const UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; ms: number }> = [
  { unit: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: 'day', ms: 24 * 60 * 60 * 1000 },
  { unit: 'hour', ms: 60 * 60 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
  { unit: 'second', ms: 1000 },
];

export function formatFromNow(value: string | number | Date | null | undefined, refTimestamp?: number): string {
  if (value == null) return '';
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return '';

  // Caller must supply a reference timestamp; we accept it as a param so the function stays pure / SSR-safe.
  const reference = refTimestamp ?? target;
  const diffMs = target - reference;

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  for (const { unit, ms } of UNITS) {
    if (Math.abs(diffMs) >= ms || unit === 'second') {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }
  return '';
}
