import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { LockService } from '../LockService';

type HandlerType = ExtensionRequestHandler<ExtensionRequest.LOCK_WALLET, true>;

@injectable()
export class LockWalletHandler implements HandlerType {
  method = ExtensionRequest.LOCK_WALLET as const;

  constructor(private lockService: LockService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    this.lockService.lock();

    return {
      ...request,
      result: true,
    };
  };
}
