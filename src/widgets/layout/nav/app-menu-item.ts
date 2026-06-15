/**
 * Single menu entry. Mirrors Angular `app-menu-item.ts`.
 */
export interface AppMenuItem {
  name: string;
  permission?: string;
  icon?: string;
  route?: string;
  items?: AppMenuItem[];
  external?: boolean;
}
