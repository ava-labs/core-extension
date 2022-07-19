import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { SendState } from '../models';
import { SendService } from '../SendService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEND_SUBMIT,
  string,
  SendState
>;

@injectable()
export class SendSubmitHandler implements HandlerType {
  method = ExtensionRequest.SEND_SUBMIT as const;

  constructor(private sendService: SendService) {}

  handle: HandlerType['handle'] = async (request) => {
    const sendState = request.params;

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
