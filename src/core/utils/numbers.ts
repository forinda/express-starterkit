/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

export function isNumber(value: unknown): value is number | string {
  if (typeof value === 'number') return true;
  if (typeof value === 'string') {
    return !isNaN(Number(value));
  }
  return false;
}

export function convertToNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = Number(value);
    if (!isNaN(num)) return num;
  }
  throw new Error('Value cannot be converted to a number');
}
