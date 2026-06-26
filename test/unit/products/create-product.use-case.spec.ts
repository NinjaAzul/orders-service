import { CacheService } from '../../../src/infrastructure/cache/cache.service';
import { AppLoggerService } from '../../../src/infrastructure/observability/app-logger.service';
import { TracingService } from '../../../src/infrastructure/observability/tracing.service';
import { CreateProductUseCase } from '../../../src/modules/products/application/use-cases/create-product.use-case';
import { Product } from '../../../src/modules/products/domain/entities/product.entity';
import { ProductsRepository } from '../../../src/modules/products/domain/repositories/products.repository';

describe('CreateProductUseCase', () => {
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
  const product: Product = {
    id: 1,
    name: 'Mouse Gamer',
    price: 149.9,
    stock: 25,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  it('creates a product and invalidates product cache', async () => {
    const repository: ProductsRepository = {
      create: jest.fn().mockResolvedValue(product),
      findById: jest.fn(),
      list: jest.fn(),
      count: jest.fn(),
    };
    const cacheService = {
      invalidateProducts: jest.fn(),
    } as unknown as CacheService;
    const useCase = new CreateProductUseCase(repository, cacheService, logger, tracing);

    await expect(
      useCase.execute({ name: 'Mouse Gamer', price: 149.9, stock: 25 }),
    ).resolves.toEqual(product);
    expect(repository.create).toHaveBeenCalledWith({
      name: 'Mouse Gamer',
      price: 149.9,
      stock: 25,
    });
    expect(cacheService.invalidateProducts).toHaveBeenCalledTimes(1);
  });
});
