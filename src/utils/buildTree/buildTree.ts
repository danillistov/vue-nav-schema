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

  const childrenMap = new Map<string, NavItem[]>();
  const itemMap = new Map(items.map(item => [item.id, item]));

  items.forEach(item => {
    childrenMap.set(item.id, []);
  });

  const rootItems: NavItem[] = [];

  items.forEach((item) => {
    const parentId = item.meta?.parent
      ?? (usePathHierarchy && item.path ? findParentByPath(item.path, itemMap) : null);

    if (parentId && itemMap.has(parentId)) {
      const children = childrenMap.get(parentId)!;
      children.push(item);
    } else {
      rootItems.push(item);
    }
  });

  items.forEach(item => {
    const children = childrenMap.get(item.id)!;
    item.children = children;
  });

  return rootItems;
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
