/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  CONTROLLER_METADATA_KEY,
  ROUTES_METADATA_KEY,
} from './controller';
import { Router } from 'express';

describe('Controller Decorators', () => {
  describe('@Controller', () => {
    it('should set controller metadata', () => {
      @Controller('/test')
      class TestController {
        @Get('/')
        get() {}
      }

      const metadata = Reflect.getMetadata(CONTROLLER_METADATA_KEY, TestController);
      expect(metadata).toBeDefined();
      expect(metadata.basePath).toBe('/test');
    });

    it('should set default base path', () => {
      @Controller('/')
      class TestController {
        @Get('/')
        get() {}
      }

      const metadata = Reflect.getMetadata(CONTROLLER_METADATA_KEY, TestController);
      expect(metadata.basePath).toBe('/');
    });
  });

  describe('HTTP Method Decorators', () => {
    it('should set route metadata for GET', () => {
      class TestController {
        @Get('/test')
        get() {}
      }

      const metadata = Reflect.getMetadata(ROUTES_METADATA_KEY, TestController.prototype);
      expect(metadata).toHaveLength(1);
      expect(metadata[0].method).toBe('get');
      expect(metadata[0].path).toBe('/test');
    });

    it('should set route metadata for POST', () => {
      class TestController {
        @Post('/test')
        post() {}
      }

      const metadata = Reflect.getMetadata(ROUTES_METADATA_KEY, TestController.prototype);
      expect(metadata[0].method).toBe('post');
    });

    it('should set route metadata for PUT', () => {
      class TestController {
        @Put('/test')
        put() {}
      }

      const metadata = Reflect.getMetadata(ROUTES_METADATA_KEY, TestController.prototype);
      expect(metadata[0].method).toBe('put');
    });

    it('should set route metadata for DELETE', () => {
      class TestController {
        @Delete('/test')
        delete() {}
      }

      const metadata = Reflect.getMetadata(ROUTES_METADATA_KEY, TestController.prototype);
      expect(metadata[0].method).toBe('delete');
    });

    it('should set route metadata for PATCH', () => {
      class TestController {
        @Patch('/test')
        patch() {}
      }

      const metadata = Reflect.getMetadata(ROUTES_METADATA_KEY, TestController.prototype);
      expect(metadata[0].method).toBe('patch');
    });
  });

  describe('Route Handler', () => {
    it('should set handler name in metadata', () => {
      class TestController {
        @Get('/test')
        testHandler() {}
      }

      const metadata = Reflect.getMetadata(ROUTES_METADATA_KEY, TestController.prototype);
      expect(metadata[0].handlerName).toBe('testHandler');
    });

    it('should support multiple routes', () => {
      class TestController {
        @Get('/test1')
        test1() {}

        @Post('/test2')
        test2() {}
      }

      const metadata = Reflect.getMetadata(ROUTES_METADATA_KEY, TestController.prototype);
      expect(metadata).toHaveLength(2);
      expect(metadata[0].method).toBe('get');
      expect(metadata[1].method).toBe('post');
    });
  });
});
