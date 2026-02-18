import { singleton } from 'tsyringe';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';
import { TransactionStatusEvents } from './events/transactionStatusEvents';
import { ExtensionConnectionEvent, TransactionStatusInfo } from '@core/types';
import { TransactionStatusEventsHandlers } from './handlers/TransactionStatusEventsHandlers';

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
    const handler =
      TransactionStatusEventsHandlers[event.value.method]?.[event.name];

    if (!handler) {
      return;
    }

    const { name, properties } = handler(event);

    if (!name || !properties) {
      return;
    }

    this.analyticsServicePosthog.captureEncryptedEvent({
      name,
      windowId: crypto.randomUUID(),
      properties,
    });
  };
}
