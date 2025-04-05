import {
  GetUsersRepository,
  GetUsersQuery,
  GetUsersResult,
  GetUsersPagination,
} from './get-users.repository';
import { Singleton } from '@/core/di/container';
import { db } from '@/core/db';
import { users } from '@/core/db/schema';
import { GetUsersEntity } from '../entities/get-users-entity';
import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';

@Singleton()
export class GetUsersRepositoryImpl implements GetUsersRepository {
  async findAll(query: GetUsersQuery, pagination: GetUsersPagination): Promise<GetUsersResult> {
    const { sortBy = 'created_at', sortOrder = 'desc', q } = query;
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Build the query
    const baseQuery = db.select().from(users);

    // Apply search filter if provided
    const whereClause = q
      ? or(ilike(users.name, `%${q}%`), ilike(users.email, `%${q}%`))
      : undefined;

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    // Apply sorting and pagination
    const data = await baseQuery
      .where(whereClause)
      .orderBy(sortOrder === 'asc' ? asc(users[sortBy]) : desc(users[sortBy]))
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: Number(count),
      page,
      limit,
      totalPages: Math.ceil(Number(count) / limit),
    };
  }
}
