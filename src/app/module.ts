import { AutoBindDep } from '@/core/di/auto-bind';
import { Application } from 'express';
import express from 'express';
import { AppSetup } from './app';
import { inject, injectable } from 'inversify';
import { autoBind } from '@/core/decorators/bind';
import { di } from '@/core/di/container';

/**
 * Application module for setting up Express application
 */
@injectable()
@autoBind()
export class AppModule {
  private readonly app: Application;
  private appSetup!: AppSetup;

  constructor() {
    console.log('AppModule constructor');

    // Create Express application
    this.app = express();
    // Initialize AppSetup with app instance
    this.appSetup = new AppSetup(this.app);
  }

  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    // Initialize application setting
    di.get(AppSetup).initialize();
    // await this.appSetup.initialize(this.app);
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
  async start(): Promise<void> {
    // await this.appSetup.start();
    // Start the application on the specified port
    await di.get(AppSetup).start();
  }
}
