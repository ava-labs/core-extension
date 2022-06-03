import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SendService } from '../SendService';
import { deserializeSendState } from '../utils/deserializeSendState';

@injectable()
export class SendValidateHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_VALIDATE];

  constructor(private sendService: SendService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [serializedState] = request.params || [];
    const sendState = deserializeSendState(serializedState);

    if (!sendState) {
      return { ...request, error: 'Missing sendState' };
    }

    const result = await this.sendService.validateStateAndCalculateFees(
      sendState
    );

    return { ...request, result };
  };
}
