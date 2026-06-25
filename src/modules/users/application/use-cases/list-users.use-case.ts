import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PageInfo } from '../../../../shared/graphql/pagination.types';
import { parseWithZod } from '../../../../shared/validation/parse-with-zod';
import { User } from '../../domain/entities/user.entity';
import { USERS_REPOSITORY, UsersRepository } from '../../domain/repositories/users.repository';

const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export interface ListUsersResult {
  data: User[];
  pageInfo: PageInfo;
}

@Injectable()
export class ListUsersUseCase {
  constructor(@Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository) {}

  async execute(input: unknown): Promise<ListUsersResult> {
    const pagination = parseWithZod(paginationSchema, input);
    const [data, total] = await Promise.all([
      this.usersRepository.list(pagination),
      this.usersRepository.count(),
    ]);

    return {
      data,
      pageInfo: {
        limit: pagination.limit,
        offset: pagination.offset,
        total,
      },
    };
  }
}
