import { Controller, Get } from '@/core/decorators/controller';
import { formatResponse } from '@/common/formatter/response';
import { ApiRequestContext } from '@/core/context/request';

@Controller('/health')
export class HealthController {
  @Get('/')
  async checkHealth(context: ApiRequestContext) {
    return formatResponse(context.res, {
      message: 'Service is healthy',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });
  }
}
