import { GetUsersRepository, SortField, GetUsersQuery } from '../get-users-repository';
import { GetUsersEntity } from '../../entities/get-users-entity';
import { db } from '@/db';
import { users, UserSelectType } from '@/db/schema/users';
import { and, ilike, or, asc, desc, eq, AnyColumn } from 'drizzle-orm';
import { PgSelect, PgSelectBase } from 'drizzle-orm/pg-core';

export class DrizzleGetUsersRepository implements GetUsersRepository {
  async findAll(
    query?: GetUsersQuery,
    pagination?: { page: number; limit: number },
    sort?: SortField[]
  ): Promise<GetUsersEntity[]> {
    const { q, name, email, ...otherFields } = query || {};
    const { page = 1, limit = 10 } = pagination || {};

    let queryBuilder: PgSelect = db.select().from(users) as unknown as PgSelect;

    // Apply search conditions
    const conditions = [];

    if (q) {
      conditions.push(or(ilike(users.name, `%${q}%`), ilike(users.email, `%${q}%`)));
    }

    if (name) {
      conditions.push(ilike(users.name, `%${name}%`));
    }

    if (email) {
      conditions.push(ilike(users.email, `%${email}%`));
    }

    // Apply other fields if they match user columns
    Object.entries(otherFields).forEach(([key, value]) => {
      if (users[key as keyof typeof users]) {
        conditions.push(eq(users[key as keyof UserSelectType], value));
      }
    });

    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions));
    }

    // Apply sorting
    if (sort?.length) {
      const sortFields = sort
        .map(({ field, order }) => {
          const column = users[field as keyof typeof users] as AnyColumn | undefined;
          if (!column) return null;
          return order === 'desc' ? desc(column) : asc(column);
        })
        .filter((field): field is NonNullable<typeof field> => field !== null);

      if (sortFields.length > 0) {
        queryBuilder = queryBuilder.orderBy(...sortFields);
      }
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder = queryBuilder.limit(limit).offset(offset);

    const result = await queryBuilder;
    return result.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    })) as unknown as GetUsersEntity[];
  }
}
