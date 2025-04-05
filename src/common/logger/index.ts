import winston from 'winston';
import { injectable } from 'inversify';
// import { Singleton } from '@/core/di/base-deco';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  HTTP = 'http',
}

export interface LoggerOptions {
  level: LogLevel;
  format: 'json' | 'simple' | 'pretty';
  transports: ('console' | 'file')[];
  filename?: string;
  maxSize?: number;
  maxFiles?: number;
}

interface LogMessage {
  timestamp: string;
  level: string;
  message: string;
  [key: string]: any;
}

// @AutoRegister({ singleton: true })
@injectable()
export class LoggerService {
  private logger: winston.Logger;
  private options: LoggerOptions;

  constructor() {
    // Set default log level based on environment
    const defaultLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

    this.logger = winston.createLogger({
      level: defaultLevel,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
      ],
    });

    this.options = {
      level: defaultLevel === 'debug' ? LogLevel.DEBUG : LogLevel.INFO,
      format: 'simple',
      transports: ['console'],
      filename: 'logs/app.log',
      maxSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    };

    // Log the current log level
    this.info(`Logger initialized with level: ${defaultLevel}`);
  }

  private initializeLogger(): void {
    const { level, format, transports, filename, maxSize, maxFiles } = this.options;

    // Configure format
    const formatConfig = this.getFormatConfig(format);

    // Configure transports
    const transportConfigs = transports
      .map(transport => {
        if (transport === 'console') {
          return new winston.transports.Console({
            level,
            format: formatConfig,
          });
        } else if (transport === 'file') {
          return new winston.transports.File({
            filename,
            level,
            format: formatConfig,
            maxsize: maxSize,
            maxFiles,
          });
        }
        return null;
      })
      .filter(Boolean) as winston.transport[];

    // Create logger
    this.logger = winston.createLogger({
      level,
      format: formatConfig,
      transports: transportConfigs,
    });
  }

  private getFormatConfig(format: 'json' | 'simple' | 'pretty'): winston.Logform.Format {
    switch (format) {
      case 'json':
        return winston.format.json();
      case 'pretty':
        return winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(info => {
            const { timestamp, level, message, ...meta } = info;
            return `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
          })
        );
      case 'simple':
      default:
        return winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(info => {
            const { timestamp, level, message, ...meta } = info;
            return `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta) : ''
            }`;
          })
        );
    }
  }

  error(message: string, meta?: Record<string, any>): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.logger.warn(message, meta);
  }

  info(message: string, meta?: Record<string, any>): void {
    this.logger.info(message, meta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.logger.debug(message, meta);
  }

  http(message: string, meta?: Record<string, any>): void {
    this.logger.http(message, meta);
  }

  // Method to update logger options at runtime
  updateOptions(options: Partial<LoggerOptions>): void {
    this.options = { ...this.options, ...options };
    this.initializeLogger();
  }
}
