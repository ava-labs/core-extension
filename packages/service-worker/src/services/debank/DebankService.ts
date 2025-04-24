import { singleton } from 'tsyringe';

import {
  DefiDataProvider,
  DefiProtocol,
  DefiToken,
  DefiItem,
  DefiItemType,
  DefiCommonItem,
  DefiLendingItem,
  DefiVestingItem,
  DefiInsuranceBuyerItem,
  DefiRewardItem,
  DefiItemGroup,
  DefiPerpetualItem,
} from '@core/types/src/models';

import {
  DebankChain,
  DebankComplexProtocol,
  DebankPortfolioItemObject,
  DebankProtocolDetailTypes,
  DebankPortfolioTokenItem,
  DebankTxPreExecutionResult,
  ExplainTxResponse,
} from '@core/types/src/models';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { FeatureGates } from '../featureFlags/models';
import { Network } from '@avalabs/core-chains-sdk';
import { txParamsToTransactionData } from './utils/txParamsToTransactionData';
import {
  EthSendTransactionParamsWithGas,
  TransactionDisplayValues,
} from '../wallet/handlers/eth_sendTransaction/models';
import { debankActionsToTransactionActions } from './utils/debankActionsToTransactionActions';
import { mapTokenItemToTransactionToken } from './utils/mapTokenItemToTransactionToken';
import { mapNftToTransactionNft } from './utils/mapNftToTransactionNft';

@singleton()
export class DebankService implements DefiDataProvider {
  chains: DebankChain[] = [];

  #initializationPromise: Promise<unknown>;
  #baseUrl = `${process.env.PROXY_URL}/proxy/debank/v1`;

  constructor(private featureFlagService: FeatureFlagService) {
    this.#initializationPromise = this.#initialize();
  }

  async #initialize() {
    return Promise.allSettled([this.#fetchChainList()]);
  }

  async #fetchChainList() {
    try {
      const url = this.#buildUrl('chain/list');
      const response = await fetch(url);
      this.chains = (await response.json()) ?? [];
    } catch {
      /**
       * Not much we can do if something goes wrong. We can't throw an error,
       * as we don't want to stop other requests from coming through.
       *
       * Worst case scenario is that we won't display the chain information
       * for the protocol (that's what we need the chain data for on the UI side).
       */
      this.chains = [];
    }
  }

  async getUserProtocols(address: string): Promise<DefiProtocol[]> {
    // Let's wait for the initialization process to finish.
    // This is just a safeguard for an edge case where the first request could
    // technically come in before the request for DeBank chain list finishes.
    await this.#initializationPromise;

    try {
      const url = this.#buildUrl('user/all_complex_protocol_list', {
        id: address,
      });
      const response = await fetch(url);
      const rawData: DebankComplexProtocol[] = await response.json();

      const protocols: DefiProtocol[] = rawData.map(
        ({
          id,
          chain: debankChainId,
          name,
          site_url,
          logo_url,
          portfolio_item_list,
        }) => {
          const chain = this.#getUniversalChain(debankChainId);

          return {
            id,
            name,
            chainId: chain?.community_id,
            chainLogoUrl: chain?.logo_url,
            chainName: chain?.name,
            siteUrl: site_url,
            logoUrl: logo_url,
            groups: this.#mapPortfolioItems(portfolio_item_list),
            totalUsdValue:
              this.#calculateTotalValueOfProtocolItems(portfolio_item_list),
          };
        },
      );

