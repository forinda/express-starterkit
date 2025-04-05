import { DomainModule } from '@/core/decorators/domain-decorator';
import { userControllers } from './users/routes';

@DomainModule({ controllers: [...userControllers] })
export class ApiV1Module {}
