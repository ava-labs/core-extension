import { getDataWithSchemaVersion, migrateToLatest } from './schemaMigrations';

const upToDateKey = 'upToDateKey';
const outDatedKeyWithInvalidSchema = 'outDatedKeyWithInvalidSchema';
const outDatedKeyWithArrayInput = 'outDatedKeyWithArrayInput';
const outDatedKeyWithPrimitiveInput = 'outDatedKeyWithPrimitiveInput';
const outDatedKeyWithCorrectOrder = 'outDatedKeyWithCorrectOrder';
const outDatedKeyWithIncorrectOrder = 'outDatedKeyWithIncorrectOrder';
const outDatedKeyWithIncorrectVersion = 'outDatedKeyWithIncorrectVersion';

const mockJoiSchema = {
  validate: jest.fn(() => ({
    error: undefined,
  })),
};

const MOCK_SCHEMA_MAP = {
  [upToDateKey]: {
    latestVersion: 2,
    migrations: [
      {
        version: 2,
        migration: {
          up: jest.fn(async (data) => ({ ...data, version: 2 })),
          previousSchema: mockJoiSchema,
        },
      },
    ],
  },
  [outDatedKeyWithInvalidSchema]: {
    latestVersion: 2,
    migrations: [
      {
        version: 2,
        migration: {
          up: jest.fn(async (data) => ({ ...data, version: 2 })),
          previousSchema: {
            validate: jest.fn(() => ({ error: 'invalid schema' })),
          },
        },
      },
    ],
  },
  [outDatedKeyWithArrayInput]: {
    latestVersion: 2,
    migrations: [
      {
        version: 2,
        migration: {
          up: jest.fn(async (data) => ({ ...data[0], version: 2 })),
          previousSchema: mockJoiSchema,
        },
      },
    ],
  },
  [outDatedKeyWithPrimitiveInput]: {
    latestVersion: 2,
    migrations: [
      {
        version: 2,
        migration: {
          up: jest.fn(async (data) => ({ data, version: 2 })),
          previousSchema: mockJoiSchema,
        },
      },
    ],
  },
  [outDatedKeyWithCorrectOrder]: {
    latestVersion: 3,
    migrations: [
      {
        version: 2,
        migration: {
          up: jest.fn(async (data) => ({ ...data, version: 2 })),
          previousSchema: mockJoiSchema,
        },
      },
      {
        version: 3,
        migration: {
          up: jest.fn(async (data) => ({ ...data, version: 3 })),
          previousSchema: mockJoiSchema,
        },
      },
    ],
  },
  [outDatedKeyWithIncorrectOrder]: {
    latestVersion: 3,
    migrations: [
      {
        version: 3,
        migration: {
          up: jest.fn(async (data) => ({ ...data, version: 3 })),
          previousSchema: mockJoiSchema,
        },
      },
      {
        version: 2,
        migration: {
          up: jest.fn(async (data) => ({ ...data, version: 2 })),
          previousSchema: mockJoiSchema,
        },
      },
    ],
  },
  [outDatedKeyWithIncorrectVersion]: {
    latestVersion: 3,
    migrations: [
      {
        version: 2,
        migration: {
          up: jest.fn(async (data) => ({ ...data, version: 2 })),
          previousSchema: mockJoiSchema,
        },
      },
      {
        version: 3,
        migration: {
          up: jest.fn(async (data) => ({ ...data, version: 3 })),
          previousSchema: mockJoiSchema,
        },
      },
      {
        version: 4,
        migration: {
          up: jest.fn(async (data) => ({ ...data, version: 4 })),
          previousSchema: mockJoiSchema,
        },
      },
    ],
  },
};

jest.mock('./schemaMap', () => ({
  get SCHEMA_MAP() {
    return MOCK_SCHEMA_MAP;
  },
}));

