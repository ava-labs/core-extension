import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { SendService } from '../SendService';
import { deserializeSendState } from '../utils/deserializeSendState';

@injectable()
export class SendSubmitHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_SUBMIT];

  constructor(private sendService: SendService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [serializedState] = request.params || [];
    const sendState = deserializeSendState(serializedState);

    if (!sendState) {
      return { ...request, error: 'missing sendState' };
    }

    const [result, error] = await resolve(this.sendService.send(sendState));
    return {
      ...request,
      result: result,
      error: error ? error.message || error.toString() : undefined,
    };
  };
}
