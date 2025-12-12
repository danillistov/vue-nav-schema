import type { RouteRecordNormalized } from 'vue-router';

export interface FilterRoutesOptions {
  filter?: (route: RouteRecordNormalized) => boolean;
  checkRole?: (roles: string[]) => boolean;
  checkPermission?: (permissions: string[]) => boolean;
}

const isVisible = (route: RouteRecordNormalized) =>
  route.meta?.hidden !== true;

const passesFilter = (
  route: RouteRecordNormalized,
  filter?: (route: RouteRecordNormalized) => boolean,
) => !filter || filter(route);

const createRoutePredicate = (options: FilterRoutesOptions) => (route: RouteRecordNormalized) => {
  const { filter } = options;

  return [
    isVisible(route),
    passesFilter(route, filter),
  ].every(Boolean);
};

/**
 * Filters an array of Vue Router routes based on visibility, custom filters, roles, and permissions.
 *
 * This function applies multiple filtering criteria to routes:
 * - Excludes routes marked as hidden in metadata
 * - Applies custom filter function if provided
 * - Validates user roles against route requirements
 * - Validates user permissions against route requirements
 *
 * @param routes - Array of normalized Vue Router route records to filter
 * @param options - Filtering options object
 * @param options.filter - Optional custom filter function. Return `true` to include the route.
 *
 * @returns Filtered array of routes that pass all specified criteria
 *
 * @example
 * ```ts
 * const routes = [
 *   { path: '/admin', meta: { roles: ['admin'] } },
 *   { path: '/user', meta: { hidden: true } },
 *   { path: '/public', meta: {} }
 * ];
 *
 * const visibleRoutes = filterRoutes(routes, {
 *   checkRole: (roles) => roles.includes('admin'),
 *   filter: (route) => route.path.startsWith('/admin')
 * });
 * // Returns: [{ path: '/admin', meta: { roles: ['admin'] } }]
 * ```
 */
export function filterRoutes(
  routes: RouteRecordNormalized[],
  options: FilterRoutesOptions = {},
): RouteRecordNormalized[] {
  return routes.filter(createRoutePredicate(options));
}
