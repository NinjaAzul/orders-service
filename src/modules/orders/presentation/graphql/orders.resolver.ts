import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { FindOrderUseCase } from '../../application/use-cases/find-order.use-case';
import { CreateOrderInput } from './orders.inputs';
import { mapOrderToType } from './orders.mapper';
import { OrderType } from './orders.types';

@Resolver(() => OrderType)
export class OrdersResolver {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findOrderUseCase: FindOrderUseCase,
  ) {}

  @Query(() => OrderType, { nullable: true })
  async order(@Args('id') id: string): Promise<OrderType | null> {
    const order = await this.findOrderUseCase.execute(Number(id));
    return order ? mapOrderToType(order) : null;
  }

  @Mutation(() => OrderType)
  async createOrder(@Args('input') input: CreateOrderInput): Promise<OrderType> {
    return mapOrderToType(
      await this.createOrderUseCase.execute({
        userId: Number(input.userId),
        idempotencyKey: input.idempotencyKey,
        items: input.items.map((item) => ({
          productId: Number(item.productId),
          quantity: item.quantity,
        })),
      }),
    );
  }
}
