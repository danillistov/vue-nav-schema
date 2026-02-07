# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2025-02-07

### Added

- `useNavigation` composable for building reactive navigation schemas from Vue Router
- Hierarchical navigation tree (`schema`) with automatic parent-child relationships
- Flat navigation list (`flatSchema`) for simple navigation structures
- Breadcrumb generation (`breadcrumbs`) based on current route
- Grouped navigation (`groupedSchema`) with `groupBy: 'group'` or `groupBy: 'parent'`
- Custom filtering support via `filter` option
- Custom sorting support via `sort` option
- Active state detection with `activeMatch` support (string or RegExp)
- Dynamic title support via function in route meta
- `findItem(id)` and `findByPath(path)` helper methods
- `isActive(path)` method for checking active state
- Error handling with `NavigationError` and specialized error classes
- Schema validation with `validateSchema` option
- Full TypeScript support with exported types
- Vue 3.3+ and Vue Router 4.0+ peer dependencies
