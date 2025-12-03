import {
  DAppRequestHandler,
  DAppProviderRequest,
  AVALANCHE_BASE_DERIVATION_PATH,
  SecretType,
} from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';
import { SecretsService } from '../../secrets/SecretsService';
import {
  getExtendedPublicKey,
  isPrimaryWalletSecrets,
} from '~/services/secrets/utils';
import {
  CoreAccountType,
  CoreImportedAccount,
  CorePrimaryAccount,
  WalletType,
} from '@avalabs/types';
import { AddressResolver } from '~/services/secrets/AddressResolver';

@injectable()
export class AvalancheGetAccountsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_ACCOUNTS];

  constructor(
    private accountsService: AccountsService,
    private secretsService: SecretsService,
    private addressResolver: AddressResolver,
  ) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    const accounts = await this.accountsService.getAccounts();

    const mappedPrimaryAccounts: CorePrimaryAccount[][] = await Promise.all(
      Object.keys(accounts.primary).map(async (walletId) => {
        const walletAccounts = accounts.primary[walletId];
        if (!walletAccounts) {
          return [];
        }

        const secrets = await this.secretsService.getSecretsById(walletId);

        if (!isPrimaryWalletSecrets(secrets)) {
          return [];
        }

        const xpubXP =
          'extendedPublicKeys' in secrets
            ? getExtendedPublicKey(
                secrets.extendedPublicKeys,
                AVALANCHE_BASE_DERIVATION_PATH,
                'secp256k1',
              )
            : null;

        return await Promise.all(
          walletAccounts.map(async (acc) => {
            const externalXPAddresses =
              await this.addressResolver.getXPAddressesForAccountIndex(
                secrets.id,
                acc.index,
              );

            const primaryAccount: CorePrimaryAccount = {
              active: accounts.active?.id === acc.id,
              addressC: acc.addressC,
              addressBTC: acc.addressBTC,
              addressAVM: acc.addressAVM ?? '',
              addressPVM: acc.addressPVM ?? '',
              addressCoreEth: acc.addressCoreEth ?? '',
              addressSVM: acc.addressSVM ?? '',
              name: acc.name,
              type: CoreAccountType.PRIMARY,
              id: acc.id,
              xpAddresses: externalXPAddresses,
              xpubXP: xpubXP?.key,
              index: acc.index,
              walletType: this.#mapSecretTypeToWalletType(secrets.secretType),
              walletId,
              walletName: 'name' in secrets ? secrets.name : '',
            };

            return primaryAccount;
          }),
        );
      }),
    );

    const mappedImportedAccounts: CoreImportedAccount[] = await Promise.all(
      Object.values(accounts.imported).map(async (acc) => {
        const importedAccount: CoreImportedAccount = {
          id: acc.id,
          active: accounts.active?.id === acc.id,
          addressC: acc.addressC,
          addressBTC: acc.addressBTC ?? '',
          addressAVM: acc.addressAVM ?? '',
          addressPVM: acc.addressPVM ?? '',
          addressCoreEth: acc.addressCoreEth ?? '',
          addressSVM: acc.addressSVM ?? '',
          name: acc.name,
          type: CoreAccountType.IMPORTED,
          xpAddresses: [],
        };

        return importedAccount;
      }),
    );

    return {
      ...request,
      result: [...mappedPrimaryAccounts.flat(), ...mappedImportedAccounts],
    };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  #mapSecretTypeToWalletType = (secretType: SecretType) => {
    switch (secretType) {
      case SecretType.Mnemonic:
        return WalletType.Mnemonic;
      case SecretType.Ledger:
        return WalletType.Ledger;
      case SecretType.LedgerLive:
        return WalletType.LedgerLive;
      case SecretType.Keystone:
      case SecretType.Keystone3Pro:
        return WalletType.Keystone;
      case SecretType.Seedless:
        return WalletType.Seedless;
      default:
        throw new Error(`Unknown primary account secret type: ${secretType}`);
    }
  };
}
