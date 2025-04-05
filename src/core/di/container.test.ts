/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { di, Singleton, Injectable, resolve } from './container';

describe('Container Decorators', () => {
  beforeEach(() => {
    // Clear the container before each test
    di.unbindAll();
  });

  describe('@Singleton', () => {
    it('should register a class as a singleton', () => {
      @Singleton()
      class TestService {
        public value = 1;
      }

      const instance1 = resolve(TestService);
      const instance2 = resolve(TestService);

      expect(instance1).toBe(instance2);
      expect(instance1.value).toBe(1);
    });

    it('should allow custom token for singleton', () => {
      const TOKEN = Symbol('TestService');

      @Singleton()
      class TestService {
        public value = 1;
      }

      const instance = resolve(TestService);
      expect(instance).toBeInstanceOf(TestService);
    });
  });

  describe('@Injectable', () => {
    it('should register a class as injectable', () => {
      @Injectable()
      class TestService {
        public value = 1;
      }

      const instance = resolve(TestService);
      expect(instance).toBeInstanceOf(TestService);
      expect(instance.value).toBe(1);
    });

    it('should allow custom token for injectable', () => {
      const TOKEN = Symbol('TestService');

      @Injectable()
      class TestService {
        public value = 1;
      }

      const instance = resolve(TestService);
      expect(instance).toBeInstanceOf(TestService);
    });
  });

  describe('resolve', () => {
    it('should resolve a registered service', () => {
      @Singleton()
      class TestService {
        public value = 1;
      }

      const instance = resolve(TestService);
      expect(instance).toBeInstanceOf(TestService);
    });

    it('should throw error for unregistered service', () => {
      class UnregisteredService {}

      expect(() => resolve(UnregisteredService)).toThrow();
    });
  });
});
