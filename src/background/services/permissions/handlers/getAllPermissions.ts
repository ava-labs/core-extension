import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { Permissions } from '../models';
import { PermissionsService } from '../PermissionsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.PERMISSIONS_GET_ALL_PERMISSIONS,
  Permissions
>;

@injectable()
export class GetAllPermissionsHandler implements HandlerType {
  method = ExtensionRequest.PERMISSIONS_GET_ALL_PERMISSIONS as const;

  constructor(private permissionsService: PermissionsService) {}

  handle: HandlerType['handle'] = async (request) => {
    const currentPermissions = await this.permissionsService.getPermissions();

    return {
      ...request,
      result: currentPermissions,
    };
  };
}
