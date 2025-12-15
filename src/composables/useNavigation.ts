import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { NavigationOptions, NavItem } from '../types';
import { filterRoutes } from '@/utils/filterRoutes/filterRoutes';
import { transformRoute } from '@/utils/transformRoute/transformRoute';
import { buildTree } from '@/utils/buildTree/buildTree';
import { sortItems } from '@/utils/sortRoutes/sortItems';
import { checkIsActive } from '@/utils/checkIsActive/checkIsActive';
import { updateIsActive } from '@/utils/updateIsActive/updateIsActive';
import { flattenNavItems } from '@/utils/flattenNavItems/flattenNavItems';

export function useNavigation(options: NavigationOptions = {}) {
  const defaultOptions: NavigationOptions = {
    ...options,
  };

  const router = defaultOptions.router ?? useRouter();
  const route = defaultOptions.route ?? useRoute();

  const schema = computed<NavItem[]>(() => {
    const routes = router.getRoutes();
    const currentPath = route.path;

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

    updateIsActive(sorted, currentPath);

    return sorted;
  });

  const flatSchema = computed<NavItem[]>(() => {
    return flattenNavItems(schema.value);
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
    return checkIsActive(path, route.path);
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
