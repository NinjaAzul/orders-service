import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { CacheService } from '../../../../infrastructure/cache/cache.service';
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
  ) {}

  async execute(input: CreateOrderInputData): Promise<Order> {
    const data = parseWithZod(createOrderSchema, input);

    if (data.idempotencyKey) {
      const existingOrder = await this.ordersRepository.findByIdempotencyKey(data.idempotencyKey);

      if (existingOrder) {
        return existingOrder;
      }
    }

    const user = await this.usersRepository.findById(data.userId);

    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }

    const order = await this.ordersRepository.createConfirmed(data);
    await this.cacheService.invalidateProducts();

    return order;
  }
}
