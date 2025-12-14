import type { RouteRecordNormalized } from 'vue-router';
import type { NavItem } from '@/types';
import { isString, isRegExp } from 'es-toolkit/predicate';

export interface TransformRouteOptions {
  currentPath?: string;
  isExpanded?: boolean;
}

export function transformRoute(
  route: RouteRecordNormalized,
  options: TransformRouteOptions = {},
): NavItem {
  const { currentPath, isExpanded = false } = options;

  const isActive = currentPath ? checkIsActive(route, currentPath) : false;

  return {
    id: route.name as string,
    label: (route.meta?.title as string) || (route.name as string) || route.path,
    path: route.path,
    icon: route.meta?.icon as string | undefined,
    badge: route.meta?.badge as string | number | undefined,
    children: [],
    meta: route.meta || {},
    isActive,
    isExpanded,
  };
}

function checkIsActive(route: RouteRecordNormalized, currentPath: string): boolean {
  // Exact match
  if (currentPath === route.path) {
    return true;
  }

  // Check if route has dynamic segments (contains :)
  if (route.path.includes(':')) {
    // Convert route pattern to regex
    // /about/:id -> /about/[^/]+
    const pattern = route.path
      .replace(/:[^/]+/g, '[^/]+')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${pattern}$`);

    if (regex.test(currentPath)) {
      return true;
    }
  }

  // Check if current path is a child of this route
  if (currentPath.startsWith(route.path + '/')) {
    return true;
  }

  // Check custom activeMatch from meta
  if (route.meta?.activeMatch) {
    const matcher = route.meta.activeMatch;

    if (isString(matcher)) {
      return currentPath.includes(matcher);
    }

    if (isRegExp(matcher)) {
      return matcher.test(currentPath);
    }
  }

  return false;
}
