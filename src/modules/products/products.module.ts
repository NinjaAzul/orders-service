import { Module } from '@nestjs/common';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { FindProductUseCase } from './application/use-cases/find-product.use-case';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { PRODUCTS_REPOSITORY } from './domain/repositories/products.repository';
import { KyselyProductsRepository } from './infrastructure/repositories/kysely-products.repository';
import { ProductsResolver } from './presentation/graphql/products.resolver';

@Module({
  providers: [
    CreateProductUseCase,
    FindProductUseCase,
    ListProductsUseCase,
    ProductsResolver,
    {
      provide: PRODUCTS_REPOSITORY,
      useClass: KyselyProductsRepository,
    },
  ],
  exports: [FindProductUseCase, PRODUCTS_REPOSITORY],
})
export class ProductsModule {}
