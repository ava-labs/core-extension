import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../../tokens/TokenManagerService';
import { NetworkService } from '../../network/NetworkService';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_GET_TOKEN_DATA,
  NetworkContractToken | null | false,
  [tokenAddress: string]
>;

@injectable()
export class GetTokenDataHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_GET_TOKEN_DATA as const;

  constructor(
    private tokenManagerService: TokenManagerService,
    private networkService: NetworkService
  ) {}

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    const [tokenAddress] = request.params;
    const network = await this.networkService.getNetwork(scope);

    if (!network) {
      return {
        ...request,
        error: 'Target network not found',
      };
    }

    try {
      const tokenData = await this.tokenManagerService.getTokenData(
        tokenAddress,
        network
      );
      return {
        ...request,
        result: tokenData,
      };
    } catch (err: any) {
      sentryCaptureException(err, SentryExceptionTypes.INTERNAL_ERROR);

      return {
        ...request,
        result: false,
      };
    }
  };
}
