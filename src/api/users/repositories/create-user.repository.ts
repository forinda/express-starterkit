import { CreateUserEntity } from '../entities/create-user-entity';

export interface CreateUserRepository {
  create(
    user: Omit<CreateUserEntity, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CreateUserEntity>;
}
