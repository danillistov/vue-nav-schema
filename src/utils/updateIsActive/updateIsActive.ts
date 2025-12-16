import type { NavItem } from '@/types';
import { checkIsActive } from '@/utils/checkIsActive/checkIsActive';

/**
 * Recursively updates the isActive property for all navigation items
 * based on the current path.
 *
 * This function mutates the items in place to preserve reactivity.
 *
 * @param items - Array of navigation items to update
 * @param currentPath - The current path to check against
 */
export function updateIsActive(items: NavItem[], currentPath: string): void {
  items.forEach((item) => {
    if (item.path) {
      item.isActive = checkIsActive(
        item.path,
        currentPath,
        item.meta?.activeMatch as string | RegExp | undefined,
      );
    }

    if (item.children && item.children.length > 0) {
      updateIsActive(item.children, currentPath);
    }
  });
}
