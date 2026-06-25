import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 20 })
  limit = 20;

  @Field(() => Int, { defaultValue: 0 })
  offset = 0;
}

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  offset!: number;

  @Field(() => Int)
  total!: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pageInfo: PageInfo;
}
