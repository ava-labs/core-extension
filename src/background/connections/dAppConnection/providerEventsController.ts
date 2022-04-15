import { bridgeTransactionsUpdatedEvent } from '@src/background/services/bridge/events/bridgeTransactionsUpdateEvents';
import { bridgeTransferEvent } from '@src/background/services/bridge/events/bridgeTransferEvents';
import { accountsChangedEvents } from '@src/background/services/web3/events/accountsChangedEvent';
import { chainChangedEvents } from '@src/background/services/web3/events/chainChangedEvent';
import { unlockStateChangedEvents } from '@src/background/services/web3/events/unlockStateChangedEvent';
import { INPAGE_PROVIDER } from '@src/common';
import { merge, tap } from 'rxjs';
import { Runtime } from 'webextension-polyfill-ts';

/**
 * All of the below events map to events inside of the metamask provider here
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
export function providerEventsController(connection: Runtime.Port) {
  const connectionDomain =
    connection.sender?.url && new URL(connection.sender?.url || '').hostname;

  return merge(
    accountsChangedEvents(connectionDomain),
    chainChangedEvents(),
    unlockStateChangedEvents(),
    // for CoreX
    bridgeTransferEvent(),
    bridgeTransactionsUpdatedEvent()
  ).pipe(
    tap((evt) => connection.postMessage({ name: INPAGE_PROVIDER, data: evt }))
  );
}
