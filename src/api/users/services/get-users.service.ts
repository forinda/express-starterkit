/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { GetUsersRepository, SortField, GetUsersQuery } from '../repositories/get-users-repository';
import { GetUsersEntity } from '../entities/get-users-entity';
import { Singleton } from '@/core/di/container';
import { inject } from 'inversify';
import { GetUsersRepositoryImpl } from '../repositories/get-users.repository.impl';

@Singleton()
export class GetUsersService {
  constructor(
    @inject(GetUsersRepositoryImpl)
    private readonly getUsersRepository: GetUsersRepository
  ) {}

  async execute(
    query?: GetUsersQuery,
    pagination?: { page: number; limit: number },
    sort?: SortField[]
  ): Promise<GetUsersEntity[]> {
    return this.getUsersRepository.findAll(query, pagination, sort);
  }
}
