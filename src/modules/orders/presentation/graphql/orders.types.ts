import { Field, Float, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ProductType } from '../../../products/presentation/graphql/products.types';
import { UserType } from '../../../users/presentation/graphql/users.types';

export enum OrderStatusType {
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
}

registerEnumType(OrderStatusType, {
  name: 'OrderStatus',
});

@ObjectType('OrderItem')
export class OrderItemType {
  @Field(() => ID)
  id!: number;

  @Field(() => ProductType)
  product!: ProductType;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Float)
  price!: number;
}

@ObjectType('Order')
export class OrderType {
  @Field(() => ID)
  id!: number;

  @Field(() => UserType)
  user!: UserType;

  @Field(() => [OrderItemType])
  items!: OrderItemType[];

  @Field(() => OrderStatusType)
  status!: OrderStatusType;

  @Field(() => Float)
  total!: number;

  @Field()
  createdAt!: string;
}
