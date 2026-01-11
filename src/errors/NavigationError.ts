/**
 * Base error class for all navigation-related errors
 */
export class NavigationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'NavigationError';
    Object.setPrototypeOf(this, NavigationError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
    };
  }
}

/**
 * Error thrown when schema configuration is invalid
 */
export class InvalidSchemaError extends NavigationError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_SCHEMA', context);
    this.name = 'InvalidSchemaError';
    Object.setPrototypeOf(this, InvalidSchemaError.prototype);
  }
}

/**
 * Error thrown when route configuration is invalid
 */
export class InvalidRouteError extends NavigationError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_ROUTE', context);
    this.name = 'InvalidRouteError';
    Object.setPrototypeOf(this, InvalidRouteError.prototype);
  }
}

/**
 * Error thrown when navigation item is invalid
 */
export class InvalidNavItemError extends NavigationError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_NAV_ITEM', context);
    this.name = 'InvalidNavItemError';
    Object.setPrototypeOf(this, InvalidNavItemError.prototype);
  }
}

/**
 * Error thrown when circular dependency is detected in navigation tree
 */
export class CircularDependencyError extends NavigationError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CIRCULAR_DEPENDENCY', context);
    this.name = 'CircularDependencyError';
    Object.setPrototypeOf(this, CircularDependencyError.prototype);
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends NavigationError {
  constructor(
    message: string,
    public readonly field: string,
    context?: Record<string, unknown>,
  ) {
    super(message, 'VALIDATION_ERROR', { ...context, field });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
