/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

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
  private configService: ConfigService;
  private logger: LoggerService;
  private api: Api;

  constructor(private app: Application) {
    this.configService = di.get(ConfigService);
    this.logger = di.get(LoggerService);
    this.api = di.get(Api);
  }

  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    // Initialize application settings
    this.logger.info('AppSetup', 'Initializing application...');

    // Setup plugins and middleware
    setupPlugins(this.app, this.configService, this.logger);
    this.logger.info('AppSetup', 'Plugins setup complete');

    // Setup routes
    this.api.setup(this.app);
    this.logger.info('AppSetup', 'Routes setup complete');

    // Setup error handling
    setupErrorHandling(this.app, this.logger);

    this.logger.info('AppSetup', 'Application initialized successfully');
  }

  /**
   * Mount the application
   */
  async mount(): Promise<void> {
    this.logger.info('AppSetup', 'Mounting application...');
    // Any additional mounting logic can go here
  }
}
