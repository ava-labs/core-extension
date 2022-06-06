import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { LockService } from '../LockService';

@injectable()
export class LockWalletHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.LOCK_WALLET];

  constructor(private lockService: LockService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    this.lockService.lock();

    return {
      ...request,
      result: true,
    };
  };
}
