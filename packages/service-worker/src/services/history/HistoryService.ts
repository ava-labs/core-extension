import { singleton } from 'tsyringe';
import {
  NetworkVMType,
  type NetworkContractToken,
} from '@avalabs/core-chains-sdk';
import {
  NetworkWithCaipId,
  TxHistoryItem,
  type TokensPriceShortData,
} from '@core/types';
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
import { TokenPricesService } from '../balances/TokenPricesService';
import {
  filterSpamTransactions,
  MIN_FILTERED_RESULTS,
  MAX_FETCH_PAGES,
  type TokenPriceMap,
} from './activitySpamFilter';

@singleton()
export class HistoryService {
  constructor(
    private moduleManager: ModuleManager,
    private accountsService: AccountsService,
    private unifiedBridgeService: UnifiedBridgeService,
    private balanceAggregatorService: BalanceAggregatorService,
    private tokenPricesService: TokenPricesService,
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
        ? this.#enrichNetworkWithCachedTokens(network)
        : network;

    if (network.isTestnet) {
      const { transactions } = await module.getTransactionHistory({
        address,
        network: enrichedNetwork,
        offset: 25,
      });

      return transactions.map(
        (transaction) =>
          ({
            ...transaction,
            vmType: network.vmName,
            bridgeAnalysis: this.#analyze(network, transaction),
          }) as TxHistoryItem,
      );
    }

    // Fetch first page and price data in parallel
    const [firstPage, priceData] = await Promise.all([
      module.getTransactionHistory({
        address,
        network: enrichedNetwork,
        offset: 25,
      }),
      this.tokenPricesService.getPriceChangesData(),
    ]);

    const allFiltered: TxHistoryItem[] = [];
    let { transactions } = firstPage;
    let pageToken = firstPage.nextPageToken;
    let pagesLoaded = 1;

    while (transactions.length > 0) {
      const prices = this.#buildPriceMap(transactions, network, priceData);
      const clean = filterSpamTransactions(transactions, prices);

      for (const transaction of clean) {
        allFiltered.push({
          ...transaction,
          vmType: network.vmName,
          bridgeAnalysis: this.#analyze(network, transaction),
        } as TxHistoryItem);
      }

      if (
        allFiltered.length >= MIN_FILTERED_RESULTS ||
        !pageToken ||
        pagesLoaded >= MAX_FETCH_PAGES
      ) {
        break;
      }

      const nextPage = await module.getTransactionHistory({
        address,
        network: enrichedNetwork,
        offset: 25,
        nextPageToken: pageToken,
      });

      transactions = nextPage.transactions;
      pageToken = nextPage.nextPageToken;
      pagesLoaded++;
    }

    return allFiltered;
  }

  #buildPriceMap(
    transactions: Transaction[],
    network: NetworkWithCaipId,
    priceData?: TokensPriceShortData,
  ): TokenPriceMap {
    const prices: TokenPriceMap = new Map();

    if (!priceData) {
      return prices;
    }

    for (const tx of transactions) {
      const token = tx.tokens[0];

      if (!token) {
        continue;
      }

      if (token.type === TokenType.NATIVE) {
        const key = `NATIVE-${token.symbol.toLowerCase()}`;

        if (!prices.has(key)) {
          prices.set(key, priceData[key]?.currentPrice ?? null);
        }
      } else if ('address' in token) {
        const lowered = token.address.toLowerCase();

        if (!prices.has(lowered)) {
          const tokenId = `${network.caipId}-${lowered}`;
          const byId = priceData[tokenId];

          if (byId) {
            prices.set(lowered, byId.currentPrice ?? null);
          } else {
            const byPlatform = Object.values(priceData).find(
              (t) => t.platforms?.[network.caipId] === lowered,
            );
            prices.set(lowered, byPlatform?.currentPrice ?? null);
          }
        }
      }
    }

    return prices;
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
  ): NetworkWithCaipId {
    const allAddressBalances =
      this.balanceAggregatorService.balances[network.chainId];

    if (!allAddressBalances) {
      return network;
    }

    const existingAddresses = new Set(
      network.tokens?.map((t) => t.address) ?? [],
    );

    const cachedSplTokens: SPLToken[] = [];

    for (const addressBalances of Object.values(allAddressBalances)) {
      for (const token of Object.values(addressBalances)) {
        if (token.type !== TokenType.SPL) continue;
        if (existingAddresses.has(token.address)) continue;

        existingAddresses.add(token.address);
        cachedSplTokens.push({
          address: token.address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          contractType: TokenType.SPL,
          type: TokenType.SPL,
          caip2Id: network.caipId,
          logoUri: token.logoUri,
        });
      }
    }

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
