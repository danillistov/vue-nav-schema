import { rangeRight } from 'es-toolkit';
import type { NavItem } from '@/types';

export interface BuildTreeOptions {
  usePathHierarchy?: boolean;
}

/**
 * Builds a hierarchical tree structure from flat array of navigation items.
 *
 * Priority:
 * 1. Explicit parent via meta.parent
 * 2. Automatic hierarchy by path (if usePathHierarchy is true)
 *
 * @param items - Flat array of navigation items
 * @param options - Build options
 * @param options.usePathHierarchy - Enable automatic hierarchy detection by path
 *
 * @returns Hierarchical tree structure
 */
export function buildTree(
  items: NavItem[],
  options: BuildTreeOptions = {},
): NavItem[] {
  const { usePathHierarchy = false } = options;

  const clonedItems = items.map(item => ({ ...item, children: [] as NavItem[] }));
  const itemMap = new Map(clonedItems.map(item => [item.id, item]));

  return clonedItems.filter((item) => {
    const originalItem = items.find(i => i.id === item.id)!;
    const parentId = originalItem.meta?.parent
      ?? (usePathHierarchy && originalItem.path ? findParentByPath(originalItem.path, itemMap) : null);

    if (parentId && itemMap.has(parentId)) {
      const parent = itemMap.get(parentId)!;

      parent.children!.push(item);

      return false;
    }

    return true;
  });
}

/**
 * Finds parent item ID by analyzing path hierarchy
 */
function findParentByPath(
  path: string,
  itemMap: Map<string, NavItem>,
): string | null {
  const segments = path.split('/').filter(Boolean);

  return (
    rangeRight(1, segments.length)
      .map(i => `/${segments.slice(0, i).join('/')}`)
      .map(parentPath => [...itemMap.entries()].find(([, item]) => item.path === parentPath)?.[0])
      .find(Boolean) ?? null
  );
}
