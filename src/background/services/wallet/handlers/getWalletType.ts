import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { WalletService } from '../WalletService';
import { injectable } from 'tsyringe';

@injectable()
export class GetWalletTypeHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.WALLET_GET_TYPE];

  constructor(private walletService: WalletService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    return {
      ...request,
      result: this.walletService.walletType,
    };
  };
}
