import type { NavigationOptions, NavItem } from '../types';
export declare function useNavigation(options?: NavigationOptions): {
    schema: import("vue").ComputedRef<NavItem[]>;
    flatSchema: import("vue").ComputedRef<NavItem[]>;
    findItem: (id: string) => NavItem | undefined;
    findByPath: (path: string) => NavItem | undefined;
    isActive: (path: string) => boolean;
    breadcrumbs: import("vue").ComputedRef<NavItem[]>;
    groupedSchema: import("vue").ComputedRef<Record<string, NavItem[]>>;
};
