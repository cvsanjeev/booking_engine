import { Injectable } from '@nestjs/common';
import { pino } from 'pino' 

@Injectable()
export class LoggerService {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    });
  }

  log(message: string, context?: any): void {
    this.logger.info(context || {}, message);
  }

  error(message: string, context?: any): void {
    this.logger.error(context || {}, message);
  }

  warn(message: string, context?: any): void {
    this.logger.warn(context || {}, message);
  }

  debug(message: string, context?: any): void {
    this.logger.debug(context || {}, message);
  }
}