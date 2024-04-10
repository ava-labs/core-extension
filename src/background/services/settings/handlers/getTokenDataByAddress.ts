import { NetworkContractToken } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../../tokens/TokenManagerService';
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

  constructor(private tokenManagerService: TokenManagerService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [tokenAddress] = request.params;

    try {
      const tokenData = await this.tokenManagerService.getTokenData(
        tokenAddress
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
