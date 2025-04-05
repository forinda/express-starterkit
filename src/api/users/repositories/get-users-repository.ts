import { GetUsersEntity } from '../entities/get-users-entity';

export interface SortField {
  field: string;
  order: 'asc' | 'desc';
}

export interface GetUsersQuery {
  q?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

export interface GetUsersRepository {
  findAll(
    query?: GetUsersQuery,
    pagination?: { page: number; limit: number },
    sort?: SortField[]
  ): Promise<GetUsersEntity[]>;
}
