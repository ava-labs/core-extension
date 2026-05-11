export type RuntimeFragment = {
  file?: string | undefined;
  data?: unknown;
  name?: string | undefined;
  json?: boolean | undefined;
  rawSource?: string | undefined;
  shimRequire?: string | undefined;
};
/**
 * @param {string} KEY
 * @param {readonly RuntimeFragment[]} runtimeModules
 * @returns {string}
 */
export function assembleRuntime(
  KEY: string,
  runtimeModules: readonly RuntimeFragment[],
): string;
/**
 * Prepares the source code for a given module specifier.
 *
 * @param {string} specifier - The module specifier to prepare.
 * @returns {string} The prepared source code.
 */
export function prepareSource(specifier: string): string;
/**
 * Webpack adds a multiline comment in front of every line of the runtime code.
 * They break actually-multiline comments as a result. This is a necessary step
 * to prevent a runtime error in development mode.
 *
 * @param {string} source
 * @returns {string}
 */
export function removeMultilineComments(source: string): string;
