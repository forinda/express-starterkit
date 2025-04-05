import { injectable } from 'inversify';
import { db } from '@/config/database';
import { UserInsertType, users, UserSelectType } from '@/core/db/schema/users';
import { nanoid } from 'nanoid';

@injectable()
export class RegisterUserRepository {
  async execute(
    user: Omit<UserInsertType, 'id' | 'created_at' | 'updated_at'>
  ): Promise<UserSelectType> {
    const [createdUser] = await db
      .insert(users)
      .values({
        ...user,
        id: nanoid(),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    return createdUser;
  }
}
