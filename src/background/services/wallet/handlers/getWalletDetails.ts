import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { WalletDetails } from '../models';
import { SecretsService } from '../../secrets/SecretsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_GET_DETAILS,
  WalletDetails[]
>;

@injectable()
export class GetWalletDetailsHandler implements HandlerType {
  method = ExtensionRequest.WALLET_GET_DETAILS as const;

  constructor(private secretsService: SecretsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    return {
      ...request,
      result: await this.secretsService.getPrimaryWalletsDetails(),
    };
  };
}
