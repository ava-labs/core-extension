/**
 * Creates a debug proxy for a target object by replacing all own keys and
 * overshadowing the ones from the prototype chain.
 *
 * @param {any} target - The target object to create a debug proxy for.
 * @param {object} source - The keys to check for in the target object.
 * @param {string} hint - The hint to identify the source of the missing key.
 */
export function debugProxy(target: any, source: object, hint: string): void;
