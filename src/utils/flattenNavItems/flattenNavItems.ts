import type { NavItem } from '@/types';

/**
 * Flattens a hierarchical navigation tree into a single-level array.
 * All nested children are recursively extracted and added to the result.
 *
 * @param items - Array of navigation items (can be hierarchical)
 * @returns Flat array containing all items including nested children
 *
 * @example
 * const tree = [
 *   { id: '1', label: 'Home', path: '/' },
 *   {
 *     id: '2',
 *     label: 'Users',
 *     path: '/users',
 *     children: [
 *       { id: '3', label: 'List', path: '/users/list' },
 *       { id: '4', label: 'Create', path: '/users/create' }
 *     ]
 *   }
 * ];
 *
 * const flat = flattenNavItems(tree);
 * // Result: [
 * //   { id: '1', ... },
 * //   { id: '2', ..., children: [...] },
 * //   { id: '3', ... },
 * //   { id: '4', ... }
 * // ]
 */
export function flattenNavItems(items: NavItem[]): NavItem[] {
  return items.reduce<NavItem[]>((acc, item) => {
    acc.push(item);

    if (item.children && item.children.length > 0) {
      acc.push(...flattenNavItems(item.children));
    }

    return acc;
  }, []);
}
