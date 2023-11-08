import {
  Avalanche,
  DerivationPath,
  getLedgerExtendedPublicKey,
  getPubKeyFromTransport,
} from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SecretType } from '../../secrets/models';
import { SecretsService } from '../../secrets/SecretsService';
import { PubKeyType } from '../../wallet/models';
import { LedgerService } from '../LedgerService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
  boolean
>;

@injectable()
export class MigrateMissingPublicKeysFromLedgerHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS as const;

  constructor(
    private secretsService: SecretsService,
    private ledgerService: LedgerService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    try {
      const secrets = await this.secretsService.getActiveAccountSecrets();

      if (
        secrets.type !== SecretType.Ledger &&
        secrets.type !== SecretType.LedgerLive
      ) {
        return {
          ...request,
          result: true,
        };
      }

      const transport = this.ledgerService.recentTransport;

      if (!transport) {
        throw new Error('Ledger transport not available');
      }

      if (secrets.type === SecretType.Ledger) {
        // nothing to update, exit early
        if (secrets.xpubXP) {
          return {
            ...request,
            result: true,
          };
        }

        const xpubXP = await getLedgerExtendedPublicKey(
          transport,
          false,
          Avalanche.LedgerWallet.getAccountPath('X')
        );

        await this.secretsService.updateSecrets({ xpubXP });
      } else if (secrets.type === SecretType.LedgerLive) {
        const hasMissingXPPublicKey = (secrets.pubKeys ?? []).some(
          (pubKey) => !pubKey.xp
        );

        // nothing to migrate, exit early
        if (!hasMissingXPPublicKey) {
          return {
            ...request,
            result: true,
          };
        }

        const migrationResult: {
          updatedPubKeys: PubKeyType[];
          hasError: boolean;
        } = {
          updatedPubKeys: [],
          hasError: false,
        };

        for (const [index, pubKey] of (secrets.pubKeys ?? []).entries()) {
          if (!pubKey.xp) {
            try {
              const addressPublicKeyXP = await getPubKeyFromTransport(
                transport,
                index,
                DerivationPath.LedgerLive,
                'AVM'
              );

              migrationResult.updatedPubKeys.push({
                ...pubKey,
                xp: addressPublicKeyXP.toString('hex'),
              });
            } catch (err) {
              migrationResult.updatedPubKeys.push(pubKey);
              migrationResult.hasError = true;
            }
          } else {
            migrationResult.updatedPubKeys.push(pubKey);
          }
        }

        await this.secretsService.updateSecrets({
          pubKeys: migrationResult.updatedPubKeys,
        });

        if (migrationResult.hasError) {
          throw new Error(
            'Error while searching for missing public keys: incomplete migration.'
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
