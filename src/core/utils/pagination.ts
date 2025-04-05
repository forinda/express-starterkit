/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { Request } from 'express';
import { PaginationParams } from '../context/request';

export function extractPaginationParams(query: Request['query']): PaginationParams {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const sort = query.sort as string | undefined;
  const order = (query.order as 'asc' | 'desc') || 'desc';
  delete query.page;
  delete query.limit;
  delete query.sort;
  delete query.order;
  return {
    page,
    limit,
    sort,
    order,
  };
}

export function createPaginationResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationParams
) {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
