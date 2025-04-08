/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ZodTypeAny,
  ZodObject,
  ZodArray,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodEnum,
  ZodOptional,
  ZodDefault,
  ZodLiteral,
  ZodNativeEnum,
  ZodDate,
  ZodRecord,
  ZodUnion,
  ZodIntersection,
  ZodLazy,
  ZodEffects,
} from 'zod';

type SwaggerSchema = {
  type?: string;
  format?: string;
  properties?: Record<string, SwaggerSchema>;
  required?: string[];
  items?: SwaggerSchema;
  enum?: (string | number)[];
  oneOf?: SwaggerSchema[];
  allOf?: SwaggerSchema[];
  anyOf?: SwaggerSchema[];
  nullable?: boolean;
  default?: any;
  description?: string;
  minimum?: number;
  maximum?: number;
  additionalProperties?: SwaggerSchema;
};

export function zodToSwagger(schema: ZodTypeAny): SwaggerSchema {
  if (schema instanceof ZodObject) {
    return handleZodObject(schema);
  } else if (schema instanceof ZodArray) {
    return handleZodArray(schema);
  } else if (schema instanceof ZodString) {
    return handleZodString(schema);
  } else if (schema instanceof ZodNumber) {
    return handleZodNumber(schema);
  } else if (schema instanceof ZodBoolean) {
    return { type: 'boolean' };
  } else if (schema instanceof ZodEnum) {
    return { type: 'string', enum: schema.options };
  } else if (schema instanceof ZodOptional || schema instanceof ZodDefault) {
    return zodToSwagger(schema._def.innerType);
  } else if (schema instanceof ZodLiteral) {
    return { type: typeof schema.value, enum: [schema.value] };
  } else if (schema instanceof ZodNativeEnum) {
    return { type: 'string', enum: Object.values(schema.enum) };
  } else if (schema instanceof ZodDate) {
    return { type: 'string', format: 'date-time' };
  } else if (schema instanceof ZodRecord) {
    return { type: 'object', additionalProperties: zodToSwagger(schema.valueSchema) };
  } else if (schema instanceof ZodUnion) {
    return { oneOf: schema.options.map(zodToSwagger) };
  } else if (schema instanceof ZodIntersection) {
    return { allOf: [zodToSwagger(schema._def.left), zodToSwagger(schema._def.right)] };
  } else if (schema instanceof ZodLazy) {
    return zodToSwagger(schema.schema);
  } else if (schema instanceof ZodEffects) {
    return zodToSwagger(schema.innerType());
  } else {
    return {};
  }
}

function handleZodObject(schema: ZodObject<any>): SwaggerSchema {
  const shape = schema.shape;
  const properties: Record<string, SwaggerSchema> = {};
  const required: string[] = [];

  for (const [key, value] of Object.entries(shape)) {
    properties[key] = zodToSwagger(value as ZodTypeAny);

    // Check if the field is required (not optional or default)
    if (!(value instanceof ZodOptional) && !(value instanceof ZodDefault)) {
      required.push(key);
    }
  }

  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined,
  };
}

function handleZodArray(schema: ZodArray<any>): SwaggerSchema {
  return {
    type: 'array',
    items: zodToSwagger(schema.element),
  };
}

function handleZodString(schema: ZodString): SwaggerSchema {
  const result: SwaggerSchema = { type: 'string' };

  if (schema.isEmail) {
    result.format = 'email';
  } else if (schema.isURL) {
    result.format = 'url';
  } else if (schema.isUUID) {
    result.format = 'uuid';
  } else if (schema.isDatetime) {
    result.format = 'date-time';
  }

  return result;
}

function handleZodNumber(schema: ZodNumber): SwaggerSchema {
  const result: SwaggerSchema = { type: 'number' };

  if (schema.isInt) {
    result.type = 'integer';
  }

  if (schema.minValue !== null) {
    result.minimum = schema.minValue;
  }

  if (schema.maxValue !== null) {
    result.maximum = schema.maxValue;
  }

  return result;
}

export function zodSchemaToRequestBody(schema: ZodTypeAny, description?: string): any {
  const swaggerSchema = zodToSwagger(schema);

  return {
    description: description || 'Request body',
    content: {
      'application/json': {
        schema: swaggerSchema,
      },
    },
  };
}
