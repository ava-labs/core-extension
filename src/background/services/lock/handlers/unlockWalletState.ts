import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { LockService } from '../LockService';
import { injectable } from 'tsyringe';

@injectable()
export class UnlockWalletHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.UNLOCK_WALLET];

  constructor(private lockService: LockService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const params = request.params;

    if (!params) {
      return {
        ...request,
        error: 'params missing from request',
      };
    }

    const password = params.pop();

    if (!password) {
      return {
        ...request,
        error: 'password missing for request',
      };
    }

    const [, err] = await resolve(this.lockService.unlock(password));

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    return {
      ...request,
      result: true,
    };
  };
}
