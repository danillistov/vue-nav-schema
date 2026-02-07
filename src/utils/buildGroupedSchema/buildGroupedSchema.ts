import type { NavItem, GroupedSchema } from '@/types';

export interface BuildGroupedSchemaOptions {
  groupBy?: 'group' | 'parent' | false;
  ungroupedKey?: string;
}

type GroupingStrategy = (item: NavItem) => string | undefined;
type GroupByType = Exclude<BuildGroupedSchemaOptions['groupBy'], false | undefined>;

const groupingStrategies: Record<GroupByType, GroupingStrategy> = {
  group: (item: NavItem) => item.meta?.group as string | undefined,
  parent: (item: NavItem) => item.meta?.parent as string | undefined,
};

/**
 * Builds a grouped schema from navigation items
 * @param items - Array of navigation items
 * @param options - Grouping options
 * @returns Object with group names as keys and arrays of NavItem as values
 */
export function buildGroupedSchema(
  items: NavItem[],
  options: BuildGroupedSchemaOptions = {},
): GroupedSchema {
  const { groupBy = 'group', ungroupedKey = 'Other' } = options;

  if (groupBy === false) {
    return {};
  }

  const grouped: GroupedSchema = {};
  const strategy = groupingStrategies[groupBy];

  const processItem = (item: NavItem) => {
    const groupName = strategy(item);
    const key = groupName || ungroupedKey;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(item);

    if (item.children && item.children.length > 0) {
      item.children.forEach(processItem);
    }
  };

  items.forEach(processItem);

  return grouped;
}
