import { AppLoggerService } from '../../../src/infrastructure/observability/app-logger.service';
import { TracingService } from '../../../src/infrastructure/observability/tracing.service';
import { ConflictError } from '../../../src/shared/errors/conflict-error';
import { CreateUserUseCase } from '../../../src/modules/users/application/use-cases/create-user.use-case';
import { User } from '../../../src/modules/users/domain/entities/user.entity';
import { UsersRepository } from '../../../src/modules/users/domain/repositories/users.repository';

describe('CreateUserUseCase', () => {
  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as AppLoggerService;
  const tracing = {
    withSpan: async <T>(
      _name: string,
      _attributes: Record<string, string | number | boolean | undefined>,
      operation: () => Promise<T>,
    ): Promise<T> => operation(),
  } as TracingService;
  const createdUser: User = {
    id: 1,
    name: 'Erick',
    email: 'erick@example.com',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  it('creates a user when email is available', async () => {
    const repository: UsersRepository = {
      create: jest.fn().mockResolvedValue(createdUser),
      findByEmail: jest.fn().mockResolvedValue(null),
      findById: jest.fn(),
      list: jest.fn(),
      count: jest.fn(),
    };
    const useCase = new CreateUserUseCase(repository, logger, tracing);

    await expect(useCase.execute({ name: 'Erick', email: 'erick@example.com' })).resolves.toEqual(
      createdUser,
    );
  });

  it('rejects duplicated email', async () => {
    const repository: UsersRepository = {
      create: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue(createdUser),
      findById: jest.fn(),
      list: jest.fn(),
      count: jest.fn(),
    };
    const useCase = new CreateUserUseCase(repository, logger, tracing);

    await expect(
      useCase.execute({ name: 'Erick', email: 'erick@example.com' }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
