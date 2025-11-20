import {
  Avalanche,
  DerivationPath,
  getLedgerExtendedPublicKey,
  getPubKeyFromTransport,
  getAddressDerivationPath,
} from '@avalabs/core-wallets-sdk';
import {
  ExtensionRequest,
  ExtensionRequestHandler,
  AddressPublicKeyJson,
  SecretType,
  AVALANCHE_BASE_DERIVATION_PATH,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SecretsService } from '../../secrets/SecretsService';
import { LedgerService } from '../LedgerService';
import { AccountsService } from '../../accounts/AccountsService';
import { getExtendedPublicKey, hasPublicKeyFor } from '../../secrets/utils';

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

      if (secrets.secretType === SecretType.Ledger) {
        // nothing to update, exit early
        if (
          getExtendedPublicKey(
            secrets.extendedPublicKeys,
            AVALANCHE_BASE_DERIVATION_PATH,
            'secp256k1',
          )
        ) {
          return {
            ...request,
            result: true,
          };
        }

        const xpubXP = await getLedgerExtendedPublicKey(
          transport,
          false,
          Avalanche.LedgerWallet.getAccountPath('X'),
        );

        await this.secretsService.updateSecrets(
          {
            extendedPublicKeys: [
              ...secrets.extendedPublicKeys,
              {
                type: 'extended-pubkey',
                curve: 'secp256k1',
                derivationPath: AVALANCHE_BASE_DERIVATION_PATH,
                key: xpubXP,
              },
            ],
          },
          walletId,
        );
      } else if (secrets.secretType === SecretType.LedgerLive) {
        const accounts =
          await this.accountsService.getPrimaryAccountsByWalletId(secrets.id);

        const missingDerivationPaths: [number, string][] = [];

        for (let i = 0; i < accounts.length; i++) {
          const account = accounts[i]!;
          const avmDerivationPath = getAddressDerivationPath(
            account.index,
            'AVM',
          );

          if (!hasPublicKeyFor(secrets, avmDerivationPath, 'secp256k1')) {
            missingDerivationPaths.push([account.index, avmDerivationPath]);
          }
        }

        // nothing to migrate, exit early
        if (!missingDerivationPaths.length) {
          return {
            ...request,
            result: true,
          };
        }

        const migrationResult: {
          newPubKeys: AddressPublicKeyJson[];
          hasError: boolean;
        } = {
          newPubKeys: [],
          hasError: false,
        };

        for (const [accountIndex, derivationPath] of missingDerivationPaths) {
          try {
            const addressPublicKeyXP = await getPubKeyFromTransport(
              transport,
              accountIndex,
              DerivationPath.LedgerLive,
              'AVM',
            );

            migrationResult.newPubKeys.push({
              curve: 'secp256k1',
              derivationPath,
              key: addressPublicKeyXP.toString('hex'),
              type: 'address-pubkey',
            });
          } catch (_err) {
            migrationResult.hasError = true;
            break;
          }
        }

        await this.secretsService.updateSecrets(
          {
            publicKeys: [...secrets.publicKeys, ...migrationResult.newPubKeys],
          },
          walletId,
        );

        if (migrationResult.hasError) {
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
