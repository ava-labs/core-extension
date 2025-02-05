import { singleton } from 'tsyringe';
import type { Subscription } from 'rxjs';
import { filter, firstValueFrom, map, Subject } from 'rxjs';
import EventEmitter from 'events';
import type {
  CBOR,
  DeviceRequestData,
  DeviceResponseData,
  KeystoneTransport,
} from './models';
import { KeystoneEvent } from './models';
import type { OnUnlock } from '@src/background/runtime/lifecycleCallbacks';

@singleton()
export class KeystoneService implements KeystoneTransport, OnUnlock {
  private eventEmitter = new EventEmitter();

  private keystoneDeviceRequest$ = new Subject<DeviceRequestData>();
  private keystoneDeviceResponse$ = new Subject<DeviceResponseData>();
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

  public submitSignatureResponse(response: DeviceResponseData) {
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
        map((response: DeviceResponseData) => {
          return Buffer.from(response.cbor, 'hex');
        }),
      ),
    );
  }

  addListener(event: KeystoneEvent, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
