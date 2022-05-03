import { getContractDataErc20 } from '@avalabs/avalanche-wallet-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
@injectable()
export class GetTokenDataHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SETTINGS_GET_TOKEN_DATA];

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [tokenAddress] = request.params || [];
    try {
      const tokenData = await getContractDataErc20(tokenAddress);
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
