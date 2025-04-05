import 'reflect-metadata';
import { di } from '@/core/di/container';
import { AppModule } from './module';
import { ServerModule } from './server';
import { LoggerService } from '@/common/logger';

/**
 * Bootstrap the application
 */
async function bootstrap() {
  try {
    const logger = di.resolve(LoggerService);
    logger.info('Bootstrap', 'Starting application bootstrap...');

    // Create and initialize app module
    const appModule = di.resolve(AppModule);
    await appModule.initialize();
    const app = await appModule.getAppMount();

    // Create and start server module
    const serverModule = new ServerModule(app);
    await serverModule.start();

    logger.info('Bootstrap', 'Application bootstrap completed successfully');

    // Handle process termination
    process.on('SIGTERM', async () => {
      logger.info('Bootstrap', 'SIGTERM received. Shutting down gracefully...');
      await serverModule.stop();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('Bootstrap', 'SIGINT received. Shutting down gracefully...');
      await serverModule.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();
