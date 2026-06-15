/**
 * Port of Angular `DomHelper.ts` / `HtmlHelper.ts`.
 */

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attrs: Record<string, string> = {}
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tagName);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

export function appendChild(parent: HTMLElement, child: HTMLElement): void {
  parent.appendChild(child);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
