import { assertPresent } from '@src/utils/assertions';
import { SchemaMap } from './models';
import { SCHEMA_MAP } from './schemaMap';
import { CommonError } from '@src/utils/errors';

export const getDataWithSchemaVersion = <T>(key: string, data: T) => {
  if (Array.isArray(data) || !SCHEMA_MAP[key] || data?.['version']) {
    return data;
  }

  return { ...data, version: SCHEMA_MAP[key].latestVersion };
};

export const migrateToLatest = async <T>(
  key: keyof SchemaMap,
  data: T & { version?: number },
  onMigrationApplied?: (data: unknown) => Promise<void>,
  loadDependency?: (key: string) => Promise<unknown>,
): Promise<T> => {
  const currentVersion = Array.isArray(data) ? 1 : (data.version ?? 1);
  const schema = SCHEMA_MAP[key] as SchemaMap[keyof SchemaMap] | undefined;

  if (!schema || schema.latestVersion <= currentVersion) {
    return data;
  }

  // just to make sure migrations are piped in the correct order...
  const orderedMigrations = [...schema.migrations]
    .filter(({ version }) => version > currentVersion)
    .sort((a, b) => a.version - b.version);

  const results = await orderedMigrations.reduce(
    async (migrationResult, currentMigration) => {
      const result = await migrationResult;

      // safe to break the chain here as the pipe is ordered
      if (currentMigration.version > schema.latestVersion) {
        return result;
      }

      const { error: validationError } =
        currentMigration.migration.previousSchema.validate(result);

      if (validationError) {
        const mismatchingPaths = validationError.details
          .map((d, i) => `${i + 1}: {${d.path}}`)
          .join(' | ');

        throw new Error(
          `Error while upgrading ${key} to version ${currentMigration.version}. Unexpected data types in paths: ${mismatchingPaths}`,
        );
      }

      if ('dependencyKeys' in currentMigration.migration) {
        assertPresent(loadDependency, CommonError.Unknown);

        const dependencies = await Promise.all(
          currentMigration.migration.dependencyKeys.map(loadDependency),
        );

        return currentMigration.migration.up(result, ...dependencies);
      }

      return currentMigration.migration.up(result);
    },
    Promise.resolve(
      typeof data === 'object' && !Array.isArray(data) && data !== null
        ? { ...data, version: currentVersion }
        : data,
    ) as Promise<{ version?: number; [key: PropertyKey]: unknown }>,
  );

  if (onMigrationApplied) {
    await onMigrationApplied(results);
  }

  return results as T;
};
