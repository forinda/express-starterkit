import { db } from '@/config/database';
import { UserInsertType, users, UserSelectType } from '@/db/schema/users';
import { nanoid } from 'nanoid';
import { Singleton } from '@/core/di/container';

@Singleton()
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
