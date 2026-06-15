/**
 * Port of Angular `style-loader.service.ts`.
 * Dynamically injects a <link rel="stylesheet">.
 */
const loaded = new Set<string>();

export function loadStyle(href: string): Promise<void> {
  if (loaded.has(href)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const el = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = href;
    el.onload = () => {
      loaded.add(href);
      resolve();
    };
    el.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
    document.head.appendChild(el);
  });
}
