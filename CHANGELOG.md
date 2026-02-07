## [1.0.1](https://github.com/danillistov/vue-nav-schema/compare/v1.0.0...v1.0.1) (2026-02-07)


### Bug Fixes

* update semantic-release package ([#19](https://github.com/danillistov/vue-nav-schema/issues/19)) ([25a76ee](https://github.com/danillistov/vue-nav-schema/commit/25a76ee19f34729705aba3241815a9cfe784be09))

# 1.0.0 (2026-02-07)


### Bug Fixes

* semantic release ([cc1df31](https://github.com/danillistov/vue-nav-schema/commit/cc1df310afe6e6506f65cdf0e47a79a6d47e8d17))
* update semantic-release package ([#18](https://github.com/danillistov/vue-nav-schema/issues/18)) ([f5574a5](https://github.com/danillistov/vue-nav-schema/commit/f5574a54d9905e0b1a68e8f63d5e861278e8c4b7))


### Features

* base project initialization ([87f4abf](https://github.com/danillistov/vue-nav-schema/commit/87f4abf05284746c402f9f1d3fa8992f99466fe5))
* ci/cd ([43d58e6](https://github.com/danillistov/vue-nav-schema/commit/43d58e6416c8b25e21f690e9cf348b4a79f0d71e))
* gitignore extend ([39c9ccc](https://github.com/danillistov/vue-nav-schema/commit/39c9ccc6a27566b2c951e02674f7e60b28e24050))
* initial release ([03c0e23](https://github.com/danillistov/vue-nav-schema/commit/03c0e23d86478af7caf816bd768401229bd7281e))
* npm release false ([fac7d7b](https://github.com/danillistov/vue-nav-schema/commit/fac7d7b431ae81e8306554948b624875271a9c55))
* pre-commit ([63d3744](https://github.com/danillistov/vue-nav-schema/commit/63d3744928e954d13652c10175a95fb21b5a544a))

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
