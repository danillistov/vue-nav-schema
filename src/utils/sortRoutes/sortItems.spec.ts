import { describe, it, expect } from 'vitest';
import { sortItems } from './sortItems';
import type { NavItem } from '@/types';

describe('sortItems', () => {
  const mockItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      children: [],
      meta: { order: 3 },
      isActive: false,
      isExpanded: false,
    },
    {
      id: 'users',
      label: 'Users',
      path: '/users',
      children: [],
      meta: { order: 1 },
      isActive: false,
      isExpanded: false,
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      children: [],
      meta: { order: 2 },
      isActive: false,
      isExpanded: false,
    },
    {
      id: 'reports',
      label: 'Reports',
      path: '/reports',
      children: [],
      meta: {},
      isActive: false,
      isExpanded: false,
    },
  ];

  it('should sort items by order meta field', () => {
    const result = sortItems([...mockItems]);

    expect(result[0].id).toBe('users');
    expect(result[1].id).toBe('settings');
    expect(result[2].id).toBe('dashboard');
    expect(result[3].id).toBe('reports');
  });

  it('should put items without order at the end', () => {
    const result = sortItems([...mockItems]);

    expect(result[result.length - 1].id).toBe('reports');
  });

  it('should use custom sort function when provided', () => {
    const result = sortItems([...mockItems], {
      sort: (a, b) => a.label.localeCompare(b.label),
    });

    expect(result[0].id).toBe('dashboard');
    expect(result[1].id).toBe('reports');
    expect(result[2].id).toBe('settings');
    expect(result[3].id).toBe('users');
  });

  it('should handle empty array', () => {
    const result = sortItems([]);

    expect(result).toEqual([]);
  });

  it('should not mutate original array', () => {
    const original = [...mockItems];
    const originalCopy = [...mockItems];

    sortItems(original);

    expect(original).toEqual(originalCopy);
  });

  it('should recursively sort children', () => {
    const itemsWithChildren: NavItem[] = [
      {
        id: 'parent',
        label: 'Parent',
        path: '/parent',
        meta: { order: 1 },
        children: [
          {
            id: 'child2',
            label: 'Child 2',
            path: '/parent/child2',
            children: [],
            meta: { order: 2 },
            isActive: false,
            isExpanded: false,
          },
          {
            id: 'child1',
            label: 'Child 1',
            path: '/parent/child1',
            children: [],
            meta: { order: 1 },
            isActive: false,
            isExpanded: false,
          },
        ],
        isActive: false,
        isExpanded: false,
      },
    ];

    const result = sortItems(itemsWithChildren);

    expect(result[0].children?.[0].id).toBe('child1');
    expect(result[0].children?.[1].id).toBe('child2');
  });
});
