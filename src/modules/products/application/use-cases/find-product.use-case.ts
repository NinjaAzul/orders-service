import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../../shared/errors/not-found-error';
import { Product } from '../../domain/entities/product.entity';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../../domain/repositories/products.repository';

@Injectable()
export class FindProductUseCase {
  constructor(
    @Inject(PRODUCTS_REPOSITORY) private readonly productsRepository: ProductsRepository,
  ) {}

  async execute(id: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError('Product not found', 'PRODUCT_NOT_FOUND');
    }

    return product;
  }
}
