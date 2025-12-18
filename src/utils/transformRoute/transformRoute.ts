import type { Router, RouteRecordNormalized, RouteParams } from 'vue-router';
import type { NavItem } from '@/types';
import { checkRouteIsActive } from '@/utils/checkIsActive/checkIsActive';

export interface TransformRouteOptions {
  currentPath?: string;
  isExpanded?: boolean;
}

/**
 * Resolves the label for a route based on its meta.title property.
 *
 * @param route - The route to get the label from
 * @param params - Current route parameters for dynamic title functions
 * @returns The resolved label string
 */
function resolveRouteLabel(route: RouteRecordNormalized, params: RouteParams): string {
  const metaTitle = route.meta?.title;

  if (typeof metaTitle === 'function') {
    return metaTitle(params);
  }

  return (metaTitle as string) || (route.name as string) || route.path;
}

/**
 * Transforms a Vue Router route into a navigation item.
 *
 * @param route - The Vue Router route to transform
 * @param router - Vue Router instance to get the current path from
 * @param options - Optional configuration for the transformation
 * @returns A NavItem representing the route
 */
export function transformRoute(
  route: RouteRecordNormalized,
  router: Router,
  options: TransformRouteOptions = {},
): NavItem {
  const { isExpanded = false } = options;
  const { path: currentPath, params } = router.currentRoute.value;

  const isActive = currentPath ? checkRouteIsActive(route, currentPath) : false;
  const label = resolveRouteLabel(route, params);

  return {
    id: route.name as string,
    label,
    path: route.path,
    icon: route.meta?.icon as string | undefined,
    badge: route.meta?.badge as string | number | undefined,
    children: [],
    meta: route.meta || {},
    isActive,
    isExpanded,
  };
}
