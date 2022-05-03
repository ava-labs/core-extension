import {
  ledgerTransport$,
  setLedgerTransport,
} from '@avalabs/wallet-react-components';
import Transport from '@ledgerhq/hw-transport';
import { EventEmitter } from 'events';
import { Subject, Subscription } from 'rxjs';
import { singleton } from 'tsyringe';
import { LockService } from '../lock/LockService';
import { LockEvents } from '../lock/models';
import { LedgerTransport } from './LedgerTransport';
import { DeviceRequestData, DeviceResponseData, LedgerEvent } from './models';

@singleton()
export class LedgerService {
  private eventEmitter = new EventEmitter();

  private _transport?: Transport;
  private ledgerDeviceRequest$ = new Subject<DeviceRequestData>();
  private ledgerDeviceResponse$ = new Subject<DeviceResponseData>();
  private ledgerRequestSubscription?: Subscription;

  public get transport(): Transport | undefined {
    return this._transport;
  }

  constructor(private lockService: LockService) {
    this.lockService.addListener(LockEvents.LOCKED, () => {
      this._transport?.close();
      this._transport = undefined;
      this.ledgerRequestSubscription?.unsubscribe();
    });
  }

  initTransport() {
    if (this._transport) {
      return;
    }

    this._transport = new LedgerTransport(
      this.ledgerDeviceRequest$,
      this.ledgerDeviceResponse$
    );

    this.ledgerRequestSubscription = this.ledgerDeviceRequest$.subscribe(
      (request) => {
        this.eventEmitter.emit(LedgerEvent.TRANSPORT_REQUEST, request);
      }
    );

    setLedgerTransport(this._transport);
  }

  ledgerResponse(response: DeviceResponseData) {
    this.ledgerDeviceResponse$.next(response);
  }

  addListener(event: LedgerEvent, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
