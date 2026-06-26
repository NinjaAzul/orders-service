import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { AppLoggerService } from '../../../../infrastructure/observability/app-logger.service';
import { TracingService } from '../../../../infrastructure/observability/tracing.service';
import { ConflictError } from '../../../../shared/errors/conflict-error';
import { parseWithZod } from '../../../../shared/validation/parse-with-zod';
import { User } from '../../domain/entities/user.entity';
import { USERS_REPOSITORY, UsersRepository } from '../../domain/repositories/users.repository';

const createUserSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  email: z.email('email must be valid'),
});

export type CreateUserI5nputData = z.infer<typeof createUserSchema>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
    private readonly logger: AppLoggerService,
    private readonly tracing: TracingService,
  ) {}

  async execute(input: CreateUserI5nputData): Promise<User> {
    return this.tracing.withSpan(
      'usecase.create_user',
      { feature: 'users', operation: 'createUser' },
      async () => {
        const data = parseWithZod(createUserSchema, input);
        const existingUser = await this.usersRepository.findByEmail(data.email);

        if (existingUser) {
          this.logger.warn({
            feature: 'users',
            operation: 'createUser',
            message: 'user email already exists',
            errorCode: 'USER_EMAIL_ALREADY_EXISTS',
          });
          throw new ConflictError('User email already exists', 'USER_EMAIL_ALREADY_EXISTS');
        }

        const user = await this.usersRepository.create(data);
        this.logger.info({
          feature: 'users',
          operation: 'createUser',
          message: 'user created',
          userId: user.id,
        });

        return user;
      },
    );
  }
}
