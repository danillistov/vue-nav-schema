import type { RouteRecordNormalized } from 'vue-router';
import type { NavItem } from '@/types';
import { checkRouteIsActive } from '@/utils/checkIsActive/checkIsActive';

export interface TransformRouteOptions {
  currentPath?: string;
  isExpanded?: boolean;
}

export function transformRoute(
  route: RouteRecordNormalized,
  options: TransformRouteOptions = {},
): NavItem {
  const { currentPath, isExpanded = false } = options;

  const isActive = currentPath ? checkRouteIsActive(route, currentPath) : false;

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
