import { ColumnType, Generated } from 'kysely';

type Timestamp = ColumnType<Date, Date | undefined, never>;
type Numeric = ColumnType<string, number, never>;

export type OrderStatus = 'CONFIRMED' | 'REJECTED';

export interface UserTable {
  id: Generated<number>;
  name: string;
  email: string;
  created_at: Timestamp;
}

export interface ProductTable {
  id: Generated<number>;
  name: string;
  price: Numeric;
  stock: number;
  created_at: Timestamp;
}

export interface OrderTable {
  id: Generated<number>;
  user_id: number;
  status: OrderStatus;
  total: Numeric;
  idempotency_key: string | null;
  created_at: Timestamp;
}

export interface OrderItemTable {
  id: Generated<number>;
  order_id: number;
  product_id: number;
  quantity: number;
  price: Numeric;
  created_at: Timestamp;
}

export interface Database {
  users: UserTable;
  products: ProductTable;
  orders: OrderTable;
  order_items: OrderItemTable;
}
