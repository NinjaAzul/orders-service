import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '../../../../shared/graphql/pagination.types';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { User } from '../../domain/entities/user.entity';
import { CreateUserInput } from './users.inputs';
import { UserConnection, UserType } from './users.types';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) {}

  @Query(() => UserConnection)
  async users(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<UserConnection> {
    const result = await this.listUsersUseCase.execute(pagination ?? {});

    return {
      data: result.data.map(mapUserToType),
      pageInfo: result.pageInfo,
    };
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserType> {
    return mapUserToType(await this.createUserUseCase.execute(input));
  }
}

export function mapUserToType(user: User): UserType {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    orders: [],
    createdAt: user.createdAt.toISOString(),
  };
}
