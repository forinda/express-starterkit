import { CreateUserRepository } from './create-user.repository';
import { Singleton } from '@/core/di/container';
import { db } from '@/db';
import { users } from '@/db/schema';
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
        gender: user.gender,
        password: user.password,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    return createdUser;
  }
}
