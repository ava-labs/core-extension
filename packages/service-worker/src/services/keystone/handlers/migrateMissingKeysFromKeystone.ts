import { getAddressDerivationPath } from '@avalabs/core-wallets-sdk';
import {
  ExtensionRequest,
  ExtensionRequestHandler,
  AddressPublicKeyJson,
  SecretType,
  ExtendedPublicKey,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';
import {
  buildExtendedPublicKey,
  getExtendedPublicKey,
  hasPublicKeyFor,
} from '../../secrets/utils';
import { getAvalancheExtendedKeyPath } from '@core/common';
import { AddressPublicKey } from '~/services/secrets/AddressPublicKey';

import KeystoneUSBAvalancheSDK from '@keystonehq/hw-app-avalanche';
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';
import {
  Curve as KeystoneCurve,
  DerivationAlgorithm,
} from '@keystonehq/bc-ur-registry';
import { fromPublicKey } from 'bip32';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.KEYSTONE_MIGRATE_MISSING_PUBKEYS,
  boolean
>;

@injectable()
export class MigrateMissingPublicKeysFromKeystoneHandler
  implements HandlerType
{
  method = ExtensionRequest.KEYSTONE_MIGRATE_MISSING_PUBKEYS as const;

  constructor(
    private secretsService: SecretsService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      const activeAccount = await this.accountsService.getActiveAccount();
      if (!activeAccount) {
        throw new Error('There is no active account');
      }
      const secrets =
        await this.secretsService.getAccountSecrets(activeAccount);

      if (secrets.secretType !== SecretType.Keystone3Pro) {
        return {
          ...request,
          result: true,
        };
      }

      const walletId = secrets.id;

      if (!walletId) {
        throw new Error('Wallet id is missing');
      }

      const accounts =
        await this.accountsService.getPrimaryAccountsByWalletId(walletId);
      const accountIndexIds = accounts.map((account) => ({
        id: account.id,
        index: account.index,
      }));

      const indicesWithMissingXPKeys = accountIndexIds.filter(({ index }) => {
        const xpubXP = getExtendedPublicKey(
          secrets.extendedPublicKeys,
          getAvalancheExtendedKeyPath(index),
          'secp256k1',
        );
        const hasXPPublicKey = hasPublicKeyFor(
          secrets,
          getAddressDerivationPath(index, 'AVM'),
          'secp256k1',
        );

        return !xpubXP || !hasXPPublicKey;
      });

      // nothing to update, exit early
      if (indicesWithMissingXPKeys.length === 0) {
        return {
          ...request,
          result: true,
        };
      }

      let hasError = false;
      const newExtendedPublicKeys: ExtendedPublicKey[] = [];
      const newPublicKeys: AddressPublicKeyJson[] = [];

      for (const { index } of indicesWithMissingXPKeys) {
        try {
          const xpPublicKeyPath = getAddressDerivationPath(index, 'AVM');
          const xpubXPPath = getAvalancheExtendedKeyPath(index);

          let xpubXP = getExtendedPublicKey(
            secrets.extendedPublicKeys,
            xpubXPPath,
            'secp256k1',
          );

          if (!xpubXP) {
            const app = new KeystoneUSBAvalancheSDK(
              await createKeystoneTransport(),
            );
            const { publicKey, chainCode } = await app.getPubkey(
              getAvalancheExtendedKeyPath(index),
              KeystoneCurve.secp256k1,
              DerivationAlgorithm.slip10,
            );
            xpubXP = buildExtendedPublicKey(
              fromPublicKey(
                Buffer.from(publicKey, 'hex'),
                chainCode,
              ).toBase58(),
              getAvalancheExtendedKeyPath(index),
            );
            newExtendedPublicKeys.push(xpubXP);
          }

          if (hasPublicKeyFor(secrets, xpPublicKeyPath, 'secp256k1')) {
            continue;
          }

          const xpPublicKey = AddressPublicKey.fromExtendedPublicKeys(
            [xpubXP],
            'secp256k1',
            xpPublicKeyPath,
          );

          newPublicKeys.push(xpPublicKey.toJSON());
        } catch (_err) {
          hasError = true;
          break;
        }
      }

      if (newPublicKeys.length > 0 || newExtendedPublicKeys.length > 0) {
        await this.secretsService.updateSecrets(
          {
            publicKeys: [...secrets.publicKeys, ...newPublicKeys],
            extendedPublicKeys: [
              ...secrets.extendedPublicKeys,
              ...newExtendedPublicKeys,
            ],
          },
          walletId,
        );

        for (const { id } of indicesWithMissingXPKeys) {
          await this.accountsService.refreshAddressesForAccount(id);
        }
      }

      if (hasError) {
        throw new Error(
          'Error while searching for missing public keys: incomplete migration.',
        );
      }

      return {
        ...request,
        result: true,
      };
    } catch (err: any) {
      return {
        ...request,
        error: err instanceof Error ? err.message : err.toString(),
      };
    }
  };
}
