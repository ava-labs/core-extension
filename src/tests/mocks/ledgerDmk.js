/**
 * `@ledgerhq/device-management-kit` and `@ledgerhq/device-transport-kit-web-hid`
 * ship an ESM-only `exports` map (no `require`/`default` condition), so Jest's
 * CJS resolver cannot load them, and `@avalabs/core-wallets-sdk` reads DMK
 * enums (e.g. `DeviceModelId`, `DeviceActionStatus`) at module-init time.
 *
 * `LedgerDmkService`'s methods and the SDK's Ledger signers are mocked in the
 * suites that exercise them, so these stubs only need to let the module graph
 * load. A recursive proxy answers any value import (builders, factories, enum
 * members) with a callable/constructable stub.
 */
const cache = new Map();

const makeStub = (key) => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const fn = function () {
    return proxy;
  };

  const proxy = new Proxy(fn, {
    get: (target, prop) => {
      if (prop === Symbol.toPrimitive) {
        return () => key;
      }
      if (prop === 'toString' || prop === 'valueOf') {
        return () => key;
      }
      if (typeof prop === 'symbol') {
        return target[prop];
      }
      if (prop === 'build') {
        return () => ({});
      }
      if (prop === 'addTransport') {
        return () => proxy;
      }
      return makeStub(`${key}.${prop}`);
    },
    apply: () => proxy,
    construct: () => proxy,
  });

  cache.set(key, proxy);
  return proxy;
};

module.exports = new Proxy(
  {},
  {
    get: (_target, prop) =>
      typeof prop === 'symbol' ? undefined : makeStub(prop),
  },
);
