import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '../../../../shared/graphql/pagination.types';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { FindProductUseCase } from '../../application/use-cases/find-product.use-case';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case';
import { CreateProductInput } from './products.inputs';
import { mapProductToType } from './products.mapper';
import { ProductConnection, ProductType } from './products.types';

@Resolver(() => ProductType)
export class ProductsResolver {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly findProductUseCase: FindProductUseCase,
  ) {}

  @Query(() => ProductConnection)
  async products(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<ProductConnection> {
    const result = await this.listProductsUseCase.execute(pagination ?? {});

    return {
      data: result.data.map(mapProductToType),
      pageInfo: result.pageInfo,
    };
  }

  @Query(() => ProductType, { nullable: true })
  async product(@Args('id') id: string): Promise<ProductType> {
    return mapProductToType(await this.findProductUseCase.execute(Number(id)));
  }

  @Mutation(() => ProductType)
  async createProduct(@Args('input') input: CreateProductInput): Promise<ProductType> {
    return mapProductToType(await this.createProductUseCase.execute(input));
  }
}
