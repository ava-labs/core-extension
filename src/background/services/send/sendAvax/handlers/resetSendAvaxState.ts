import { DEFAULT_SEND_AVAX_FORM } from '@avalabs/wallet-react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
@injectable()
export class SendAvaxResetHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_AVAX_RESET];

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    return {
      ...request,
      result: DEFAULT_SEND_AVAX_FORM,
    };
  };
}
