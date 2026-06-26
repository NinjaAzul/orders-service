import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { AppLoggerService } from '../../../../infrastructure/observability/app-logger.service';
import { TracingService } from '../../../../infrastructure/observability/tracing.service';
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
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
    private readonly logger: AppLoggerService,
    private readonly tracing: TracingService,
  ) {}

  async execute(input: unknown): Promise<ListUsersResult> {
    return this.tracing.withSpan(
      'usecase.list_users',
      { feature: 'users', operation: 'users' },
      async () => {
        const pagination = parseWithZod(paginationSchema, input);
        const [data, total] = await Promise.all([
          this.usersRepository.list(pagination),
          this.usersRepository.count(),
        ]);

        this.logger.info({
          feature: 'users',
          operation: 'users',
          message: 'users listed',
          limit: pagination.limit,
          offset: pagination.offset,
          total,
        });

        return {
          data,
          pageInfo: {
            limit: pagination.limit,
            offset: pagination.offset,
            total,
          },
        };
      },
    );
  }
}
