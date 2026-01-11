import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { Breadcrumbs, NavigationOptions, NavItem, GroupedSchema } from '../types';
import { filterRoutes } from '@/utils/filterRoutes/filterRoutes';
import { transformRoute } from '@/utils/transformRoute/transformRoute';
import { buildTree } from '@/utils/buildTree/buildTree';
import { sortItems } from '@/utils/sortRoutes/sortItems';
import { checkIsActive } from '@/utils/checkIsActive/checkIsActive';
import { updateIsActive } from '@/utils/updateIsActive/updateIsActive';
import { flattenNavItems } from '@/utils/flattenNavItems/flattenNavItems';
import { buildBreadcrumbs } from '@/utils/buildBreadcrumbs/buildBreadcrumbs';
import { buildGroupedSchema } from '@/utils/buildGroupedSchema/buildGroupedSchema';
import { NavigationError } from '@/errors';

export function useNavigation(options: NavigationOptions = {}) {
  const defaultOptions: NavigationOptions = {
    ...options,
  };

  const router = defaultOptions.router ?? useRouter();
  const route = defaultOptions.route ?? useRoute();
  const lastError = ref<NavigationError | null>(null);

  const handleError = (error: Error) => {
    if (error instanceof NavigationError) {
      lastError.value = error;
    }

    if (options.onError) {
      options.onError(error);
    } else if (process.env.NODE_ENV !== 'production') {
      console.error('[vue-nav-schema]', error);
    }
  };

  const schema = computed<NavItem[]>(() => {
    try {
      const routes = router.getRoutes();

      const filteredRoutes = filterRoutes(routes, {
        filter: options.filter,
      });

      const items = filteredRoutes.map((route) =>
        transformRoute(route, router, {
          validateRoute: options.validateSchema,
          onError: handleError,
        }),
      );

      const tree = buildTree(items, {
        usePathHierarchy: true,
        validateItems: options.validateSchema,
      });

      const sorted = sortItems(tree, {
        sort: options.sort,
      });

      updateIsActive(sorted, router);

      return sorted;
    } catch (error) {
      if (error instanceof Error) {
        handleError(error);
      }
      return [];
    }
  });

  const flatSchema = computed<NavItem[]>(() => {
    return flattenNavItems(schema.value);
  });

  const breadcrumbs = computed<Breadcrumbs>(() => {
    return buildBreadcrumbs(flatSchema.value, router);
  });

  const groupedSchema = computed<GroupedSchema>(() => {
    return buildGroupedSchema(schema.value, {
      groupBy: options.groupBy,
    });
  });

  const findItem = (id: string): NavItem | undefined => {
    return flatSchema.value.find((item) => item.id === id);
  };

  const findByPath = (path: string): NavItem | undefined => {
    return flatSchema.value.find((item) => item.path === path);
  };

  const isActive = (path: string) => {
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
    lastError,
  };
}
