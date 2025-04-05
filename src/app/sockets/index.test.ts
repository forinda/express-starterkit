/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SocketModule } from './index';
import { di } from '@/core/di/container';
import { LoggerService } from '@/common/logger';
import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';

describe('Socket Module', () => {
  let socketModule: SocketModule;
  let logger: LoggerService;
  let httpServer: Server;

  beforeEach(() => {
    di.unbindAll();
    logger = new LoggerService();
    di.bind(Symbol.for('LoggerService')).toConstantValue(logger);
    socketModule = new SocketModule();
    httpServer = new Server();
  });

  describe('initialize', () => {
    it('should create a socket.io server', () => {
      const io = socketModule.initialize(httpServer);
      expect(io).toBeInstanceOf(SocketServer);
    });

    it('should set up connection handling', () => {
      const io = socketModule.initialize(httpServer);
      const mockSocket = {
        id: 'test-id',
        on: vi.fn(),
      };

      // Simulate connection
      io.emit('connection', mockSocket);

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
