import type { RouteRecordNormalized } from 'vue-router';
import type { NavItem } from '@/types';
export interface TransformRouteOptions {
    currentPath?: string;
    isExpanded?: boolean;
}
export declare function transformRoute(route: RouteRecordNormalized, options?: TransformRouteOptions): NavItem;
