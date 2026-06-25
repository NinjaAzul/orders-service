import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { ORDERS_REPOSITORY, OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class FindOrderUseCase {
  constructor(@Inject(ORDERS_REPOSITORY) private readonly ordersRepository: OrdersRepository) {}

  async execute(id: number): Promise<Order | null> {
    return this.ordersRepository.findById(id);
  }
}
