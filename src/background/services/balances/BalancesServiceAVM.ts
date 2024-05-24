import { singleton } from 'tsyringe';
import { GlacierService } from '../glacier/GlacierService';
import { TokenPricesService } from './TokenPricesService';
import { SettingsService } from '../settings/SettingsService';
import { Account } from '../accounts/models';
import { Network } from '@avalabs/chains-sdk';
import {
  NetworkTokenWithBalance,
  TokenType,
  TokenWithBalanceAVM,
} from './models';
import * as Sentry from '@sentry/browser';
import {
  AggregatedAssetAmount,
  BlockchainId,
  CChainAtomicBalances,
  Network as NetworkType,
  PChainBalance,
  XChainBalances,
  XChainSharedAssetBalance,
} from '@avalabs/glacier-sdk';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { balanceToDisplayValue, bnToBig } from '@avalabs/utils-sdk';
import BN from 'bn.js';
import { getTokenValue } from './utils/getTokenValue';
import { calculateTotalBalance } from './utils/calculateTotalBalance';
import { stripAddressPrefix } from '@src/utils/stripAddressPrefix';

@singleton()
export class BalancesServiceAVM {
  constructor(
    private glacierService: GlacierService,
    private tokenPricesService: TokenPricesService,
    private settingsService: SettingsService
  ) {}

  private _isXchainBalance(
    balanceResult: PChainBalance | XChainBalances | CChainAtomicBalances
  ): balanceResult is XChainBalances {
    return Object.keys(balanceResult).includes('locked');
  }

  private _getBalancesByAddressesFetcher = async (
    account: Account,
    network: Network
  ): Promise<XChainBalances> => {
    const xpAddress = account.addressAVM
      ? stripAddressPrefix(account.addressAVM)
      : undefined;
    if (!xpAddress) {
      throw new Error('This account does not support AVM');
    }

    const result = await this._fetchBalances(xpAddress, network);
    return result;
  };

  private async _fetchBalances(
    address: string,
    network: Network
  ): Promise<XChainBalances> {
    const networkType = network.isTestnet
      ? NetworkType.FUJI
      : NetworkType.MAINNET;

    const glacierResult = await this.glacierService.getChainBalance({
      blockchainId: BlockchainId.X_CHAIN,
      network: networkType,
      addresses: address,
    });
    const glacierBalance = glacierResult.balances;
    // Making sure that the result is XChainBalance
    if (!this._isXchainBalance(glacierBalance)) {
      sentryCaptureException(
        new Error('Incorrect type balance was returned from glacier'),
        SentryExceptionTypes.BALANCES
      );
      throw new Error('Incorrect type balance was returned from glacier');
    }
    return glacierBalance;
  }

  private async _getPrice(network: Network): Promise<number | undefined> {
    const settings = await this.settingsService.getSettings();
    const tokenId = network.pricingProviders?.coingecko.nativeTokenId;

    const tokenPrice = tokenId
      ? await this.tokenPricesService.getPriceByCoinId(
          tokenId,
          settings.currency
        )
      : undefined;
    return tokenPrice;
  }

  private _convertToBalanceXchain(
    balance: XChainBalances,
    tokenPrice: number | undefined,
    network: Network
  ): TokenWithBalanceAVM {
    const decimals = network.networkToken.decimals;
    const available = new BN(
      balance.unlocked.reduce((acc, item) => {
        if (item.symbol === 'AVAX') {
          return Number(item.amount) + acc;
        }
        return acc;
      }, 0)
    );
    const availableUSD =
      tokenPrice === undefined
        ? undefined
        : bnToBig(available, decimals).mul(tokenPrice);

    const availableDisplayValue = balanceToDisplayValue(available, decimals);

    const balancePerType: Record<string, number> = {};

    Object.keys(balance).forEach((balanceType) => {
      const balancesToAdd = balance[balanceType];
      if (!balancesToAdd || !balancesToAdd.length) {
        balancePerType[balanceType] = 0;
        return;
      }

      balancesToAdd.forEach(
        (uxto: AggregatedAssetAmount | XChainSharedAssetBalance) => {
          if (uxto.symbol === network.networkToken.symbol) {
            const previousBalance = balancePerType[balanceType] ?? 0;
            const newBalance = previousBalance + Number(uxto.amount);
            balancePerType[balanceType] = newBalance;
          }
        }
      );
    });

    const totalBalance = calculateTotalBalance(balance);

    const balanceUSD =
      tokenPrice === undefined
        ? undefined
        : bnToBig(totalBalance, network.networkToken.decimals).mul(tokenPrice);

    const balanceDisplayValue = balanceToDisplayValue(
      totalBalance,
      network.networkToken.decimals
    );

    return {
      ...network.networkToken,
      type: TokenType.NATIVE,
      balance: totalBalance,
      balanceUSD: balanceUSD?.toNumber(),
      balanceDisplayValue,
      balanceUsdDisplayValue: balanceUSD?.toFixed(2),
      priceUSD: tokenPrice,
      available,
      availableUSD: availableUSD?.toNumber(),
      availableDisplayValue,
      availableUsdDisplayValue: availableUSD?.toFixed(2),
      utxos: balance,
      locked: getTokenValue(decimals, balancePerType['locked']),
      unlocked: getTokenValue(decimals, balancePerType['unlocked']),
      atomicMemoryUnlocked: getTokenValue(
        decimals,
        balancePerType['atomicMemoryUnlocked']
      ),
      atomicMemoryLocked: getTokenValue(
        decimals,
        balancePerType['atomicMemoryLocked']
      ),
    };
  }

  async getBalances({
    accounts,
    network,
  }: {
    accounts: Account[];
    network: Network;
  }): Promise<Record<string, Record<string, NetworkTokenWithBalance>>> {
    const sentryTracker = Sentry.startTransaction({
      name: 'BalancesServiceAVM: getBalances',
    });

    const tokenPrice = await this._getPrice(network);

    const results = await Promise.allSettled(
      accounts.map(async (account) => {
        if (!account.addressAVM) {
          return;
        }
        try {
          // Fetching balance from glacier
          const fetchedBalance = await this._getBalancesByAddressesFetcher(
            account,
            network
          );

          if (!fetchedBalance) {
            return;
          }

          const balanceXchain = this._convertToBalanceXchain(
            fetchedBalance,
            tokenPrice,
            network
          );

          return {
            [account.addressAVM]: {
              [network.networkToken.symbol]: balanceXchain,
            },
          };
        } catch {
          return {};
        }
      })
    ).then((items) => {
      const result = items
        .filter(
          (
            item
          ): item is PromiseFulfilledResult<
            Record<string, Record<string, TokenWithBalanceAVM>>
          > => item.status === 'fulfilled'
        )
        .map((item) => item.value);
      return result;
    });

    const result = results.reduce((acc, account) => {
      return { ...account, ...acc };
    }, {});
    sentryTracker.finish();
    return result;
  }
}
