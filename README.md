# vue-nav-schema

> Build reactive navigation schemas from Vue Router configuration

Transform your Vue Router setup into a type-safe, reactive navigation structure with minimal configuration.

## Features

- **Auto-generated** - Build navigation directly from routes without boilerplate
- **Fully Reactive** - Updates automatically with route changes
- **Permission-aware** - Built-in support for access control via custom filters
- **Customizable** - Flexible meta configuration for each route
- **TypeScript** - Full type safety out of the box
- **Lightweight** - Less than 5KB gzipped

## Installation

```bash
npm install vue-nav-schema
# or
pnpm add vue-nav-schema
# or
yarn add vue-nav-schema
```

## Quick Start

### 1. Configure your routes with navigation metadata

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue'),
    meta: {
      title: 'Home',
      icon: 'home',
      order: 1,
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('./views/Users.vue'),
    meta: {
      title: 'Users',
      icon: 'users',
      order: 2,
    },
  },
  {
    path: '/users/create',
    name: 'users-create',
    component: () => import('./views/UsersCreate.vue'),
    meta: {
      title: 'Create User',
      icon: 'user-plus',
      order: 1,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./views/Settings.vue'),
    meta: {
      title: 'Settings',
      icon: 'cog',
      order: 3,
      hidden: true, // Won't appear in navigation
    },
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
```

### 2. Use the composable in your component

```vue
<template>
  <nav>
    <ul>
      <li v-for="item in schema" :key="item.id">
        <router-link :to="item.path" :class="{ active: item.isActive }">
          <span class="icon">{{ item.icon }}</span>
          {{ item.label }}
        </router-link>

        <!-- Render children recursively -->
        <ul v-if="item.children?.length">
          <li v-for="child in item.children" :key="child.id">
            <router-link :to="child.path">{{ child.label }}</router-link>
          </li>
        </ul>
      </li>
    </ul>

    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.id">
        <span v-if="index > 0"> / </span>
        <router-link :to="crumb.path">{{ crumb.label }}</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useNavigation } from 'vue-nav-schema';

const { schema, breadcrumbs } = useNavigation();
</script>
```

## API Reference

### `useNavigation(options?)`

The main composable for building navigation schemas.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `router` | `Router` | auto-injected | Vue Router instance |
| `route` | `RouteLocationNormalizedLoaded` | auto-injected | Current route |
| `filter` | `(route: RouteRecordNormalized) => boolean` | `undefined` | Custom filter function |
| `sort` | `(a: NavItem, b: NavItem) => number` | `undefined` | Custom sort function |
| `maxDepth` | `number` | `undefined` | Maximum nesting depth |
| `flatMode` | `boolean` | `false` | Return only flat structure |
| `groupBy` | `'group' \| 'parent' \| false` | `false` | Grouping strategy |
| `onError` | `(error: Error) => void` | `console.error` | Error handler callback |
| `validateSchema` | `boolean` | `false` | Enable validation |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `schema` | `ComputedRef<NavItem[]>` | Hierarchical navigation tree |
| `flatSchema` | `ComputedRef<NavItem[]>` | Flattened list of all items |
| `breadcrumbs` | `ComputedRef<Breadcrumbs>` | Current breadcrumb trail |
| `groupedSchema` | `ComputedRef<GroupedSchema>` | Items grouped by specified key |
| `findItem` | `(id: string) => NavItem \| undefined` | Find item by ID |
| `findByPath` | `(path: string) => NavItem \| undefined` | Find item by path |
| `isActive` | `(path: string) => boolean` | Check if path is currently active |
| `lastError` | `Ref<NavigationError \| null>` | Last error that occurred |

### Navigation Meta

Configure navigation behavior through route meta properties.

```typescript
interface NavigationMeta {
  // Display
  title?: string | ((params: RouteParamsGeneric) => string);
  icon?: string;
  badge?: string | number;

  // Ordering & Hierarchy
  order?: number;
  group?: string;
  parent?: string;

  // Visibility
  hidden?: boolean;

  // External Links
  external?: boolean;
  target?: '_blank' | '_self';

  // Breadcrumbs
  breadcrumb?: boolean;

  // Active State
  activeMatch?: string | RegExp;
}
```

#### Meta Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string \| Function` | Navigation label. Can be a function for dynamic titles based on route params |
| `icon` | `string` | Icon identifier (use with your icon library) |
| `badge` | `string \| number` | Badge content to display |
| `order` | `number` | Sort order (lower values appear first) |
| `group` | `string` | Group key for `groupBy: 'group'` |
| `parent` | `string` | Explicit parent item ID for custom hierarchy |
| `hidden` | `boolean` | Hide from navigation schema |
| `external` | `boolean` | Mark as external link |
| `target` | `'_blank' \| '_self'` | Link target for external links |
| `breadcrumb` | `boolean` | Include in breadcrumb trail |
| `activeMatch` | `string \| RegExp` | Custom pattern for active state matching |

### NavItem

The structure of navigation items returned by the composable.

```typescript
interface NavItem {
  id: string;           // Route name or unique identifier
  label: string;        // Display label
  path?: string;        // Route path
  icon?: string;        // Icon reference
  badge?: string | number;
  children?: NavItem[]; // Nested items
  meta?: Record<string, any>;
  isActive?: boolean;   // Currently active
  isExpanded?: boolean; // Expansion state
}
```

### Breadcrumb

```typescript
type Breadcrumb = {
  id: string;
  path?: string;
  label: string;
  current: boolean;
};

type Breadcrumbs = Breadcrumb[];
```

## Examples

### Filtering Routes by Permission

```typescript
const { schema } = useNavigation({
  filter: (route) => {
    // Hide admin routes from non-admin users
    if (route.meta?.requiresAdmin && !userStore.isAdmin) {
      return false;
    }
    return !route.meta?.hidden;
  },
});
```

### Custom Sorting

```typescript
const { schema } = useNavigation({
  sort: (a, b) => {
    // Sort alphabetically by label
    return a.label.localeCompare(b.label);
  },
});
```

### Grouped Navigation

```typescript
// Routes
const routes = [
  { path: '/dashboard', meta: { title: 'Dashboard', group: 'main' } },
  { path: '/analytics', meta: { title: 'Analytics', group: 'main' } },
  { path: '/users', meta: { title: 'Users', group: 'admin' } },
  { path: '/settings', meta: { title: 'Settings', group: 'admin' } },
];

// Component
const { groupedSchema } = useNavigation({ groupBy: 'group' });

// Result:
// {
//   main: [{ id: 'dashboard', ... }, { id: 'analytics', ... }],
//   admin: [{ id: 'users', ... }, { id: 'settings', ... }]
// }
```

### Dynamic Titles

```typescript
const routes = [
  {
    path: '/users/:id',
    name: 'user-details',
    meta: {
      title: (params) => `User #${params.id}`,
      icon: 'user',
    },
  },
];
```

### Custom Active Matching

```typescript
const routes = [
  {
    path: '/products',
    name: 'products',
    meta: {
      title: 'Products',
      // Match this item as active for any /products/* path
      activeMatch: /^\/products/,
    },
  },
];
```

### Error Handling

```typescript
import { useNavigation, NavigationError, CircularDependencyError } from 'vue-nav-schema';

const { schema, lastError } = useNavigation({
  validateSchema: true,
  onError: (error) => {
    if (error instanceof CircularDependencyError) {
      console.error('Circular dependency detected:', error.context);
    }
    // Send to error tracking service
    errorTracker.capture(error);
  },
});

// Check for errors
watchEffect(() => {
  if (lastError.value) {
    console.warn('Navigation error:', lastError.value.message);
  }
});
```

## TypeScript

Full TypeScript support is included. Extend the `RouteMeta` interface to get type checking for your navigation meta:

```typescript
// router.d.ts
import 'vue-router';
import type { NavigationMeta } from 'vue-nav-schema';

declare module 'vue-router' {
  interface RouteMeta extends NavigationMeta {
    // Add your custom meta properties here
    requiresAuth?: boolean;
    roles?: string[];
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
