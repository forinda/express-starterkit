import { eq } from 'drizzle-orm';
import { db } from '@/config/database';
import { users, UserSelectType } from '@/db/schema';
import { Singleton } from '@/core/di/container';

@Singleton()
export class FindByIdRepository {
  async execute(id: string): Promise<UserSelectType | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }
}
