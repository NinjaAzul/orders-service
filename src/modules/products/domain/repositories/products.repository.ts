import { Product } from '../entities/product.entity';

export const PRODUCTS_REPOSITORY = Symbol('PRODUCTS_REPOSITORY');

export interface CreateProductData {
  name: string;
  price: number;
  stock: number;
}

export interface Pagination {
  limit: number;
  offset: number;
}

export interface ProductsRepository {
  create(data: CreateProductData): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  list(pagination: Pagination): Promise<Product[]>;
  count(): Promise<number>;
}
