/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ControllerModule, BaseControllerModule, CONTROLLER_MODULE_KEY } from './controller-module';
import { Controller, Get } from './controller';
import { di } from '../di/container';
import { Router } from 'express';

describe('Controller Module', () => {
  beforeEach(() => {
    di.unbindAll();
  });

  describe('@ControllerModule', () => {
    it('should set module metadata', () => {
      @ControllerModule({
        controllers: [],
      })
      class TestModule {}

      const metadata = Reflect.getMetadata(CONTROLLER_MODULE_KEY, TestModule);
      expect(metadata).toBeDefined();
      expect(metadata.controllers).toEqual([]);
    });
  });

  describe('BaseControllerModule', () => {
    it('should initialize controllers', () => {
      @Controller('/test')
      class TestController {
        @Get('/')
        get() {}
      }

      @ControllerModule({
        controllers: [TestController],
      })
      class TestModule extends BaseControllerModule {
        getControllers() {
          return this.controllers;
        }
      }

      const module = new TestModule();
      const controllers = module.getControllers();

      expect(controllers).toHaveLength(1);
      expect(controllers[0].target).toBe(TestController);
      expect(controllers[0].router).toBeInstanceOf(Router);
      expect(controllers[0].basePath).toBe('/test');
    });

    it('should handle controller initialization errors', () => {
      @ControllerModule({
        controllers: [class InvalidController {}],
      })
      class TestModule extends BaseControllerModule {
        getControllers() {
          return this.controllers;
        }
      }

      expect(() => new TestModule()).toThrow();
    });
  });
});
