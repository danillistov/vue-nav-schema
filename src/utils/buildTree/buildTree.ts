import { rangeRight } from 'es-toolkit';
import type { NavItem } from '@/types';
import { validateNavItem, validateChildren, CircularDependencyError } from '@/errors';

export interface BuildTreeOptions {
  usePathHierarchy?: boolean;
  validateItems?: boolean;
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
 * @param options.validateItems - Enable validation of navigation items (default: true in dev, false in prod)
 *
 * @returns Hierarchical tree structure
 * @throws {ValidationError} If item validation fails
 * @throws {CircularDependencyError} If circular dependency is detected
 */
export function buildTree(
  items: NavItem[],
  options: BuildTreeOptions = {},
): NavItem[] {
  const { usePathHierarchy = false, validateItems = process.env.NODE_ENV !== 'production' } = options;

  if (validateItems) {
    items.forEach(item => validateNavItem(item));
  }

  const childrenMap = new Map<string, NavItem[]>();
  const itemMap = new Map(items.map(item => [item.id, item]));

  if (validateItems) {
    detectCircularDependencies(items, itemMap);
  }

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

    if (validateItems && children.length > 0) {
      validateChildren(children, item.id);
    }

    item.children = children;
  });

  return rootItems;
}

/**
 * Detects circular dependencies in the navigation tree
 * @throws {CircularDependencyError} If circular dependency is detected
 */
function detectCircularDependencies(
  items: NavItem[],
  itemMap: Map<string, NavItem>,
): void {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function visit(itemId: string, path: string[] = []): void {
    if (recursionStack.has(itemId)) {
      const cycle = [...path, itemId].join(' -> ');
      throw new CircularDependencyError(
        `Circular dependency detected: ${cycle}`,
        {
          cycle: [...path, itemId],
          itemId,
        },
      );
    }

    if (visited.has(itemId)) {
      return;
    }

    visited.add(itemId);
    recursionStack.add(itemId);

    const item = itemMap.get(itemId);
    if (item?.meta?.parent) {
      visit(item.meta.parent as string, [...path, itemId]);
    }

    recursionStack.delete(itemId);
  }

  items.forEach(item => {
    if (!visited.has(item.id)) {
      visit(item.id);
    }
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
