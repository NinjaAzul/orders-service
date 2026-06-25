import { Inject, Injectable } from '@nestjs/common';
import { Kysely, Selectable } from 'kysely';
import { DATABASE } from '../../../../infrastructure/database/database.provider';
import { Database, ProductTable } from '../../../../infrastructure/database/database.types';
import { Product } from '../../domain/entities/product.entity';
import {
  CreateProductData,
  Pagination,
  ProductsRepository,
} from '../../domain/repositories/products.repository';

@Injectable()
export class KyselyProductsRepository implements ProductsRepository {
  constructor(@Inject(DATABASE) private readonly db: Kysely<Database>) {}

  async create(data: CreateProductData): Promise<Product> {
    const product = await this.db
      .insertInto('products')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.toDomain(product);
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.db
      .selectFrom('products')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return product ? this.toDomain(product) : null;
  }

  async list(pagination: Pagination): Promise<Product[]> {
    const products = await this.db
      .selectFrom('products')
      .selectAll()
      .orderBy('id', 'asc')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .execute();

    return products.map((product) => this.toDomain(product));
  }

  async count(): Promise<number> {
    const result = await this.db
      .selectFrom('products')
      .select((expressionBuilder) => expressionBuilder.fn.countAll().as('count'))
      .executeTakeFirstOrThrow();

    return Number(result.count);
  }

  private toDomain(product: Selectable<ProductTable>): Product {
    return {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      stock: product.stock,
      createdAt: product.created_at,
    };
  }
}
