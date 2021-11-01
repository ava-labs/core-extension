import { Permissions } from '../models';

/**
 * In order for a domain to qualify as permitted it needs to have added accounts, at
 * least one of those accounts needs to be granted
 *
 * @param domain the domain we want to check for permissions
 * @returns boolean
 */
export function domainHasAccountsPermissions(
  domain?: string,
  permissions?: Permissions
) {
  return !!(
    domain &&
    permissions?.[domain] &&
    permissions[domain].accounts &&
    Object.values(permissions[domain].accounts).length &&
    Object.values(permissions[domain].accounts).some((value) => value)
  );
}
