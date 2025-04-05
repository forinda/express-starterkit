/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { CreateUserEntity } from '../entities/create-user-entity';

export interface CreateUserRepository {
  create(
    user: Omit<CreateUserEntity, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CreateUserEntity>;
}
