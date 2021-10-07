import { SendSubmitResponse } from '@avalabs/wallet-react-components';
import { sendTxUpdatedEventListener } from '@src/background/services/send/events/listeners';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useEffect, useState } from 'react';
import { filter } from 'rxjs';

/**
 * {activeTxIndex: 0}
 * This means the tx for this has begun
 *
 * {activeTxIndex: 0, complete: true, txId: ''}
 * This means that that tx has completed
 *
 * {txId: ''}
 * This is all steps are complete and this is the final hash
 *
 */
export function useGetSendTxDetails() {
  const { events } = useConnectionContext();
  const [details, setDetails] = useState<SendSubmitResponse>();

  useEffect(() => {
    if (!events) {
      return;
    }

    const subscription = events()
      .pipe(filter(sendTxUpdatedEventListener))
      .subscribe((evt) => {
        setDetails(evt.value);
      });

    return () => subscription.unsubscribe();
  }, [events]);

  return details;
}
