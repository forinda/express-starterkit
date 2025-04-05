import { GetUsersEntity } from '../entities/get-users-entity';

export interface GetUsersQuery {
  sortBy?: keyof GetUsersEntity;
  sortOrder?: 'asc' | 'desc';
  q?: string;
}

export interface GetUsersPagination {
  page: number;
  limit: number;
}

export interface GetUsersResult {
  data: GetUsersEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetUsersRepository {
  findAll(query: GetUsersQuery, pagination: GetUsersPagination): Promise<GetUsersResult>;
}
