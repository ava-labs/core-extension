import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { PermissionsService } from '../PermissionsService';
@injectable()
export class GetAllPermissionsHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.PERMISSIONS_GET_ALL_PERMISSIONS];

  constructor(private permissionsService: PermissionsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const currentPermissions = await this.permissionsService.getPermissions();

    return {
      ...request,
      result: currentPermissions,
    };
  };
}
