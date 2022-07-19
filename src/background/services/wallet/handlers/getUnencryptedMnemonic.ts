import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { WalletService } from '../WalletService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC,
  string,
  [password: string]
>;

@injectable()
export class GetUnencryptedMnemonicHandler implements HandlerType {
  method = ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC as const;

  constructor(private walletService: WalletService) {}
  handle: HandlerType['handle'] = async (request) => {
    const [password] = request.params;

    if (!password) {
      return {
        ...request,
        error: 'password missing for request',
      };
    }

    const [decryptedMnemonic, err] = await resolve(
      this.walletService.getMnemonic(password)
    );

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    return {
      ...request,
      result: decryptedMnemonic,
    };
  };
}
