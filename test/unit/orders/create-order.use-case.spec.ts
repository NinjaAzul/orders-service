import { CacheService } from '../../../src/infrastructure/cache/cache.service';
import { AppLoggerService } from '../../../src/infrastructure/observability/app-logger.service';
import { TracingService } from '../../../src/infrastructure/observability/tracing.service';
import { CreateOrderUseCase } from '../../../src/modules/orders/application/use-cases/create-order.use-case';
import { Order } from '../../../src/modules/orders/domain/entities/order.entity';
import { OrdersRepository } from '../../../src/modules/orders/domain/repositories/orders.repository';
import { User } from '../../../src/modules/users/domain/entities/user.entity';
import { UsersRepository } from '../../../src/modules/users/domain/repositories/users.repository';

describe('CreateOrderUseCase', () => {
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
  const user: User = {
    id: 1,
    name: 'Erick',
    email: 'erick@example.com',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };
  const order: Order = {
    id: 10,
    userId: 1,
    status: 'CONFIRMED',
    total: 20,
    idempotencyKey: 'request-1',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    user,
    items: [],
  };

  it('returns existing order when idempotency key was already processed', async () => {
    const ordersRepository: OrdersRepository = {
      findById: jest.fn(),
      findByIdempotencyKey: jest.fn().mockResolvedValue(order),
      createConfirmed: jest.fn(),
    };
    const usersRepository: UsersRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      list: jest.fn(),
      count: jest.fn(),
    };
    const cacheService = {
      invalidateProducts: jest.fn(),
    } as unknown as CacheService;
    const useCase = new CreateOrderUseCase(
      ordersRepository,
      usersRepository,
      cacheService,
      logger,
      tracing,
    );

    await expect(
      useCase.execute({
        userId: 1,
        idempotencyKey: 'request-1',
        items: [{ productId: 1, quantity: 1 }],
      }),
    ).resolves.toEqual(order);
    expect(ordersRepository.createConfirmed).not.toHaveBeenCalled();
  });
});
