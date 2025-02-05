import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { DappPermissions } from '../models';
import type { PermissionsService } from '../PermissionsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.PERMISSIONS_GET_PERMISSIONS,
  DappPermissions | undefined,
  [domain: string]
>;

@injectable()
export class GetPermissionsForDomainHandler implements HandlerType {
  method = ExtensionRequest.PERMISSIONS_GET_PERMISSIONS as const;

  constructor(private permissionsService: PermissionsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [domain] = request.params;

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
