import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { CacheService } from '../../../../infrastructure/cache/cache.service';
import { PageInfo } from '../../../../shared/graphql/pagination.types';
import { parseWithZod } from '../../../../shared/validation/parse-with-zod';
import { Product } from '../../domain/entities/product.entity';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../../domain/repositories/products.repository';

const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export interface ListProductsResult {
  data: Product[];
  pageInfo: PageInfo;
}

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCTS_REPOSITORY) private readonly productsRepository: ProductsRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(input: unknown): Promise<ListProductsResult> {
    const pagination = parseWithZod(paginationSchema, input);
    const cacheKey = `products:list:limit:${pagination.limit}:offset:${pagination.offset}`;
    const cached = await this.cacheService.getJson<ListProductsResult>(cacheKey);

    if (cached) {
      return {
        data: cached.data.map((product) => ({
          ...product,
          createdAt: new Date(product.createdAt),
        })),
        pageInfo: cached.pageInfo,
      };
    }

    const [data, total] = await Promise.all([
      this.productsRepository.list(pagination),
      this.productsRepository.count(),
    ]);
    const result = {
      data,
      pageInfo: {
        limit: pagination.limit,
        offset: pagination.offset,
        total,
      },
    };

    await this.cacheService.setJson(cacheKey, result);

    return result;
  }
}
