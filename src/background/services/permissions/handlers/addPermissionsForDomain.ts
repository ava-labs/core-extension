import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { PermissionsService } from '../PermissionsService';
@injectable()
export class PermissionsAddDomainHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.PERMISSIONS_ADD_DOMAIN];

  constructor(private permissionsService: PermissionsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const params = request.params;
    if (!params) {
      return {
        ...request,
        error: 'no params on request',
      };
    }

    const permissions = params[0];

    if (!permissions || !permissions.domain || !permissions.accounts) {
      return {
        ...request,
        error: 'no permissions in params',
      };
    }

    this.permissionsService.addPermission(permissions);

    return {
      ...request,
      result: true,
    };
  };
}
