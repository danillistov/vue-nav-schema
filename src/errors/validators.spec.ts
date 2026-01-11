import { describe, it, expect } from 'vitest';
import type { NavItem } from '@/types';
import type { RouteRecordNormalized } from 'vue-router';
import {
  validateNavItem,
  validateRoute,
  validateChildren,
  validateGroupByOption,
  safeExecute,
} from './validators';
import { ValidationError, InvalidRouteError, InvalidNavItemError } from './NavigationError';

describe('validateNavItem', () => {
  it('should pass validation for valid NavItem', () => {
    const item: NavItem = {
      id: 'test',
      label: 'Test Label',
      path: '/test',
    };

    expect(() => validateNavItem(item)).not.toThrow();
  });

  it('should throw ValidationError when id is missing', () => {
    const item = {
      label: 'Test Label',
    } as Partial<NavItem>;

    expect(() => validateNavItem(item)).toThrow(ValidationError);
    expect(() => validateNavItem(item)).toThrow('NavItem must have an id');
  });

  it('should throw ValidationError when id is empty string', () => {
    const item = {
      id: '  ',
      label: 'Test Label',
    } as Partial<NavItem>;

    expect(() => validateNavItem(item)).toThrow(ValidationError);
    expect(() => validateNavItem(item)).toThrow('id must be a non-empty string');
  });

  it('should throw ValidationError when label is missing', () => {
    const item = {
      id: 'test',
    } as Partial<NavItem>;

    expect(() => validateNavItem(item)).toThrow(ValidationError);
    expect(() => validateNavItem(item)).toThrow('NavItem must have a label');
  });

  it('should throw ValidationError when label is empty string', () => {
    const item = {
      id: 'test',
      label: '   ',
    } as Partial<NavItem>;

    expect(() => validateNavItem(item)).toThrow(ValidationError);
    expect(() => validateNavItem(item)).toThrow('label must be a non-empty string');
  });
});

describe('validateRoute', () => {
  it('should pass validation for route with name', () => {
    const route = {
      name: 'test',
      path: '/test',
    } as RouteRecordNormalized;

    expect(() => validateRoute(route)).not.toThrow();
  });

  it('should pass validation for route with path but no name', () => {
    const route = {
      path: '/test',
    } as RouteRecordNormalized;

    expect(() => validateRoute(route)).not.toThrow();
  });

  it('should throw InvalidRouteError when both name and path are missing', () => {
    const route = {} as RouteRecordNormalized;

    expect(() => validateRoute(route)).toThrow(InvalidRouteError);
    expect(() => validateRoute(route)).toThrow('Route must have either a name or path');
  });

  it('should throw InvalidRouteError when path is not a string', () => {
    const route = {
      name: 'test',
      path: 123 as any,
    } as RouteRecordNormalized;

    expect(() => validateRoute(route)).toThrow(InvalidRouteError);
    expect(() => validateRoute(route)).toThrow('Route path must be a string');
  });
});

describe('validateChildren', () => {
  it('should pass validation for valid children array', () => {
    const children: NavItem[] = [
      { id: 'child1', label: 'Child 1' },
      { id: 'child2', label: 'Child 2' },
    ];

    expect(() => validateChildren(children, 'parent')).not.toThrow();
  });

  it('should pass validation when children is undefined', () => {
    expect(() => validateChildren(undefined, 'parent')).not.toThrow();
  });

  it('should pass validation when children is null', () => {
    expect(() => validateChildren(null, 'parent')).not.toThrow();
  });

  it('should throw InvalidNavItemError when children is not an array', () => {
    const children = 'not an array' as any;

    expect(() => validateChildren(children, 'parent')).toThrow(InvalidNavItemError);
    expect(() => validateChildren(children, 'parent')).toThrow(
      'NavItem children must be an array',
    );
  });

  it('should throw ValidationError when child is invalid', () => {
    const children = [{ label: 'Missing ID' }] as any;

    expect(() => validateChildren(children, 'parent')).toThrow(ValidationError);
    expect(() => validateChildren(children, 'parent')).toThrow('Invalid child at index 0');
  });
});

describe('validateGroupByOption', () => {
  it('should pass validation for "group"', () => {
    expect(() => validateGroupByOption('group')).not.toThrow();
  });

  it('should pass validation for "parent"', () => {
    expect(() => validateGroupByOption('parent')).not.toThrow();
  });

  it('should pass validation for false', () => {
    expect(() => validateGroupByOption(false)).not.toThrow();
  });

  it('should pass validation for undefined', () => {
    expect(() => validateGroupByOption(undefined)).not.toThrow();
  });

  it('should throw ValidationError for invalid value', () => {
    expect(() => validateGroupByOption('invalid' as any)).toThrow(ValidationError);
    expect(() => validateGroupByOption('invalid' as any)).toThrow(
      'groupBy must be "group", "parent", false, or undefined',
    );
  });
});

describe('safeExecute', () => {
  it('should return the result of successful function execution', () => {
    const result = safeExecute(() => 'success', 'fallback');

    expect(result).toBe('success');
  });

  it('should return fallback value when function throws', () => {
    const result = safeExecute(
      () => {
        throw new Error('Test error');
      },
      'fallback',
    );

    expect(result).toBe('fallback');
  });

  it('should call onError callback when function throws', () => {
    let errorCaught: Error | null = null;

    safeExecute(
      () => {
        throw new Error('Test error');
      },
      'fallback',
      (error) => {
        errorCaught = error;
      },
    );

    expect(errorCaught).toBeInstanceOf(Error);
    expect((errorCaught as unknown as { message: string })?.message).toBe('Test error');
  });

  it('should not call onError when function succeeds', () => {
    let onErrorCalled = false;

    safeExecute(
      () => 'success',
      'fallback',
      () => {
        onErrorCalled = true;
      },
    );

    expect(onErrorCalled).toBe(false);
  });
});
