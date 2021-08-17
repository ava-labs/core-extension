import { Permissions } from '../models';

/**
 * If the permissions are popped open and the user closes it without giving permissions
 * than we need to write to disk beofre the window closes that permissions were refused. This
 * write will signal to the connect request that the user refused the connect and release the stream
 * so they can click connect again.
 *
 * @param domain the domain name
 * @returns boolean
 */
export function domainPermissionsExist(
  domain: string,
  permissions: Permissions
) {
  return !!permissions[domain];
}
