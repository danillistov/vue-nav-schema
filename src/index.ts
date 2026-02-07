export { useNavigation } from './composables/useNavigation';

export type {
  NavItem,
  NavigationMeta,
  NavigationOptions,
  Breadcrumb,
  Breadcrumbs,
  GroupedSchema,
} from './types';

export {
  NavigationError,
  InvalidSchemaError,
  InvalidRouteError,
  InvalidNavItemError,
  CircularDependencyError,
  ValidationError,
} from './errors';
