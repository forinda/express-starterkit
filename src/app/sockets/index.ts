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
      this.logger.error('SocketService', `Socket.IO server error: ${error.message}`);
    });
  }

  /**
   * Handle new socket connections
   * @param socket Socket instance
   */
  private handleConnection(socket: Socket): void {
    this.logger.info('SocketService', `New Socket.IO connection established - ID: ${socket.id}`);

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
    this.logger.debug('SocketService', `Received Socket.IO message from ${socket.id}`);
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
    this.logger.info(
      'SocketService',
      `Socket.IO connection closed - ID: ${socket.id}, Reason: ${reason}`
    );
  }

  /**
   * Handle socket errors
   * @param socket Socket instance
   * @param error Error object
   */
  private handleError(socket: Socket, error: Error): void {
    this.logger.error('SocketService', `Socket.IO error on ${socket.id}: ${error.message}`);
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
        this.logger.info('SocketService', 'Socket.IO server stopped');
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
