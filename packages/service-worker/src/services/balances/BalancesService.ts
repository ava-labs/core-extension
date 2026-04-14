import {
  GetBalancesResponse,
  Module,
  Network,
  NetworkVMType,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import {
  getPriceChangeValues,
  getProviderForNetwork,
  isNotNullish,
  isPrimaryAccount,
} from '@core/common';
import { Account, NetworkWithCaipId, TokensPriceShortData } from '@core/types';
import * as Sentry from '@sentry/browser';
import { ethers } from 'ethers';
import LRUCache from 'lru-cache';
import { singleton } from 'tsyringe';
import { ModuleManager } from '../../vmModules/ModuleManager';
import { AddressResolver } from '../secrets/AddressResolver';
import { SettingsService } from '../settings/SettingsService';

const ERC20_BALANCE_OF_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
];

const cacheStorage = new LRUCache({ max: 100, ttl: 60 * 1000 });

const PROTO_POLLUTION_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isValidErc20TokenEntry(
  t: unknown,
): t is { address: string; name: string; symbol: string; decimals: number } {
  if (typeof t !== 'object' || t === null) return false;
  const obj = t as Record<string, unknown>;
  return (
    typeof obj.address === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.symbol === 'string' &&
    typeof obj.decimals === 'number' &&
    Number.isFinite(obj.decimals)
  );
}

@singleton()
export class BalancesService {
  constructor(
    private settingsService: SettingsService,
    private moduleManager: ModuleManager,
    private addressResolver: AddressResolver,
  ) {}

  /**
   * Workaround for testnets where the VM module's balance provider
   * (Glacier/Debank) claims to support the chain but returns no ERC20 data.
   * Fetches balances directly via individual RPC balanceOf calls.
   *
   * Mutates rawBalances in-place.
   * TODO: Remove once the evm-module properly falls through to the RPC provider.
   */
  async #fillMissingErc20Balances(
    rawBalances: GetBalancesResponse,
    network: NetworkWithCaipId,
    module: Module,
    addresses: string[],
  ): Promise<void> {
    const hasAnyErc20 = addresses.some((addr) => {
      const acct = rawBalances[addr];
      if (!acct || acct instanceof Error) return false;
      return Object.values(acct).some(
        (t) => !(t instanceof Error) && t.type === TokenType.ERC20,
      );
    });
    if (hasAnyErc20) return;

    const erc20Tokens = await this.#fetchErc20TokenList(network, module);
    if (!erc20Tokens.length) return;

    const provider = await getProviderForNetwork(
      network as unknown as Parameters<typeof getProviderForNetwork>[0],
    ).catch(() => null);
    if (!(provider instanceof JsonRpcBatchInternal)) return;

    for (const address of addresses) {
      if (PROTO_POLLUTION_KEYS.has(address)) continue;
      const acct = rawBalances[address];
      if (!acct || acct instanceof Error) continue;

      try {
        const results = await Promise.allSettled(
          erc20Tokens.map(async (token) => {
            const contract = new ethers.Contract(
              token.address,
              ERC20_BALANCE_OF_ABI,
              provider,
            );
            const balance: bigint = await contract.balanceOf!(address);
            return { ...token, balance };
          }),
        );

        for (const result of results) {
          if (result.status !== 'fulfilled') continue;

          const {
            address: tokenAddr,
            name,
            symbol,
            decimals,
            balance,
          } = result.value;

          const tokenKey = tokenAddr.toLowerCase();
          if (PROTO_POLLUTION_KEYS.has(tokenKey)) continue;

          (rawBalances[address] as Record<string, TokenWithBalance>)[tokenKey] =
            {
              type: TokenType.ERC20,
              address: tokenAddr,
              name,
              symbol,
              decimals,
              balance,
              balanceDisplayValue: ethers.formatUnits(balance, decimals),
              balanceInCurrency: undefined,
              balanceCurrencyDisplayValue: '',
              priceInCurrency: undefined,
              reputation: null,
            } as unknown as TokenWithBalance;
        }
      } catch (err) {
        console.warn(
          `BalancesService: ERC20 RPC fallback failed for ${address} on ${network.caipId}:`,
          err,
        );
      }
    }
  }

  async #fetchErc20TokenList(
    network: NetworkWithCaipId,
    module: Module,
  ): Promise<
    { address: string; name: string; symbol: string; decimals: number }[]
  > {
    try {
      const allTokens = await module.getTokens(network as Network);
      return (allTokens as unknown[]).filter(isValidErc20TokenEntry);
    } catch {
      try {
        const res = await fetch(
          `${process.env.PROXY_URL}/tokens?evmChainId=${network.chainId}`,
        );
        if (!res.ok) return [];
        const data: unknown = await res.json();
        return Array.isArray(data) ? data.filter(isValidErc20TokenEntry) : [];
      } catch {
        return [];
      }
    }
  }

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

    const rawBalances = await module.getBalances({
      // TODO: Use public key and module.getAddress instead to make this more modular
      addresses: Array.from(addressesToFetch),
      network: network as Network, // TODO: Remove this cast after SVM network type appears in vm-module-types
      currency,
      customTokens,
      tokenTypes,
      storage: cacheStorage,
    });

    // Workaround: Glacier/Debank may claim to support testnets like Sepolia
    // but return empty ERC20 results. When ERC20 was requested but no ERC20
    // tokens were returned, fetch them directly via RPC balanceOf calls.
    if (
      network.isTestnet &&
      network.vmName === NetworkVMType.EVM &&
      tokenTypes.includes(TokenType.ERC20)
    ) {
      await this.#fillMissingErc20Balances(
        rawBalances,
        network,
        module,
        Array.from(addressesToFetch),
      );
    }

    // Apply price changes data, VM Modules don't do this yet.
    // Note: rawBalances may contain an account-level `error` property
    // (e.g. when listErc20Balances fails but getNativeBalance succeeds).
    // We must NOT skip the entire account in that case — instead we
    // process individual tokens and only skip entries that are errors.
    const balances = Object.keys(rawBalances).reduce(
      (
        accountBalances,
        accountKey,
      ): Record<string, Record<string, TokenWithBalance>> => {
        const rawAccountTokenList = rawBalances[accountKey];
        if (!rawAccountTokenList) {
          return accountBalances;
        }

        if (rawAccountTokenList.error) {
          console.warn(
            `BalancesService: Partial failure for ${accountKey} on ${network.caipId}:`,
            rawAccountTokenList.error,
          );
        }

        const accountTokens = Object.keys(rawAccountTokenList).reduce(
          (tokens, tokenKey): Record<string, TokenWithBalance> => {
            if (tokenKey === 'error') {
              return tokens;
            }

            const tokenBalance = rawAccountTokenList[tokenKey];
            if (
              !tokenBalance ||
              tokenBalance instanceof Error ||
              tokenBalance?.error
            ) {
              if (tokenBalance?.error) {
                console.warn(
                  `BalancesService: Skipping token ${tokenKey} on ${network.caipId}:`,
                  tokenBalance.error,
                );
              }
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
        );

        if (Object.keys(accountTokens).length === 0) {
          return accountBalances;
        }

        return {
          ...accountBalances,
          [accountKey]: accountTokens,
        };
      },
      {},
    );

    sentryTracker.finish();

    return balances;
  }
}
