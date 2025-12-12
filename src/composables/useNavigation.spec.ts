import { describe, it, expect, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useNavigation } from './useNavigation';
import type { Router, RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router';

const mockRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: {},
    meta: {
      title: 'Dashboard',
      icon: 'dashboard-icon',
      order: 1,
    },
  },
  {
    path: '/users',
    name: 'users',
    component: {},
    meta: {
      title: 'Users',
      icon: 'users-icon',
      order: 2,
    },
  },
  {
    path: '/users/list',
    name: 'users-list',
    component: {},
    meta: {
      title: 'User List',
      parent: 'users',
      order: 1,
    },
  },
  {
    path: '/users/create',
    name: 'users-create',
    component: {},
    meta: {
      title: 'Create User',
      parent: 'users',
      order: 2,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: {},
    meta: {
      title: 'Settings',
      hidden: true,
    },
  },
];

function createMockRouter(routes: RouteRecordRaw[]): Router {
  return {
    getRoutes: () => routes as any,
  } as Router;
}

function createMockRoute(path: string): RouteLocationNormalizedLoaded {
  return {
    path,
    name: '',
    params: {},
    query: {},
    hash: '',
    fullPath: path,
    matched: [],
    meta: {},
    redirectedFrom: undefined,
  } as RouteLocationNormalizedLoaded;
}

describe('useNavigation', () => {
  let mockRouter: Router;
  let mockRoute: RouteLocationNormalizedLoaded;

  beforeEach(() => {
    mockRouter = createMockRouter(mockRoutes);
    mockRoute = createMockRoute('/dashboard');
  });

  it('should return navigation schema', () => {
    const { schema } = useNavigation({
      router: mockRouter,
      route: mockRoute,
    });

    expect(schema.value).toBeDefined();
    expect(Array.isArray(schema.value)).toBe(true);
  });

  it('should filter out hidden routes', () => {
    const { schema } = useNavigation({
      router: mockRouter,
      route: mockRoute,
    });

    const settingsItem = schema.value.find((item) => item.id === 'settings');
    expect(settingsItem).toBeUndefined();
  });

  it('should build hierarchical structure', () => {
    const { schema } = useNavigation({
      router: mockRouter,
      route: mockRoute,
    });

    const usersItem = schema.value.find((item) => item.id === 'users');
    expect(usersItem).toBeDefined();
    expect(usersItem?.children).toHaveLength(2);
    expect(usersItem?.children?.[0].id).toBe('users-list');
    expect(usersItem?.children?.[1].id).toBe('users-create');
  });

  it('should sort items by order', () => {
    const { schema } = useNavigation({
      router: mockRouter,
      route: mockRoute,
    });

    expect(schema.value[0].id).toBe('dashboard');
    expect(schema.value[1].id).toBe('users');
  });

  it('should mark active route', () => {
    const { schema } = useNavigation({
      router: mockRouter,
      route: createMockRoute('/dashboard'),
    });

    const dashboardItem = schema.value.find((item) => item.id === 'dashboard');
    expect(dashboardItem?.isActive).toBe(true);
  });

  it('should mark parent as active when on child route', () => {
    const { schema } = useNavigation({
      router: mockRouter,
      route: createMockRoute('/users/list'),
    });

    const usersItem = schema.value.find((item) => item.id === 'users');
    expect(usersItem?.isActive).toBe(true);
  });

  it('should apply custom filter', () => {
    const { schema } = useNavigation({
      router: mockRouter,
      route: mockRoute,
      filter: (route) => route.path.startsWith('/users'),
    });

    expect(schema.value).toHaveLength(1);
    expect(schema.value[0].id).toBe('users');
  });

  it('should apply custom sort', () => {
    const { schema } = useNavigation({
      router: mockRouter,
      route: mockRoute,
      sort: (a, b) => b.label.localeCompare(a.label),
    });

    expect(schema.value[0].id).toBe('users');
    expect(schema.value[1].id).toBe('dashboard');
  });

  it('should return flat schema', () => {
    const { flatSchema } = useNavigation({
      router: mockRouter,
      route: mockRoute,
    });

    expect(flatSchema.value).toHaveLength(4);
  });

  it('should find item by id', () => {
    const { findItem } = useNavigation({
      router: mockRouter,
      route: mockRoute,
    });

    const item = findItem('users');
    expect(item).toBeDefined();
    expect(item?.label).toBe('Users');
  });

  it('should find item by path', () => {
    const { findByPath } = useNavigation({
      router: mockRouter,
      route: mockRoute,
    });

    const item = findByPath('/users');
    expect(item).toBeDefined();
    expect(item?.id).toBe('users');
  });

  it('should check if path is active', () => {
    const { isActive } = useNavigation({
      router: mockRouter,
      route: createMockRoute('/dashboard'),
    });

    expect(isActive('/dashboard')).toBe(true);
    expect(isActive('/users')).toBe(false);
  });

  it('should reactively update when route changes', () => {
    const route = ref(createMockRoute('/dashboard'));

    const { schema } = useNavigation({
      router: mockRouter,
      route: route.value,
    });

    const initialActive = schema.value.find((item) => item.isActive);
    expect(initialActive?.id).toBe('dashboard');

    route.value = createMockRoute('/users');
  });
});
