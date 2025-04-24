import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { resolve } from '@core/utils';
import { injectable } from 'tsyringe';
import { LockService } from '../LockService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LOCK_CHANGE_PASSWORD,
  true,
  [newPassword: string, oldPassword: string]
>;

@injectable()
export class LockChangePasswordHandler implements HandlerType {
  method = ExtensionRequest.LOCK_CHANGE_PASSWORD as const;

  constructor(private lockService: LockService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [newPassword, oldPassword] = request.params;

    if (oldPassword === newPassword) {
      return {
        ...request,
        error: 'New password is the same as the old',
      };
    }

    const [, err] = await resolve(
      this.lockService.changePassword(oldPassword, newPassword),
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
