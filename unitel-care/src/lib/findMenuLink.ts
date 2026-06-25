import type { MenuItem } from '@/router/menu';
import type React from 'react';

export interface MenuLinkItem {
  name: string;
  url?: string;
  icon?: React.ElementType;
}

const HOME_URL = '/';

export function findMenuLink(
  menu: MenuItem[],
  pathname: string,
  parents: MenuLinkItem[] = []
): MenuLinkItem[] | null {
  for (const item of menu) {
    if (item.url === HOME_URL) continue;
    const current = [...parents, { name: item.name, url: item.url, icon: item.icon }];

    // match exact url
    if (item.url === pathname) {
      return current;
    }

    // search children
    if (item.items) {
      const found = findMenuLink(item.items, pathname, current);
      if (found) return found;
    }
  }
  return null;
}
