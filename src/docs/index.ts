/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigService } from '@/common/config';
import { LoggerService } from '@/common/logger';
import { drizzleTableToSwaggerSchema } from '@/core/utils/drizzle-schema-to-swagger';
import { SwaggerService } from '@/core/services/swagger.service';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

const docsSchema = {} as Record<string, any>;

export function addSchemaToDocs(table: any): void {
  const { name, schema } = drizzleTableToSwaggerSchema(table);

  if (!docsSchema[name]) {
    docsSchema[name] = {
      type: 'object',
      properties: {},
      required: [],
    };
  }
  docsSchema[name] = schema;
}
/**
 * Setup Swagger documentation
 * @param app Express application
 * @param configService Configuration service
 * @param logger Logger service
 */
export function setupSwagger(
  app: Application,
  configService: ConfigService,
  logger: LoggerService
): void {
  const serverConfig = configService.getServerConfig();
  const swaggerService = new SwaggerService(configService);
  const swaggerDocument = swaggerService.generateDocument();

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
