/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { Application } from 'express';
import express from 'express';
import { AppSetup } from './app';
import { injectable } from 'inversify';
import { autoBind } from '@/core/decorators/bind';
import { di } from '@/core/di/container';
import { LoggerService } from '@/common/logger';

/**
 * Application module for setting up Express application
 */
@injectable()
@autoBind()
export class AppModule {
  private readonly app: Application;
  private appSetup: AppSetup;
  private logger: LoggerService;

  constructor() {
    this.logger = di.get<LoggerService>(Symbol.for('LoggerService'));
    this.logger.info('AppModule', 'Initializing application module');
    // Create Express application
    this.app = express();
    // Initialize AppSetup with app instance
    this.appSetup = new AppSetup(this.app);
  }

  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    this.logger.info('AppModule', 'Initializing application');
    await this.appSetup.initialize();
  }

  /**
   * Get the Express application instance
   */
  getApp(): Application {
    return this.app;
  }

  /**
   * Start the application
   */
  async getAppMount(): Promise<Application> {
    await this.appSetup.mount();
    return this.app;
  }
}
