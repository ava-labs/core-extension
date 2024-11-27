import { injectable } from 'tsyringe';
import { Network } from '@avalabs/glacier-sdk';
import { TokenType } from '@avalabs/vm-module-types';
import { uniq } from 'lodash';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { SecretsService } from '../../../secrets/SecretsService';
import { AccountsService } from '../../../accounts/AccountsService';
import { GlacierService } from '../../../glacier/GlacierService';
import { NetworkService } from '../../../network/NetworkService';
import { BalanceAggregatorService } from '../../BalanceAggregatorService';
import { Account } from '../../../accounts/models';

import { GetWalletsWithActivityParams, TotalBalanceForWallet } from './models';
import {
  calculateTotalBalanceForAddresses,
  getAccountsWithActivity,
  getAllAddressesForAccounts,
  getIncludedNetworks,
} from './helpers';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCES_GET_TOTAL_FOR_WALLET,
  TotalBalanceForWallet,
  GetWalletsWithActivityParams
>;

@injectable()
export class GetTotalBalanceForWalletHandler implements HandlerType {
  method = ExtensionRequest.BALANCES_GET_TOTAL_FOR_WALLET as const;

  constructor(
    private secretService: SecretsService,
    private glacierService: GlacierService,
    private networkService: NetworkService,
    private accountsService: AccountsService,
    private balanceAggregatorService: BalanceAggregatorService
  ) {}

  #getAddressesActivity = (addresses: string[]) =>
    this.glacierService.getChainIdsForAddresses({
      addresses,
      network: this.networkService.isMainnet() ? Network.MAINNET : Network.FUJI,
    });

  handle: HandlerType['handle'] = async ({ request }) => {
    const { walletId } = request.params;
    const secrets = await this.secretService.getWalletAccountsSecretsById(
      walletId
    );

    if (!secrets.xpubXP) {
      return {
        ...request,
        error: 'not available for this wallet', // TODO
      };
    }

    try {
      const walletAccounts =
        this.accountsService.getPrimaryAccountsByWalletId(walletId);
      const derivedWaletAddresses = getAllAddressesForAccounts(walletAccounts);

      const underivedPChainAddresses = Object.keys(
        await getAccountsWithActivity(
          secrets.xpubXP,
          await this.networkService.getAvalanceProviderXP(),
          this.#getAddressesActivity
        )
      ).filter(
        (address) => !derivedWaletAddresses.includes(address.toLowerCase())
      );

      const networksIncludedInRollup = getIncludedNetworks(
        this.networkService.isMainnet(),
        await this.networkService.activeNetworks.promisify(),
        await this.networkService.getFavoriteNetworks()
      );

      await this.balanceAggregatorService.getBalancesForNetworks(
        networksIncludedInRollup,
        [
          ...walletAccounts,
          ...underivedPChainAddresses.map<Account>(
            (address) =>
              ({
                walletId,
                addressPVM: address,
                addressAVM: address,
              } as Account)
          ),
        ],
        [TokenType.NATIVE, TokenType.ERC20]
      );

      const allWalletAddresses = uniq([
        ...derivedWaletAddresses,
        ...underivedPChainAddresses,
      ]);

      const result = calculateTotalBalanceForAddresses(
        this.balanceAggregatorService.balances,
        allWalletAddresses,
        networksIncludedInRollup
      );

      return {
        ...request,
        result,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
