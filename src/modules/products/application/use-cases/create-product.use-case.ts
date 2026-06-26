import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { CacheService } from '../../../../infrastructure/cache/cache.service';
import { AppLoggerService } from '../../../../infrastructure/observability/app-logger.service';
import { TracingService } from '../../../../infrastructure/observability/tracing.service';
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
    private readonly logger: AppLoggerService,
    private readonly tracing: TracingService,
  ) {}

  async execute(input: CreateProductInputData): Promise<Product> {
    return this.tracing.withSpan(
      'usecase.create_product',
      { feature: 'products', operation: 'createProduct' },
      async () => {
        const data = parseWithZod(createProductSchema, input);
        const product = await this.productsRepository.create(data);
        await this.cacheService.invalidateProducts();

        this.logger.info({
          feature: 'products',
          operation: 'createProduct',
          message: 'product created',
          productId: product.id,
          stock: product.stock,
        });

        return product;
      },
    );
  }
}
