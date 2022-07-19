import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { WalletType } from '../models';
import { WalletService } from '../WalletService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_GET_TYPE,
  WalletType | undefined
>;

@injectable()
export class GetWalletTypeHandler implements HandlerType {
  method = ExtensionRequest.WALLET_GET_TYPE as const;

  constructor(private walletService: WalletService) {}
  handle: HandlerType['handle'] = async (request) => {
    return {
      ...request,
      result: this.walletService.walletType,
    };
  };
}
