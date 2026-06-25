import { User } from '../entities/user.entity';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface CreateUserData {
  name: string;
  email: string;
}

export interface Pagination {
  limit: number;
  offset: number;
}

export interface UsersRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  list(pagination: Pagination): Promise<User[]>;
  count(): Promise<number>;
}
