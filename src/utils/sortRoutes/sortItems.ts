import type { NavItem } from '@/types';

export interface SortItemsOptions {
  sort?: (a: NavItem, b: NavItem) => number;
}

const defaultSort = (a: NavItem, b: NavItem): number => {
  const orderA = (a.meta?.order as number) ?? Infinity;
  const orderB = (b.meta?.order as number) ?? Infinity;
  return orderA - orderB;
};

/**
 * Sorts navigation items by order or custom sort function.
 * Recursively sorts children as well.
 *
 * @param items - Array of navigation items to sort
 * @param options - Sorting options
 * @param options.sort - Optional custom sort function
 *
 * @returns Sorted array of navigation items (mutates children in place to preserve reactivity)
 */
export function sortItems(
  items: NavItem[],
  options: SortItemsOptions = {},
): NavItem[] {
  const { sort = defaultSort } = options;

  const sortedItems = [...items].sort(sort);

  sortedItems.forEach((item) => {
    if (item.children && item.children.length > 0) {
      item.children = sortItems(item.children, options);
    }
  });

  return sortedItems;
}
