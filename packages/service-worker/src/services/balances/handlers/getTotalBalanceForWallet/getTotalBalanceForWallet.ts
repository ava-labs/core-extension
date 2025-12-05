import { isNil } from 'lodash';
import { injectable } from 'tsyringe';
import { Network } from '@avalabs/glacier-sdk';
import { hex } from '@scure/base';
import { TokenType } from '@avalabs/vm-module-types';
import {
  getAllAddressesForAccounts,
  getAvalancheXpBasePath,
  getXPChainIds,
  isNotNullish,
  calculateTotalAtomicFundsForAccounts,
} from '@core/common';
import {
  AVALANCHE_BASE_DERIVATION_PATH,
  Account,
  ExtensionRequest,
  ExtensionRequestHandler,
  TotalBalanceForWallet,
  ImportedAccount,
  PrimaryAccount,
} from '@core/types';

import { SecretsService } from '~/services/secrets/SecretsService';
import { AccountsService } from '~/services/accounts/AccountsService';
import { GlacierService } from '~/services/glacier/GlacierService';
import { NetworkService } from '~/services/network/NetworkService';
import { BalanceAggregatorService } from '~/services/balances/BalanceAggregatorService';
import { getExtendedPublicKey } from '~/services/secrets/utils';
import { getAvaxPrice } from '~/services/balances/handlers/helpers';

import {
  GetTotalBalanceForWalletParams,
  isImportedAccountsRequest,
} from './models';
import {
  calculateTotalBalanceForAccounts,
  getAccountsWithActivity,
  getIncludedNetworks,
  removeChainPrefix,
} from './helpers';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCES_GET_TOTAL_FOR_WALLET,
  TotalBalanceForWallet,
  GetTotalBalanceForWalletParams
>;

@injectable()
export class GetTotalBalanceForWalletHandler implements HandlerType {
  method = ExtensionRequest.BALANCES_GET_TOTAL_FOR_WALLET as const;

  constructor(
    private secretService: SecretsService,
    private glacierService: GlacierService,
    private networkService: NetworkService,
    private accountsService: AccountsService,
    private balanceAggregatorService: BalanceAggregatorService,
  ) {}

  #getAddressesActivity = (addresses: string[]) =>
    this.glacierService.getChainIdsForAddresses({
      addresses,
      network: this.networkService.isMainnet() ? Network.MAINNET : Network.FUJI,
    });

  async #findUnderivedAccounts(walletId: string, derivedAccounts: Account[]) {
    const secrets =
      await this.secretService.getWalletAccountsSecretsById(walletId);

    const derivedWalletAddresses = getAllAddressesForAccounts(
      derivedAccounts ?? [],
    );
    const derivedAddressesUnprefixed =
      derivedWalletAddresses.map(removeChainPrefix);

    const extendedPublicKey =
      'extendedPublicKeys' in secrets
        ? getExtendedPublicKey(
            secrets.extendedPublicKeys,
            AVALANCHE_BASE_DERIVATION_PATH,
            'secp256k1',
          )
        : null;

    const xpPublicKeys = secrets.publicKeys.filter(
      (key) =>
        key.curve === 'secp256k1' &&
        key.derivationPath.startsWith(getAvalancheXpBasePath()),
    );

    const providerXP = await this.networkService.getAvalanceProviderXP();
    const addressesFromXpub = extendedPublicKey
      ? await getAccountsWithActivity(
          extendedPublicKey.key,
          providerXP,
          this.#getAddressesActivity,
        )
      : [];

    const addressesFromXpPublicKeys = xpPublicKeys
      .map(({ key }) =>
        providerXP.getAddress(Buffer.from(hex.decode(key)), 'X'),
      )
      .map(removeChainPrefix);

    const underivedXPChainAddresses = [
      ...addressesFromXpub,
      ...addressesFromXpPublicKeys,
    ].filter((address) => !derivedAddressesUnprefixed.includes(address));

