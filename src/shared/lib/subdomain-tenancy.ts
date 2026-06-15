/**
 * Port of Angular `SubdomainTenancyNameFinder.ts`.
 * Extracts a tenancy name from a subdomain-based URL.
 *
 * Example: `acme.app.example.com` + format `{TENANCY_NAME}.app.example.com` → `acme`.
 */
export function getCurrentTenancyNameOrNull(
  appBaseUrlFormat: string,
  currentRootAddress: string = window.location.host
): string | null {
  const placeholder = '{TENANCY_NAME}';
  if (!appBaseUrlFormat.includes(placeholder)) return null;

  const escaped = appBaseUrlFormat
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(placeholder, '(.+)');

  const pattern = new RegExp(escaped);
  const match = pattern.exec(currentRootAddress);
  return match?.[1] ?? null;
}
