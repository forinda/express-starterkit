/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PgTable,
  PgColumn,
  PgText,
  PgEnumColumn,
  PgTimestamp,
  PgBoolean,
  PgNumeric,
  PgInteger,
  PgJson,
  PgArray,
} from 'drizzle-orm/pg-core';

type ColumnTypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  date: string;
  json: any;
  array: any[];
};

interface SwaggerProperty {
  type: keyof ColumnTypeMap;
  format?: string;
  enum?: any[];
  default?: any;
  items?: SwaggerProperty;
}

interface SwaggerSchema {
  type: 'object';
  properties: Record<string, SwaggerProperty>;
  required: string[];
}

interface TableSchema {
  name: string;
  schema: SwaggerSchema;
}

// Type guards for different column types
function isPgText(column: PgColumn): column is PgText<any> {
  return column.columnType === 'PgText';
}

function isPgEnum(column: PgColumn): column is PgEnumColumn<any> {
  return column.columnType === 'PgEnumColumn';
}

function isPgTimestamp(column: PgColumn): column is PgTimestamp<any> {
  return column.columnType === 'PgTimestamp';
}

function isPgBoolean(column: PgColumn): column is PgBoolean<any> {
  return column.columnType === 'PgBoolean';
}

function isPgNumeric(column: PgColumn): column is PgNumeric<any> {
  return column.columnType === 'PgNumeric';
}

function isPgInteger(column: PgColumn): column is PgInteger<any> {
  return column.columnType === 'PgInteger';
}

function isPgJson(column: PgColumn): column is PgJson<any> {
  return column.columnType === 'PgJson';
}

function isPgArray(column: PgColumn): column is PgArray<any, any> {
  return column.columnType === 'PgArray';
}

export function drizzleTableToSwaggerSchema(table: PgTable): TableSchema {
  const drizzleTable = table as any;
  // Get the table name from the Drizzle table configuration
  const tableName =
    drizzleTable[Symbol.for('drizzle:Name')] ||
    drizzleTable.name ||
    drizzleTable.config?.name ||
    'unknown';

  const schema: SwaggerSchema = {
    type: 'object',
    properties: {},
    required: [],
  };

  const columns = drizzleTable[Symbol.for('drizzle:Columns')] as Record<string, PgColumn>;

  for (const [columnName, column] of Object.entries(columns)) {
    if (!column) continue;

    let property: SwaggerProperty = { type: 'string' }; // Default fallback

    if (isPgEnum(column)) {
      property = {
        type: 'string',
        enum: column.enumValues,
      };
    } else if (isPgText(column)) {
      property = { type: 'string' };
    } else if (isPgTimestamp(column)) {
      property = {
        type: 'string',
        format: 'date-time',
      };
    } else if (isPgBoolean(column)) {
      property = { type: 'boolean' };
    } else if (isPgNumeric(column) || isPgInteger(column)) {
      property = { type: 'number' };
    } else if (isPgJson(column)) {
      property = { type: 'json' };
    } else if (isPgArray(column)) {
      property = {
        type: 'array',
        items: { type: 'string' },
      };
    }

    if (column.default !== undefined) {
      property.default = column.default;
    }

    schema.properties[columnName] = property;

    if (column.notNull && !column.hasDefault) {
      schema.required.push(columnName);
    }
  }

  return {
    name: tableName,
    schema,
  };
}
