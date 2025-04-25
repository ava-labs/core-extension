import {
  ExtensionRequest,
  ExtensionRequestHandler,
  Permissions,
} from '@core/types';
import { injectable } from 'tsyringe';
import { PermissionsService } from '../PermissionsService';

export type HandlerType = ExtensionRequestHandler<
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
