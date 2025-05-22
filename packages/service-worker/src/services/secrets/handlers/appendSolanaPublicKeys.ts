import { injectable } from 'tsyringe';
import { getSolanaDerivationPath } from '@avalabs/core-wallets-sdk';

import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { AccountsService } from '../../accounts/AccountsService';
import { AddressPublicKey } from '../AddressPublicKey';
import { SecretsService } from '../SecretsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SECRETS_APPEND_SOLANA_PUBLIC_KEYS,
  undefined,
  { publicKeys: { index: number; key: string }[]; walletId: string }
>;

@injectable()
export class AppendSolanaPublicKeysHandler implements HandlerType {
  method = ExtensionRequest.SECRETS_APPEND_SOLANA_PUBLIC_KEYS as const;

  constructor(
    private accountsService: AccountsService,
    private secretsService: SecretsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { publicKeys, walletId } = request.params ?? {};

    try {
      // Append derived public keys
      const addressPublicKeys = publicKeys.map(({ index, key }) =>
        AddressPublicKey.fromJSON({
          curve: 'ed25519',
          derivationPath: getSolanaDerivationPath(index),
          key,
        }).toJSON(),
      );

      await this.secretsService.appendPublicKeys(walletId, addressPublicKeys);

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
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
