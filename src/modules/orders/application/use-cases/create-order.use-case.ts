import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { CacheService } from '../../../../infrastructure/cache/cache.service';
import { AppLoggerService } from '../../../../infrastructure/observability/app-logger.service';
import { TracingService } from '../../../../infrastructure/observability/tracing.service';
import { NotFoundError } from '../../../../shared/errors/not-found-error';
import { parseWithZod } from '../../../../shared/validation/parse-with-zod';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../../../users/domain/repositories/users.repository';
import { Order } from '../../domain/entities/order.entity';
import { ORDERS_REPOSITORY, OrdersRepository } from '../../domain/repositories/orders.repository';

const createOrderSchema = z.object({
  userId: z.coerce.number().int().positive('userId must be positive'),
  idempotencyKey: z.string().trim().min(1).optional(),
  items: z
    .array(
      z.object({
        productId: z.coerce.number().int().positive('productId must be positive'),
        quantity: z.number().int().positive('quantity must be greater than zero'),
      }),
    )
    .min(1, 'items must contain at least one item'),
});

export type CreateOrderInputData = z.infer<typeof createOrderSchema>;

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY) private readonly ordersRepository: OrdersRepository,
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
    private readonly cacheService: CacheService,
    private readonly logger: AppLoggerService,
    private readonly tracing: TracingService,
  ) {}

  async execute(input: CreateOrderInputData): Promise<Order> {
    return this.tracing.withSpan(
      'usecase.create_order',
      { feature: 'orders', operation: 'createOrder' },
      async () => {
        const data = parseWithZod(createOrderSchema, input);

        this.logger.info({
          feature: 'orders',
          operation: 'createOrder',
          message: 'order creation started',
          userId: data.userId,
          itemsCount: data.items.length,
          hasIdempotencyKey: Boolean(data.idempotencyKey),
        });

        if (data.idempotencyKey) {
          const existingOrder = await this.ordersRepository.findByIdempotencyKey(
            data.idempotencyKey,
          );

          if (existingOrder) {
            this.logger.info({
              feature: 'orders',
              operation: 'createOrder',
              message: 'idempotency key reused',
              orderId: existingOrder.id,
              userId: existingOrder.userId,
            });

            return existingOrder;
          }
        }

        const user = await this.usersRepository.findById(data.userId);

        if (!user) {
          this.logger.warn({
            feature: 'orders',
            operation: 'createOrder',
            message: 'order rejected by missing user',
            errorCode: 'USER_NOT_FOUND',
            userId: data.userId,
          });
          throw new NotFoundError('User not found', 'USER_NOT_FOUND');
        }

        const order = await this.ordersRepository.createConfirmed(data);
        await this.cacheService.invalidateProducts();

        this.logger.info({
          feature: 'orders',
          operation: 'createOrder',
          message: 'order confirmed',
          orderId: order.id,
          userId: order.userId,
          itemsCount: order.items.length,
          total: order.total,
          status: order.status,
        });

        return order;
      },
    );
  }
}
