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
import { PchainBalance, NetworkTokenWithBalance, TokenType } from './models';
import BN from 'bn.js';
import { balanceToDisplayValue, bnToBig } from '@avalabs/utils-sdk';
import * as Sentry from '@sentry/browser';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

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

  private async _fetchBalances(
    address: string,
    network: Network
  ): Promise<PChainBalance | undefined> {
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
      return;
    }
    return glacierBalance;
  }

  private _getTokenValue(decimals: number, amount?: number) {
    return amount === undefined ? 0 : amount / 10 ** decimals;
  }

  private _convertToBalancePchain(
    balance: PChainBalance,
    tokenPrice: number | undefined,
    decimals: number
  ): PchainBalance {
    const balancePerType: Record<string, number> = {};

    Object.keys(balance).forEach((balanceType) => {
      const balancesToAdd = balance[balanceType];
      if (!balancesToAdd.length) {
        balancePerType[balanceType] = 0;
        return;
      }

      balance[balanceType]?.forEach((uxto) => {
        const previousBalance = balancePerType[balanceType] ?? 0;
        const newBalance = previousBalance + Number(uxto.amount);
        balancePerType[balanceType] = newBalance;
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
    return {
      available,
      availableUSD: availableUSD?.toNumber(),
      availableDisplayValue,
      availableUsdDisplayValue: availableUSD?.toFixed(2),
      utxos: balance,
      lockedStaked: this._getTokenValue(
        decimals,
        balancePerType['lockedStaked']
      ),
      lockedStakeable: this._getTokenValue(
        decimals,
        balancePerType['lockedStakeable']
      ),
      lockedPlatform: this._getTokenValue(
        decimals,
        balancePerType['lockedPlatform']
      ),
      atomicMemoryLocked: this._getTokenValue(
        decimals,
        balancePerType['atomicMemoryLocked']
      ),
      atomicMemoryUnlocked: this._getTokenValue(
        decimals,
        balancePerType['atomicMemoryUnlocked']
      ),
      unlockedUnstaked: this._getTokenValue(
        decimals,
        balancePerType['unlockedUnstaked']
      ),
      unlockedStaked: this._getTokenValue(
        decimals,
        balancePerType['unlockedStaked']
      ),
      pendingStaked: this._getTokenValue(
        decimals,
        balancePerType['pendingStaked']
      ),
    };
  }

  private _calculateTotalBalance(balance: PchainBalance): BN {
    const uxtos = balance.utxos;
    if (!uxtos) {
      return new BN(0);
    }

    const sum = Object.values(uxtos).reduce(function (totalAcc, utxoList) {
      const typeSum = utxoList.reduce(function (typeAcc, utxo) {
        const balanceToAdd = Number(utxo.amount);
        return typeAcc + balanceToAdd;
      }, 0);

      return totalAcc + typeSum;
    }, 0);

    return new BN(sum);
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
          const fetchedBalance = await this._fetchBalances(
            account.addressPVM,
            network
          );

          if (!fetchedBalance) {
            return;
          }

          const balancePchain = this._convertToBalancePchain(
            fetchedBalance,
            tokenPrice,
            network.networkToken.decimals
          );
          const balance = this._calculateTotalBalance(balancePchain);

          const balanceUSD =
            tokenPrice === undefined
              ? undefined
              : bnToBig(balance, network.networkToken.decimals).mul(tokenPrice);

          const balanceDisplayValue = balanceToDisplayValue(
            balance,
            network.networkToken.decimals
          );

          const chainBalance: NetworkTokenWithBalance = {
            ...network.networkToken,
            type: TokenType.NATIVE,
            balance,
            balanceUSD: balanceUSD?.toNumber(),
            balanceDisplayValue,
            balanceUsdDisplayValue: balanceUSD?.toFixed(2),
            priceUSD: tokenPrice,
            pchainBalance: balancePchain,
          };

          return {
            [account.addressPVM]: {
              [network.networkToken.symbol]: chainBalance,
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
            Record<string, Record<string, NetworkTokenWithBalance>>
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
