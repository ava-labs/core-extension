import { injectable } from 'tsyringe';
import { DerivationPath } from '@avalabs/core-wallets-sdk';

import {
  SecretType,
  ExtensionRequest,
  ExtensionRequestHandler,
  LegacyImportLedgerWalletParams,
  ImportWalletResult,
  ImportLedgerWalletParams,
} from '@core/types';

import { WalletService } from '../WalletService';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_IMPORT_LEDGER_NEW,
  ImportWalletResult,
  [Exclude<ImportLedgerWalletParams, LegacyImportLedgerWalletParams>]
>;

@injectable()
export class ImportLedgerHandlerNew implements HandlerType {
  method = ExtensionRequest.WALLET_IMPORT_LEDGER_NEW as const;

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
    const [{ addressPublicKeys, extendedPublicKeys, name }] = request.params;

    if (!addressPublicKeys.length) {
      return {
        ...request,
        error: `Missing required param: need at least one address public key`,
      };
    }

    const secretType =
      extendedPublicKeys.length === 0
        ? SecretType.LedgerLive
        : SecretType.Ledger;

    const id =
      secretType === SecretType.Ledger
        ? await this.walletService.addPrimaryWallet({
            secretType,
            derivationPathSpec: DerivationPath.BIP44,
            extendedPublicKeys,
            publicKeys: addressPublicKeys,
            name,
          })
        : await this.walletService.addPrimaryWallet({
            secretType,
            derivationPathSpec: DerivationPath.LedgerLive,
            extendedPublicKeys: [],
            publicKeys: addressPublicKeys,
            name,
          });

    // Number of accounts is equal to the number of derived EVM public keys, since they are always provided.
    const numberOfAccounts = addressPublicKeys.filter(({ derivationPath }) =>
      isEvmDerivationPath(derivationPath),
    ).length;

    await this.#addAccounts(id, numberOfAccounts);

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

const isEvmDerivationPath = (derivationPath: string) =>
  derivationPath.startsWith(`m/44'/60'/`);
