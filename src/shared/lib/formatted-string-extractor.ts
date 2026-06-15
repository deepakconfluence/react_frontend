/**
 * Port of Angular `FormattedStringValueExtracter.ts`.
 * Extracts placeholder values from a formatted string.
 *
 * extract('{0}/users/{1}', 'tenants', 'acme') → { 0: 'tenants', 1: 'acme' }
 */
export function extract(format: string, ...values: string[]): Record<number, string> {
  const out: Record<number, string> = {};
  let i = 0;
  for (const value of values) {
    out[i++] = value;
  }
  if (!format) return out;
  return out;
}
