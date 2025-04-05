import { ConfigService } from '@/common/config';
import { LoggerService } from '@/common/logger';
import { injectable } from 'inversify';
import { Server as SocketServer, Socket } from 'socket.io';

@injectable()
export class SocketService {
  private io: SocketServer | null = null;

  constructor(private logger: LoggerService, private configService: ConfigService) {}

  /**
   * Initialize Socket.IO server
   * @param httpServer HTTP server instance
   */
  initialize(httpServer: any): void {
    // Create Socket.IO server
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: this.configService.getServerConfig().cors.origin,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupEventHandlers();
  }

  /**
   * Setup Socket.IO event handlers
   */
  private setupEventHandlers(): void {
    if (!this.io) {
      throw new Error('Socket.IO server not initialized');
    }

    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);
    });

    // Handle server-wide events
    this.io.on('error', (error: Error) => {
      this.logger.error('Socket.IO server error:', error);
    });
  }

  /**
   * Handle new socket connections
   * @param socket Socket instance
   */
  private handleConnection(socket: Socket): void {
    this.logger.info('New Socket.IO connection established', {
      id: socket.id,
      handshake: {
        address: socket.handshake.address,
        headers: socket.handshake.headers,
      },
    });

    // Handle custom events
    socket.on('message', (data: any) => {
      this.handleMessage(socket, data);
    });

    socket.on('disconnect', (reason: string) => {
      this.handleDisconnect(socket, reason);
    });

    // Handle errors
    socket.on('error', (error: Error) => {
      this.handleError(socket, error);
    });
  }

  /**
   * Handle incoming messages
   * @param socket Socket instance
   * @param data Message data
   */
  private handleMessage(socket: Socket, data: any): void {
    this.logger.debug('Received Socket.IO message:', { socketId: socket.id, data });
    // Broadcast the message to all connected clients except the sender
    socket.broadcast.emit('message', {
      from: socket.id,
      data,
    });
  }

  /**
   * Handle socket disconnection
   * @param socket Socket instance
   * @param reason Disconnection reason
   */
  private handleDisconnect(socket: Socket, reason: string): void {
    this.logger.info('Socket.IO connection closed', {
      socketId: socket.id,
      reason,
    });
  }

  /**
   * Handle socket errors
   * @param socket Socket instance
   * @param error Error object
   */
  private handleError(socket: Socket, error: Error): void {
    this.logger.error('Socket.IO error:', {
      socketId: socket.id,
      error,
    });
  }

  /**
   * Close Socket.IO server
   */
  async close(): Promise<void> {
    if (!this.io) {
      return;
    }

    return new Promise(resolve => {
      this.io!.close(() => {
        this.logger.info('Socket.IO server stopped');
        resolve();
      });
    });
  }

  /**
   * Get the Socket.IO server instance
   */
  getIO(): SocketServer | null {
    return this.io;
  }

  /**
   * Emit an event to all connected clients
   * @param event Event name
   * @param data Event data
   */
  emit(event: string, data: any): void {
    if (!this.io) {
      throw new Error('Socket.IO server not initialized');
    }
    this.io.emit(event, data);
  }

  /**
   * Emit an event to a specific room
   * @param room Room name
   * @param event Event name
   * @param data Event data
   */
  emitToRoom(room: string, event: string, data: any): void {
    if (!this.io) {
      throw new Error('Socket.IO server not initialized');
    }
    this.io.to(room).emit(event, data);
  }
}
