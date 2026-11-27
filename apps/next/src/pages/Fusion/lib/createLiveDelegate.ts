const getMemberNames = (value: object) => {
  const names = new Set<string>();
  let current: object | null = value;

  while (current && current !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(current)) {
      if (name !== 'constructor') {
        names.add(name);
      }
    }
    current = Object.getPrototypeOf(current);
  }

  return names;
};

export const getCapabilitySignature = (value: object | null | undefined) =>
  value
    ? [...getMemberNames(value)]
        .filter(
          (name) =>
            typeof (value as Record<string, unknown>)[name] === 'function',
        )
        .sort()
        .join(',')
    : '';

// fusion-sdk spreads initializers, so each method must dereference the latest
// value per call; the method set itself is fixed, so rebuild when it changes.
export const createLiveDelegate = <T extends object>(
  getCurrent: () => T,
): T => {
  const initial = getCurrent();
  const delegate: Record<string, unknown> = {};

  for (const name of getMemberNames(initial)) {
    if (typeof (initial as Record<string, unknown>)[name] === 'function') {
      Object.defineProperty(delegate, name, {
        enumerable: true,
        value: (...args: unknown[]) => {
          const current = getCurrent() as Record<string, unknown>;
          const method = current[name];

          if (typeof method !== 'function') {
            throw new Error(
              `"${name}" is no longer supported by the active wallet.`,
            );
          }

          return Reflect.apply(method, current, args);
        },
      });
    } else {
      Object.defineProperty(delegate, name, {
        enumerable: true,
        get: () => (getCurrent() as Record<string, unknown>)[name],
      });
    }
  }

  return delegate as T;
};
