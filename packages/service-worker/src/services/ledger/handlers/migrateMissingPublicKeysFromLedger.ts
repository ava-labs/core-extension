import {
  getLedgerExtendedPublicKey,
  getAddressDerivationPath,
} from '@avalabs/core-wallets-sdk';
import {
  ExtensionRequest,
  ExtensionRequestHandler,
  AddressPublicKeyJson,
  SecretType,
  ExtendedPublicKey,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SecretsService } from '../../secrets/SecretsService';
import { LedgerService } from '../LedgerService';
import { AccountsService } from '../../accounts/AccountsService';
import {
  buildExtendedPublicKey,
  getExtendedPublicKey,
  hasPublicKeyFor,
} from '../../secrets/utils';
import { getAvalancheExtendedKeyPath } from '@core/common';
import { AddressPublicKey } from '~/services/secrets/AddressPublicKey';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
  boolean
>;

@injectable()
export class MigrateMissingPublicKeysFromLedgerHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS as const;

  constructor(
    private secretsService: SecretsService,
    private ledgerService: LedgerService,
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
      if (
        secrets.secretType !== SecretType.Ledger &&
        secrets.secretType !== SecretType.LedgerLive
      ) {
        return {
          ...request,
          result: true,
        };
      }

      const walletId = secrets.id;

      if (!walletId) {
        throw new Error('Wallet id is missing');
      }

      const transport = this.ledgerService.recentTransport;

      if (!transport) {
        throw new Error('Ledger transport not available');
      }

      const accounts =
        await this.accountsService.getPrimaryAccountsByWalletId(walletId);
      const accountIndices = accounts.map((account) => account.index);

      const indicesWithMissingXPKeys = accountIndices.filter((index) => {
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

      for (const accountIndex of indicesWithMissingXPKeys) {
        try {
          const xpPublicKeyPath = getAddressDerivationPath(accountIndex, 'AVM');
          const xpubXPPath = getAvalancheExtendedKeyPath(accountIndex);

          let xpubXP = getExtendedPublicKey(
            secrets.extendedPublicKeys,
            xpubXPPath,
            'secp256k1',
          );

          if (!xpubXP) {
            const xpubXPString = await getLedgerExtendedPublicKey(
              transport,
              false,
              xpubXPPath,
            );

            xpubXP = buildExtendedPublicKey(xpubXPString, xpubXPPath);
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

        if (hasError) {
          throw new Error(
            'Error while searching for missing public keys: incomplete migration.',
          );
        }
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
