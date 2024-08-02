import { injectable } from 'tsyringe';
import { DerivationPath } from '@avalabs/core-wallets-sdk';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { SecretType } from '../../secrets/models';
import { WalletService } from '../WalletService';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';

import { ImportLedgerWalletParams, ImportWalletResult } from './models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_IMPORT_LEDGER,
  ImportWalletResult,
  [ImportLedgerWalletParams]
>;

@injectable()
export class ImportLedgerHandler implements HandlerType {
  method = ExtensionRequest.WALLET_IMPORT_LEDGER as const;

  constructor(
    private walletService: WalletService,
    private accountsService: AccountsService,
    private secretsService: SecretsService
  ) {}

  async #addAccounts(walletId: string, numberOfAccounts: number = 3) {
    // We need to await each of these calls, otherwise there may be race conditions
    // (i.e. address for 0-index account derived N times).

    for (let i = 0; i < numberOfAccounts; i++) {
      await this.accountsService.addPrimaryAccount({
        walletId,
      });
    }
  }

  handle: HandlerType['handle'] = async ({ request }) => {
    const [{ xpub, xpubXP, pubKeys, secretType, name }] = request.params;

    if (
      secretType !== SecretType.Ledger &&
      secretType !== SecretType.LedgerLive
    ) {
      return {
        ...request,
        error: `Invalid type: ${secretType}`,
      };
    }
    const secret = secretType === SecretType.Ledger ? xpub : pubKeys;

    if (!secret) {
      return {
        ...request,
        error: `Missing required param: Need xpub or pubKeys`,
      };
    }

    const isKnown = await this.secretsService.isKnownSecret(secretType, secret);

    if (isKnown) {
      return {
        ...request,
        error: `This wallet already exists`,
      };
    }

    let id: string;
    if (secretType === SecretType.Ledger) {
      id = await this.walletService.addPrimaryWallet({
        secretType,
        xpub,
        xpubXP,
        name,
        derivationPath: DerivationPath.BIP44,
      });
    } else {
      if (!pubKeys) {
        return {
          ...request,
          error: 'Public keys are missing',
        };
      }

      id = await this.walletService.addPrimaryWallet({
        secretType,
        pubKeys,
        name,
        derivationPath: DerivationPath.LedgerLive,
      });
    }

    const numberOfAccountsToCreate =
      secretType === SecretType.LedgerLive ? pubKeys?.length : undefined;

    await this.#addAccounts(id, numberOfAccountsToCreate);
    const addedWallet = await this.secretsService.getWalletAccountsSecretsById(
      id
    );
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
