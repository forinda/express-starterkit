import { ConfigService } from '@/common/config';
import { LoggerService } from '@/common/logger';
import { createServer, Server } from 'http';
import { SocketService } from '../sockets';
import { Application } from 'express';
import { di } from '@/core/di/container';

export class ServerModule {
  private httpServer: Server;
  private configService: ConfigService;
  private logger: LoggerService;
  private socketService: SocketService;

  constructor(app: Application) {
    this.configService = di.resolve(ConfigService);
    this.logger = di.resolve(LoggerService);
    this.socketService = di.resolve(SocketService);

    // Create HTTP server
    this.httpServer = createServer(app);
  }

  /**
   * Start the servers
   */
  async start(): Promise<void> {
    const serverConfig = this.configService.getServerConfig();

    // Initialize Socket.IO
    this.socketService.initialize(this.httpServer);

    // Start HTTP server
    this.httpServer.listen(serverConfig.port, () => {
      this.logger.info(`HTTP server is running on port ${serverConfig.port}`);
      this.logger.info(`Socket.IO server is running on ws://localhost:${serverConfig.port}`);
    });
  }

  /**
   * Stop the servers
   */
  async stop(): Promise<void> {
    return new Promise(resolve => {
      // Close Socket.IO server
      this.socketService.close().then(() => {
        // Close HTTP server
        this.httpServer.close(() => {
          this.logger.info('HTTP server stopped');
          resolve();
        });
      });
    });
  }
}
