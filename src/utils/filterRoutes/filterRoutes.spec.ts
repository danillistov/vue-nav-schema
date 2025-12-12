import { describe, it, expect } from 'vitest';
import { filterRoutes } from './filterRoutes';
import type { RouteRecordNormalized } from 'vue-router';

describe('filterRoutes', () => {
  const mockRoutes: Partial<RouteRecordNormalized>[] = [
    {
      name: 'dashboard',
      path: '/dashboard',
      meta: { title: 'Dashboard' },
    },
    {
      name: 'users',
      path: '/users',
      meta: { title: 'Users', hidden: true },
    },
    {
      name: 'settings',
      path: '/settings',
      meta: { title: 'Settings' },
    },
    {
      name: 'admin',
      path: '/admin',
      meta: { title: 'Admin' },
    },
    {
      name: 'reports',
      path: '/reports',
      meta: { title: 'Reports' },
    },
  ];

  it('should filter out hidden routes', () => {
    const result = filterRoutes(mockRoutes as RouteRecordNormalized[]);

    expect(result).toHaveLength(4);
    expect(result.find((r) => r.name === 'users')).toBeUndefined();
  });

  it('should apply custom filter function', () => {
    const result = filterRoutes(mockRoutes as RouteRecordNormalized[], {
      filter: (route) => route.path.startsWith('/admin'),
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('admin');
  });

  it('should return all routes when no filters provided', () => {
    const routesWithoutHidden = mockRoutes.filter((r) => !r.meta?.hidden);

    const result = filterRoutes(mockRoutes as RouteRecordNormalized[], {});

    expect(result).toHaveLength(routesWithoutHidden.length);
  });
});

