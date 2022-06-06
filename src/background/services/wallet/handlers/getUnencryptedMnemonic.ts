import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { resolve } from '@src/utils/promiseResolver';
import { WalletService } from '../WalletService';
import { injectable } from 'tsyringe';

@injectable()
export class GetUnencryptedMnemonicHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC];

  constructor(private walletService: WalletService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [password] = request.params || [];

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
