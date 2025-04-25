import { ExtensionRequest, ExtensionRequestHandler, WalletDetails } from '@core/types';
import { injectable } from 'tsyringe';
import { SecretsService } from '../../secrets/SecretsService';

export type HandlerType = ExtensionRequestHandler<
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
