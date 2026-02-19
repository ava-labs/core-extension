import {
  Account,
  ExtensionConnectionEvent,
  TransactionStatusEvents,
  TransactionStatusInfo,
} from '@core/types';

import { measureDuration } from '@core/common';
import { RpcRequest } from '@avalabs/vm-module-types';
import { AccountsService } from '~/services/accounts/AccountsService';

type AnalyticsEventBuilderFn = (
  event: ExtensionConnectionEvent<TransactionStatusInfo>,
) => Promise<{ name: string; properties: Record<string, unknown> } | null>;

export type TransactionStatusEventBuilders = Partial<
  Record<TransactionStatusEvents, AnalyticsEventBuilderFn>
>;

async function getUsedAccount(
  request: RpcRequest,
  accountsService: AccountsService,
): Promise<Account | undefined> {
  const accountContext = request.context?.account;
  const evmAddress =
    accountContext &&
    typeof accountContext === 'object' &&
    'evmAddress' in accountContext &&
    typeof (accountContext as { evmAddress: string }).evmAddress === 'string'
      ? (accountContext as { evmAddress: string }).evmAddress
      : undefined;
  const allAccounts = await accountsService.getAccountList();
  return evmAddress
    ? (allAccounts.find(
        (acc) => acc.addressC?.toLowerCase() === evmAddress.toLowerCase(),
      ) ?? (await accountsService.getActiveAccount()))
    : undefined;
}

export function getAvalancheSendTransactionHandlers(
  accountsService: AccountsService,
): TransactionStatusEventBuilders {
  return {
    [TransactionStatusEvents.PENDING]: async (event) => {
      const { txHash, request } = event.value;
      const { chainId } = request;

      measureDuration(txHash).start();

      const account = await getUsedAccount(request, accountsService);

      return {
        name: 'avalanche_sendTransaction_success',
        properties: { address: account?.addressC ?? '', txHash, chainId },
      };
    },
    [TransactionStatusEvents.REVERTED]: async (event) => {
      const { txHash, request } = event.value;
      const { chainId } = request;

      measureDuration(txHash).end();

      const account = await getUsedAccount(request, accountsService);

      return {
        name: 'avalanche_sendTransaction_failed',
        properties: { address: account?.addressC ?? '', txHash, chainId },
      };
    },
    [TransactionStatusEvents.CONFIRMED]: async (event) => {
      const { txHash, request } = event.value;
      const { chainId } = request;
      const duration = measureDuration(txHash).end();

      const account = await getUsedAccount(request, accountsService);

      return {
        name: 'avalanche_sendTransaction_confirmed',
        properties: {
          address: account?.addressC ?? '',
          txHash,
          chainId,
          duration,
        },
      };
    },
  };
}
