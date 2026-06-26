import { CacheService } from '../../../src/infrastructure/cache/cache.service';
import { AppLoggerService } from '../../../src/infrastructure/observability/app-logger.service';
import { TracingService } from '../../../src/infrastructure/observability/tracing.service';
import { CreateOrderUseCase } from '../../../src/modules/orders/application/use-cases/create-order.use-case';
import { Order } from '../../../src/modules/orders/domain/entities/order.entity';
import { OrdersRepository } from '../../../src/modules/orders/domain/repositories/orders.repository';
import { User } from '../../../src/modules/users/domain/entities/user.entity';
import { UsersRepository } from '../../../src/modules/users/domain/repositories/users.repository';
import { ConflictError } from '../../../src/shared/errors/conflict-error';
import { ValidationError } from '../../../src/shared/errors/validation-error';

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

  it('rejects order when stock is insufficient', async () => {
    const ordersRepository: OrdersRepository = {
      findById: jest.fn(),
      findByIdempotencyKey: jest.fn().mockResolvedValue(null),
      createConfirmed: jest
        .fn()
        .mockRejectedValue(new ConflictError('Insufficient stock', 'INSUFFICIENT_STOCK')),
    };
    const usersRepository: UsersRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn().mockResolvedValue(user),
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
        idempotencyKey: 'stock-request-1',
        items: [{ productId: 1, quantity: 10 }],
      }),
    ).rejects.toMatchObject({
      message: 'Insufficient stock',
      code: 'INSUFFICIENT_STOCK',
    });
    expect(ordersRepository.createConfirmed).toHaveBeenCalledWith({
      userId: 1,
      idempotencyKey: 'stock-request-1',
      items: [{ productId: 1, quantity: 10 }],
    });
    expect(cacheService.invalidateProducts).not.toHaveBeenCalled();
  });

  it('creates a confirmed order and invalidates product cache', async () => {
    const ordersRepository: OrdersRepository = {
      findById: jest.fn(),
      findByIdempotencyKey: jest.fn().mockResolvedValue(null),
      createConfirmed: jest.fn().mockResolvedValue(order),
    };
    const usersRepository: UsersRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn().mockResolvedValue(user),
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
        idempotencyKey: 'request-2',
        items: [{ productId: 1, quantity: 1 }],
      }),
    ).resolves.toEqual(order);
    expect(usersRepository.findById).toHaveBeenCalledWith(1);
    expect(ordersRepository.createConfirmed).toHaveBeenCalledWith({
      userId: 1,
      idempotencyKey: 'request-2',
      items: [{ productId: 1, quantity: 1 }],
    });
    expect(cacheService.invalidateProducts).toHaveBeenCalledTimes(1);
  });

  it.each([
    {
      description: 'non-positive userId',
      input: {
        userId: 0,
        idempotencyKey: 'request-invalid-user',
        items: [{ productId: 1, quantity: 1 }],
      },
      message: 'userId must be positive',
    },
    {
      description: 'empty items',
      input: {
        userId: 1,
        idempotencyKey: 'request-empty-items',
        items: [],
      },
      message: 'items must contain at least one item',
    },
    {
      description: 'non-positive productId',
      input: {
        userId: 1,
        idempotencyKey: 'request-invalid-product',
        items: [{ productId: 0, quantity: 1 }],
      },
      message: 'productId must be positive',
    },
    {
      description: 'non-positive quantity',
      input: {
        userId: 1,
        idempotencyKey: 'request-invalid-quantity',
        items: [{ productId: 1, quantity: 0 }],
      },
      message: 'quantity must be greater than zero',
    },
    {
      description: 'blank idempotency key',
      input: {
        userId: 1,
        idempotencyKey: '   ',
        items: [{ productId: 1, quantity: 1 }],
      },
      message: 'Too small',
    },
  ])('rejects invalid input: $description', async ({ input, message }) => {
    const ordersRepository: OrdersRepository = {
      findById: jest.fn(),
      findByIdempotencyKey: jest.fn(),
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

    await expect(useCase.execute(input)).rejects.toMatchObject({
      message: expect.stringContaining(message) as string,
      code: 'VALIDATION_ERROR',
    });
    await expect(useCase.execute(input)).rejects.toBeInstanceOf(ValidationError);
    expect(ordersRepository.findByIdempotencyKey).not.toHaveBeenCalled();
    expect(ordersRepository.createConfirmed).not.toHaveBeenCalled();
    expect(usersRepository.findById).not.toHaveBeenCalled();
    expect(cacheService.invalidateProducts).not.toHaveBeenCalled();
  });
});
