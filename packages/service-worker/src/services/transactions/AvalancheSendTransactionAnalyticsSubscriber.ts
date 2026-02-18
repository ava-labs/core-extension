import { RpcMethod } from '@avalabs/vm-module-types';
import { singleton } from 'tsyringe';
import {
  ExtensionConnectionEvent,
  TransactionStatusEvents as TransactionStatusEventNames,
} from '@core/types';
import { getAddressForChain } from '@core/common';

import { AccountsService } from '../accounts/AccountsService';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';
import { NetworkService } from '../network/NetworkService';
import { TransactionStatusEvents } from './events/transactionStatusEvents';

/**
 * Subscribes to transaction status events and captures analytics for
 * avalanche_sendTransaction: success on PENDING, failed on REVERTED.
 */
@singleton()
export class AvalancheSendTransactionAnalyticsSubscriber {
  constructor(
    private transactionStatusEvents: TransactionStatusEvents,
    private analyticsServicePosthog: AnalyticsServicePosthog,
    private accountsService: AccountsService,
    private networkService: NetworkService,
  ) {
    this.transactionStatusEvents.addListener(this.#onTransactionStatusEvent);
  }

  #onTransactionStatusEvent = async (
    event: ExtensionConnectionEvent<{
      txHash: string;
      chainId: string;
      context?: Record<string, unknown>;
    }>,
  ) => {
    const eventName =
      event.name === TransactionStatusEventNames.PENDING
        ? 'avalanche_sendTransaction_success'
        : event.name === TransactionStatusEventNames.REVERTED
          ? 'avalanche_sendTransaction_failed'
          : null;

    if (!eventName) {
      return;
    }

    const { value } = event;
    if (!value?.context) {
      return;
    }

    const method = value.context.method as string | undefined;
    if (method !== RpcMethod.AVALANCHE_SEND_TRANSACTION) {
      return;
    }

    const { txHash, chainId } = value;
    const network = await this.networkService.getNetwork(chainId);
    const activeAccount = await this.accountsService.getActiveAccount();
    const address = getAddressForChain(network, activeAccount);

    if (!address) {
      return;
    }

    this.analyticsServicePosthog.captureEncryptedEvent({
      name: eventName,
      windowId: crypto.randomUUID(),
      properties: {
        address,
        txHash,
        chainId,
      },
    });
  };
}
