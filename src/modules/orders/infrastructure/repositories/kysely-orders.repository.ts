import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { DATABASE } from '../../../../infrastructure/database/database.provider';
import { Database } from '../../../../infrastructure/database/database.types';
import { ConflictError } from '../../../../shared/errors/conflict-error';
import { NotFoundError } from '../../../../shared/errors/not-found-error';
import { Product } from '../../../products/domain/entities/product.entity';
import { Order, OrderItem } from '../../domain/entities/order.entity';
import {
  CreateConfirmedOrderData,
  OrdersRepository,
} from '../../domain/repositories/orders.repository';

interface ProductSnapshot {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
  quantity: number;
}

@Injectable()
export class KyselyOrdersRepository implements OrdersRepository {
  constructor(@Inject(DATABASE) private readonly db: Kysely<Database>) {}

  async findById(id: number): Promise<Order | null> {
    const order = await this.db
      .selectFrom('orders')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!order) {
      return null;
    }

    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', order.user_id)
      .executeTakeFirst();

    const items = await this.db
      .selectFrom('order_items')
      .innerJoin('products', 'products.id', 'order_items.product_id')
      .select([
        'order_items.id as item_id',
        'order_items.product_id as product_id',
        'order_items.quantity as quantity',
        'order_items.price as item_price',
        'products.name as product_name',
        'products.price as product_price',
        'products.stock as product_stock',
        'products.created_at as product_created_at',
      ])
      .where('order_items.order_id', '=', id)
      .orderBy('order_items.id', 'asc')
      .execute();

    return {
      id: order.id,
      userId: order.user_id,
      status: order.status,
      total: Number(order.total),
      idempotencyKey: order.idempotency_key,
      createdAt: order.created_at,
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.created_at,
          }
        : undefined,
      items: items.map((item): OrderItem => {
        const product: Product = {
          id: item.product_id,
          name: item.product_name,
          price: Number(item.product_price),
          stock: item.product_stock,
          createdAt: item.product_created_at,
        };

        return {
          id: item.item_id,
          productId: item.product_id,
          quantity: item.quantity,
          price: Number(item.item_price),
          product,
        };
      }),
    };
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<Order | null> {
    const order = await this.db
      .selectFrom('orders')
      .select(['id'])
      .where('idempotency_key', '=', idempotencyKey)
      .executeTakeFirst();

    return order ? this.findById(order.id) : null;
  }

  async createConfirmed(data: CreateConfirmedOrderData): Promise<Order> {
    const orderId = await this.db.transaction().execute(async (trx) => {
      const productSnapshots: ProductSnapshot[] = [];
      let total = 0;

      for (const item of data.items) {
        const product = await trx
          .selectFrom('products')
          .selectAll()
          .where('id', '=', item.productId)
          .executeTakeFirst();

        if (!product) {
          throw new NotFoundError('Product not found', 'PRODUCT_NOT_FOUND');
        }

        const updatedProduct = await trx
          .updateTable('products')
          .set({
            stock: sql<number>`stock - ${item.quantity}`,
          })
          .where('id', '=', item.productId)
          .where('stock', '>=', item.quantity)
          .returning(['id'])
          .executeTakeFirst();

        if (!updatedProduct) {
          throw new ConflictError('Insufficient stock', 'INSUFFICIENT_STOCK');
        }

        const price = Number(product.price);
        total += price * item.quantity;
        productSnapshots.push({
          id: product.id,
          name: product.name,
          price,
          stock: product.stock,
          createdAt: product.created_at,
          quantity: item.quantity,
        });
      }

      const order = await trx
        .insertInto('orders')
        .values({
          user_id: data.userId,
          status: 'CONFIRMED',
          total,
          idempotency_key: data.idempotencyKey ?? null,
        })
        .returning(['id'])
        .executeTakeFirstOrThrow();

      for (const product of productSnapshots) {
        await trx
          .insertInto('order_items')
          .values({
            order_id: order.id,
            product_id: product.id,
            quantity: product.quantity,
            price: product.price,
          })
          .execute();
      }

      return order.id;
    });

    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order was created but could not be loaded');
    }

    return order;
  }
}
