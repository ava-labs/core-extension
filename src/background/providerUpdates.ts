import { PassThrough } from 'stream';
import {
  accountsChangedUpdate,
  unlockStateChangedUpdate,
  chainChangedUpdate,
} from './utils/providerUpdate';
import { tap, Subject, firstValueFrom, combineLatest } from 'rxjs';
import { network } from './services/network/network';
import { wallet } from './services/wallet/wallet';

/**
 * Using a signal here so that we bootstrap one observe for each store change. For every conection
 * we provide a create listener to stream function and if there are no listeners then the observes
 * fire into an empty stream. But our max observes is always 1:1.
 *
 * All of the below observes map to events inside of the metamask provider here
 * @link https://github.com/MetaMask/providers/blob/8400d5f65efc9486052ea6742962d6c29a5ed8ca/src/BaseProvider.ts#L189
 *
 * These events are processed inside of middleware @link https://github.com/MetaMask/json-rpc-middleware-stream. Basically, the
 * json-rpc-engine passes the event into the middleware, the middleware checks if the event has an id. If it does not then
 * it grabs the "injected provider" and it dispatches an event on that provider. The provider then has a listener on itself that
 * catches the events, maps them to certain allowed events, those mappings make certain checks and then if all of this checks out
 * the injected provider fires off the right event for the dApp to listen on.
 *
 * For reference both the base provider and the InpageProvider have event mappers, those are local now
 *
 */
const signal = new Subject();

/**
 * Not sure this event works yet lets call this a placeholder
 */
// observe(store.walletStore, 'accounts', (update) => {
//   signal.dispatch(accountsChangedUpdate(update.newValue as string[]));
// });

/**
 * Not sure this event works yet lets call this a placeholder
 */
// observe(store.extensionStore, 'isUnlocked', (update) => {
//   signal.dispatch(
//     unlockStateChangedUpdate(
//       update.newValue as boolean,
//       store.walletStore.accounts
//     )
//   );
// });

// observe(store.walletStore, 'addrC', (update) => {
//   signal.dispatch(chainChangedUpdate(update.newValue as string));
// });

/**
 * We going to need to add a merge here for signal events and fire this when address changes as well
 */
wallet.pipe(
  tap(async (wallet) => {
    const net = await firstValueFrom(network);
    wallet &&
      signal.next(chainChangedUpdate(wallet.getAddressC(), net.chainId));
  })
);

export function createProviderUpdateStream() {
  function signalListener(value) {
    stream.push(value);
  }

  const subscription = signal.subscribe(signalListener);

  const stream = new PassThrough({
    objectMode: true,
    destroy() {
      subscription.unsubscribe();
    },
  });

  return stream;
}
