import { ConfigService } from '@/common/config';
import { LoggerService } from '@/common/logger';
import { Application } from 'express';
import { setupPlugins } from './plugins';
import { setupErrorHandling } from './err';
import { injectable } from 'inversify';
import { Api } from '@/api';
import { di } from '@/core/di/container';
import { autoBind } from '@/core/decorators/bind';

/**
 * Application setup service
 */
@injectable()
@autoBind()
export class AppSetup {
  private app: Application;
  private configService: ConfigService;
  private logger: LoggerService;
  private api: Api;

  constructor(app: Application) {
    this.app = app;
    this.configService = di.get(ConfigService);
    this.logger = di.get(LoggerService);
    this.api = di.get(Api);
  }

  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    // Initialize application settings
    this.logger.info('Initializing application...');

    // Setup plugins and middleware
    setupPlugins(this.app, this.configService);
    this.logger.info('Plugins setup complete');

    // Setup routes
    this.api.setup(this.app);
    this.logger.info('Routes setup complete');

    // Setup error handling
    setupErrorHandling(this.app, this.logger);

    this.logger.info('Application initialized successfully');
  }

  /**
   * Start the application
   */
  async start(): Promise<void> {
    const serverConfig = this.configService.getServerConfig();
    const port = serverConfig.port;
    const host = serverConfig.host;

    // Log all mounted routes before starting the server
    this.logger.info('Server routes:');
    this.app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        // Routes registered directly on the app
        this.logger.info(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        // Router middleware
        middleware.handle.stack.forEach((handler: any) => {
          if (handler.route) {
            const path = handler.route.path;
            const methods = Object.keys(handler.route.methods)
              .filter(method => handler.route.methods[method])
              .map(method => method.toUpperCase());
            this.logger.info(`${methods.join(',')} ${middleware.regexp}${path}`);
          }
        });
      }
    });

    this.app.listen(port, host, () => {
      this.logger.info(`Server is running on http://${host}:${port}`);
      this.logger.info(`Swagger documentation available at http://${host}:${port}/api-docs`);
    });
  }
}
