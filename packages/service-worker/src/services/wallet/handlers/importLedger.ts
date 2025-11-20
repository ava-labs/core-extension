import { injectable } from 'tsyringe';
import {
  DerivationPath,
  getAddressDerivationPath,
  getSolanaDerivationPath,
} from '@avalabs/core-wallets-sdk';

import { assertPresent } from '@core/common';
import {
  AVALANCHE_BASE_DERIVATION_PATH,
  AddressPublicKeyJson,
  EVM_BASE_DERIVATION_PATH,
  ExtendedPublicKey,
  SecretType,
  ExtensionRequest,
  ExtensionRequestHandler,
  SecretsError,
  LegacyImportLedgerWalletParams,
  ImportWalletResult,
} from '@core/types';

import { WalletService } from '../WalletService';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';

import { buildExtendedPublicKey } from '../../secrets/utils';
import { isNotNullish } from '@core/common';
import { addAllAccountsWithHistory } from '~/services/accounts/utils/addAllAccountsWithHistory';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_IMPORT_LEDGER,
  ImportWalletResult,
  [LegacyImportLedgerWalletParams]
>;

@injectable()
export class ImportLedgerHandler implements HandlerType {
  method = ExtensionRequest.WALLET_IMPORT_LEDGER as const;

  constructor(
    private walletService: WalletService,
    private accountsService: AccountsService,
    private secretsService: SecretsService,
  ) {}

  async #addAccounts(walletId: string, numberOfAccounts: number = 3) {
    // We need to await each of these calls, otherwise there may be race conditions
    // (i.e. address for 0-index account derived N times).

    for (let i = 0; i < numberOfAccounts; i++) {
      const accountId = await this.accountsService.addPrimaryAccount({
        walletId,
      });
      if (i === 0) {
        await this.accountsService.activateAccount(accountId);
      }
    }
  }

  handle: HandlerType['handle'] = async ({ request }) => {
    const [
      {
        xpub,
        xpubXP,
        pubKeys,
        secretType,
        name,
        dryRun,
        numberOfAccountsToCreate,
      },
    ] = request.params;

    if (
      secretType !== SecretType.Ledger &&
      secretType !== SecretType.LedgerLive
    ) {
      return {
        ...request,
        error: `Invalid type: ${secretType}`,
      };
    }

    if (!xpub && !pubKeys) {
      return {
        ...request,
        error: `Missing required param: Need xpub or pubKeys`,
      };
    }

    if (secretType === SecretType.Ledger) {
      assertPresent(xpub, SecretsError.MissingExtendedPublicKey);

      const isKnown = await this.secretsService.isKnownSecret(secretType, xpub);

      if (isKnown) {
        return {
          ...request,
          error: 'This wallet already exists',
        };
      }
    } else if (secretType === SecretType.LedgerLive) {
      assertPresent(pubKeys?.[0], SecretsError.PublicKeyNotFound);

      const isKnown = await this.secretsService.isKnownSecret(
        secretType,
        pubKeys[0].evm,
      );

      if (isKnown) {
        return {
          ...request,
          error: 'This wallet already exists',
        };
      }
    }

    if (dryRun) {
      return {
        ...request,
        result: {
          id: '0',
          name,
          type: secretType,
        },
      };
    }

    let id: string;
    if (secretType === SecretType.Ledger) {
      const extendedPublicKeys: ExtendedPublicKey[] = [
        buildExtendedPublicKey(xpub, EVM_BASE_DERIVATION_PATH),
      ];
      if (xpubXP) {
        extendedPublicKeys.push(
          buildExtendedPublicKey(xpubXP, AVALANCHE_BASE_DERIVATION_PATH),
        );
      }
      const solanaKeys = (pubKeys ?? [])
        .map((pubKey, index) => {
          if (!pubKey.svm) {
            return null;
          }

          return {
            type: 'address-pubkey',
            curve: 'ed25519',
            derivationPath: getSolanaDerivationPath(index),
            key: pubKey.svm,
          } as const;
        })
        .filter(isNotNullish);

      id = await this.walletService.addPrimaryWallet({
        secretType,
        derivationPathSpec: DerivationPath.BIP44,
        extendedPublicKeys,
        publicKeys: solanaKeys, // The EVM and XP address keys will be populated at the end of this function
        name,
      });
    } else {
      if (!pubKeys) {
        return {
          ...request,
          error: 'Public keys are missing',
        };
      }

      const publicKeys: AddressPublicKeyJson<true>[] = [];

      for (const [index, pubKey] of pubKeys.entries()) {
        publicKeys.push({
          curve: 'secp256k1',
          key: pubKey.evm,
          derivationPath: getAddressDerivationPath(index, 'EVM'),
          type: 'address-pubkey',
        });

        if (pubKey.xp) {
          publicKeys.push({
            curve: 'secp256k1',
            key: pubKey.xp,
            derivationPath: getAddressDerivationPath(index, 'AVM'),
            type: 'address-pubkey',
          });
        }

        if (pubKey.svm) {
          publicKeys.push({
            curve: 'ed25519',
            key: pubKey.svm,
            derivationPath: getSolanaDerivationPath(index),
            type: 'address-pubkey',
          });
        }
      }

      id = await this.walletService.addPrimaryWallet({
        secretType,
        derivationPathSpec: DerivationPath.LedgerLive,
        extendedPublicKeys: [],
        publicKeys,
        name,
      });
    }

    const accountsToBeCreated = numberOfAccountsToCreate || 3;
    const accountsToCreate = Math.max(
      1,
      pubKeys?.length
        ? Math.min(pubKeys.length, accountsToBeCreated)
        : accountsToBeCreated,
    );
    if (pubKeys?.length) {
      await this.#addAccounts(id, accountsToCreate);
    } else {
      const accountIds = await addAllAccountsWithHistory({
        walletId: id,
      });
      if (accountIds[0]) {
        this.accountsService.activateAccount(accountIds[0]);
      }
    }

    const addedWallet =
      await this.secretsService.getWalletAccountsSecretsById(id);
    return {
      ...request,
      result: {
        type: secretType,
        name: addedWallet.name,
        id,
      },
    };
  };
}
