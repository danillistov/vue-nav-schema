import type { NavItem } from '@/types';
import { checkIsActive } from '@/utils/checkIsActive/checkIsActive';
import { Router } from 'vue-router';

/**
 * Recursively updates the isActive property for all navigation items
 * based on the current path.
 *
 * This function mutates the items in place to preserve reactivity.
 *
 * @param items - Array of navigation items to update
 * @param router - Vue Router instance to get the current path from
 */
export function updateIsActive(items: NavItem[], router: Router): void {
  const { path: currentPath } = router.currentRoute.value;

  items.forEach((item) => {
    if (item.path) {
      item.isActive = checkIsActive(
        item.path,
        currentPath,
        item.meta?.activeMatch as string | RegExp | undefined,
      );
    }

    if (item.children && item.children.length > 0) {
      updateIsActive(item.children, router);
    }
  });
}
