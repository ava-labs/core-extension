import { singleton } from 'tsyringe';
import { filter, firstValueFrom, map, Subject, Subscription } from 'rxjs';
import EventEmitter from 'events';
import {
  CBOR,
  KeystoneDeviceRequestData,
  KeystoneDeviceResponseData,
  KeystoneEvent,
  KeystoneTransport,
} from '@core/types';
import { OnUnlock } from '../../runtime/lifecycleCallbacks';

@singleton()
export class KeystoneService implements KeystoneTransport, OnUnlock {
  private eventEmitter = new EventEmitter();

  private keystoneDeviceRequest$ = new Subject<KeystoneDeviceRequestData>();
  private keystoneDeviceResponse$ = new Subject<KeystoneDeviceResponseData>();
  private keystoneRequestSubscription?: Subscription;

  onUnlock() {
    this.keystoneRequestSubscription = this.keystoneDeviceRequest$.subscribe(
      (request) => {
        this.eventEmitter.emit(KeystoneEvent.DEVICE_REQUEST, request);
      },
    );
  }

  onLock() {
    this.keystoneRequestSubscription?.unsubscribe();
  }

  public submitSignatureResponse(response: KeystoneDeviceResponseData) {
    this.keystoneDeviceResponse$.next(response);
  }

  public async requestSignature(cbor: CBOR, tabId?: number): Promise<Buffer> {
    const requestId = crypto.randomUUID();

    // Trigger the Keystone approval overlay
    this.keystoneDeviceRequest$.next({
      requestId,
      tabId,
      ...cbor,
    });

    // Wait for the user to scan the signature QR code displayed on their device.
    return firstValueFrom(
      this.keystoneDeviceResponse$.pipe(
        filter((response) => response.requestId === requestId),
        map((response: KeystoneDeviceResponseData) => {
          return Buffer.from(response.cbor, 'hex');
        }),
      ),
    );
  }

  addListener(event: KeystoneEvent, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
