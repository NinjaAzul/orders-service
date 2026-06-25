import { Order } from '../entities/order.entity';

export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY');

export interface CreateOrderItemData {
  productId: number;
  quantity: number;
}

export interface CreateConfirmedOrderData {
  userId: number;
  idempotencyKey?: string;
  items: CreateOrderItemData[];
}

export interface OrdersRepository {
  findById(id: number): Promise<Order | null>;
  findByIdempotencyKey(idempotencyKey: string): Promise<Order | null>;
  createConfirmed(data: CreateConfirmedOrderData): Promise<Order>;
}
