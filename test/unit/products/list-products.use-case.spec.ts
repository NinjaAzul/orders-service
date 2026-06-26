import { CacheService } from '../../../src/infrastructure/cache/cache.service';
import { AppLoggerService } from '../../../src/infrastructure/observability/app-logger.service';
import { TracingService } from '../../../src/infrastructure/observability/tracing.service';
import { ListProductsUseCase } from '../../../src/modules/products/application/use-cases/list-products.use-case';
import { Product } from '../../../src/modules/products/domain/entities/product.entity';
import { ProductsRepository } from '../../../src/modules/products/domain/repositories/products.repository';

describe('ListProductsUseCase', () => {
  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as AppLoggerService;
  const tracing = {
    withSpan: async <T>(
      _name: string,
      _attributes: Record<string, string | number | boolean | undefined>,
      operation: () => Promise<T>,
    ): Promise<T> => operation(),
  } as TracingService;
  const products: Product[] = [
    {
      id: 1,
      name: 'Mouse Gamer',
      price: 149.9,
      stock: 25,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    },
  ];

  it('lists products from database and stores result in cache', async () => {
    const repository: ProductsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      list: jest.fn().mockResolvedValue(products),
      count: jest.fn().mockResolvedValue(1),
    };
    const cacheService = {
      getJson: jest.fn().mockResolvedValue(null),
      setJson: jest.fn(),
    } as unknown as CacheService;
    const useCase = new ListProductsUseCase(repository, cacheService, logger, tracing);

    await expect(useCase.execute({ limit: 10, offset: 0 })).resolves.toEqual({
      data: products,
      pageInfo: {
        limit: 10,
        offset: 0,
        total: 1,
      },
    });
    expect(repository.list).toHaveBeenCalledWith({ limit: 10, offset: 0 });
    expect(repository.count).toHaveBeenCalledTimes(1);
    expect(cacheService.setJson).toHaveBeenCalledWith('products:list:limit:10:offset:0', {
      data: products,
      pageInfo: {
        limit: 10,
        offset: 0,
        total: 1,
      },
    });
  });

  it('lists products from cache when available', async () => {
    const repository: ProductsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      list: jest.fn(),
      count: jest.fn(),
    };
    const cacheService = {
      getJson: jest.fn().mockResolvedValue({
        data: products.map((product) => ({
          ...product,
          createdAt: product.createdAt.toISOString(),
        })),
        pageInfo: {
          limit: 20,
          offset: 0,
          total: 1,
        },
      }),
      setJson: jest.fn(),
    } as unknown as CacheService;
    const useCase = new ListProductsUseCase(repository, cacheService, logger, tracing);

    const result = await useCase.execute({});

    expect(result).toEqual({
      data: products,
      pageInfo: {
        limit: 20,
        offset: 0,
        total: 1,
      },
    });
    expect(repository.list).not.toHaveBeenCalled();
    expect(repository.count).not.toHaveBeenCalled();
    expect(cacheService.setJson).not.toHaveBeenCalled();
  });
});
