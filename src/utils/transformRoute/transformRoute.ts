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
  if (currentPath === route.path) {
    return true;
  }

  if (currentPath.startsWith(route.path + '/')) {
    return true;
  }

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
