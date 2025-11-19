import {
  DAppRequestHandler,
  DAppProviderRequest,
  AVALANCHE_BASE_DERIVATION_PATH,
  SecretType,
  AddressPublicKeyJson,
} from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';
import { SecretsService } from '../../secrets/SecretsService';
import {
  getExtendedPublicKey,
  isPrimaryWalletSecrets,
} from '~/services/secrets/utils';
import {
  AddressIndex,
  CoreAccountType,
  CoreImportedAccount,
  CorePrimaryAccount,
  WalletType,
} from '@avalabs/types';

@injectable()
export class AvalancheGetAccountsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_ACCOUNTS];

  constructor(
    private accountsService: AccountsService,
    private secretsService: SecretsService,
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

        return walletAccounts.map((acc) => {
          const externalXPAddresses = this.#getXPPublicKeysForAccountIndex(
            secrets.publicKeys,
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
        });
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

  #getXPPublicKeysForAccountIndex = (
    publicKeys: AddressPublicKeyJson[],
    accountIndex: number,
  ) => {
    const addressIndices: AddressIndex[] = [];

    for (const { curve, derivationPath, key } of publicKeys) {
      // Reject non-Secp256k1 keys
      if (curve !== 'secp256k1') continue;

      // Reject keys that are not for the given index
      if (!derivationPath.startsWith(`m/44'/9000'/${accountIndex}'/`)) continue;

      // Just some future-proofing - we expect the derivation path to have 6 segments,
      // separated by '/':
      const segments = derivationPath.split('/');
      if (segments.length !== 6) {
        throw new Error(
          `Invalid derivation path for X/P public key: ${derivationPath}. Expected 6 segments, got ${segments.length}.`,
        );
      }

      // Take the last index from the derivation path - this is our address index
      const addressIndex = Number(segments.pop());

      if (Number.isNaN(addressIndex) || !Number.isInteger(addressIndex)) {
        throw new Error(
          `Invalid address index obtained, expected an integer, got ${addressIndex}`,
        );
      }

      addressIndices.push({
        address: key,
        index: addressIndex,
      });
    }

    return addressIndices;
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
