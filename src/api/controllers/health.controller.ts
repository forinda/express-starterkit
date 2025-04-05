import { Controller, Get } from '@/core/decorators/controller';
import { Request, Response } from 'express';

@Controller('/health')
export class HealthController {
  @Get('/')
  async check(req: Request, res: Response) {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
