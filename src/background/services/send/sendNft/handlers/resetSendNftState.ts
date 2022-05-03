import { SEND_NFT_FORM_DEFAULT } from '@avalabs/wallet-react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
@injectable()
export class SendNftResetHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_NFT_RESET];

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [contractAddress, tokenId] = request.params || [];

    if (!contractAddress) {
      return {
        ...request,
        error: 'no contractAddress in params',
      };
    }

    if (!tokenId) {
      return {
        ...request,
        error: 'no tokenId in params',
      };
    }

    return {
      ...request,
      result: {
        ...SEND_NFT_FORM_DEFAULT,
        contractAddress,
        tokenId,
      },
    };
  };
}
