import { map, Subject } from 'rxjs';
import { SendEvent } from './models';

export const sendTxDetails$ = new Subject<any>();

export function sendTxDetailsEvent() {
  return sendTxDetails$.pipe(
    map((value) => ({
      name: SendEvent.TX_DETAILS,
      value,
    }))
  );
}
