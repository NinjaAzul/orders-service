import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { PageInfo } from '../../../../shared/graphql/pagination.types';

@ObjectType('Product')
export class ProductType {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field(() => Float)
  price!: number;

  @Field(() => Int)
  stock!: number;

  @Field()
  createdAt!: string;
}

@ObjectType('ProductConnection')
export class ProductConnection {
  @Field(() => [ProductType])
  data!: ProductType[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;
}
