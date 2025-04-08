/* eslint-disable @typescript-eslint/no-explicit-any */
import { drizzleTableToSwaggerSchema } from './drizzle-schema-to-swagger';
import { PgTable } from 'drizzle-orm/pg-core';

export interface SwaggerTag {
  name: string;
  description: string;
}

export interface SwaggerPath {
  [method: string]: {
    summary?: string;
    description?: string;
    tags?: string[];
    security?: Array<{ [key: string]: string[] }>;
    responses?: {
      [statusCode: string]: {
        description: string;
        content?: {
          [contentType: string]: {
            schema: any;
          };
        };
      };
    };
  };
}

export interface SwaggerMetadata {
  paths: Record<string, SwaggerPath>;
  tags: SwaggerTag[];
  schemas: Record<string, any>;
}

export class SwaggerMetadataRegistry {
  private static instance: SwaggerMetadataRegistry;
  private metadata: SwaggerMetadata = {
    paths: {},
    tags: [],
    schemas: {},
  };

  private constructor() {}

  public static getInstance(): SwaggerMetadataRegistry {
    if (!SwaggerMetadataRegistry.instance) {
      SwaggerMetadataRegistry.instance = new SwaggerMetadataRegistry();
    }
    return SwaggerMetadataRegistry.instance;
  }

  public addPath(path: string, method: string, metadata: SwaggerPath[string]): void {
    if (!this.metadata.paths[path]) {
      this.metadata.paths[path] = {};
    }
    this.metadata.paths[path][method] = metadata;
  }

  public addTag(tag: SwaggerTag): void {
    if (!this.metadata.tags.some(t => t.name === tag.name)) {
      this.metadata.tags.push(tag);
    }
  }

  public addSchema(table: PgTable): void {
    const { name, schema } = drizzleTableToSwaggerSchema(table);
    this.metadata.schemas[name] = schema;
  }

  public getMetadata(): SwaggerMetadata {
    return this.metadata;
  }
}
