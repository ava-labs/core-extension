import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import type { LockService } from '../LockService';

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
