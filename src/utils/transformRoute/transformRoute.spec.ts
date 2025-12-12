import { describe, it, expect } from 'vitest';
import { transformRoute } from './transformRoute';
import type { RouteRecordNormalized } from 'vue-router';

describe('transformRoute', () => {
  it('should transform basic route to NavItem', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'dashboard',
      path: '/dashboard',
      meta: {
        title: 'Dashboard',
        icon: 'dashboard-icon',
        order: 1,
      },
    };

    const result = transformRoute(route as RouteRecordNormalized);

    expect(result).toEqual({
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard-icon',
      badge: undefined,
      children: [],
      meta: {
        title: 'Dashboard',
        icon: 'dashboard-icon',
        order: 1,
      },
      isActive: false,
      isExpanded: false,
    });
  });

  it('should use route name as label if title is missing', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'users',
      path: '/users',
      meta: {},
    };

    const result = transformRoute(route as RouteRecordNormalized);

    expect(result.label).toBe('users');
  });

  it('should use path as label if both name and title are missing', () => {
    const route: Partial<RouteRecordNormalized> = {
      path: '/about',
      meta: {},
    };

    const result = transformRoute(route as RouteRecordNormalized);

    expect(result.label).toBe('/about');
  });

  it('should include badge from meta', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'notifications',
      path: '/notifications',
      meta: {
        title: 'Notifications',
        badge: 5,
      },
    };

    const result = transformRoute(route as RouteRecordNormalized);

    expect(result.badge).toBe(5);
  });

  it('should mark route as active with exact path match', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'dashboard',
      path: '/dashboard',
      meta: {},
    };

    const result = transformRoute(route as RouteRecordNormalized, {
      currentPath: '/dashboard',
    });

    expect(result.isActive).toBe(true);
  });

  it('should mark parent route as active when on child path', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'users',
      path: '/users',
      meta: {},
    };

    const result = transformRoute(route as RouteRecordNormalized, {
      currentPath: '/users/list',
    });

    expect(result.isActive).toBe(true);
  });

  it('should not mark as active for unrelated paths', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'users',
      path: '/users',
      meta: {},
    };

    const result = transformRoute(route as RouteRecordNormalized, {
      currentPath: '/dashboard',
    });

    expect(result.isActive).toBe(false);
  });

  it('should support custom activeMatch string', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'reports',
      path: '/reports',
      meta: {
        activeMatch: 'analytics',
      },
    };

    const result = transformRoute(route as RouteRecordNormalized, {
      currentPath: '/dashboard/analytics',
    });

    expect(result.isActive).toBe(true);
  });

  it('should support custom activeMatch regex', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'admin',
      path: '/admin',
      meta: {
        activeMatch: /^\/admin\/.+/,
      },
    };

    const result = transformRoute(route as RouteRecordNormalized, {
      currentPath: '/admin/users/edit',
    });

    expect(result.isActive).toBe(true);
  });

  it('should set isExpanded from options', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'users',
      path: '/users',
      meta: {},
    };

    const result = transformRoute(route as RouteRecordNormalized, {
      isExpanded: true,
    });

    expect(result.isExpanded).toBe(true);
  });
});
