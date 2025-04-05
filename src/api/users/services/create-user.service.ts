/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { inject } from 'inversify';
import { CreateUserRepository } from '../repositories/create-user-repository';
import { Singleton } from '@/core/di/container';
import { CreateUserEntity } from '../entities/create-user-entity';

export const CreateUserRepositoryToken = Symbol.for('CreateUserRepository');

@Singleton()
export class CreateUserService {
  constructor(
    @inject(CreateUserRepositoryToken)
    private readonly createUserRepository: CreateUserRepository
  ) {}

  async execute(
    userData: Omit<CreateUserEntity, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CreateUserEntity> {
    return this.createUserRepository.create(userData);
  }
}
