/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ControllerModule } from './controller-module';
import { Controller, Get } from './controller';
import { di } from '../di/container';
import { Router } from 'express';

describe('Controller Module', () => {
  beforeEach(() => {
    di.unbindAll();
  });

  describe('ControllerModule', () => {
    it('should register and initialize controllers', () => {
      @Controller('/test')
      class TestController {
        @Get('/')
        get() {}
      }

      const module = new ControllerModule();
      module.registerController(TestController);
      module.initializeController(module.getController('TestController')!);

      const controllers = module.getAllControllers();
      expect(controllers).toHaveLength(1);
      expect(controllers[0].target).toBe(TestController);
      expect(controllers[0].router).toBeInstanceOf(Router);
      expect(controllers[0].basePath).toBe('/test');
    });

    it('should handle controller registration errors', () => {
      const module = new ControllerModule();
      expect(() => module.registerController(class InvalidController {})).toThrow();
    });
  });
});
