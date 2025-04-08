import { eq } from 'drizzle-orm';
import { db } from '@/config/database';
import { users, UserSelectType } from '@/db/schema';
import { Singleton } from '@/core/di/container';

@Singleton()
export class FindByEmailRepository {
  async execute(email: string): Promise<UserSelectType | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }
}
