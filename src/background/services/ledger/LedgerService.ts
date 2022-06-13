import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { EventEmitter } from 'events';
import { Subject, Subscription } from 'rxjs';
import { singleton } from 'tsyringe';
import { LedgerTransport } from './LedgerTransport';
import { DeviceRequestData, DeviceResponseData, LedgerEvent } from './models';
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

  private ledgerDeviceRequest$ = new Subject<DeviceRequestData>();
  private ledgerDeviceResponse$ = new Subject<DeviceResponseData>();
  private ledgerRequestSubscription?: Subscription;

  constructor() {
    this.ledgerRequestSubscription = this.ledgerDeviceRequest$.subscribe(
      (request) => {
        this.eventEmitter.emit(LedgerEvent.TRANSPORT_REQUEST, request);
      }
    );
  }

  onUnlock(): void | Promise<void> {
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
        ledgerTransportUUID
      )
    );
  }

  ledgerResponse(response: DeviceResponseData) {
    this.ledgerDeviceResponse$.next(response);
  }

  addListener(event: LedgerEvent, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
