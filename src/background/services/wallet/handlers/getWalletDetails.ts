import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { WalletDetails } from '../models';
import { WalletService } from '../WalletService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_GET_DETAILS,
  WalletDetails[]
>;

@injectable()
export class GetWalletDetailsHandler implements HandlerType {
  method = ExtensionRequest.WALLET_GET_DETAILS as const;

  constructor(private walletService: WalletService) {}

  handle: HandlerType['handle'] = async (request) => {
    return {
      ...request,
      result: this.walletService.wallets,
    };
  };
}
