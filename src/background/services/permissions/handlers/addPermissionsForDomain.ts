import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { addPermissionsForDomain } from '../permissions';

export async function addDAppPermissionsForDomain(
  request: ExtensionConnectionMessage
) {
  const params = request.params;
  if (!params) {
    return {
      ...request,
      error: 'no params on request',
    };
  }

  const permissions = params[0];

  if (!permissions) {
    return {
      ...request,
      error: 'no permissions in params',
    };
  }

  addPermissionsForDomain.next(permissions);

  return {
    ...request,
    result: true,
  };
}

export const AddPermissionsForDomainRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.PERMISSIONS_ADD_DOMAIN, addDAppPermissionsForDomain];
