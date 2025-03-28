import type Joi from 'joi';

export const WALLET_ID = 'migrated-wallet-id';

type Dependencies = [string, unknown][];
type KeysTuple<T extends Dependencies> = { [K in keyof T]: T[K][0] };
type TypesTuple<T extends Dependencies> = { [K in keyof T]: T[K][1] };

export type SimpleMigration<PrevSchema, NewSchema> = {
  previousSchema: Joi.Schema;
  up: (data: PrevSchema) => Promise<NewSchema & { version: number }>;
};

export type MigrationWithDeps<
  PrevSchema,
  NewSchema,
  Deps extends Dependencies,
> = {
  previousSchema: Joi.Schema;
  dependencyKeys: KeysTuple<Deps>;
  up: (
    data: PrevSchema,
    ...dependencies: TypesTuple<Deps>
  ) => Promise<NewSchema & { version: number }>;
};

export type Migration<
  PrevSchema = unknown,
  NewSchema = unknown,
  Deps extends [string, unknown][] = [string, unknown][],
> =
  | SimpleMigration<PrevSchema, NewSchema>
  | MigrationWithDeps<PrevSchema, NewSchema, Deps>;

export type SchemaMap = Record<
  string,
  {
    latestVersion: number;
    migrations: readonly {
      version: number;
      migration: Migration;
    }[];
  }
>;
