import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { permissions$ } from '../permissions';

async function getAllPermissions(request: ExtensionConnectionMessage) {
  const params = request.params;
  if (!params) {
    return {
      ...request,
      error: 'no params on request',
    };
  }

  const currentPermissions = await firstValueFrom(permissions$);

  return {
    ...request,
    result: currentPermissions,
  };
}

export const GetAllPermissionsRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.PERMISSIONS_GET_ALL_PERMISSIONS, getAllPermissions];
