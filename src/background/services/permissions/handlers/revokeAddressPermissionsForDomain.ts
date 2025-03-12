import { injectable } from 'tsyringe';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { PermissionsService } from '../PermissionsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.PERMISSIONS_REVOKE_ADDRESS_ACCESS_FOR_DOMAIN,
  true,
  [domain: string, addresses: string[]]
>;

@injectable()
export class RevokeAddressPermissionsForDomainHandler implements HandlerType {
  method =
    ExtensionRequest.PERMISSIONS_REVOKE_ADDRESS_ACCESS_FOR_DOMAIN as const;

  constructor(private permissionsService: PermissionsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [domain, addresses] = request.params;

    if (!domain || !addresses.length) {
      return {
        ...request,
        error: 'no permissions in params',
      };
    }

    this.permissionsService.revokePermission(domain, addresses);

    return {
      ...request,
      result: true,
    };
  };
}
