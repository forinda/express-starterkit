import { GetUsersEntity } from '../entities/get-users-entity';

export interface GetUsersRepository {
  findAll(): Promise<GetUsersEntity[]>;
}
