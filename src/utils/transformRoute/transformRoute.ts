import type { Router, RouteRecordNormalized, RouteParams } from 'vue-router';
import type { NavItem } from '@/types';
import { checkRouteIsActive } from '@/utils/checkIsActive/checkIsActive';
import { validateRoute, InvalidRouteError, safeExecute } from '@/errors';

export interface TransformRouteOptions {
  currentPath?: string;
  isExpanded?: boolean;
  validateRoute?: boolean;
  onError?: (error: Error) => void;
}

/**
 * Resolves the label for a route based on its meta.title property.
 *
 * @param route - The route to get the label from
 * @param params - Current route parameters for dynamic title functions
 * @param onError - Error handler for title function errors
 * @returns The resolved label string
 */
function resolveRouteLabel(
  route: RouteRecordNormalized,
  params: RouteParams,
  onError?: (error: Error) => void,
): string {
  const metaTitle = route.meta?.title;

  const name = route.name ? String(route.name) : route.path;
  console.log(name);

  if (typeof metaTitle === 'function') {
    return safeExecute(
      () => metaTitle(params),
      name,
      (error) => {
        if (onError) {
          onError(
            new InvalidRouteError(
              `Error executing title function for route "${name}": ${error.message}`,
              {
                routeName: route.name,
                routePath: route.path,
                originalError: error.message,
              },
            ),
          );
        }
      },
    );
  }

  return (metaTitle as string) || name;
}

/**
 * Transforms a Vue Router route into a navigation item.
 *
 * @param route - The Vue Router route to transform
 * @param router - Vue Router instance to get the current path from
 * @param options - Optional configuration for the transformation
 * @returns A NavItem representing the route
 * @throws {InvalidRouteError} If route validation fails
 */
export function transformRoute(
  route: RouteRecordNormalized,
  router: Router,
  options: TransformRouteOptions = {},
): NavItem {
  const {
    isExpanded = false,
    validateRoute: shouldValidate = process.env.NODE_ENV !== 'production',
    onError,
  } = options;

  if (shouldValidate) {
    validateRoute(route);
  }

  const { path: currentPath, params } = router.currentRoute.value;

  const isActive = currentPath ? checkRouteIsActive(route, currentPath) : false;
  const label = resolveRouteLabel(route, params, onError);

  return {
    id: String(route.name),
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
