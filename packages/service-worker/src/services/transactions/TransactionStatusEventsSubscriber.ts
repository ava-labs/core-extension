import { RpcMethod } from '@avalabs/vm-module-types';
import { singleton } from 'tsyringe';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';
import { AccountsService } from '../accounts/AccountsService';
import { TransactionStatusEvents } from './events/transactionStatusEvents';
import { ExtensionConnectionEvent, TransactionStatusInfo } from '@core/types';
import {
  getAvalancheSendTransactionHandlers,
  TransactionStatusEventBuilders,
} from './handlers/avalancheSendTransactionHandler';

/**
 * Subscribes to transaction status events and captures analytics
 */
@singleton()
export class TransactionStatusEventsSubscriber {
  #handlers: Partial<Record<string, TransactionStatusEventBuilders>>;

  constructor(
    private transactionStatusEvents: TransactionStatusEvents,
    private analyticsServicePosthog: AnalyticsServicePosthog,
    accountsService: AccountsService,
  ) {
    this.#handlers = {
      [RpcMethod.AVALANCHE_SEND_TRANSACTION]:
        getAvalancheSendTransactionHandlers(accountsService),
    };
    this.transactionStatusEvents.addListener(this.#onTransactionStatusEvent);
  }

  #onTransactionStatusEvent = async (
    event: ExtensionConnectionEvent<TransactionStatusInfo>,
  ) => {
    const handler = this.#handlers[event.value.request.method]?.[event.name];

    if (!handler) {
      return;
    }

    const result = await handler(event);

    if (!result) {
      return;
    }

    this.analyticsServicePosthog.captureEncryptedEvent({
      name: result.name,
      windowId: crypto.randomUUID(),
      properties: result.properties,
    });
  };
}
