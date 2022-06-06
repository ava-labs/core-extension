import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { resolve } from '@src/utils/promiseResolver';
import { LockService } from '../LockService';
import { injectable } from 'tsyringe';

@injectable()
export class LockChangePasswordHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.LOCK_CHANGE_PASSWORD];

  constructor(private lockService: LockService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [newPassword, oldPassword] = request.params || [];

    if (!newPassword) {
      return {
        ...request,
        error: 'new password missing for request',
      };
    }

    if (!oldPassword) {
      return {
        ...request,
        error: 'old password missing for request',
      };
    }

    if (oldPassword === newPassword) {
      return {
        ...request,
        error: 'New password is the same as the old',
      };
    }

    const [, err] = await resolve(
      this.lockService.changePassword(oldPassword, newPassword)
    );

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
