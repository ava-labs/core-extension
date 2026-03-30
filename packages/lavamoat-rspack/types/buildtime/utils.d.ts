export type ProgressAPI = {
  /**
   * - Checks if current progress
   * matches expectedStep
   */
  is: (expectedStep: string) => boolean;
  /**
   * - Checks if expectedStep
   * was already reported.
   */
  done: (expectedStep: string) => boolean;
  /**
   * - Reports an error if
   * expectedStep was not already reported.
   */
  assertDone: (expectedStep: string) => void;
  /**
   * - Moves progress forward if step
   * passed is the next step. no-op if current step (reporting progress is
   * idempotent)
   */
  report: (step: string) => void;
  /**
   * - Cancels the progress monitoring.
   */
  cancel: () => void;
  /**
   * - true if progress monitoring was cancelled
   */
  isCancelled: () => boolean;
  /**
   * - Wire up the array to
   * push errors to for compilation. Pass compilation.errors to it as soon as
   * possible.
   */
  reportErrorsTo: (errors: Error[]) => void;
};
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
/**
 * @template T
 * @template {keyof T} K
 * @typedef {T & Required<Pick<T, K>>} RequireFields
 */
/**
 * @template {Record<string, any>} T
 * @template {keyof T} K
 * @param {T} storeObj
 * @param {readonly K[]} fields
 * @returns {asserts storeObj is RequireFields<T, K>}
 */
export function assertFields<T extends Record<string, any>, K extends keyof T>(
  storeObj: T,
  fields: readonly K[],
): asserts storeObj is RequireFields<T, K>;
/**
 * @typedef {object} ProgressAPI
 * @property {(expectedStep: string) => boolean} is - Checks if current progress
 *   matches expectedStep
 * @property {(expectedStep: string) => boolean} done - Checks if expectedStep
 *   was already reported.
 * @property {(expectedStep: string) => void} assertDone - Reports an error if
 *   expectedStep was not already reported.
 * @property {(step: string) => void} report - Moves progress forward if step
 *   passed is the next step. no-op if current step (reporting progress is
 *   idempotent)
 * @property {() => void} cancel - Cancels the progress monitoring.
 * @property {() => boolean} isCancelled - true if progress monitoring was cancelled
 * @property {(errors: Error[]) => void} reportErrorsTo - Wire up the array to
 *   push errors to for compilation. Pass compilation.errors to it as soon as
 *   possible.
 */
/**
 * Monitors progress along a linear sequence of steps.
 *
 * @param {object} options
 * @param {string[]} options.steps
 * @returns {ProgressAPI}
 */
export function progress({ steps }: { steps: string[] }): ProgressAPI;
