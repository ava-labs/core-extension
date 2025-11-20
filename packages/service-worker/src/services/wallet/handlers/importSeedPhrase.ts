import { injectable } from 'tsyringe';
import {
  getXpubFromMnemonic,
  Avalanche,
  DerivationPath,
} from '@avalabs/core-wallets-sdk';
import { ethErrors } from 'eth-rpc-errors';

import {
  AVALANCHE_BASE_DERIVATION_PATH,
  EVM_BASE_DERIVATION_PATH,
  SecretType,
  ImportSeedphraseWalletParams,
  ImportWalletResult,
  SeedphraseImportError,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';

import { WalletService } from '../WalletService';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';

import { buildExtendedPublicKey } from '../../secrets/utils';
import { addAllAccountsWithHistory } from '~/services/accounts/utils/addAllAccountsWithHistory';

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
    private secretsService: SecretsService,
  ) {}

  async #addAccounts(walletId: string) {
    const accountIds = await addAllAccountsWithHistory({
      walletId,
    });
    if (accountIds[0]) {
      await this.accountsService.activateAccount(accountIds[0]);
    }
  }

  handle: HandlerType['handle'] = async ({ request }) => {
    const [params] = request.params;
    const { mnemonic: rawMnemonic, name } = params;
    const mnemonic = rawMnemonic.toLowerCase(); // BIP39 seed phrases are case-insensitive

    const isKnown = await this.secretsService.isKnownSecret(
      SecretType.Mnemonic,
      mnemonic,
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
    const xpubXP = Avalanche.getXpubFromMnemonic(mnemonic, 0);

    const id = await this.walletService.addPrimaryWallet({
      secretType: SecretType.Mnemonic,
      mnemonic,
      extendedPublicKeys: [
        buildExtendedPublicKey(xpub, EVM_BASE_DERIVATION_PATH),
        buildExtendedPublicKey(xpubXP, AVALANCHE_BASE_DERIVATION_PATH),
      ],
      publicKeys: [],
      derivationPathSpec: DerivationPath.BIP44,
      name,
    });

    await this.#addAccounts(id);

    const addedWallet =
      await this.secretsService.getWalletAccountsSecretsById(id);

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
