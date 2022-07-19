import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { TokenWithBalance } from '../../balances/models';
import { SendState } from '../models';
import { SendService } from '../SendService';

export type SendValidateHandlerType<
  T extends TokenWithBalance = TokenWithBalance
> = ExtensionRequestHandler<
  ExtensionRequest.SEND_VALIDATE,
  SendState<T>,
  SendState<T>
>;

@injectable()
export class SendValidateHandler implements SendValidateHandlerType {
  method = ExtensionRequest.SEND_VALIDATE as const;

  constructor(private sendService: SendService) {}

  handle: SendValidateHandlerType['handle'] = async (request) => {
    const sendState = request.params;

    if (!sendState) {
      return { ...request, error: 'Missing sendState' };
    }

    const result = await this.sendService.validateStateAndCalculateFees(
      sendState
    );

    return { ...request, result };
  };
}
