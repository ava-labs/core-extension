import { injectable } from 'tsyringe';

import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { PermissionsService } from '../PermissionsService';
import { ethErrors } from 'eth-rpc-errors';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.PERMISSIONS_REVOKE_ADDRESS_ACCESS_FOR_DOMAINS,
  true,
  [domains: string[], addresses: string[]]
>;

@injectable()
export class RevokeAddressPermissionsForDomainsHandler implements HandlerType {
  method =
    ExtensionRequest.PERMISSIONS_REVOKE_ADDRESS_ACCESS_FOR_DOMAINS as const;

  constructor(private permissionsService: PermissionsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [domains, addresses] = request.params;

    if (!domains?.length || !addresses?.length) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams(
          'Expected a list of domains and list of addresses',
        ),
      };
    }

    await this.permissionsService.revokePermissionsForDomains(
      domains,
      addresses,
    );

    return {
      ...request,
      result: true,
    };
  };
}
