import { SchemaMap, SCHEMA_MAP } from './schemaMap';

export const getDataWithSchemaVersion = <T>(key: string, data: T) => {
  if (Array.isArray(data) || !SCHEMA_MAP[key] || data?.['version']) {
    return data;
  }

  return { ...data, version: SCHEMA_MAP[key].latestVersion };
};

export const migrateToLatest = async <T>(
  key: keyof SchemaMap,
  data: T & { version?: number },
  onMigrationApplied?: (data: T) => Promise<void>
): Promise<T> => {
  const currentVersion = Array.isArray(data) ? 1 : data.version ?? 1;
  const schema = SCHEMA_MAP[key] as SchemaMap[keyof SchemaMap] | undefined;

  if (!schema || schema.latestVersion <= currentVersion) {
    return data;
  }

  // just to make sure migrations are piped in the correct order...
  const orderedMigrations = [...schema.migrations]
    .filter(({ version }) => version > currentVersion)
    .sort((a, b) => a.version - b.version);

  const results = await orderedMigrations.reduce<Promise<T>>(
    async (migrationResult, currentMigration) => {
      const result = await migrationResult;

      // safe to break the chain here as the pipe is ordered
      if (currentMigration.version > schema.latestVersion) {
        return result;
      }

      if (currentMigration.migration.previousSchema.validate(result).error) {
        throw new Error(
          `Error while upgrading ${key} to version ${currentMigration.version}`
        );
      }

      return currentMigration.migration.up(result);
    },
    Promise.resolve(
      typeof data === 'object' && !Array.isArray(data) && data !== null
        ? { ...data, version: currentVersion }
        : data
    )
  );

  if (onMigrationApplied) {
    await onMigrationApplied(results);
  }

  return results;
};
