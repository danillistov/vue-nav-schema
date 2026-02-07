import type { RouteRecordNormalized } from 'vue-router';
import { isString, isRegExp } from 'es-toolkit/predicate';
import { matchesDynamicPattern } from '@/helpers/pathPatternHelpers';

/**
 * Checks if the current path matches the activeMatch pattern from route meta.
 */
function matchesActiveMatch(activeMatch: string | RegExp, currentPath: string): boolean {
  if (isString(activeMatch)) {
    return currentPath.includes(activeMatch);
  }

  if (isRegExp(activeMatch)) {
    return activeMatch.test(currentPath);
  }

  return false;
}

/**
 * Checks if the current path is a child of the given path pattern.
 */
function isChildPath(pathPattern: string, currentPath: string): boolean {
  return currentPath.startsWith(pathPattern + '/');
}

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
) {
  if (currentPath === pathPattern) {
    return true;
  }

  if (activeMatch && matchesActiveMatch(activeMatch, currentPath)) {
    return true;
  }

  if (pathPattern.includes(':')) {
    return matchesDynamicPattern(pathPattern, currentPath);
  }

  return isChildPath(pathPattern, currentPath);
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
) {
  return checkIsActive(
    route.path,
    currentPath,
    route.meta?.activeMatch as string | RegExp | undefined,
  );
}
