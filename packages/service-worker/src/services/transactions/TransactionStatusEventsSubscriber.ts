import { singleton } from 'tsyringe';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';
import { TransactionStatusEvents } from './events/transactionStatusEvents';
import { avalancheSendTransactionHandler } from './handlers/avalancheSendTransactionHandler';
import { ExtensionConnectionEvent, TransactionStatusInfo } from '@core/types';

/**
 * Subscribes to transaction status events and captures analytics
 */
@singleton()
export class TransactionStatusEventsSubscriber {
  constructor(
    private transactionStatusEvents: TransactionStatusEvents,
    private analyticsServicePosthog: AnalyticsServicePosthog,
  ) {
    this.transactionStatusEvents.addListener(this.#onTransactionStatusEvent);
  }

  #onTransactionStatusEvent = async (
    event: ExtensionConnectionEvent<TransactionStatusInfo>,
  ) => {
    avalancheSendTransactionHandler({
      analyticsServicePosthog: this.analyticsServicePosthog,
      event,
    });
  };
}
