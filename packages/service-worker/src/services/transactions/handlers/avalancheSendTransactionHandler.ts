import {
  Account,
  ExtensionConnectionEvent,
  NetworkWithCaipId,
  TransactionStatusEvents,
  TransactionStatusInfo,
} from '@core/types';

import { getAddressForChain, measureDuration } from '@core/common';
import { RpcRequest } from '@avalabs/vm-module-types';
import { AccountsService } from '~/services/accounts/AccountsService';
import { NetworkService } from '~/services/network/NetworkService';

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

async function getUsedAccountAddress(
  request: RpcRequest,
  accountsService: AccountsService,
  network?: NetworkWithCaipId,
): Promise<string | undefined> {
  const account = await getUsedAccount(request, accountsService);
  return getAddressForChain(network, account);
}

export function getAvalancheSendTransactionHandlers(
  accountsService: AccountsService,
  networkService: NetworkService,
): TransactionStatusEventBuilders {
  return {
    [TransactionStatusEvents.PENDING]: async (event) => {
      const { txHash, request } = event.value;
      const network = await networkService.getNetwork(request.chainId);

      measureDuration(txHash).start();

      const accountAddress = await getUsedAccountAddress(
        request,
        accountsService,
        network,
      );

      return {
        name: 'avalanche_sendTransaction_success',
        properties: {
          address: accountAddress,
          txHash,
          chainId: network?.chainId,
        },
      };
    },
    [TransactionStatusEvents.REVERTED]: async (event) => {
      const { txHash, request } = event.value;
      const network = await networkService.getNetwork(request.chainId);

      measureDuration(txHash).end();

      const accountAddress = await getUsedAccountAddress(
        request,
        accountsService,
        network,
      );

      return {
        name: 'avalanche_sendTransaction_failed',
        properties: {
          address: accountAddress,
          txHash,
          chainId: network?.chainId,
        },
      };
    },
    [TransactionStatusEvents.CONFIRMED]: async (event) => {
      const { txHash, request } = event.value;
      const network = await networkService.getNetwork(request.chainId);
      const duration = measureDuration(txHash).end();

      const accountAddress = await getUsedAccountAddress(
        request,
        accountsService,
        network,
      );
      return {
        name: 'avalanche_sendTransaction_confirmed',
        properties: {
          address: accountAddress,
          txHash,
          chainId: network?.chainId,
          duration,
        },
      };
    },
  };
}
