/**
 * Port of Angular `UrlHelper.ts`. URL parsing & query-string utilities.
 */

export function getQueryParameters(url?: string): Record<string, string> {
  const target = url ?? window.location.href;
  const queryIndex = target.indexOf('?');
  if (queryIndex < 0) return {};
  const params = new URLSearchParams(target.substring(queryIndex));
  const out: Record<string, string> = {};
  params.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

export function getInitialUrlParts(): { hostPart: string; appPart: string } {
  const { protocol, host, pathname } = window.location;
  return {
    hostPart: `${protocol}//${host}`,
    appPart: pathname.split('/').slice(0, 2).join('/') || '/',
  };
}

export function trimEnd(value: string, ch = '/'): string {
  let end = value.length;
  while (end > 0 && value[end - 1] === ch) end--;
  return value.substring(0, end);
}
