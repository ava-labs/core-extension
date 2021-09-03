import { filter, Observable, tap } from 'rxjs';
import { PostMessageData } from './windowPostMessage';

function isHandshake(val: string) {
  return val === 'SYN' || val === 'ACK';
}

/**
 * This is to fulfil the handshake req of the code we are using from the metamask team. In
 * the window post message connection. The contentscript and the provider communicate bidirectionally
 * through this. Before this communication is allowed the ACK and SYN both have to be fulfilled.
 */
export function providerHandshake(dispatch: (data: any) => void) {
  return (observer: Observable<PostMessageData>) => {
    return observer.pipe(
      tap((evt) => {
        if (isHandshake(evt.data)) {
          dispatch(evt.data);
        }
      }),
      filter((evt) => !isHandshake(evt.data))
    );
  };
}
