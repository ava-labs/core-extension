import { singleton } from 'tsyringe';
import {
  NetworkVMType,
  type NetworkContractToken,
} from '@avalabs/core-chains-sdk';
import { NetworkWithCaipId, TxHistoryItem } from '@core/types';
import { ModuleManager } from '../../vmModules/ModuleManager';
import { AccountsService } from '../accounts/AccountsService';
import {
  TokenType,
  type SPLToken,
  type Transaction,
} from '@avalabs/vm-module-types';
import { UnifiedBridgeService } from '../unifiedBridge/UnifiedBridgeService';
import { resolve } from '@core/common';
import { Monitoring } from '@core/common';
import { AnalyzeTxParams } from '@avalabs/bridge-unified';
import { BalanceAggregatorService } from '../balances/BalanceAggregatorService';

@singleton()
export class HistoryService {
  constructor(
    private moduleManager: ModuleManager,
    private accountsService: AccountsService,
    private unifiedBridgeService: UnifiedBridgeService,
    private balanceAggregatorService: BalanceAggregatorService,
  ) {}

  async getTxHistory(
    network: NetworkWithCaipId,
    otherAddress?: string,
  ): Promise<TxHistoryItem[]> {
    const address = otherAddress ?? (await this.#getAddress(network));

    if (!address) {
      return [];
    }

    const [module] = await resolve(
      this.moduleManager.loadModuleByNetwork(network),
    );

    if (!module) {
      Monitoring.sentryCaptureException(
        new Error(
          `Fetching history failed. Module not found for ${network.caipId}`,
        ),
        Monitoring.SentryExceptionTypes.VM_MODULES,
      );
      return [];
    }

    const enrichedNetwork =
      network.vmName === NetworkVMType.SVM
        ? this.#enrichNetworkWithCachedTokens(network, address)
        : network;

    const { transactions } = await module.getTransactionHistory({
      address,
      network: enrichedNetwork,
      offset: 25,
    });

    const txHistoryItem = transactions.map((transaction) => {
      const result = this.#analyze(network, transaction);
      const vmType = network.vmName;
      return {
        ...transaction,
        vmType,
        bridgeAnalysis: result,
      };
    }) as TxHistoryItem[];

    return txHistoryItem;
  }

  #analyze(network: NetworkWithCaipId, transaction: Transaction) {
    const params: AnalyzeTxParams = {
      from: transaction.from as `0x${string}`,
      to: transaction.to as `0x${string}`,
      chainId: network.caipId,
      tokenTransfers: transaction.tokens.map((transfer) => ({
        symbol: transfer.symbol,
        from: (transfer.from?.address ?? transaction.from) as `0x${string}`,
        to: (transfer.to?.address ?? transaction.to) as `0x${string}`,
      })),
    };

    return this.unifiedBridgeService.analyzeTx(params);
  }

  #enrichNetworkWithCachedTokens(
    network: NetworkWithCaipId,
    address: string,
  ): NetworkWithCaipId {
    const chainBalances =
      this.balanceAggregatorService.balances[network.chainId]?.[address];

    if (!chainBalances) {
      return network;
    }

    const existingAddresses = new Set(
      network.tokens?.map((t) => t.address) ?? [],
    );

    const cachedSplTokens = Object.values(chainBalances).reduce<SPLToken[]>(
      (acc, token) => {
        if (token.type !== TokenType.SPL) return acc;
        if (existingAddresses.has(token.address)) return acc;

        acc.push({
          address: token.address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          contractType: TokenType.SPL,
          type: TokenType.SPL,
          caip2Id: network.caipId,
          logoUri: token.logoUri,
        });
        return acc;
      },
      [],
    );

    if (cachedSplTokens.length === 0) {
      return network;
    }

    return {
      ...network,
      tokens: [
        ...(network.tokens ?? []),
        ...cachedSplTokens,
      ] as NetworkContractToken[],
    };
  }

  async #getAddress(network: NetworkWithCaipId) {
    const activeAccount = await this.accountsService.getActiveAccount();
    switch (network.vmName) {
      case NetworkVMType.EVM:
        return activeAccount?.addressC;
      case NetworkVMType.BITCOIN:
        return activeAccount?.addressBTC;
      case NetworkVMType.AVM:
        return activeAccount?.addressAVM;
      case NetworkVMType.PVM:
        return activeAccount?.addressPVM;
      case NetworkVMType.CoreEth:
        return activeAccount?.addressCoreEth;
      case NetworkVMType.SVM:
        return activeAccount?.addressSVM;
      default:
        return undefined;
    }
  }
}
