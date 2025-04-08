export interface SwaggerTag {
  name: string;
  description: string;
}

export interface SwaggerParameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  schema: {
    type: string;
    format?: string;
    minimum?: number;
    maximum?: number;
    default?: any;
    enum?: string[];
  };
}

export interface SwaggerRequestBody {
  required?: boolean;
  content: {
    [contentType: string]: {
      schema: {
        type: string;
        required?: string[];
        properties: Record<string, any>;
      };
    };
  };
}

export interface SwaggerResponse {
  description: string;
  content?: {
    [contentType: string]: {
      schema: any;
    };
  };
}

export interface SwaggerPathMetadata {
  summary?: string;
  description?: string;
  tags?: string[];
  security?: Array<{ [key: string]: string[] }>;
  parameters?: SwaggerParameter[];
  requestBody?: SwaggerRequestBody;
  responses?: {
    [statusCode: string]: SwaggerResponse;
  };
}

export interface SwaggerDocument {
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
    schemas: Record<string, any>;
  };
  security: Array<{
    cookieAuth: string[];
    bearerAuth: string[];
  }>;
  tags: SwaggerTag[];
  paths: Record<string, any>;
}
