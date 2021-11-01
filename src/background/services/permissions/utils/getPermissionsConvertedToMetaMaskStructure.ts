import { Permissions } from '../models';
import { domainHasAccountsPermissions } from './domainHasAccountPermissions';

/**
 * In order to work with the @link https://metamask.github.io/test-dapp/ we convert our own
 * permissions to the structure currently used by metamask
 *
 * @param domain the domain for which permissions are being requested
 * @returns
 */
export function getPermissionsConvertedToMetaMaskStructure(
  domain?: string,
  permissions?: Permissions
) {
  if (!domain || !permissions) {
    return [];
  }

  const hasAccountsPermission = domainHasAccountsPermissions(
    domain,
    permissions
  );
  return hasAccountsPermission
    ? [
        {
          invoker: domain,
          parentCapability: 'accounts',
        },
      ]
    : [];
}
