import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../../tokens/TokenManagerService';
@injectable()
export class GetTokenDataHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SETTINGS_GET_TOKEN_DATA];

  constructor(private tokenManagerService: TokenManagerService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [tokenAddress] = request.params || [];
    try {
      const tokenData = await this.tokenManagerService.getTokenData(
        tokenAddress
      );
      return {
        ...request,
        result: tokenData,
      };
    } catch {
      return {
        ...request,
        result: false,
      };
    }
  };
}
