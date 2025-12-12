import type { RouteRecordNormalized, Router, RouteLocationNormalizedLoaded } from 'vue-router';
export interface NavigationMeta {
    title?: string;
    icon?: string;
    order?: number;
    hidden?: boolean;
    group?: string;
    parent?: string;
    roles?: string[];
    permissions?: string[];
    badge?: string | number;
    external?: boolean;
    target?: '_blank' | '_self';
    breadcrumb?: boolean;
    activeMatch?: string | RegExp;
}
export interface NavItem {
    id: string;
    label: string;
    path?: string;
    icon?: string;
    badge?: string | number;
    children?: NavItem[];
    meta?: Record<string, any>;
    isActive?: boolean;
    isExpanded?: boolean;
}
export interface NavigationOptions {
    router?: Router;
    route?: RouteLocationNormalizedLoaded;
    filter?: (route: RouteRecordNormalized) => boolean;
    checkRole?: (roles: string[]) => boolean;
    checkPermission?: (permissions: string[]) => boolean;
    sort?: (a: NavItem, b: NavItem) => number;
    maxDepth?: number;
    flatMode?: boolean;
    groupBy?: 'group' | 'parent' | false;
}
