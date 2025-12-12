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
 * @returns New sorted array of navigation items
 */
export function sortItems(
  items: NavItem[],
  options: SortItemsOptions = {},
): NavItem[] {
  const { sort = defaultSort } = options;

  // Create a shallow copy to avoid mutation
  const sortedItems = [...items].sort(sort);

  // Recursively sort children
  return sortedItems.map((item) => {
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: sortItems(item.children, options),
      };
    }
    return item;
  });
}
