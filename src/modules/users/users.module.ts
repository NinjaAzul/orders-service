import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { USERS_REPOSITORY } from './domain/repositories/users.repository';
import { KyselyUsersRepository } from './infrastructure/repositories/kysely-users.repository';
import { UsersResolver } from './presentation/graphql/users.resolver';

@Module({
  providers: [
    CreateUserUseCase,
    ListUsersUseCase,
    UsersResolver,
    {
      provide: USERS_REPOSITORY,
      useClass: KyselyUsersRepository,
    },
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}