      return protocols;
    } catch (err) {
      throw new Error(
        `DebankService: Failed to load user's DeFi portfolio. ${
          err instanceof Error ? err.message : err
        }`,
      );
    }
  }

  async isPreExecuteTxAvailable(chainId: number): Promise<boolean> {
    if (
      !this.featureFlagService.featureFlags[
        FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION
      ]
    ) {
      return false;
    }
    await this.#initializationPromise;

    return !!this.chains.find((chain) => chain.community_id === chainId)
      ?.is_support_pre_exec;
  }

  async parseTransaction(
    network: Network,
    tx: EthSendTransactionParamsWithGas,
  ): Promise<TransactionDisplayValues> {
    this.featureFlagService.ensureFlagEnabled(
      FeatureGates.DEBANK_TRANSACTION_PARSING,
    );

    await this.#initializationPromise;

    const [explainResult, execResult] = await Promise.allSettled([
      this.#explainTx(network, tx),
      this.#preExecuteTx(network, tx),
    ]);

    if (
      explainResult.status === 'rejected' &&
      execResult.status === 'rejected'
    ) {
      throw new Error('DeBank transaction parsing failed');
    }

    const result: TransactionDisplayValues = {
      fromAddress: tx.from,
      abi:
        explainResult.status === 'fulfilled'
          ? explainResult.value.abi
          : undefined,
      actions:
        explainResult.status === 'fulfilled'
          ? debankActionsToTransactionActions(explainResult.value.actions ?? [])
          : [],
      gas: {
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas
          ? BigInt(tx.maxPriorityFeePerGas)
          : undefined,
        maxFeePerGas: BigInt(tx.maxFeePerGas),
        gasLimit: Number(tx.gasLimit),
        recommendedGasLimit:
          execResult.status === 'fulfilled'
            ? execResult.value.gas.gas_limit
            : undefined,
      },

      balanceChange:
        execResult.status === 'fulfilled'
          ? {
              usdValueChange: execResult.value.balance_change.usd_value_change,
              sendTokenList:
                execResult.value?.balance_change.send_token_list.map(
                  mapTokenItemToTransactionToken,
                ) ?? [],
              receiveTokenList:
                execResult.value.balance_change.receive_token_list.map(
                  mapTokenItemToTransactionToken,
                ) ?? [],
              sendNftList:
                execResult.value.balance_change.send_nft_list.map(
                  mapNftToTransactionNft,
                ) ?? [],
              receiveNftList:
                execResult.value.balance_change.receive_nft_list.map(
                  mapNftToTransactionNft,
                ) ?? [],
            }
          : undefined,

      preExecSuccess:
        execResult.status === 'fulfilled' && execResult.value.pre_exec.success,
    };
    return result;
  }

  async #explainTx(
    network: Network,
    tx: EthSendTransactionParamsWithGas,
  ): Promise<ExplainTxResponse> {
    this.featureFlagService.ensureFlagEnabled(
      FeatureGates.DEBANK_TRANSACTION_PARSING,
    );

    await this.#initializationPromise;

    if (!this.chains.some((chain) => chain.community_id === network.chainId)) {
      throw new Error('DebankService: Network not supported');
    }

    try {
      const url = this.#buildUrl('wallet/explain_tx');
      const response = await fetch(url, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ tx: txParamsToTransactionData(network, tx) }),
      }).then((res) => {
        if (!res.ok) {
          return Promise.reject();
        }
        return res;
      });

      const responseData: ExplainTxResponse = await response.json();
      if (Object.keys(responseData).length === 0) {
        // Debank API sometimes returns an empty object when fails to explain the tx
        throw new Error('Empty result');
      }

      return responseData;
    } catch (err) {
      throw new Error(
        `DebankService: Failed to pre-execute transaction. ${
          err instanceof Error ? err.message : err
        }`,
      );
    }
  }

  async #preExecuteTx(
    network: Network,
    tx: EthSendTransactionParamsWithGas,
  ): Promise<DebankTxPreExecutionResult> {
    await this.#initializationPromise;

    if (!(await this.isPreExecuteTxAvailable(network.chainId))) {
      throw new Error(
        'DebankService: Transaction pre-execution not supported on network',
      );
    }

    try {
      const url = this.#buildUrl('wallet/pre_exec_tx');
      const response = await fetch(url, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ tx: txParamsToTransactionData(network, tx) }),
      }).then((res) => {
        if (!res.ok) {
          return Promise.reject();
        }
        return res;
      });
      return (await response.json()) as DebankTxPreExecutionResult;
    } catch (err) {
      throw new Error(
        `DebankService: Failed to pre-execute transaction. ${
          err instanceof Error ? err.message : err
        }`,
      );
    }
  }

  #mapPortfolioItems(items: DebankPortfolioItemObject[]): DefiItemGroup[] {
    const allItems = this.#sortItems(
      items
        .map((item) => {
          // DeBank may return multiple detail types with the last one being the most accurate in their estimation.
          // @see https://docs.cloud.debank.com/en/readme/api-models/portfolioitemobject#about-detail_types
          const type =
            item.detail_types[item.detail_types.length - 1] ??
            DebankProtocolDetailTypes.COMMON;

          switch (type) {
            case DebankProtocolDetailTypes.LENDING:
              return this.#mapLendingItem(item);

            case DebankProtocolDetailTypes.VESTING:
              return this.#mapVestingItem(item);

            case DebankProtocolDetailTypes.REWARD:
              return this.#mapRewardItem(item);

            case DebankProtocolDetailTypes.INSURANCE_BUYER:
              return this.#mapInsuranceItem(item);

            case DebankProtocolDetailTypes.PERPETUALS:
              return this.#mapPerpetualItem(item);

            // Some items we show in a simplified manner, just like
            // the "common" positions.
            case DebankProtocolDetailTypes.LOCKED:
            case DebankProtocolDetailTypes.COMMON:
              return this.#mapCommonItem(item);

            default:
              // Return null for items that we don't know how to handle/present yet.
              return null;
          }
        })
        .filter(Boolean) as DefiItem[], // Filter-out the nullish items.
    );

    const groupedByName = allItems.reduce((groups, item) => {
      const group = groups.get(item.name) ?? {
        name: item.name,
        totalUsdValue: 0,
        items: [],
      };

      groups.set(item.name, {
        ...group,
        items: [...group.items, item],
        totalUsdValue: group.totalUsdValue + item.netUsdValue,
      });

      return groups;
    }, new Map<string, DefiItemGroup>());

    return Array.from(groupedByName.values());
  }

  #mapRewardItem(item: DebankPortfolioItemObject): DefiRewardItem {
    return {
      name: item.name,
      type: DefiItemType.Reward,
      netUsdValue: item.stats.net_usd_value,
      tokens: this.#mapTokens(item.detail.token_list),
    };
  }

  #mapPerpetualItem(item: DebankPortfolioItemObject): DefiPerpetualItem {
    return {
      type: DefiItemType.Perpetual,
      name: item.name,
      // We know the fields below are not supposed to be undefined
      // for perpetuals, so we can cast safely.
      positionToken: this.#mapToken(
        item.detail.position_token as DebankPortfolioTokenItem,
      ),
      marginToken: this.#mapToken(
        item.detail.margin_token as DebankPortfolioTokenItem,
      ),
      profitUsdValue: Number(item.detail.pnl_usd_value),
      netUsdValue: item.stats.net_usd_value,
    };
  }

  #mapInsuranceItem(item: DebankPortfolioItemObject): DefiInsuranceBuyerItem {
    return {
      type: DefiItemType.InsuranceBuyer,
      name: item.name,
      // We know those fields are not supposed to be undefined
      // for insurance, so we can cast safely.
      description: String(item.detail.description),
      expiredAt: Number(item.detail.expired_at),
      netUsdValue: Number(item.detail.usd_value),
    };
  }

  #mapVestingItem(item: DebankPortfolioItemObject): DefiVestingItem {
    const token = item.detail.token as DebankPortfolioTokenItem;

    return {
      name: item.name,
      type: DefiItemType.Vesting,
      netUsdValue: item.stats.net_usd_value,
      token: {
        ...this.#mapToken(token),
        claimableAmount: token.claimable_amount,
      },
      endAt: item.detail.end_at,
    };
  }

  #mapLendingItem(item: DebankPortfolioItemObject): DefiLendingItem {
    return {
      name: item.name,
      type: DefiItemType.Lending,
      healthRate: item.detail.health_rate,
      netUsdValue: item.stats.net_usd_value,
      supplyTokens: this.#mapTokens(item.detail.supply_token_list),
      rewardTokens: this.#mapTokens(item.detail.reward_token_list),
      borrowTokens: this.#mapTokens(item.detail.borrow_token_list),
    };
  }

  #mapCommonItem(item: DebankPortfolioItemObject): DefiCommonItem {
    return {
      name: item.name,
      type: DefiItemType.Common,
      netUsdValue: item.stats.net_usd_value,
      supplyTokens: this.#mapTokens(item.detail.supply_token_list),
      rewardTokens: this.#mapTokens(item.detail.reward_token_list),
    };
  }

  #mapTokens(tokens?: DebankPortfolioTokenItem[]): DefiToken[] {
    if (!tokens) {
      return [];
    }

    return tokens.map((token) => this.#mapToken(token));
  }

  #mapToken({
    name: tokenName,
    symbol,
    decimals,
    logo_url,
    price,
    amount,
  }: DebankPortfolioTokenItem): DefiToken {
    return {
      name: tokenName,
      price,
      amount,
      symbol,
      logoUrl: logo_url,
      decimals,
      usdValue: price * amount,
    };
  }

  #sortItems(items: DefiItem[]): DefiItem[] {
    return [...items].sort(
      ({ netUsdValue: valueA }, { netUsdValue: valueB }) => valueB - valueA,
    );
  }

  /**
   * Debank's API responds with it's own chain IDs (e.g. "eth" instead of 1 for Ethereum).
   * They provide an endpoint that maps those ids to the chain ids as we know them,
   */
  #getUniversalChain(debankChainId: string): DebankChain | undefined {
    return this.chains.find(({ id }) => id === debankChainId);
  }

  #calculateTotalValueOfProtocolItems(
    items: DebankPortfolioItemObject[],
  ): number {
    return items.reduce((total, { stats }) => total + stats.net_usd_value, 0);
  }

  #buildUrl(path: string, params?: Record<string, string>) {
    const search = params ? `?${new URLSearchParams(params)}` : '';
    return `${this.#baseUrl}/${path}${search}`;
  }
}
