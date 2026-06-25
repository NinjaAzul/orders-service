import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderItemInput {
  @Field(() => ID)
  productId!: string;

  @Field(() => Int)
  quantity!: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => ID)
  userId!: string;

  @Field(() => [CreateOrderItemInput])
  items!: CreateOrderItemInput[];

  @Field({ nullable: true })
  idempotencyKey?: string;
}
