import { JsonRpcRequest } from './rpc/jsonRpcEngine';
import { Signal } from 'micro-signals';
import { DomainMetadata } from './models';
import { store } from '@src/store/store';
import storageListener from './utils/storage';
import { formatAndLog } from './utils/logging';

const domainMetadataSignal = new Signal<DomainMetadata>();

export const DOMAIN_METADATA_METHOD = 'metamask_sendDomainMetadata';

export enum MethodsRequiringPermissions {
  eth_accounts = 'eth_accounts',
}

export class PermissionsController {
  private _destroy = new Signal<boolean>();
  destroy() {
    this._destroy.dispatch(true);
  }

  private methodsRequiringPermissions = new Set<string>(
    Object.values(MethodsRequiringPermissions)
  );

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

    return domainMetadataSignal
      .peek((domainMetadata) =>
        formatAndLog('Permission request (domain set)', domainMetadata)
      )
      .promisify()
      .then((domainMetadata) => {
        formatAndLog('Permission request', rpcReuqest);
        return store.permissionsStore.domainHasPermissions(
          domainMetadata.method
        )
          ? rpcReuqest
          : storageListener
              .merge(
                this._destroy.map(() => {
                  /**
                   * Cheating here and throwing an error when destroyed is called so we
                   * close the promise and thus the listener
                   */
                  throw new Error('destroyed connection');
                })
              )
              .filter(() => {
                return store.permissionsStore.domainHasPermissions(
                  domainMetadata.method
                );
              })
              .peek(() =>
                formatAndLog('Permission request, granted', rpcReuqest)
              )
              .map(() => rpcReuqest)
              .promisify();
      });
  }

  async validateMethodPermissions(rpcReuqest: JsonRpcRequest<any>) {
    return this.methodsRequiringPermissions.has(rpcReuqest.method)
      ? this.permissionGranted(rpcReuqest)
      : Promise.resolve(rpcReuqest);
  }
}

export function watchForDomainAndDispatch(rpcReuqest: JsonRpcRequest<any>) {
  if (rpcReuqest && rpcReuqest.method === DOMAIN_METADATA_METHOD) {
    domainMetadataSignal.dispatch(rpcReuqest.params.name);
  }
}
