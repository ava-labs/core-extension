import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { LockService } from '../LockService';

@injectable()
export class GetLockStateHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.LOCK_GET_STATE];

  constructor(private lockService: LockService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    return {
      ...request,
      result: this.lockService.locked,
    };
  };
}
