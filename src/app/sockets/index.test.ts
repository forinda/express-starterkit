/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { di } from '@/core/di/container';
import { LoggerService } from '@/common/logger';
import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import { SocketService } from './index';
import { ConfigService } from '@/common/config';

describe('Socket Module', () => {
  let socketModule: SocketService;
  let logger: LoggerService;
  let configService: ConfigService;
  let httpServer: Server;

  beforeEach(() => {
    di.unbindAll();
    logger = new LoggerService();
    configService = new ConfigService();
    di.bind(Symbol.for('LoggerService')).toConstantValue(logger);
    di.bind(Symbol.for('ConfigService')).toConstantValue(configService);
    socketModule = new SocketService(logger, configService);
    httpServer = new Server();
  });

  describe('initialize', () => {
    it('should create a socket.io server', () => {
      socketModule.initialize(httpServer);
      const io = socketModule.getIO();
      expect(io).toBeInstanceOf(SocketServer);
    });

    it('should set up connection handling', () => {
      socketModule.initialize(httpServer);
      const io = socketModule.getIO();
      const mockSocket = {
        id: 'test-id',
        on: vi.fn(),
      };

      // Simulate connection
      io!.emit('connection', mockSocket);

      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });
  });

  describe('getIO', () => {
    it('should return the socket.io server instance', () => {
      const io = socketModule.initialize(httpServer);
      expect(socketModule.getIO()).toBe(io);
    });

    it('should throw if server is not initialized', () => {
      expect(() => socketModule.getIO()).toThrow();
    });
  });
});
