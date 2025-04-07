import winston from 'winston';
import { injectable } from 'inversify';
import { Singleton } from '@/core/di/container';
import { autoBind } from '@/core/decorators/bind';
// import { Singleton } from '@/core/di/base-deco';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const logLevels = {
  debug: { color: colors.cyan, prefix: 'DEBUG' },
  info: { color: colors.green, prefix: 'INFO' },
  warn: { color: colors.yellow, prefix: 'WARN' },
  error: { color: colors.red, prefix: 'ERROR' },
};

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
@Singleton()
@autoBind()
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
    // this.info('LoggerService', `Logger initialized with level: ${defaultLevel}`);
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

  private formatMessage(level: keyof typeof logLevels, context: string, message: string): string {
    const timestamp = new Date().toISOString();
    const { color, prefix } = logLevels[level];
    return `${colors.dim}[${timestamp}]${colors.reset} ${color}[${prefix}]${colors.reset} ${colors.bright}[${context}]${colors.reset} ${message}`;
  }

  error(context: string, message: string): void {
    console.error(this.formatMessage('error', context, message));
  }

  warn(context: string, message: string): void {
    console.warn(this.formatMessage('warn', context, message));
  }

  info(context: string, message: string): void {
    console.info(this.formatMessage('info', context, message));
  }

  debug(context: string, message: string): void {
    console.debug(this.formatMessage('debug', context, message));
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
