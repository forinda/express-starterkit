/* eslint-disable @typescript-eslint/no-explicit-any */
import { SwaggerMetadataRegistry } from '../utils/swagger-metadata';
import { SwaggerTag, SwaggerPathMetadata } from '../types/swagger.types';

export function SwaggerTag(tag: string, description?: string) {
  return function (_target: any) {
    const metadataRegistry = SwaggerMetadataRegistry.getInstance();
    metadataRegistry.addTag({
      name: tag,
      description: description || `${tag} operations`,
    });
  };
}

export function SwaggerPath(
  path: string,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  metadata: SwaggerPathMetadata
) {
  return function (_target: any, _propertyKey: string, _descriptor: PropertyDescriptor) {
    const metadataRegistry = SwaggerMetadataRegistry.getInstance();
    metadataRegistry.addPath(path, method, metadata);
  };
}

export function SwaggerSchema(table: any) {
  return function (_target: any) {
    const metadataRegistry = SwaggerMetadataRegistry.getInstance();
    metadataRegistry.addSchema(table);
  };
}
