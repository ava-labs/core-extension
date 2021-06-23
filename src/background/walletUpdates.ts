import { store } from '@src/store/store';
import { Signal } from 'micro-signals';
import { observe } from 'mobx';
import { PassThrough } from 'stream';
import {
  accountsChangedUpdate,
  unlockStateChangedUpdate,
  chainChangedUpdate,
} from './utils/providerUpdate';

/**
 * Using a signal here so that we bootstrap one observe for each store change. For every conection
 * we provide a create listener to stream function and if there are no listeners then the observes
 * fire into an empty stream. But our max observes is always 1:1.
 *
 * All of the below observes map to events inside of the metamask provider here
 * @link https://github.com/MetaMask/providers/blob/8400d5f65efc9486052ea6742962d6c29a5ed8ca/src/BaseProvider.ts#L189
 *
 */
const signal = new Signal();

observe(store.walletStore, 'accounts', (update) => {
  signal.dispatch(accountsChangedUpdate(update.newValue as string[]));
});

observe(store.extensionStore, 'isUnlocked', (update) => {
  signal.dispatch(
    unlockStateChangedUpdate(
      update.newValue as boolean,
      store.walletStore.accounts
    )
  );
});

observe(store.walletStore, 'addrC', (update) => {
  signal.dispatch(chainChangedUpdate(update.newValue as string));
});

export function createProviderUpdateStream() {
  const stream = new PassThrough({
    objectMode: true,
    destroy() {
      signal.remove(signalListener);
    },
  });

  function signalListener(value) {
    stream.push(value);
  }

  signal.add(signalListener);
  return stream;
}
