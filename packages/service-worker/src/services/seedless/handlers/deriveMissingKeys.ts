import { injectable } from 'tsyringe';

import {
  ExtensionRequest,
  ExtensionRequestHandler,
  SecretType,
} from '@core/types';

import { AccountsService } from '../../accounts/AccountsService';
import { SecretsService } from '../../secrets/SecretsService';
import { SeedlessTokenStorage } from '../SeedlessTokenStorage';
import { SeedlessWallet } from '../SeedlessWallet';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_DERIVE_MISSING_KEYS,
  void,
  { walletId: string }
>;

@injectable()
export class DeriveMissingKeysHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_DERIVE_MISSING_KEYS as const;

  constructor(
    private secretsService: SecretsService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { walletId } = request.params ?? {};

    try {
      const secrets = await this.secretsService.getSecretsById(walletId);

      if (secrets.secretType !== SecretType.Seedless) {
        return {
          ...request,
          error: 'Wallet is not a seedless wallet',
        };
      }
      const addressPublicKey = secrets.publicKeys[0];

      if (!addressPublicKey) {
        return {
          ...request,
          error:
            'Wallet storage seems to be corrupted, there are no public keys derived at all',
        };
      }

      const seedlessWallet = new SeedlessWallet({
        sessionStorage: new SeedlessTokenStorage(this.secretsService),
        addressPublicKeys: [addressPublicKey],
      });

      await seedlessWallet.deriveMissingKeys();

      const updatedKeys = await seedlessWallet.getPublicKeys();

      await this.secretsService.updateSecrets(
        { publicKeys: updatedKeys },
        walletId,
      );

      // Refresh addresses for all accounts in the wallet
      const accounts =
        await this.accountsService.getPrimaryAccountsByWalletId(walletId);

      const accountIds = accounts.map((acc) => acc.id);

      for (const id of accountIds) {
        await this.accountsService.refreshAddressesForAccount(id);
      }

      return {
        ...request,
        result: undefined,
      };
    } catch (error: any) {
      return {
        ...request,
        error: error instanceof Error ? error.message : error.toString(),
      };
    }
  };
}
