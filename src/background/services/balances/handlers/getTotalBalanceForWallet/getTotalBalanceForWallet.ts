import { injectable } from 'tsyringe';
import { Network } from '@avalabs/glacier-sdk';
import { TokenType } from '@avalabs/vm-module-types';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { SecretsService } from '../../../secrets/SecretsService';
import { AccountsService } from '../../../accounts/AccountsService';
import { GlacierService } from '../../../glacier/GlacierService';
import { NetworkService } from '../../../network/NetworkService';
import { BalanceAggregatorService } from '../../BalanceAggregatorService';
import { Account } from '../../../accounts/models';

import {
  GetTotalBalanceForWalletParams,
  TotalBalanceForWallet,
  isImportedAccountsRequest,
} from './models';
import {
  calculateTotalBalanceForAccounts,
  getAccountsWithActivity,
  getAllAddressesForAccounts,
  getIncludedNetworks,
} from './helpers';
import { getXPChainIds } from '@src/utils/getDefaultChainIds';
import { getExtendedPublicKey } from '@src/background/services/secrets/utils';
import { AVALANCHE_BASE_DERIVATION_PATH } from '@src/background/services/secrets/models';
import { isNotNullish } from '@src/utils/typeUtils';

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
    const derivedAddressesUnprefixed = derivedWalletAddresses.map((addr) =>
      addr.replace(/^[PXC]-/i, ''),
    );

    const extendedPublicKey =
      'extendedPublicKeys' in secrets
        ? getExtendedPublicKey(
            secrets.extendedPublicKeys,
            AVALANCHE_BASE_DERIVATION_PATH,
            'secp256k1',
          )
        : null;

    const underivedXPChainAddresses = extendedPublicKey
      ? (
          await getAccountsWithActivity(
            extendedPublicKey.key,
            await this.networkService.getAvalanceProviderXP(),
            this.#getAddressesActivity,
          )
        ).filter((address) => !derivedAddressesUnprefixed.includes(address))
      : [];

    return underivedXPChainAddresses.map<Partial<Account>>((address) => ({
      addressPVM: `P-${address}`,
      addressAVM: `X-${address}`,
    }));
  }

  handle: HandlerType['handle'] = async ({ request }) => {
    const { walletId } = request.params;
    const requestsImportedAccounts = isImportedAccountsRequest(walletId);

    try {
      const allAccounts = this.accountsService.getAccounts();
      const derivedAccounts = requestsImportedAccounts
        ? Object.values(allAccounts.imported ?? {})
        : (allAccounts.primary[walletId] ?? []);

      if (!derivedAccounts.length) {
        return {
          ...request,
          result: {
            totalBalanceInCurrency: 0,
            hasBalanceOnUnderivedAccounts: false,
          },
        };
      }

      const underivedAccounts = requestsImportedAccounts
        ? []
        : await this.#findUnderivedAccounts(walletId, derivedAccounts);

      const networksIncludedInTotal = getIncludedNetworks(
        this.networkService.isMainnet(),
        await this.networkService.activeNetworks.promisify(),
        await this.networkService.getFavoriteNetworks(),
      );

      // Get balance for derived addresses
      const { tokens: derivedAddressesBalances } =
        await this.balanceAggregatorService.getBalancesForNetworks(
          networksIncludedInTotal.map((network) => network.chainId),
          derivedAccounts,
          [TokenType.NATIVE, TokenType.ERC20],
        );

      let totalBalanceInCurrency = calculateTotalBalanceForAccounts(
        derivedAddressesBalances,
        derivedAccounts,
        networksIncludedInTotal,
      );
      let hasBalanceOnUnderivedAccounts = false;

      if (underivedAccounts.length > 0) {
        // Get balance for underived addresses for X- and P-Chain.
        // We DO NOT cache this response. When fetching balances for multiple X/P addresses at once,
        // Glacier responds with all the balances aggregated into one record and the Avalanche Module
        // returns it with the first address as the key. If cached, we'd save incorrect data.
        const { tokens: underivedAddressesBalances } =
          await this.balanceAggregatorService.getBalancesForNetworks(
            getXPChainIds(this.networkService.isMainnet()),
            underivedAccounts as Account[],
            [TokenType.NATIVE],
            false, // Don't cache this
          );

        const xpChains = (
          await Promise.all(
            getXPChainIds(this.networkService.isMainnet()).map((chainId) =>
              this.networkService.getNetwork(chainId),
            ),
          )
        ).filter(isNotNullish);

        const underivedAccountsTotal = calculateTotalBalanceForAccounts(
          underivedAddressesBalances,
          underivedAccounts,
          xpChains,
        );
        totalBalanceInCurrency += underivedAccountsTotal;
        hasBalanceOnUnderivedAccounts = underivedAccountsTotal > 0;
      }

      return {
        ...request,
        result: {
          totalBalanceInCurrency,
          hasBalanceOnUnderivedAccounts,
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
