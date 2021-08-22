import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { permissions$ } from '../permissions';

export async function getPermissionsForDomain(
  request: ExtensionConnectionMessage
) {
  const params = request.params;
  if (!params) {
    return {
      ...request,
      error: new Error('no params on request'),
    };
  }

  const domain = params[0];

  if (!domain) {
    return {
      ...request,
      error: new Error('no domain in params'),
    };
  }

  const currentPermissions = firstValueFrom(permissions$);
  const domainPermissions = currentPermissions[domain];

  if (!domainPermissions) {
    return {
      ...request,
      result: undefined,
    };
  }

  return {
    ...request,
    result: domainPermissions,
  };
}

export const GetPermissionsForDomainRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.PERMISSIONS_GET_PERMISSIONS, getPermissionsForDomain];
