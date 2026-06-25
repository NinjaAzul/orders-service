import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { CacheService } from '../../../../infrastructure/cache/cache.service';
import { parseWithZod } from '../../../../shared/validation/parse-with-zod';
import { Product } from '../../domain/entities/product.entity';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../../domain/repositories/products.repository';

const createProductSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  price: z.number().positive('price must be greater than zero'),
  stock: z.number().int().min(0, 'stock must be greater than or equal to zero'),
});

export type CreateProductInputData = z.infer<typeof createProductSchema>;

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCTS_REPOSITORY) private readonly productsRepository: ProductsRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(input: CreateProductInputData): Promise<Product> {
    const data = parseWithZod(createProductSchema, input);
    const product = await this.productsRepository.create(data);
    await this.cacheService.invalidateProducts();

    return product;
  }
}
