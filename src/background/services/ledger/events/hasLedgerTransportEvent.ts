import { map } from 'rxjs';
import { ledgerTransport$ } from '@avalabs/wallet-react-components';
import { LedgerEvent } from './models';

export function hasLedgerTransportEvent() {
  return ledgerTransport$.pipe(
    map((transport) => {
      return {
        name: LedgerEvent.HAS_TRANSPORT,
        value: !!transport,
      };
    })
  );
}
