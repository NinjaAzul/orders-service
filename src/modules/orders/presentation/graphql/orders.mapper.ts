import { mapProductToType } from '../../../products/presentation/graphql/products.mapper';
import { mapUserToType } from '../../../users/presentation/graphql/users.resolver';
import { Order } from '../../domain/entities/order.entity';
import { OrderItemType, OrderStatusType, OrderType } from './orders.types';

export function mapOrderToType(order: Order): OrderType {
  return {
    id: order.id,
    user: order.user
      ? mapUserToType(order.user)
      : {
          id: order.userId,
          name: '',
          email: '',
          orders: [],
          createdAt: '',
        },
    items: order.items.map((item): OrderItemType => {
      if (!item.product) {
        throw new Error('Order item product was not loaded');
      }

      return {
        id: item.id,
        product: mapProductToType(item.product),
        quantity: item.quantity,
        price: item.price,
      };
    }),
    status: OrderStatusType[order.status],
    total: order.total,
    createdAt: order.createdAt.toISOString(),
  };
}
