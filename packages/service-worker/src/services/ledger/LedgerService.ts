import { OnLock, OnUnlock } from '../../runtime/lifecycleCallbacks';
import { EventEmitter } from 'events';
import { Subject, Subscription } from 'rxjs';
import { singleton } from 'tsyringe';
import { LedgerTransport } from './LedgerTransport';
import {
  LedgerEvent,
  LedgerDeviceRequestData,
  LedgerDeviceResponseData,
} from '@core/types';
import LRU from 'lru-cache';

const ledgerTransportLRUCache = new LRU<string, LedgerTransport>({
  max: 10,
  dispose: (transport) => {
    transport.close();
  },
});

@singleton()
export class LedgerService implements OnLock, OnUnlock {
  private eventEmitter = new EventEmitter();

  private ledgerDeviceRequest$ = new Subject<LedgerDeviceRequestData>();
  private ledgerDeviceResponse$ = new Subject<LedgerDeviceResponseData>();
  private ledgerRequestSubscription?: Subscription;

  onUnlock(): void | Promise<void> {
    this.ledgerRequestSubscription = this.ledgerDeviceRequest$.subscribe(
      (request) => {
        this.eventEmitter.emit(LedgerEvent.TRANSPORT_REQUEST, request);
      },
    );
    /**
     * Request all active frontend LedgerProviders to notify the background after a background script restart.
     */
    this.eventEmitter.emit(LedgerEvent.DISCOVER_TRANSPORTS);
  }

  public getTransport(ledgerTransportUUID: string) {
    return ledgerTransportLRUCache.get(ledgerTransportUUID);
  }

  /**
   * The issue solved here is that when the extnesion itself requests a signer
   * it doesnt care what window is the signer. It cares that the window is still
   * active and able to sign. So we simply grab the most recent transport created
   * and delegate the signing to that window
   */
  public get recentTransport() {
    const mostRecentTransportKey: string = ledgerTransportLRUCache
      .keys()
      .next().value;
    return ledgerTransportLRUCache.peek(mostRecentTransportKey);
  }

  removeTransportFromCache(ledgerTransportUUID: string) {
    ledgerTransportLRUCache.delete(ledgerTransportUUID);
  }

  /**
   * Before a new transport is requested the window requests that all
   * other previously opened transports close if they are claiming interface
   * index 2. We cant know which one that is from the new window or the background
   * so we simply ask all of the open windows to do so.
   *
   * This gets called by the CloseLedgerTransportHandler when a new confirm window
   * is being requested open
   */
  async closeOpenedTransport(currentTransportUUID: string) {
    this.eventEmitter.emit(
      LedgerEvent.TRANSPORT_CLOSE_REQUEST,
      currentTransportUUID,
    );
    /**
     * Avoiding a Possibly race condition here, we are requesting that a window close and simultaneously
     * requesting that another window open. The latter requires that the first has happened since
     * the whole point is to release the claimed interface.
     *
     * We cant simply listen for a response cause another window may not even be open, so we
     * would get stuck in a holding pattern if we did so.
     *
     * I put a setTimeout here but that is shitty. If there is a better way im open though. The
     * issue is all of these windows and events are in separate contexts and thus there is nothing to
     * sync all of this up.
     *
     * One other idea is to check through the background if there is an open window with the claimed interface first.
     * Then if we find that to be true to listen for a response to it being closed. Once the response is received
     * we can close the previous window. Is this worth the tradeoff of a setimeout being removed though?
     */
    return new Promise((res) => setTimeout(() => res(true), 100));
  }

  onLock() {
    ledgerTransportLRUCache.clear();
    this.ledgerRequestSubscription?.unsubscribe();
  }

  initTransport(ledgerTransportUUID: string) {
    if (ledgerTransportLRUCache.get(ledgerTransportUUID)) {
      return;
    }
    ledgerTransportLRUCache.set(
      ledgerTransportUUID,
      new LedgerTransport(
        this.ledgerDeviceRequest$,
        this.ledgerDeviceResponse$,
        ledgerTransportUUID,
      ),
    );
  }

  ledgerResponse(response: LedgerDeviceResponseData) {
    this.ledgerDeviceResponse$.next(response);
  }

  addListener(event: LedgerEvent, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
