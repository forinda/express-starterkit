import { Application } from 'express';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { ConfigService } from '@/common/config';

/**
 * Setup application plugins and middleware
 * @param app Express application
 * @param configService Configuration service
 */
export function setupPlugins(app: Application, configService: ConfigService): void {
  const serverConfig = configService.getServerConfig();

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

  // Compression
  app.use(compression());

  // Logging
  if (configService.isDevelopment()) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }
}
