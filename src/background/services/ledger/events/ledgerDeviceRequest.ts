import { map } from 'rxjs';
import { ledgerDeviceRequest$ } from '../ledger';
import { LedgerEvent } from './models';

export function ledgerDeviceRequest() {
  return ledgerDeviceRequest$.pipe(
    map((data: any) => {
      return {
        name: LedgerEvent.TRANSPORT_REQUEST,
        value: data,
      };
    })
  );
}
