import { Product } from '../../../products/domain/entities/product.entity';
import { User } from '../../../users/domain/entities/user.entity';

export type OrderStatus = 'CONFIRMED' | 'REJECTED';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  total: number;
  idempotencyKey: string | null;
  createdAt: Date;
  user?: User;
  items: OrderItem[];
}
