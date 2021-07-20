import { JsonRpcRequest } from './rpc/jsonRpcEngine';
import { Signal } from 'micro-signals';
import { store } from '@src/store/store';
import storageListener from './utils/storage';
import { formatAndLog } from './utils/logging';

export const DOMAIN_METADATA_METHOD = 'metamask_sendDomainMetadata';
export const CONNECT_METHOD = 'eth_requestAccounts';

/**
 * Add the name of the requests that need permissions here, like so:
 * eth_accounts = 'eth_accounts',
 *
 * This will flag the request, set it as pending until the permissions are verified. If the permissions
 * are non-existent then the call remains in pending until permissions are given or the connection is lost.
 */
export enum MethodsRequiringPermissions {}
export interface JSONRPCRequestWithDomain extends JsonRpcRequest<any> {
  domain: string;
}
export class PermissionsController {
  private connectionDomainSignal = new Signal<string>();

  private _destroy = new Signal<boolean>();
  destroy() {
    this._destroy.dispatch(true);
  }

  private methodsRequiringPermissions = new Set<string>(
    Object.values(MethodsRequiringPermissions)
  );

  /**
   * Assign this as a promise of the signal, the signal will resolve on the first push
   * and the promise will essentially act as a cache for the result
   */
  getDomain = this.connectionDomainSignal.promisify();

  private async permissionGranted(rpcReuqest: JsonRpcRequest<any>) {
    /**
     * Wait for the domain to be sent from the provider. This is one of two methods called
     * when the provider starts up. Each connection with a UI will have a provider and each
     * provider will push the domain metadata. nce we recieve that we push it into the domain
     * metadata signal and then all checks are kicked off.
     *
     * 1. Check if permissions already exist for domain
     *   a. If they do push the rpc downstream and proceed
     * 2. If they dont exist we will be waiting for a connect request from the UI
     *   a. popup will show asking for permissions
     *   b. user grants permissions and the popup writes to localstorage
     *   c. The listener sees that permissions have been written
     *   d. Verify that the permissions exists for the given domain
     */

    return this.getDomain.then((domain) => {
      formatAndLog('Permission request (pending)', rpcReuqest);

      const domainHasPermissions =
        store.permissionsStore.domainHasAccountsPermissions(domain);

      return domainHasPermissions
        ? rpcReuqest
        : storageListener
            .filter(() => {
              return store.permissionsStore.domainHasAccountsPermissions(
                domain
              );
            })
            .peek(() =>
              formatAndLog('Permission request (granted)', rpcReuqest)
            )
            .map(() => rpcReuqest)
            .promisify(
              this._destroy
                .peek(() => {
                  formatAndLog(
                    'Permission request canceled (connection destroyed)',
                    rpcReuqest
                  );
                })
                .map(() => 'destroyed connection')
            );
    });
  }

  async validateMethodPermissions(rpcReuqest: JsonRpcRequest<any>) {
    return this.methodsRequiringPermissions.has(rpcReuqest.method)
      ? this.permissionGranted(rpcReuqest)
      : this.onConnectAddDomainToRequest(rpcReuqest);
  }

  watchForDomainAndDispatch(rpcReuqest: JsonRpcRequest<any>) {
    if (rpcReuqest && rpcReuqest.method === DOMAIN_METADATA_METHOD) {
      this.connectionDomainSignal.dispatch(rpcReuqest.params.name);
    }

    return this;
  }

  /**
   * Since we are in a connection pipe and all instances belong to a particular pipe, we
   * essentially tag a pipe with a domain and then everything works as tagged. Downstream methods such
   * as permissions and what not use this "tag" to determine context'
   *
   * For that reason we update the request to include the domain that came from the provider. Then in the popup
   * we get permissions for that domain and act accordingly. This isnt the cleanest code but it makes sure a dApp
   * isnt injecting into the connection and becoming a bad actor.
   *
   * @param rpcReuqest
   * @returns
   */
  private async onConnectAddDomainToRequest(rpcReuqest: JsonRpcRequest<any>) {
    const domain = await this.getDomain;

    return rpcReuqest && rpcReuqest.method
      ? {
          ...rpcReuqest,
          domain,
        }
      : rpcReuqest;
  }
}
