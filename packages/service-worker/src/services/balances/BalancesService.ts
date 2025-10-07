import { TokenUnit } from '@avalabs/core-utils-sdk';
import { singleton } from 'tsyringe';
import { Account, NetworkWithCaipId, TokensPriceShortData } from '@core/types';
import { ModuleManager } from '../../vmModules/ModuleManager';
import { SettingsService } from '../settings/SettingsService';
import { getPriceChangeValues } from '@core/common';
import * as Sentry from '@sentry/browser';
import {
  Network,
  NetworkVMType,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import LRUCache from 'lru-cache';

const cacheStorage = new LRUCache({ max: 100, ttl: 60 * 1000 });

@singleton()
export class BalancesService {
  constructor(
    private settingsService: SettingsService,
    private moduleManager: ModuleManager,
  ) {}

  async getBalancesForNetwork(
    network: NetworkWithCaipId,
    accounts: Account[],
    tokenTypes: TokenType[],
    priceChanges?: TokensPriceShortData,
  ): Promise<Record<string, Record<string, TokenWithBalance>>> {
    const sentryTracker = Sentry.startTransaction(
      {
        name: 'BalancesService: getBalances',
      },
      {
        network: network.caipId,
      },
    );
    const module = await this.moduleManager.loadModuleByNetwork(network);

    const settings = await this.settingsService.getSettings();
    const currency = settings.currency.toLowerCase();
    const customTokens = Object.values(
      settings.customTokens[network.chainId] ?? {},
    ).map((t) => ({ ...t, type: TokenType.ERC20 as const }));

    const rawBalances = await module.getBalances({
      // TODO: Use public key and module.getAddress instead to make this more modular
      addresses: accounts
        .map((account) => {
          switch (network.vmName) {
            case NetworkVMType.EVM:
              return account.addressC;
            case NetworkVMType.BITCOIN:
              return account.addressBTC;
            case NetworkVMType.AVM:
              return account.addressAVM;
            case NetworkVMType.PVM:
              return account.addressPVM;
            case NetworkVMType.CoreEth:
              return account.addressCoreEth;
            case NetworkVMType.HVM:
              return account.addressHVM;
            case NetworkVMType.SVM:
              return account.addressSVM;
            default:
              return undefined;
          }
        })
        .filter((address): address is string => !!address),
      network: network as Network, // TODO: Remove this cast after SVM network type appears in vm-module-types
      currency,
      customTokens,
      tokenTypes,
      storage: cacheStorage,
    });

    // Apply price changes data and override AVAX prices for C/X/P chains with watchlist prices
    const balances = Object.keys(rawBalances).reduce(
      (
        accountBalances,
        accountKey,
      ): Record<string, Record<string, TokenWithBalance>> => {
        const rawAccountTokenList = rawBalances[accountKey];
        if (!rawAccountTokenList || rawAccountTokenList?.error) {
          return accountBalances;
        }

        return {
          ...accountBalances,
          [accountKey]: Object.keys(rawAccountTokenList).reduce(
            (tokens, tokenKey): Record<string, TokenWithBalance> => {
              const tokenBalance = rawAccountTokenList[tokenKey];
              if (tokenBalance?.error) {
                return tokens;
              }

              // Check if this is AVAX on C/X/P chains and override price with watchlist data
              const isAvaxOnAvalancheChains =
                tokenBalance.type === TokenType.NATIVE &&
                tokenBalance.symbol === 'AVAX';

              const updatedTokenBalance = { ...tokenBalance };
              const watchlistAvaxPrice = priceChanges?.['avax']?.currentPrice;
              if (isAvaxOnAvalancheChains && watchlistAvaxPrice) {
                const balanceUnit = new TokenUnit(
                  tokenBalance.balance,
                  tokenBalance.decimals,
                  tokenBalance.symbol,
                );
                const balanceInCurrency =
                  balanceUnit !== undefined
                    ? balanceUnit.mul(watchlistAvaxPrice)
                    : undefined;

                updatedTokenBalance.balanceInCurrency =
                  balanceInCurrency?.toDisplay({ fixedDp: 2, asNumber: true });

                updatedTokenBalance.balanceCurrencyDisplayValue =
                  balanceInCurrency?.toDisplay({ fixedDp: 2 });

                const availableUnit = new TokenUnit(
                  tokenBalance.available,
                  tokenBalance.decimals,
                  tokenBalance.symbol,
                );

                const availableInCurrency =
                  availableUnit !== undefined
                    ? availableUnit.mul(watchlistAvaxPrice)
                    : undefined;

                updatedTokenBalance.availableCurrencyDisplayValue =
                  availableInCurrency?.toDisplay({ fixedDp: 2 });
                updatedTokenBalance.availableInCurrency =
                  availableInCurrency?.toDisplay({
                    fixedDp: 2,
                    asNumber: true,
                  });

                updatedTokenBalance.priceInCurrency = watchlistAvaxPrice;
                console.log({ tokenBalance, updatedTokenBalance });
              }

              return {
                ...tokens,
                [tokenKey]: {
                  ...updatedTokenBalance,
                  priceChanges: getPriceChangeValues(
                    updatedTokenBalance.symbol,
                    updatedTokenBalance.balanceInCurrency,
                    priceChanges,
                  ),
                },
              };
            },
            {},
          ),
        };
      },
      {},
    );

    sentryTracker.finish();

    return balances;
  }
}
