import { stripAddressPrefix } from '@src/utils/stripAddressPrefix';
import { Network } from '@avalabs/chains-sdk';
import {
  BlockchainId,
  CChainAtomicBalances,
  Network as NetworkType,
  PChainBalance,
  XChainBalances,
} from '@avalabs/glacier-sdk';
import { singleton } from 'tsyringe';
import { Account } from '../accounts/models';
import { GlacierService } from '../glacier/GlacierService';
import { TokenPricesService } from './TokenPricesService';
import { SettingsService } from '../settings/SettingsService';
import {
  NetworkTokenWithBalance,
  TokenType,
  TokenWithBalancePVM,
} from './models';
import BN from 'bn.js';
import { balanceToDisplayValue, bnToBig } from '@avalabs/utils-sdk';
import * as Sentry from '@sentry/browser';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { getTokenValue } from './utils/getTokenValue';
import { calculateTotalBalance } from './utils/calculateTotalBalance';

@singleton()
export class BalancesServicePVM {
  constructor(
    private glacierService: GlacierService,
    private tokenPricesService: TokenPricesService,
    private settingsService: SettingsService
  ) {}

  private _isPchainBalance(
    balanceResult: PChainBalance | XChainBalances | CChainAtomicBalances
  ): balanceResult is PChainBalance {
    return Object.keys(balanceResult).includes('unlockedUnstaked');
  }

  private _getBalancesByAddressesFetcher = async (
    account: Account,
    network: Network
  ): Promise<PChainBalance> => {
    const xpAddress = account.addressPVM
      ? stripAddressPrefix(account.addressPVM)
      : undefined;
    if (!xpAddress) {
      throw new Error('This account does not support PVM');
    }

    const glacierResponses: PChainBalance = await this._fetchBalances(
      xpAddress,
      network
    );

    return glacierResponses;
  };

  private async _fetchBalances(
    address: string,
    network: Network
  ): Promise<PChainBalance> {
    const networkType = network.isTestnet
      ? NetworkType.FUJI
      : NetworkType.MAINNET;

    const glacierResult = await this.glacierService.getChainBalance({
      blockchainId: BlockchainId.P_CHAIN,
      network: networkType,
      addresses: address,
    });
    const glacierBalance = glacierResult.balances;
    // Making sure that the result is PChainBalance
    if (!this._isPchainBalance(glacierBalance)) {
      sentryCaptureException(
        new Error('Incorrect type balance was returned from glacier'),
        SentryExceptionTypes.BALANCES
      );
      throw new Error('Incorrect type balance was returned from glacier');
    }
    return glacierBalance;
  }

  private _convertToBalancePchain(
    balance: PChainBalance,
    tokenPrice: number | undefined,
    network: Network
  ): TokenWithBalancePVM {
    const balancePerType: Record<string, number> = {};
    const decimals = network.networkToken.decimals;

    Object.keys(balance).forEach((balanceType) => {
      const balancesToAdd = balance[balanceType];
      if (!balancesToAdd || !balancesToAdd.length) {
        balancePerType[balanceType] = 0;
        return;
      }

      balancesToAdd.forEach((uxto) => {
        if (uxto.symbol === network.networkToken.symbol) {
          const previousBalance = balancePerType[balanceType] ?? 0;
          const newBalance = previousBalance + Number(uxto.amount);
          balancePerType[balanceType] = newBalance;
        }
      });
    });

    const available = balancePerType['unlockedUnstaked']
      ? new BN(balancePerType['unlockedUnstaked'])
      : new BN(0);
    const availableUSD =
      tokenPrice === undefined
        ? undefined
        : bnToBig(available, decimals).mul(tokenPrice);
    const availableDisplayValue = balanceToDisplayValue(available, decimals);

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
      lockedStaked: getTokenValue(decimals, balancePerType['lockedStaked']),
      lockedStakeable: getTokenValue(
        decimals,
        balancePerType['lockedStakeable']
      ),
      lockedPlatform: getTokenValue(decimals, balancePerType['lockedPlatform']),
      atomicMemoryLocked: getTokenValue(
        decimals,
        balancePerType['atomicMemoryLocked']
      ),
      atomicMemoryUnlocked: getTokenValue(
        decimals,
        balancePerType['atomicMemoryUnlocked']
      ),
      unlockedUnstaked: getTokenValue(
        decimals,
        balancePerType['unlockedUnstaked']
      ),
      unlockedStaked: getTokenValue(decimals, balancePerType['unlockedStaked']),
      pendingStaked: getTokenValue(decimals, balancePerType['pendingStaked']),
    };
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

  async getBalances({
    accounts,
    network,
  }: {
    accounts: Account[];
    network: Network;
  }): Promise<Record<string, Record<string, NetworkTokenWithBalance>>> {
    const sentryTracker = Sentry.startTransaction({
      name: 'BalancesServicePVM: getBalances',
    });
    const tokenPrice = await this._getPrice(network);

    const results = await Promise.allSettled(
      accounts.map(async (account) => {
        if (!account.addressPVM) {
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

          const balancePchain = this._convertToBalancePchain(
            fetchedBalance,
            tokenPrice,
            network
          );

          return {
            [account.addressPVM]: {
              [network.networkToken.symbol]: balancePchain,
            },
          };
        } catch {
          return {};
        }
      })
    ).then((items) => {
      return items
        .filter(
          (
            item
          ): item is PromiseFulfilledResult<
            Record<string, Record<string, TokenWithBalancePVM>>
          > => item.status === 'fulfilled'
        )
        .map((item) => item.value);
    });

    const result = results.reduce((acc, account) => {
      return { ...account, ...acc };
    }, {});
    sentryTracker.finish();
    return result;
  }
}
