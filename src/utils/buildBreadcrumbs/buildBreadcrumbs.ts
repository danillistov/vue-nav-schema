import type { Breadcrumb, Breadcrumbs, NavItem } from '@/types';
import { matchesPathExactly } from '@/helpers/pathPatternHelpers';
import { Router } from 'vue-router';

/**
 * Maps a NavItem to a Breadcrumb, extracting only the necessary fields.
 *
 * @param item - The navigation item to map
 * @param currentPath - The current path to determine if this breadcrumb is current
 * @param params - Optional route parameters to include in the breadcrumb
 * @returns A Breadcrumb object with id, path, label, current, and optionally routeParams fields
 */
function mapToBreadcrumb(item: NavItem, currentPath: string): Breadcrumb {
  const breadcrumb: Breadcrumb = {
    id: item.id,
    path: item.path,
    label: item.label,
    current: item.path ? matchesPathExactly(item.path, currentPath) : false,
  };

  return breadcrumb;
}

/**
 * Builds a breadcrumb trail from root to the current active item.
 * Uses the flat schema to find the active item and construct the path.
 *
 * @param flatItems - Flat array of all navigation items
 * @param router - Vue Router instance to get the current path from
 * @returns Array of Breadcrumbs representing the breadcrumb trail from root to current
 *
 * @example
 * const flatSchema = [
 *   { id: 'home', path: '/', label: 'Home' },
 *   { id: 'users', path: '/users', label: 'Users' },
 *   { id: 'users-list', path: '/users/list', label: 'List', meta: { parent: 'users' } }
 * ];
 *
 * const breadcrumbs = buildBreadcrumbs(flatSchema, '/users/list');
 * // Result: [
 * //   { id: 'home', path: '/', label: 'Home', current: false },
 * //   { id: 'users', path: '/users', label: 'Users', current: false },
 * //   { id: 'users-list', path: '/users/list', label: 'List', current: true }
 * // ]
 */
export function buildBreadcrumbs(
  flatItems: NavItem[],
  router: Router,
): Breadcrumbs {
  const { path: currentPath } = router.currentRoute.value;

  const currentItem = flatItems.find(
    (item) => item.path && matchesPathExactly(item.path, currentPath),
  );

  if (!currentItem) {
    return [];
  }

  const itemById = new Map(flatItems.map((item) => [item.id, item]));
  const itemByPath = new Map(
    flatItems.filter((item) => item.path).map((item) => [item.path, item]),
  );

  const breadcrumbs: Breadcrumbs = [];
  let item: NavItem | undefined = currentItem;

  while (item) {
    if (item.meta?.breadcrumb !== false) {
      breadcrumbs.unshift(mapToBreadcrumb(item, currentPath));
    }

    item = findParentItem(item, itemById, itemByPath);
  }

  return breadcrumbs;
}

function findParentItem(
  item: NavItem,
  itemById: Map<string, NavItem>,
  itemByPath: Map<string | undefined, NavItem>,
): NavItem | undefined {
  const parentId = item.meta?.parent;

  if (parentId) {
    return itemById.get(parentId);
  }

  if (!item.path) {
    return;
  }

  const lastSlashIndex = item.path.lastIndexOf('/');

  if (lastSlashIndex <= 0) {
    return;
  }

  const parentPath = item.path.slice(0, lastSlashIndex);
  const parent = itemByPath.get(parentPath);

  return parent?.id !== item.id ? parent : undefined;
}
