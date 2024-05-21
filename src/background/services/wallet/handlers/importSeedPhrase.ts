import { injectable } from 'tsyringe';
import {
  getXpubFromMnemonic,
  Avalanche,
  DerivationPath,
} from '@avalabs/wallets-sdk';
import { ethErrors } from 'eth-rpc-errors';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { SecretType } from '../../secrets/models';
import { WalletService } from '../WalletService';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';

import {
  ImportSeedphraseWalletParams,
  ImportWalletResult,
  SeedphraseImportError,
} from './models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_IMPORT_SEED_PHRASE,
  ImportWalletResult,
  [ImportSeedphraseWalletParams]
>;

@injectable()
export class ImportSeedPhraseHandler implements HandlerType {
  method = ExtensionRequest.WALLET_IMPORT_SEED_PHRASE as const;

  constructor(
    private walletService: WalletService,
    private accountsService: AccountsService,
    private secretsService: SecretsService
  ) {}

  async #addAccounts(walletId: string) {
    // We need to await each of these calls, otherwise there may be race conditions
    // (i.e. address for 0-index account derived N times).
    await this.accountsService.addPrimaryAccount({
      walletId,
    });
    await this.accountsService.addPrimaryAccount({
      walletId,
    });
    await this.accountsService.addPrimaryAccount({
      walletId,
    });
  }

  handle: HandlerType['handle'] = async (request) => {
    const [params] = request.params;
    const { mnemonic: rawMnemonic, name } = params;
    const mnemonic = rawMnemonic.toLowerCase(); // BIP39 seed phrases are case-insensitive

    const isKnown = await this.secretsService.isKnownSecret(
      SecretType.Mnemonic,
      mnemonic
    );

    if (isKnown) {
      return {
        ...request,
        error: ethErrors.rpc.invalidInput({
          data: {
            reason: SeedphraseImportError.ExistingSeedphrase,
          },
        }),
      };
    }

    const xpub = await getXpubFromMnemonic(mnemonic);
    const xpubXP = Avalanche.getXpubFromMnemonic(mnemonic);

    const id = await this.walletService.addPrimaryWallet({
      secretType: SecretType.Mnemonic,
      mnemonic,
      xpub,
      xpubXP,
      derivationPath: DerivationPath.BIP44,
      name,
    });

    await this.#addAccounts(id);

    const addedWallet = await this.secretsService.getWalletAccountsSecretsById(
      id
    );

    return {
      ...request,
      result: {
        type: SecretType.Mnemonic,
        name: addedWallet.name,
        id,
      },
    };
  };
}
