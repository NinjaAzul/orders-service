import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './database.types';

export const DATABASE = Symbol('DATABASE');

export const databaseProvider = {
  provide: DATABASE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Kysely<Database> => {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');

    return new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString,
          max: 10,
        }),
      }),
    });
  },
};
