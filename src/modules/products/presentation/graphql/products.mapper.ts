import { Product } from '../../domain/entities/product.entity';
import { ProductType } from './products.types';

export function mapProductToType(product: Product): ProductType {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.stock,
    createdAt: product.createdAt.toISOString(),
  };
}
