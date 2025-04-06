import { ControllerModule } from '@/core/decorators/controller-module';
import { Singleton } from '@/core/di/container';
import { LoggerService } from '@/common/logger';
import { di } from '@/core/di/container';
import { HealthController } from './controllers/health.controller';

@Singleton()
export class HealthControllerModule extends ControllerModule {
  private logger: LoggerService;

  constructor() {
    super();
    this.logger = di.get<LoggerService>(Symbol.for('LoggerService'));
    this.logger.debug('[HealthControllerModule]', 'Initializing health controller module');

    // Register controllers
    this.registerController(HealthController);
  }
}
