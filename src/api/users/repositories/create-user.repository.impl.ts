import { CreateUserRepository } from './create-user.repository';
import { Singleton } from '@/core/di/container';
import { db } from '@/core/db';
import { users } from '@/core/db/schema';
import { CreateUserEntity } from '../entities/create-user-entity';
import { nanoid } from 'nanoid';

@Singleton()
export class CreateUserRepositoryImpl implements CreateUserRepository {
  async create(
    user: Omit<CreateUserEntity, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CreateUserEntity> {
    const [createdUser] = await db
      .insert(users)
      .values({
        id: nanoid(),
        name: user.name,
        email: user.email,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    return createdUser;
  }
}
