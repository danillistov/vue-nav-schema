import { describe, it, expect } from 'vitest';
import { buildTree } from './buildTree';
import type { NavItem } from '@/types';

describe('buildTree', () => {
  it('should build flat structure when no parent relationships', () => {
    const items: NavItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        children: [],
        meta: {},
        isActive: false,
        isExpanded: false,
      },
      {
        id: 'users',
        label: 'Users',
        path: '/users',
        children: [],
        meta: {},
        isActive: false,
        isExpanded: false,
      },
    ];

    const result = buildTree(items);

    expect(result).toHaveLength(2);
    expect(result[0].children).toEqual([]);
    expect(result[1].children).toEqual([]);
  });

  it('should build hierarchy using meta.parent', () => {
    const items: NavItem[] = [
      {
        id: 'users',
        label: 'Users',
        path: '/users',
        children: [],
        meta: {},
        isActive: false,
        isExpanded: false,
      },
      {
        id: 'users-list',
        label: 'User List',
        path: '/users/list',
        children: [],
        meta: { parent: 'users' },
        isActive: false,
        isExpanded: false,
      },
      {
        id: 'users-create',
        label: 'Create User',
        path: '/users/create',
        children: [],
        meta: { parent: 'users' },
        isActive: false,
        isExpanded: false,
      },
    ];

    const result = buildTree(items);

    console.log(result);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('users');
    expect(result[0].children).toHaveLength(2);
    expect(result[0].children?.[0].id).toBe('users-list');
    expect(result[0].children?.[1].id).toBe('users-create');
  });

  it('should build hierarchy automatically by path', () => {
    const items: NavItem[] = [
      {
        id: 'users',
        label: 'Users',
        path: '/users',
        children: [],
        meta: {},
        isActive: false,
        isExpanded: false,
      },
      {
        id: 'users-list',
        label: 'User List',
        path: '/users/list',
        children: [],
        meta: {},
        isActive: false,
        isExpanded: false,
      },
    ];

    const result = buildTree(items, { usePathHierarchy: true });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('users');
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children?.[0].id).toBe('users-list');
  });

  it('should handle deep nesting', () => {
    const items: NavItem[] = [
      {
        id: 'admin',
        label: 'Admin',
        path: '/admin',
        children: [],
        meta: {},
        isActive: false,
        isExpanded: false,
      },
      {
        id: 'admin-users',
        label: 'Users',
        path: '/admin/users',
        children: [],
        meta: { parent: 'admin' },
        isActive: false,
        isExpanded: false,
      },
      {
        id: 'admin-users-edit',
        label: 'Edit User',
        path: '/admin/users/edit',
        children: [],
        meta: { parent: 'admin-users' },
        isActive: false,
        isExpanded: false,
      },
    ];

    const result = buildTree(items);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('admin');
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children?.[0].id).toBe('admin-users');
    expect(result[0].children?.[0].children).toHaveLength(1);
    expect(result[0].children?.[0].children?.[0].id).toBe('admin-users-edit');
  });

  it('should prioritize meta.parent over path hierarchy', () => {
    const items: NavItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        children: [],
        meta: {},
        isActive: false,
        isExpanded: false,
      },
      {
        id: 'reports',
        label: 'Reports',
        path: '/admin/reports',
        children: [],
        meta: { parent: 'dashboard' }, // Explicit parent
        isActive: false,
        isExpanded: false,
      },
    ];

    const result = buildTree(items, { usePathHierarchy: true });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('dashboard');
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children?.[0].id).toBe('reports');
  });

  it('should handle items with missing parent gracefully', () => {
    const items: NavItem[] = [
      {
        id: 'orphan',
        label: 'Orphan',
        path: '/orphan',
        children: [],
        meta: { parent: 'non-existent' },
        isActive: false,
        isExpanded: false,
      },
    ];

    const result = buildTree(items);

    // Should still include orphan at root level
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('orphan');
  });
});
