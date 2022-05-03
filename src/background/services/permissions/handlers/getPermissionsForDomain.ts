import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { PermissionsService } from '../PermissionsService';
@injectable()
export class GetPermissionsForDomainHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.PERMISSIONS_GET_PERMISSIONS];

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

    const domain = params[0];

    if (!domain) {
      return {
        ...request,
        error: 'no domain in params',
      };
    }

    const domainPermissions =
      await this.permissionsService.getPermissionsForDomain(domain);

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
  };
}
