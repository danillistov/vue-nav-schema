import { describe, it, expect } from 'vitest';
import { transformRoute } from './transformRoute';
import type { RouteRecordNormalized, Router, RouteParamsGeneric } from 'vue-router';

function createMockRouter(currentPath = '/', params = {}): Router {
  return {
    currentRoute: {
      value: {
        path: currentPath,
        params,
      },
    },
  } as Router;
}

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

    const router = createMockRouter('/');
    const result = transformRoute(route as RouteRecordNormalized, router);

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

    const router = createMockRouter('/');
    const result = transformRoute(route as RouteRecordNormalized, router);

    expect(result.label).toBe('users');
  });

  it('should use path as label if both name and title are missing', () => {
    const route: Partial<RouteRecordNormalized> = {
      path: '/about',
      meta: {},
    };

    const router = createMockRouter('/');
    const result = transformRoute(route as RouteRecordNormalized, router);

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

    const router = createMockRouter('/');
    const result = transformRoute(route as RouteRecordNormalized, router);

    expect(result.badge).toBe(5);
  });

  it('should mark route as active with exact path match', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'dashboard',
      path: '/dashboard',
      meta: {},
    };

    const router = createMockRouter('/dashboard');
    const result = transformRoute(route as RouteRecordNormalized, router);

    expect(result.isActive).toBe(true);
  });

  it('should mark parent route as active when on child path', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'users',
      path: '/users',
      meta: {},
    };

    const router = createMockRouter('/users/list');
    const result = transformRoute(route as RouteRecordNormalized, router);

    expect(result.isActive).toBe(true);
  });

  it('should not mark as active for unrelated paths', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'users',
      path: '/users',
      meta: {},
    };

    const router = createMockRouter('/dashboard');
    const result = transformRoute(route as RouteRecordNormalized, router);

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

    const router = createMockRouter('/dashboard/analytics');
    const result = transformRoute(route as RouteRecordNormalized, router);

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

    const router = createMockRouter('/admin/users/edit');
    const result = transformRoute(route as RouteRecordNormalized, router);

    expect(result.isActive).toBe(true);
  });

  it('should set isExpanded from options', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'users',
      path: '/users',
      meta: {},
    };

    const router = createMockRouter('/');
    const result = transformRoute(route as RouteRecordNormalized, router, {
      isExpanded: true,
    });

    expect(result.isExpanded).toBe(true);
  });

  it('should handle title as function with route params', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'user-detail',
      path: '/users/:id',
      meta: {
        title: (params: RouteParamsGeneric) => `User ${params.id}`,
      },
    };

    const router = createMockRouter('/users/123', { id: '123' });
    const result = transformRoute(route as RouteRecordNormalized, router);

    expect(result.label).toBe('User 123');
  });

  it('should handle title as function with multiple params', () => {
    const route: Partial<RouteRecordNormalized> = {
      name: 'post-comment',
      path: '/posts/:postId/comments/:commentId',
      meta: {
        title: (params: RouteParamsGeneric) => `Post ${params.postId} - Comment ${params.commentId}`,
      },
    };

    const router = createMockRouter('/posts/42/comments/99', {
      postId: '42',
      commentId: '99',
    });
    const result = transformRoute(route as RouteRecordNormalized, router);

    expect(result.label).toBe('Post 42 - Comment 99');
  });
});
