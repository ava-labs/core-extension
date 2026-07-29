const diag = require('./diagnostics');

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
 * Monitors progress along an ordered sequence of steps.
 *
 * A step may carry `:`-separated flags after its name:
 *
 * - `repeats`: the step may be reported more than once without erroring.
 * - `unordered`: the step belongs to a group whose members may be reported in
 *   any order relative to one another. Consecutive `unordered` steps form a
 *   single group; the sequence only advances past the group once every member
 *   has been reported. This exists because bundler hook firing order isn't
 *   guaranteed for some phases (e.g. Rspack can emit runtime requirements for a
 *   chunk before any covered module's source is generated), so requiring a
 *   fixed order between such steps would make the build fail nondeterministically.
 *
 * @param {object} options
 * @param {string[]} options.steps
 * @returns {ProgressAPI}
 */
function progress({ steps }) {
  let cancelled = false;
  /** @type {Error[]} */
  let compilationErrors = [];
  /**
   * @param {Error} e
   */
  const reportError = (e) => {
    if (!cancelled) {
      compilationErrors.push(e);
    }
  };
  const canRepeat = new Set();

  /** @type {{ members: string[]; unordered: boolean }[]} */
  const slots = [];
  /** @type {Map<string, number>} */
  const slotByStep = new Map();

  steps.forEach((step) => {
    const [name, ...flags] = step.split(':');
    if (flags.includes('repeats')) {
      canRepeat.add(name);
    }
    const unordered = flags.includes('unordered');
    const lastSlot = slots[slots.length - 1];
    if (unordered && lastSlot?.unordered) {
      lastSlot.members.push(name);
    } else {
      slots.push({ members: [name], unordered });
    }
    slotByStep.set(name, slots.length - 1);
  });

  let currentSlot = 0;
  const done = new Set();

  /**
   * @param {number} slotIndex
   */
  const describeSlot = (slotIndex) => {
    const slot = slots[slotIndex];
    if (!slot) {
      return String(undefined);
    }
    const pending = slot.members.filter((member) => !done.has(member));
    return (pending.length > 0 ? pending : slot.members).join(' or ');
  };

  const API = {};

  /**
   * Reports progress for the given step.
   *
   * @param {string} step - The step to report progress for.
   */
  API.report = (step) => {
    const slotIndex = slotByStep.get(step);
    const nextSlot = currentSlot + 1;

    if (
      canRepeat.has(step) &&
      done.has(step) &&
      (slotIndex === currentSlot || slotIndex === nextSlot)
    ) {
      diag.rawDebug(4, `  progress  Reporting ${step} again`);
      return;
    }

    if (slotIndex !== nextSlot) {
      reportError(
        Error(
          `LavaMoatPlugin: Progress reported '${step}' but the next step was expected to be '${describeSlot(
            nextSlot,
          )}'`,
        ),
      );
      return;
    }

    done.add(step);
    if (slots[nextSlot].members.every((member) => done.has(member))) {
      diag.rawDebug(
        2,
        `  progress  ${describeSlot(currentSlot)}->${describeSlot(nextSlot)}`,
      );
      currentSlot = nextSlot;
    }
  };
  /**
   * @param {string} query - Step name
   */
  API.is = (query) => {
    const current = describeSlot(currentSlot);
    diag.rawDebug(3, `  progress  Checking (${current}).is(${query})`);
    return slots[currentSlot]?.members.includes(query) ?? false;
  };
  API.get = () => {
    return describeSlot(currentSlot);
  };
  /**
   * @param {string} query - Step name
   */
  API.done = (query) => {
    return done.has(query);
  };
  /**
   * @param {string} query - Step name
   */
  API.assertDone = (query) => {
    if (done.has(query)) {
      return;
    }
    reportError(
      Error(
        `LavaMoatPlugin: Expected '${query}' to be done, but we're at '${describeSlot(
          currentSlot,
        )}'`,
      ),
    );
  };
  /**
   * @param {Error[]} errors
   */
  API.reportErrorsTo = (errors) => {
    errors.push(...compilationErrors);
    compilationErrors = errors;
  };

  API.cancel = () => {
    cancelled = true;
    diag.rawDebug(2, `  progress: build cancelled`);
  };
  API.isCancelled = () => cancelled;

  diag.rawDebug(2, `  progress  ${describeSlot(currentSlot)}`);

  return API;
}

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
const assertFields = (storeObj, fields) => {
  const missingFields = fields.filter((field) => storeObj[field] === undefined);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

module.exports = {
  assertFields,
  progress,
};
