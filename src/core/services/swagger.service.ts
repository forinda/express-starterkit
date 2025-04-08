import { Singleton } from '../di/container';
import { SwaggerDocument } from '../types/swagger.types';
import { SwaggerMetadataRegistry } from '../utils/swagger-metadata';
import { ConfigService } from '@/common/config';

@Singleton()
export class SwaggerService {
  private metadataRegistry: SwaggerMetadataRegistry;
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.metadataRegistry = SwaggerMetadataRegistry.getInstance();
    this.configService = configService;
  }

  public generateDocument(): SwaggerDocument {
    const metadata = this.metadataRegistry.getMetadata();
    const serverConfig = this.configService.getServerConfig();

    return {
      openapi: '3.0.0',
      info: {
        title: 'Healthcare Hospital API',
        version: '1.0.0',
        description: 'API documentation for Healthcare Hospital application',
      },
      servers: [
        {
          url: `http://localhost:${serverConfig.port}/api/v1`,
          description: 'API v1',
        },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'session',
            description: 'Cookie-based authentication',
          },
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: metadata.schemas,
      },
      security: [
        {
          cookieAuth: [],
          bearerAuth: [],
        },
      ],
      tags: metadata.tags,
      paths: metadata.paths,
    };
  }
}