    return underivedXPChainAddresses.map<Partial<Account>>((address) => ({
      addressPVM: `P-${address}`,
      addressAVM: `X-${address}`,
    }));
  }

  handle: HandlerType['handle'] = async ({ request }) => {
    const { walletId } = request.params;
    const requestsImportedAccounts = isImportedAccountsRequest(walletId);
    try {
      const allAccounts = await this.accountsService.getAccounts();
      const derivedAccounts = requestsImportedAccounts
        ? Object.values(allAccounts.imported ?? {})
        : (allAccounts.primary[walletId] ?? []);

      if (!derivedAccounts.length) {
        return {
          ...request,
          result: {
            totalBalanceInCurrency: 0,
            hasBalanceOnUnderivedAccounts: false,
            balanceChange: undefined,
            percentageChange: undefined,
          },
        };
      }

      const underivedAccounts = requestsImportedAccounts
        ? []
        : await this.#findUnderivedAccounts(walletId, derivedAccounts);

      const networksIncludedInTotal = getIncludedNetworks(
        this.networkService.isMainnet(),
        await this.networkService.activeNetworks.promisify(),
        await this.networkService.getEnabledNetworks(),
      );

      // Get balance for derived addresses
      let totalBalanceInCurrency: undefined | number = undefined;
      let totalPriceChangeValue = 0;

      const { atomicBalances } = this.balanceAggregatorService;
      // TODO: Handle when atomic funds isn't only in AVAX
      const avaxPrice = getAvaxPrice(atomicBalances);
      const totalAtomicFundsForActiveAccount =
        calculateTotalAtomicFundsForAccounts(
          atomicBalances,
          derivedAccounts.flatMap(
            (account: ImportedAccount | PrimaryAccount) => [
              account?.addressCoreEth,
              account?.addressAVM,
              account?.addressPVM,
            ],
          ),
        );

      // TODO: Handle if we need to handle other tokens than AVAX
      const atomicFundsForAccount = totalAtomicFundsForActiveAccount.toDisplay({
        asNumber: true,
      });

      for (const account of derivedAccounts) {
        const { tokens: derivedAddressesBalances } =
          await this.balanceAggregatorService.getBalancesForNetworks(
            networksIncludedInTotal.map((network) => network.chainId),
            [account],
            [TokenType.NATIVE, TokenType.ERC20],
          );

        const { balance, priceChangeValue } = calculateTotalBalanceForAccounts(
          derivedAddressesBalances,
          [account],
          networksIncludedInTotal,
        );

        if (totalBalanceInCurrency === undefined) {
          totalBalanceInCurrency = balance;
          totalPriceChangeValue = priceChangeValue;
          continue;
        }
        totalBalanceInCurrency += balance;
        totalPriceChangeValue += priceChangeValue;
      }
      let hasBalanceOnUnderivedAccounts = false;

      if (underivedAccounts.length > 0) {
        // Get balance for underived addresses for X- and P-Chain.
        // We DO NOT cache this response. When fetching balances for multiple X/P addresses at once,
        // Glacier responds with all the balances aggregated into one record and the Avalanche Module
        // returns it with the first address as the key. If cached, we'd save incorrect data.

        // we need to batch the request because the glacier endpoint works with 64 addresses at most
        const batchSize = 64;
        const xpChains = (
          await Promise.all(
            getXPChainIds(this.networkService.isMainnet()).map((chainId) =>
              this.networkService.getNetwork(chainId),
            ),
          )
        ).filter(isNotNullish);
        for (let i = 0; i < underivedAccounts.length; i += batchSize) {
          const accountsBatch = underivedAccounts.slice(i, i + batchSize);
          const { tokens: underivedAddressesBalances } =
            await this.balanceAggregatorService.getBalancesForNetworks(
              getXPChainIds(this.networkService.isMainnet()),
              accountsBatch as Account[],
              [TokenType.NATIVE],
              false, // Don't cache this
            );

          const { balance: underivedAccountsTotal, priceChangeValue } =
            calculateTotalBalanceForAccounts(
              underivedAddressesBalances,
              underivedAccounts,
              xpChains,
            );
          if (totalBalanceInCurrency === undefined) {
            totalBalanceInCurrency = underivedAccountsTotal;
            totalPriceChangeValue = priceChangeValue;
          } else {
            totalBalanceInCurrency += underivedAccountsTotal;
            totalPriceChangeValue += priceChangeValue;
          }
          hasBalanceOnUnderivedAccounts = underivedAccountsTotal > 0;
        }
      }

      // Calculate balance change and percentage change
      // If there's no price change data, return undefined instead of 0

      const balanceChange =
        totalPriceChangeValue !== 0 ? totalPriceChangeValue : undefined;
      let percentageChange: number | undefined = undefined;

      if (
        totalBalanceInCurrency !== undefined &&
        totalBalanceInCurrency > 0 &&
        balanceChange !== undefined &&
        balanceChange !== 0
      ) {
        // Calculate the previous balance: current balance - change = previous balance
        const previousBalance = totalBalanceInCurrency - balanceChange;
        if (previousBalance > 0) {
          percentageChange = (balanceChange / previousBalance) * 100;
        }
      }

      return {
        ...request,
        result: {
          totalBalanceInCurrency: isNil(totalBalanceInCurrency)
            ? undefined
            : totalBalanceInCurrency + avaxPrice * atomicFundsForAccount,
          hasBalanceOnUnderivedAccounts,
          balanceChange,
          percentageChange,
        },
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
