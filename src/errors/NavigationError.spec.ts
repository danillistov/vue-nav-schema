import { describe, it, expect } from 'vitest';
import {
  NavigationError,
  InvalidSchemaError,
  InvalidRouteError,
  InvalidNavItemError,
  CircularDependencyError,
  ValidationError,
} from './NavigationError';

describe('NavigationError', () => {
  it('should create a base NavigationError', () => {
    const error = new NavigationError('Test error', 'TEST_CODE', {
      someContext: 'value',
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NavigationError);
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.context).toEqual({ someContext: 'value' });
    expect(error.name).toBe('NavigationError');
  });

  it('should serialize to JSON', () => {
    const error = new NavigationError('Test error', 'TEST_CODE', {
      key: 'value',
    });

    const json = error.toJSON();

    expect(json).toEqual({
      name: 'NavigationError',
      message: 'Test error',
      code: 'TEST_CODE',
      context: { key: 'value' },
    });
  });
});

describe('InvalidSchemaError', () => {
  it('should create an InvalidSchemaError', () => {
    const error = new InvalidSchemaError('Invalid schema', { field: 'test' });

    expect(error).toBeInstanceOf(NavigationError);
    expect(error).toBeInstanceOf(InvalidSchemaError);
    expect(error.message).toBe('Invalid schema');
    expect(error.code).toBe('INVALID_SCHEMA');
    expect(error.name).toBe('InvalidSchemaError');
    expect(error.context).toEqual({ field: 'test' });
  });
});

describe('InvalidRouteError', () => {
  it('should create an InvalidRouteError', () => {
    const error = new InvalidRouteError('Invalid route', { path: '/test' });

    expect(error).toBeInstanceOf(NavigationError);
    expect(error).toBeInstanceOf(InvalidRouteError);
    expect(error.message).toBe('Invalid route');
    expect(error.code).toBe('INVALID_ROUTE');
    expect(error.name).toBe('InvalidRouteError');
  });
});

describe('InvalidNavItemError', () => {
  it('should create an InvalidNavItemError', () => {
    const error = new InvalidNavItemError('Invalid nav item', { id: 'test' });

    expect(error).toBeInstanceOf(NavigationError);
    expect(error).toBeInstanceOf(InvalidNavItemError);
    expect(error.message).toBe('Invalid nav item');
    expect(error.code).toBe('INVALID_NAV_ITEM');
    expect(error.name).toBe('InvalidNavItemError');
  });
});

describe('CircularDependencyError', () => {
  it('should create a CircularDependencyError', () => {
    const error = new CircularDependencyError('Circular dependency', {
      cycle: ['a', 'b', 'c'],
    });

    expect(error).toBeInstanceOf(NavigationError);
    expect(error).toBeInstanceOf(CircularDependencyError);
    expect(error.message).toBe('Circular dependency');
    expect(error.code).toBe('CIRCULAR_DEPENDENCY');
    expect(error.name).toBe('CircularDependencyError');
  });
});

describe('ValidationError', () => {
  it('should create a ValidationError', () => {
    const error = new ValidationError('Validation failed', 'fieldName', {
      value: 'invalid',
    });

    expect(error).toBeInstanceOf(NavigationError);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe('Validation failed');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.name).toBe('ValidationError');
    expect(error.field).toBe('fieldName');
    expect(error.context).toEqual({ value: 'invalid', field: 'fieldName' });
  });
});
