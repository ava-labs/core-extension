import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { resolve } from '@core/common';
import { injectable } from 'tsyringe';
import { LockService } from '../LockService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.UNLOCK_WALLET,
  true,
  [password: string]
>;

@injectable()
export class UnlockWalletHandler implements HandlerType {
  method = ExtensionRequest.UNLOCK_WALLET as const;

  constructor(private lockService: LockService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [password] = request.params;

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
