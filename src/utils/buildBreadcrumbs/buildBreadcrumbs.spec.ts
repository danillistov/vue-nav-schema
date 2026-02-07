import { describe, it, expect } from 'vitest';
import { buildBreadcrumbs } from './buildBreadcrumbs';
import type { NavItem } from '@/types';
import type { Router } from 'vue-router';

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

describe('buildBreadcrumbs', () => {
  it('should return empty array when no items match current path', () => {
    const items: NavItem[] = [
      {
        id: 'home',
        label: 'Home',
        path: '/',
        children: [],
        meta: {},
        isActive: false,
        isExpanded: false,
      },
    ];

    const router = createMockRouter('/non-existent');
    const result = buildBreadcrumbs(items, router);

    expect(result).toEqual([]);
  });

  it('should build breadcrumbs for simple path', () => {
    const items: NavItem[] = [
      {
        id: 'home',
        label: 'Home',
        path: '/',
        children: [],
        meta: {},
        isActive: true,
        isExpanded: false,
      },
    ];

    const router = createMockRouter('/'); const result = buildBreadcrumbs(items, router);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'home',
      label: 'Home',
      path: '/',
      current: true,
    });
  });

  it('should build breadcrumbs using meta.parent', () => {
    const items: NavItem[] = [
      {
        id: 'home',
        label: 'Home',
        path: '/',
        children: [],
        meta: {},
        isActive: true,
        isExpanded: false,
      },
      {
        id: 'users',
        label: 'Users',
        path: '/users',
        children: [],
        meta: { parent: 'home' },
        isActive: true,
        isExpanded: false,
      },
      {
        id: 'users-list',
        label: 'User List',
        path: '/users/list',
        children: [],
        meta: { parent: 'users' },
        isActive: true,
        isExpanded: false,
      },
    ];

    const router = createMockRouter('/users/list'); const result = buildBreadcrumbs(items, router);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      id: 'home',
      label: 'Home',
      path: '/',
      current: false,
    });
    expect(result[1]).toEqual({
      id: 'users',
      label: 'Users',
      path: '/users',
      current: false,
    });
    expect(result[2]).toEqual({
      id: 'users-list',
      label: 'User List',
      path: '/users/list',
      current: true,
    });
  });

  it('should build breadcrumbs using path hierarchy', () => {
    const items: NavItem[] = [
      {
        id: 'users',
        label: 'Users',
        path: '/users',
        children: [],
        meta: {},
        isActive: true,
        isExpanded: false,
      },
      {
        id: 'users-list',
        label: 'User List',
        path: '/users/list',
        children: [],
        meta: {},
        isActive: true,
        isExpanded: false,
      },
    ];

    const router = createMockRouter('/users/list'); const result = buildBreadcrumbs(items, router);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 'users',
      label: 'Users',
      path: '/users',
      current: false,
    });
    expect(result[1]).toEqual({
      id: 'users-list',
      label: 'User List',
      path: '/users/list',
      current: true,
    });
  });

  it('should handle dynamic path parameters', () => {
    const items: NavItem[] = [
      {
        id: 'users',
        label: 'Users',
        path: '/users',
        children: [],
        meta: {},
        isActive: true,
        isExpanded: false,
      },
      {
        id: 'user-detail',
        label: 'User Detail',
        path: '/users/:id',
        children: [],
        meta: { parent: 'users' },
        isActive: true,
        isExpanded: false,
      },
    ];

    const router = createMockRouter('/users/123'); const result = buildBreadcrumbs(items, router);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 'users',
      label: 'Users',
      path: '/users',
      current: false,
    });
    expect(result[1]).toEqual({
      id: 'user-detail',
      label: 'User Detail',
      path: '/users/:id',
      current: true,
    });
  });

  it('should exclude items with meta.breadcrumb = false', () => {
    const items: NavItem[] = [
      {
        id: 'home',
        label: 'Home',
        path: '/',
        children: [],
        meta: {},
        isActive: true,
        isExpanded: false,
      },
      {
        id: 'admin',
        label: 'Admin',
        path: '/admin',
        children: [],
        meta: { parent: 'home', breadcrumb: false },
        isActive: true,
        isExpanded: false,
      },
      {
        id: 'admin-users',
        label: 'Users',
        path: '/admin/users',
        children: [],
        meta: { parent: 'admin' },
        isActive: true,
        isExpanded: false,
      },
    ];

    const router = createMockRouter('/admin/users'); const result = buildBreadcrumbs(items, router);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('home');
    expect(result[1].id).toBe('admin-users');
  });

  it('should handle deep nesting', () => {
    const items: NavItem[] = [
      {
        id: 'level1',
        label: 'Level 1',
        path: '/level1',
        children: [],
        meta: {},
        isActive: true,
        isExpanded: false,
      },
      {
        id: 'level2',
        label: 'Level 2',
        path: '/level1/level2',
        children: [],
        meta: { parent: 'level1' },
        isActive: true,
        isExpanded: false,
      },
      {
        id: 'level3',
        label: 'Level 3',
        path: '/level1/level2/level3',
        children: [],
        meta: { parent: 'level2' },
        isActive: true,
        isExpanded: false,
      },
      {
        id: 'level4',
        label: 'Level 4',
        path: '/level1/level2/level3/level4',
        children: [],
        meta: { parent: 'level3' },
        isActive: true,
        isExpanded: false,
      },
    ];

    const router = createMockRouter('/level1/level2/level3/level4'); const result = buildBreadcrumbs(items, router);

    expect(result).toHaveLength(4);
    expect(result[0].id).toBe('level1');
    expect(result[1].id).toBe('level2');
    expect(result[2].id).toBe('level3');
    expect(result[3].id).toBe('level4');
    expect(result[3].current).toBe(true);
  });

  it('should return only breadcrumb fields (id, path, label, current)', () => {
    const items: NavItem[] = [
      {
        id: 'users',
        label: 'Users',
        path: '/users',
        icon: 'user-icon',
        badge: 5,
        children: [],
        meta: { someData: 'value' },
        isActive: true,
        isExpanded: true,
      },
    ];

    const router = createMockRouter('/users'); const result = buildBreadcrumbs(items, router);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'users',
      label: 'Users',
      path: '/users',
      current: true,
    });
    expect(result[0]).not.toHaveProperty('icon');
    expect(result[0]).not.toHaveProperty('badge');
    expect(result[0]).not.toHaveProperty('children');
    expect(result[0]).not.toHaveProperty('meta');
    expect(result[0]).not.toHaveProperty('isActive');
    expect(result[0]).not.toHaveProperty('isExpanded');
  });

  it('should handle multiple dynamic segments', () => {
    const items: NavItem[] = [
      {
        id: 'users',
        label: 'Users',
        path: '/users',
        children: [],
        meta: {},
        isActive: true,
        isExpanded: false,
      },
      {
        id: 'user-posts',
        label: 'User Posts',
        path: '/users/:userId/posts/:postId',
        children: [],
        meta: { parent: 'users' },
        isActive: true,
        isExpanded: false,
      },
    ];

    const router = createMockRouter('/users/123/posts/456'); const result = buildBreadcrumbs(items, router);

    expect(result).toHaveLength(2);
    expect(result[1]).toEqual({
      id: 'user-posts',
      label: 'User Posts',
      path: '/users/:userId/posts/:postId',
      current: true,
    });
  });
});
