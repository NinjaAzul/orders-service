import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { FindOrderUseCase } from './application/use-cases/find-order.use-case';
import { ORDERS_REPOSITORY } from './domain/repositories/orders.repository';
import { KyselyOrdersRepository } from './infrastructure/repositories/kysely-orders.repository';
import { OrdersResolver } from './presentation/graphql/orders.resolver';

@Module({
  imports: [UsersModule],
  providers: [
    CreateOrderUseCase,
    FindOrderUseCase,
    OrdersResolver,
    {
      provide: ORDERS_REPOSITORY,
      useClass: KyselyOrdersRepository,
    },
  ],
  exports: [FindOrderUseCase, ORDERS_REPOSITORY],
})
export class OrdersModule {}
