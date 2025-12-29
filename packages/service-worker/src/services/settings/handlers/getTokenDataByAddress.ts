import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../../tokens/TokenManagerService';
import { NetworkService } from '../../network/NetworkService';
import { Monitoring } from '@core/common';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_GET_TOKEN_DATA,
  NetworkContractToken | null | false,
  [tokenAddress: string, networkId?: string]
>;

@injectable()
export class GetTokenDataHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_GET_TOKEN_DATA as const;

  constructor(
    private tokenManagerService: TokenManagerService,
    private networkService: NetworkService,
  ) {}

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    const [tokenAddress, networkId] = request.params;
    const network = await this.networkService.getNetwork(networkId || scope);

    if (!network) {
      return {
        ...request,
        error: 'Target network not found',
      };
    }

    try {
      const tokenData = await this.tokenManagerService.getTokenData(
        tokenAddress,
        network,
      );
      return {
        ...request,
        result: tokenData,
      };
    } catch (err: any) {
      Monitoring.sentryCaptureException(
        err,
        Monitoring.SentryExceptionTypes.INTERNAL_ERROR,
      );

      return {
        ...request,
        result: false,
      };
    }
  };
}
