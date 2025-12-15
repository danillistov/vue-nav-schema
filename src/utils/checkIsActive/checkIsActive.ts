import type { RouteRecordNormalized } from 'vue-router';
import { isString, isRegExp } from 'es-toolkit/predicate';

/**
 * Check if a path pattern matches the current path.
 * Supports exact matches, dynamic segments (:id), and custom activeMatch patterns.
 *
 * @param pathPattern - The route path pattern (can include :param)
 * @param currentPath - The current path to check against
 * @param activeMatch - Optional custom activeMatch pattern from route meta
 * @returns True if the path is active
 */
export function checkIsActive(
  pathPattern: string,
  currentPath: string,
  activeMatch?: string | RegExp,
): boolean {
  // Exact match
  if (currentPath === pathPattern) {
    return true;
  }

  // Check if path has dynamic segments (contains :)
  if (pathPattern.includes(':')) {
    // Convert route pattern to regex
    // /about/:id -> /about/[^/]+
    const pattern = pathPattern
      .replace(/:[^/]+/g, '[^/]+')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${pattern}$`);

    if (regex.test(currentPath)) {
      return true;
    }
  }

  // Check if current path is a child of this route
  if (currentPath.startsWith(pathPattern + '/')) {
    return true;
  }

  // Check custom activeMatch from meta
  if (activeMatch) {
    if (isString(activeMatch)) {
      return currentPath.includes(activeMatch);
    }

    if (isRegExp(activeMatch)) {
      return activeMatch.test(currentPath);
    }
  }

  return false;
}

/**
 * Check if a route is active based on the current path.
 *
 * @param route - The route to check
 * @param currentPath - The current path
 * @returns True if the route is active
 */
export function checkRouteIsActive(
  route: RouteRecordNormalized,
  currentPath: string,
): boolean {
  return checkIsActive(
    route.path,
    currentPath,
    route.meta?.activeMatch as string | RegExp | undefined,
  );
}
