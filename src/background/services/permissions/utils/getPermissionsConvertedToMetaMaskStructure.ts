import { Permissions } from '../models';

/**
 * In order to work with the @link https://metamask.github.io/test-dapp/ we convert our own
 * permissions to the structure currently used by metamask
 *
 * @param domain the domain for which permissions are being requested
 * @returns
 */
export function getPermissionsConvertedToMetaMaskStructure(
  addressC?: string,
  domain?: string,
  permissions?: Permissions
) {
  if (!domain || !permissions || !addressC) {
    return [];
  }

  const hasAccountsPermission = permissions?.[domain]?.accounts[addressC];

  return hasAccountsPermission
    ? [
        {
          invoker: domain,
          parentCapability: 'accounts',
        },
      ]
    : [];
}