describe('background/services/storage/migrations/migrations', () => {
  describe('migrateToLatest', () => {
    it('does nothing if schema is missing from the migration map', async () => {
      const data = {
        version: 2,
        foo: 'bar',
      };

      await expect(
        migrateToLatest('missingSchemaKey', data)
      ).resolves.toStrictEqual(data);
    });

    it('does nothing if schema version is up to date', async () => {
      const data = {
        version: 2,
        foo: 'bar',
      };

      const result = await migrateToLatest(upToDateKey, data);
      expect(
        MOCK_SCHEMA_MAP[upToDateKey].migrations[0]?.migration.up
      ).not.toHaveBeenCalled();
      expect(result).toStrictEqual(data);
    });

    it('throws an error if schema validation fails', async () => {
      const data = {
        version: 1,
        foo: 'bar',
      };

      await expect(
        migrateToLatest(outDatedKeyWithInvalidSchema, data)
      ).rejects.toThrowError(
        `Error while upgrading ${outDatedKeyWithInvalidSchema} to version 2`
      );
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithInvalidSchema].migrations[0]?.migration
          .up
      ).not.toHaveBeenCalled();
    });

    it('migrates the schema when the input is an array', async () => {
      const data = [{ foo: 'bar' }];

      const result = await migrateToLatest(outDatedKeyWithArrayInput, data);
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithArrayInput].migrations[0]?.migration.up
      ).toHaveBeenCalledWith(data);
      expect(result).toStrictEqual({ ...data[0], version: 2 });
    });

    it('migrates the schema when the input is a string', async () => {
      const data = 'some-data-string';

      const result = await migrateToLatest(outDatedKeyWithPrimitiveInput, data);
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithPrimitiveInput].migrations[0]?.migration
          .up
      ).toHaveBeenCalledWith(data);
      expect(result).toStrictEqual({ data: 'some-data-string', version: 2 });
    });

    it('migrates the schema when the input is a number', async () => {
      const data = 12341234;

      const result = await migrateToLatest(outDatedKeyWithPrimitiveInput, data);
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithPrimitiveInput].migrations[0]?.migration
          .up
      ).toHaveBeenCalledWith(data);
      expect(result).toStrictEqual({ data: 12341234, version: 2 });
    });
    it('migrates the schema when the input is boolean', async () => {
      const data = false;

      const result = await migrateToLatest(outDatedKeyWithPrimitiveInput, data);
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithPrimitiveInput].migrations[0]?.migration
          .up
      ).toHaveBeenCalledWith(data);
      expect(result).toStrictEqual({ data: false, version: 2 });
    });

    it('migrates the schema when the migration order is correct', async () => {
      const data = {
        version: undefined,
        foo: 'bar',
      };

      const result = await migrateToLatest(outDatedKeyWithCorrectOrder, data);
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithCorrectOrder].migrations[0]?.migration.up
      ).toHaveBeenCalledWith({ ...data, version: 1 });
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithCorrectOrder].migrations[1]?.migration.up
      ).toHaveBeenCalledWith({ ...data, version: 2 });
      expect(result).toStrictEqual({ ...data, version: 3 });
    });

    it('migrates the schema when the migration order is incorrect', async () => {
      const data = {
        version: 1,
        foo: 'bar',
      };

      const result = await migrateToLatest(outDatedKeyWithIncorrectOrder, data);
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithIncorrectOrder].migrations[0]?.migration
          .up
      ).toHaveBeenCalledWith({ ...data, version: 2 });
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithIncorrectOrder].migrations[1]?.migration
          .up
      ).toHaveBeenCalledWith({ ...data, version: 1 });
      expect(result).toStrictEqual({ ...data, version: 3 });
    });

    it('migrates the schema no further than the pre-defined latest version', async () => {
      const data = {
        version: 1,
        foo: 'bar',
      };

      const result = await migrateToLatest(
        outDatedKeyWithIncorrectVersion,
        data
      );
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithIncorrectVersion].migrations[0]
          ?.migration.up
      ).toHaveBeenCalledWith({ ...data, version: 1 });
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithIncorrectVersion].migrations[1]
          ?.migration.up
      ).toHaveBeenCalledWith({ ...data, version: 2 });
      expect(
        MOCK_SCHEMA_MAP[outDatedKeyWithIncorrectVersion].migrations[2]
          ?.migration.up
      ).not.toHaveBeenCalled();
      expect(result).toStrictEqual({ ...data, version: 3 });
    });

    it('invokes the callback if provided', async () => {
      const callback = jest.fn();
      const data = {
        version: undefined,
        foo: 'bar',
      };

      await migrateToLatest(outDatedKeyWithCorrectOrder, data, callback);
      expect(callback).toHaveBeenCalledWith({ ...data, version: 3 });
    });
  });

  describe('getDataWithSchemaVersion', () => {
    it('does nothing if the input is an array', () => {
      const data = [1, 2, 3];

      expect(
        getDataWithSchemaVersion(outDatedKeyWithCorrectOrder, data)
      ).toStrictEqual(data);
    });

    it('does nothing if schema is missing from the migration map', () => {
      const data = {
        foo: 'bar',
      };

      expect(getDataWithSchemaVersion('missingSchemaKey', data)).toStrictEqual(
        data
      );
    });

    it('does nothing if the input has a version property', () => {
      const data = {
        foo: 'bar',
        version: 1,
      };

      expect(
        getDataWithSchemaVersion(outDatedKeyWithCorrectOrder, data)
      ).toStrictEqual(data);
    });

    it('sets the version property correctly', () => {
      const data = {
        foo: 'bar',
      };

      expect(
        getDataWithSchemaVersion(outDatedKeyWithCorrectOrder, data)
      ).toStrictEqual({
        ...data,
        version: MOCK_SCHEMA_MAP[outDatedKeyWithCorrectOrder].latestVersion,
      });
    });
  });
});
