import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ConflictError } from '../../../../shared/errors/conflict-error';
import { parseWithZod } from '../../../../shared/validation/parse-with-zod';
import { User } from '../../domain/entities/user.entity';
import { USERS_REPOSITORY, UsersRepository } from '../../domain/repositories/users.repository';

const createUserSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  email: z.email('email must be valid'),
});

export type CreateUserInputData = z.infer<typeof createUserSchema>;

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository) {}

  async execute(input: CreateUserInputData): Promise<User> {
    const data = parseWithZod(createUserSchema, input);
    const existingUser = await this.usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError('User email already exists', 'USER_EMAIL_ALREADY_EXISTS');
    }

    return this.usersRepository.create(data);
  }
}
