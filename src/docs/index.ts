import { ConfigService } from '@/common/config';
import { LoggerService } from '@/common/logger';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

interface SwaggerTag {
  name: string;
  description: string;
}

interface SwaggerDocument {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  components: {
    securitySchemes: {
      cookieAuth: {
        type: string;
        in: string;
        name: string;
        description: string;
      };
      bearerAuth: {
        type: string;
        scheme: string;
        bearerFormat: string;
      };
    };
  };
  security: Array<{
    cookieAuth: string[];
    bearerAuth: string[];
  }>;
  tags: SwaggerTag[];
  paths: Record<string, any>;
}

/**
 * Setup Swagger documentation
 * @param app Express application
 * @param configService Configuration service
 * @param logger Logger service
 * @param controllerDomainRegistry Domain registry for collecting metadata
 */
export function setupSwagger(
  app: Application,
  configService: ConfigService,
  logger: LoggerService
  // controllerDomainRegistry: ControllerDomainRegistry
): void {
  const serverConfig = configService.getServerConfig();

  // Create Swagger document
  const swaggerDocument: SwaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Express Meta API',
      version: '1.0.0',
      description: 'API documentation for Express Meta application',
    },
    servers: [
      {
        url: `http://localhost:${serverConfig.port}`,
        description: 'Development server',
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
    },
    security: [
      {
        cookieAuth: [],
        bearerAuth: [],
      },
    ],
    tags: [],
    paths: {
      '/api/v1/users': {
        get: {
          summary: 'Get all users',
          description: 'Get all users from the database',
          responses: {
            200: {
              description: 'Users fetched successfully',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                },
              },
            },
          },
        },
      },
    },
  };
  // console.log(JSON.stringify(swaggerDocument.paths, null, 2));

  // Collect metadata from controllers
  // const controllers = controllerDomainRegistry.getControllers();
  const tags = new Set<string>();

  // controllers.forEach((controller: any) => {
  //   const metadata = Reflect.getMetadata('swagger', controller);
  //   if (metadata?.tags) {
  //     metadata.tags.forEach((tag: string) => tags.add(tag));
  //   }
  // });

  // Add tags to Swagger document
  tags.forEach(tag => {
    swaggerDocument.tags.push({
      name: tag,
      description: `${tag} operations`,
    });
  });

  // Get paths from SwaggerRegistry
  // const swaggerDoc = getSwaggerDocument();
  //   console.log(swaggerDoc);

  // swaggerDocument.paths = swaggerDoc.paths || {};

  // // Merge tags from SwaggerRegistry
  // const registryTags = swaggerDoc.tags || [];
  // registryTags.forEach((tag: { name: string; description?: string }) => {
  //   if (!tags.has(tag.name)) {
  //     swaggerDocument.tags.push({
  //       name: tag.name,
  //       description: tag.description || `${tag.name} operations`,
  //     });
  //   }
  // });

  // Serve Swagger documentation
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );

  logger.info(
    'Docs',
    `Swagger documentation available at http://localhost:${serverConfig.port}/api-docs`
  );
}
