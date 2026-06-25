import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PageInfo } from '../../../../shared/graphql/pagination.types';
import { OrderType } from '../../../orders/presentation/graphql/orders.types';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field(() => [OrderType])
  orders!: OrderType[];

  @Field()
  createdAt!: string;
}

@ObjectType('UserConnection')
export class UserConnection {
  @Field(() => [UserType])
  data!: UserType[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;
}
