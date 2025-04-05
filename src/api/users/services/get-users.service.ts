/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { GetUsersEntity } from '../entities/get-users-entity';
import {
  GetUsersRepository,
  GetUsersQuery,
  GetUsersResult,
  GetUsersPagination,
} from '../repositories/get-users.repository';
import { Singleton } from '@/core/di/container';
import { inject } from 'inversify';

export const GetUsersRepositoryToken = Symbol.for('GetUsersRepository');

@Singleton()
export class GetUsersService {
  constructor(
    @inject(GetUsersRepositoryToken)
    private readonly getUsersRepository: GetUsersRepository
  ) {}

  async execute(query: GetUsersQuery, pagination: GetUsersPagination): Promise<GetUsersResult> {
    return this.getUsersRepository.findAll(query, pagination);
  }
}
