import { Signal, ValueCache } from 'micro-signals';

const networkChanged = new Signal<string | undefined>();
const networkChanges = networkChanged.cache(
  new ValueCache<string | undefined>()
);

// Dispatch immediately so there is at least one item in the signal stream.
networkChanged.dispatch('');

export { networkChanged, networkChanges };
