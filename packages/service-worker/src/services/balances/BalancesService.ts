import { wait } from '@avalabs/core-utils-sdk';
import {
  Network,
  NetworkVMType,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import {
  getExponentialBackoffDelay,
  getPriceChangeValues,
  isNotNullish,
  isPrimaryAccount,
} from '@core/common';
import { Account, NetworkWithCaipId, TokensPriceShortData } from '@core/types';
import * as Sentry from '@sentry/browser';
import LRUCache from 'lru-cache';
import { singleton } from 'tsyringe';
import { ModuleManager } from '../../vmModules/ModuleManager';
import { AddressResolver } from '../secrets/AddressResolver';
import { SettingsService } from '../settings/SettingsService';

const cacheStorage = new LRUCache({ max: 100, ttl: 60 * 1000 });

@singleton()
export class BalancesService {
  #awaiters = new Map<string, Awaiter>();

  constructor(
    private settingsService: SettingsService,
    private moduleManager: ModuleManager,
    private addressResolver: AddressResolver,
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

    const addresses = await Promise.all(
      accounts.map(async (account) => {
        if (
          isPrimaryAccount(account) &&
          (network.vmName === NetworkVMType.AVM ||
            network.vmName === NetworkVMType.PVM)
        ) {
          const firstAddress =
            network.vmName === 'AVM' ? account.addressAVM : account.addressPVM;

          if (!firstAddress) {
            return [];
          }

          const additionalAddresses =
            await this.addressResolver.getXPAddressesForAccountIndex(
              account.walletId,
              account.index,
              network.vmName,
            );

          const x = [
            firstAddress,
            additionalAddresses.externalAddresses.map(
              (address) => address.address,
            ),
            additionalAddresses.internalAddresses.map(
              (address) => address.address,
            ),
          ].flat();

          return x;
        }

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
      }),
    );

    const addressesToFetch = new Set(addresses.flat().filter(isNotNullish));

    if (addressesToFetch.size === 0) {
      return {};
    }

    const rawBalances = await this.#getBalances(
      network,
      Array.from(addressesToFetch),
      tokenTypes,
    );

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

  async #getBalances(
    network: NetworkWithCaipId,
    addresses: string[],
    tokenTypes: TokenType[],
  ) {
    const module = await this.moduleManager.loadModuleByNetwork(network);
    const settings = await this.settingsService.getSettings();
    const customTokens = Object.values(
      settings.customTokens[network.chainId] ?? {},
    ).map((t) => ({ ...t, type: TokenType.ERC20 as const }));

    if (this.#awaiters.has(network.caipId)) {
      await this.#awaiters.get(network.caipId)!.waitIfNeeded();
    }

    try {
      const rawBalances = await module.getBalances({
        // TODO: Use public key and module.getAddress instead to make this more modular
        addresses,
        network: network as Network, // TODO: Remove this cast after SVM network type appears in vm-module-types
        currency: settings.currency.toLowerCase(),
        customTokens,
        tokenTypes,
        storage: cacheStorage,
      });

      return rawBalances;
    } catch (error) {
      if (!this.#awaiters.has(network.caipId)) {
        this.#awaiters.set(network.caipId, new Awaiter());
      }
      this.#awaiters.get(network.caipId)!.bump();
      throw error;
    }
  }
}

class Awaiter {
  #waitTime: number | undefined;
  #attempt: number = 0;

  bump() {
    this.#attempt++;
    this.#waitTime = getExponentialBackoffDelay({ attempt: this.#attempt });
  }

  async waitIfNeeded() {
    if (this.#waitTime) {
      await wait(this.#waitTime);
    }
  }
}
