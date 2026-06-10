/**
 * Jest stub for `@avalabs/crypto-wasm`.
 *
 * The real package ships an Emscripten-generated bundle (`dist/crypto.js`) that
 * relies on `import.meta`, which Jest cannot parse when the module is loaded
 * through CommonJS `require`. The WASM-backed address derivation is never
 * exercised in unit tests (callers mock the higher-level modules), so we route
 * the import to this no-op stub that mirrors the public API surface.
 */

const MAX_BATCH_SIZE = 1024;

const init = () => Promise.resolve();
const deriveAddressesFromXpubs = () => Promise.resolve([]);
const deriveAddressesForEvm = () => Promise.resolve([]);
const deriveAddressesForSvm = () => Promise.resolve([]);
const deriveAddressesForBtc = () => Promise.resolve([]);
const deriveAddressesForAvalanche = () => Promise.resolve([]);

module.exports = {
  MAX_BATCH_SIZE,
  init,
  deriveAddressesFromXpubs,
  deriveAddressesForEvm,
  deriveAddressesForSvm,
  deriveAddressesForBtc,
  deriveAddressesForAvalanche,
};
