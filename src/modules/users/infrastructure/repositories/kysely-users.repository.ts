import { Inject, Injectable } from '@nestjs/common';
import { Kysely, Selectable } from 'kysely';
import { DATABASE } from '../../../../infrastructure/database/database.provider';
import { Database, UserTable } from '../../../../infrastructure/database/database.types';
import { User } from '../../domain/entities/user.entity';
import {
  CreateUserData,
  Pagination,
  UsersRepository,
} from '../../domain/repositories/users.repository';

@Injectable()
export class KyselyUsersRepository implements UsersRepository {
  constructor(@Inject(DATABASE) private readonly db: Kysely<Database>) {}

  async create(data: CreateUserData): Promise<User> {
    const user = await this.db
      .insertInto('users')
      .values({
        name: data.name,
        email: data.email,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    return user ? this.toDomain(user) : null;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return user ? this.toDomain(user) : null;
  }

  async list(pagination: Pagination): Promise<User[]> {
    const users = await this.db
      .selectFrom('users')
      .selectAll()
      .orderBy('id', 'asc')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .execute();

    return users.map((user) => this.toDomain(user));
  }

  async count(): Promise<number> {
    const result = await this.db
      .selectFrom('users')
      .select((expressionBuilder) => expressionBuilder.fn.countAll().as('count'))
      .executeTakeFirstOrThrow();

    return Number(result.count);
  }

  private toDomain(user: Selectable<UserTable>): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    };
  }
}
