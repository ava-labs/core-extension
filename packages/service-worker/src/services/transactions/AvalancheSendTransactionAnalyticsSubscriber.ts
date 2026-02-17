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
 * Subscribes to transaction status PENDING events and captures
 * avalanche_sendTransaction_success when the pending tx was an avalanche_sendTransaction.
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
    if (event.name !== TransactionStatusEventNames.PENDING) {
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
      name: 'avalanche_sendTransaction_success',
      windowId: crypto.randomUUID(),
      properties: {
        address,
        txHash,
        chainId,
      },
    });
  };
}
