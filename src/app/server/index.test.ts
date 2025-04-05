/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServerModule } from './index';
import { di } from '@/core/di/container';
import { LoggerService } from '@/common/logger';
import { ConfigService, ServerConfig } from '@/common/config';
import { SocketService } from '../sockets';
import express from 'express';

describe('Server Module', () => {
  let serverModule: ServerModule;
  let logger: LoggerService;
  let configService: ConfigService;
  let socketService: SocketService;
  let app: express.Application;

  beforeEach(() => {
    di.unbindAll();
    app = express();
    logger = new LoggerService();
    configService = new ConfigService();
    socketService = new SocketService(logger, configService);

    di.bind(Symbol.for('LoggerService')).toConstantValue(logger);
    di.bind(Symbol.for('ConfigService')).toConstantValue(configService);
    di.bind(Symbol.for('SocketService')).toConstantValue(socketService);

    serverModule = new ServerModule(app);
  });

  describe('start', () => {
    it('should start the server on the configured port', async () => {
      const port = 3000;
      const serverConfig: ServerConfig = {
        port,
        host: 'localhost',
        cors: {
          origin: '*',
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization'],
        },
      };
      vi.spyOn(configService, 'getServerConfig').mockReturnValue(serverConfig);

      await serverModule.start();

      expect(configService.getServerConfig).toHaveBeenCalled();
    });

    it('should initialize socket service', async () => {
      const initializeSpy = vi.spyOn(socketService, 'initialize');

      await serverModule.start();

      expect(initializeSpy).toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop both HTTP and Socket.IO servers', async () => {
      const closeSpy = vi.spyOn(socketService, 'close');

      await serverModule.stop();

      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
