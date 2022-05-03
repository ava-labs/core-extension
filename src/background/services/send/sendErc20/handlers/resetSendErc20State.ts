import { SEND_ERC20_FORM_DEFAULT } from '@avalabs/wallet-react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
@injectable()
export class SendErc20ResetHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_ERC20_RESET];

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [token] = request.params || [];

    if (!token) {
      return {
        ...request,
        error: 'no token in params',
      };
    }

    return {
      ...request,
      result: {
        ...SEND_ERC20_FORM_DEFAULT,
        token,
      },
    };
  };
}
