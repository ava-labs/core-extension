import { singleton } from 'tsyringe';
import { Account } from '../accounts/models';
import { TokensPriceShortData } from '../tokens/models';
import { NetworkWithCaipId } from '../network/models';
import { ModuleManager } from '@src/background/vmModules/ModuleManager';
import { SettingsService } from '../settings/SettingsService';
import { getPriceChangeValues } from './utils/getPriceChangeValues';
import * as Sentry from '@sentry/browser';
import {
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
            default:
              return undefined;
          }
        })
        .filter((address): address is string => !!address),
      network,
      currency,
      customTokens,
      tokenTypes,
      storage: cacheStorage,
    });

    // Apply price changes data, VM Modules don't do this yet
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

              return {
                ...tokens,
                [tokenKey]: {
                  ...tokenBalance,
                  priceChanges: getPriceChangeValues(
                    tokenBalance.symbol,
                    tokenBalance.balanceInCurrency,
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
