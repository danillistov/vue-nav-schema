import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { NavigationOptions, NavItem } from '../types';
import { filterRoutes } from '@/utils/filterRoutes/filterRoutes';
import { transformRoute } from '@/utils/transformRoute/transformRoute';
import { buildTree } from '@/utils/buildTree/buildTree';
import { sortItems } from '@/utils/sortRoutes/sortItems';

export function useNavigation(options: NavigationOptions = {}) {
  const defaultOptions: NavigationOptions = {
    ...options,
  };

  const router = defaultOptions.router ?? useRouter();
  const route = defaultOptions.route ?? useRoute();

  const schema = computed<NavItem[]>(() => {
    const routes = router.getRoutes();
    const currentPath = route.path; // Track route.path for reactivity

    const filteredRoutes = filterRoutes(routes, {
      filter: options.filter,
    });

    const items = filteredRoutes.map((r) =>
      transformRoute(r, { currentPath }),
    );

    const tree = buildTree(items, {
      usePathHierarchy: true,
    });

    const sorted = sortItems(tree, {
      sort: options.sort,
    });

    // Update isActive for all items recursively when route changes
    const updateIsActive = (items: NavItem[]): void => {
      items.forEach((item) => {
        if (item.path) {
          const active = isActive(item.path);
          item.isActive = active;
        }

        if (item.children && item.children.length > 0) {
          updateIsActive(item.children);
        }
      });
    };

    updateIsActive(sorted);

    return sorted;
  });

  const flatSchema = computed<NavItem[]>(() => {
    const flatten = (items: NavItem[]): NavItem[] => {
      return items.reduce<NavItem[]>((acc, item) => {
        acc.push(item);

        if (item.children && item.children.length > 0) {
          acc.push(...flatten(item.children));
        }

        return acc;
      }, []);
    };

    return flatten(schema.value);
  });

  const breadcrumbs = computed<NavItem[]>(() => {
    // TODO: Implement breadcrumbs
    return [];
  });

  const groupedSchema = computed<Record<string, NavItem[]>>(() => {
    // TODO: Implement grouped schema
    return {};
  });

  const findItem = (id: string): NavItem | undefined => {
    return flatSchema.value.find((item) => item.id === id);
  };

  const findByPath = (path: string): NavItem | undefined => {
    return flatSchema.value.find((item) => item.path === path);
  };

  const isActive = (path: string): boolean => {
    const currentPath = route.path;

    // Exact match
    if (currentPath === path) {
      return true;
    }

    // Check if path has dynamic segments (contains :)
    if (path.includes(':')) {
      // Convert route pattern to regex
      // /about/:id -> /about/[^/]+
      const pattern = path
        .replace(/:[^/]+/g, '[^/]+')
        .replace(/\//g, '\\/');
      const regex = new RegExp(`^${pattern}$`);

      if (regex.test(currentPath)) {
        return true;
      }
    }

    // Check if current path is a child of this route
    if (currentPath.startsWith(path + '/')) {
      return true;
    }

    return false;
  };

  return {
    schema,
    flatSchema,
    findItem,
    findByPath,
    isActive,
    breadcrumbs,
    groupedSchema,
  };
}
