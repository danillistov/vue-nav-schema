import type { NavItem } from '@/types';
import type { RouteRecordNormalized } from 'vue-router';
import { ValidationError, InvalidNavItemError, InvalidRouteError } from './NavigationError';

/**
 * Validates that a NavItem has all required fields
 */
export function validateNavItem(item: Partial<NavItem>): asserts item is NavItem {
  if (!item.id) {
    throw new ValidationError('NavItem must have an id', 'id', { item });
  }

  if (typeof item.id !== 'string' || item.id.trim() === '') {
    throw new ValidationError('NavItem id must be a non-empty string', 'id', {
      id: item.id,
    });
  }

  if (!item.label) {
    throw new ValidationError('NavItem must have a label', 'label', {
      id: item.id,
    });
  }

  if (typeof item.label !== 'string' || item.label.trim() === '') {
    throw new ValidationError('NavItem label must be a non-empty string', 'label', {
      id: item.id,
      label: item.label,
    });
  }
}

/**
 * Validates that a route has required properties
 */
export function validateRoute(route: RouteRecordNormalized): void {
  if (!route.name && !route.path) {
    throw new InvalidRouteError('Route must have either a name or path', {
      route: {
        name: route.name,
        path: route.path,
      },
    });
  }

  if (route.path && typeof route.path !== 'string') {
    throw new InvalidRouteError('Route path must be a string', {
      path: route.path,
      name: route.name,
    });
  }
}

/**
 * Validates NavItem children array
 */
export function validateChildren(children: unknown, parentId: string): void {
  if (children === undefined || children === null) {
    return;
  }

  if (!Array.isArray(children)) {
    throw new InvalidNavItemError('NavItem children must be an array', {
      parentId,
      children,
    });
  }

  children.forEach((child, index) => {
    try {
      validateNavItem(child);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ValidationError(
          `Invalid child at index ${index}: ${error.message}`,
          error.field,
          {
            parentId,
            childIndex: index,
            originalError: error.toJSON(),
          },
        );
      }
      throw error;
    }
  });
}

/**
 * Validates that groupBy option is valid
 */
export function validateGroupByOption(
  groupBy: unknown,
): asserts groupBy is 'group' | 'parent' | false | undefined {
  if (
    groupBy !== undefined &&
    groupBy !== 'group' &&
    groupBy !== 'parent' &&
    groupBy !== false
  ) {
    throw new ValidationError(
      'groupBy must be "group", "parent", false, or undefined',
      'groupBy',
      { groupBy },
    );
  }
}

/**
 * Safe wrapper for functions that might throw
 */
export function safeExecute<T>(
  fn: () => T,
  fallback: T,
  onError?: (error: Error) => void,
): T {
  try {
    return fn();
  } catch (error) {
    if (onError && error instanceof Error) {
      onError(error);
    }
    return fallback;
  }
}
