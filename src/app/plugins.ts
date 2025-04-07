import { Application } from 'express';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { ConfigService } from '@/common/config';
import { setupSwagger } from '@/docs';
import { LoggerService } from '@/common/logger';

/**
 * Setup application plugins and middleware
 * @param app Express application
 * @param configService Configuration service
 */
export function setupPlugins(
  app: Application,
  configService: ConfigService,
  logger: LoggerService
  // controllerDomainRegistry: ControllerDomainRegistry//
): void {
  const serverConfig = configService.getServerConfig();
  // Setup swagger documentation
  setupSwagger(app, configService, logger);
  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use(
    cors({
      origin: serverConfig.cors.origin,
      methods: serverConfig.cors.methods,
      allowedHeaders: serverConfig.cors.allowedHeaders,
      credentials: true, // Enable credentials for cookies
    })
  );

  // Cookie parser
  app.use(cookieParser());

  // Security headers
  app.use(helmet());

  // Proxy support
  // if (serverConfig.proxy) {
  app.set('trust proxy', 1); // Trust first proxy
  // }

  // Disable x-powered-by header
  app.disable('x-powered-by');
  // Enable strict routing
  app.enable('strict routing');
  // Enable case-sensitive routing
  app.enable('case sensitive routing');

  // Compression
  app.use(compression());

  // Logging
  if (configService.isDevelopment()) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }
}
