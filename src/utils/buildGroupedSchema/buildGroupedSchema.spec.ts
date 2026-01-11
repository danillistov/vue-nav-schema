import { describe, it, expect } from 'vitest';
import { buildGroupedSchema } from './buildGroupedSchema';
import type { NavItem } from '@/types';

describe('buildGroupedSchema', () => {
  it('should group items by meta.group field', () => {
    const items: NavItem[] = [
      {
        id: 'home',
        label: 'Home',
        path: '/home',
        meta: { group: 'Main' },
      },
      {
        id: 'about',
        label: 'About',
        path: '/about',
        meta: { group: 'Main' },
      },
      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        meta: { group: 'System' },
      },
    ];

    const result = buildGroupedSchema(items, { groupBy: 'group' });

    expect(result).toHaveProperty('Main');
    expect(result).toHaveProperty('System');
    expect(result.Main).toHaveLength(2);
    expect(result.System).toHaveLength(1);
    expect(result.Main[0].id).toBe('home');
    expect(result.Main[1].id).toBe('about');
    expect(result.System[0].id).toBe('settings');
  });

  it('should group items by meta.parent field', () => {
    const items: NavItem[] = [
      {
        id: 'home',
        label: 'Home',
        path: '/home',
        meta: { parent: 'dashboard' },
      },
      {
        id: 'about',
        label: 'About',
        path: '/about',
        meta: { parent: 'dashboard' },
      },
      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        meta: { parent: 'admin' },
      },
    ];

    const result = buildGroupedSchema(items, { groupBy: 'parent' });

    expect(result).toHaveProperty('dashboard');
    expect(result).toHaveProperty('admin');
    expect(result.dashboard).toHaveLength(2);
    expect(result.admin).toHaveLength(1);
  });

  it('should use ungroupedKey for items without group', () => {
    const items: NavItem[] = [
      {
        id: 'home',
        label: 'Home',
        path: '/home',
        meta: { group: 'Main' },
      },
      {
        id: 'about',
        label: 'About',
        path: '/about',
        meta: {},
      },
    ];

    const result = buildGroupedSchema(items, {
      groupBy: 'group',
      ungroupedKey: 'Uncategorized',
    });

    expect(result).toHaveProperty('Main');
    expect(result).toHaveProperty('Uncategorized');
    expect(result.Uncategorized).toHaveLength(1);
    expect(result.Uncategorized[0].id).toBe('about');
  });

  it('should use "Other" as default ungroupedKey', () => {
    const items: NavItem[] = [
      {
        id: 'about',
        label: 'About',
        path: '/about',
        meta: {},
      },
    ];

    const result = buildGroupedSchema(items, { groupBy: 'group' });

    expect(result).toHaveProperty('Other');
    expect(result.Other).toHaveLength(1);
  });

  it('should recursively process children', () => {
    const items: NavItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        meta: { group: 'Main' },
        children: [
          {
            id: 'analytics',
            label: 'Analytics',
            path: '/dashboard/analytics',
            meta: { group: 'Reports' },
          },
        ],
      },
    ];

    const result = buildGroupedSchema(items, { groupBy: 'group' });

    expect(result).toHaveProperty('Main');
    expect(result).toHaveProperty('Reports');
    expect(result.Main).toHaveLength(1);
    expect(result.Reports).toHaveLength(1);
    expect(result.Reports[0].id).toBe('analytics');
  });

  it('should handle deeply nested children', () => {
    const items: NavItem[] = [
      {
        id: 'root',
        label: 'Root',
        path: '/root',
        meta: { group: 'A' },
        children: [
          {
            id: 'level1',
            label: 'Level 1',
            path: '/root/level1',
            meta: { group: 'B' },
            children: [
              {
                id: 'level2',
                label: 'Level 2',
                path: '/root/level1/level2',
                meta: { group: 'C' },
              },
            ],
          },
        ],
      },
    ];

    const result = buildGroupedSchema(items, { groupBy: 'group' });

    expect(result).toHaveProperty('A');
    expect(result).toHaveProperty('B');
    expect(result).toHaveProperty('C');
    expect(result.A[0].id).toBe('root');
    expect(result.B[0].id).toBe('level1');
    expect(result.C[0].id).toBe('level2');
  });

  it('should return empty object when groupBy is false', () => {
    const items: NavItem[] = [
      {
        id: 'home',
        label: 'Home',
        path: '/home',
        meta: { group: 'Main' },
      },
    ];

    const result = buildGroupedSchema(items, { groupBy: false });

    expect(result).toEqual({});
  });

  it('should handle empty items array', () => {
    const result = buildGroupedSchema([], { groupBy: 'group' });

    expect(result).toEqual({});
  });

  it('should handle items with no meta', () => {
    const items: NavItem[] = [
      {
        id: 'home',
        label: 'Home',
        path: '/home',
      },
    ];

    const result = buildGroupedSchema(items, { groupBy: 'group' });

    expect(result).toHaveProperty('Other');
    expect(result.Other).toHaveLength(1);
  });

  it('should group multiple items with same group together', () => {
    const items: NavItem[] = [
      {
        id: 'item1',
        label: 'Item 1',
        path: '/item1',
        meta: { group: 'Group1' },
      },
      {
        id: 'item2',
        label: 'Item 2',
        path: '/item2',
        meta: { group: 'Group2' },
      },
      {
        id: 'item3',
        label: 'Item 3',
        path: '/item3',
        meta: { group: 'Group1' },
      },
      {
        id: 'item4',
        label: 'Item 4',
        path: '/item4',
        meta: { group: 'Group1' },
      },
    ];

    const result = buildGroupedSchema(items, { groupBy: 'group' });

    expect(result.Group1).toHaveLength(3);
    expect(result.Group2).toHaveLength(1);
    expect(result.Group1.map((item) => item.id)).toEqual([
      'item1',
      'item3',
      'item4',
    ]);
  });
});
