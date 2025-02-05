import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { Permissions } from '../models';
import type { PermissionsService } from '../PermissionsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.PERMISSIONS_GET_ALL_PERMISSIONS,
  Permissions
>;

@injectable()
export class GetAllPermissionsHandler implements HandlerType {
  method = ExtensionRequest.PERMISSIONS_GET_ALL_PERMISSIONS as const;

  constructor(private permissionsService: PermissionsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const currentPermissions = await this.permissionsService.getPermissions();

    return {
      ...request,
      result: currentPermissions,
    };
  };
}
