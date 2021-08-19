import { Duplex } from 'stream';
import providerHandlers from './providerHandlers';
import web3Handlers from './web3Handlers';
import { JsonRpcRequest } from '../../../utils/jsonRpcEngine';
import { resolve } from '../../../utils/promiseResolver';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';
import { ProviderRequest } from '../models';
import { formatAndLog } from '../../../utils/logging';

/**
 * This is the core of the background logic. Every provider request comes in through the WalletControllerStream
 * _write method. That method then offloads the handling to the ProviderController. The result is then
 * piped back down into the stream and sent out to its respective client.
 */
export class ProviderController {
  /**
   * Check if a handler exists, make sure it only exists in one handler provider.
   * @param data
   * @returns
   */
  private getRequestHandler(data: JsonRpcRequest<any>) {
    const providerHandler = providerHandlers.getHandlerForKey(data);
    const web3Handler = web3Handlers.getHandlerForKey(data);
    if (!providerHandler && !web3Handler) {
      return () =>
        Promise.reject(`the rpc method ${data.method} is not supported`);
    } else if (providerHandler && web3Handler) {
      return () =>
        Promise.reject(
          `the rpc method ${data.method} is supported by multiple handlers`
        );
    } else {
      return providerHandler || web3Handler;
    }
  }

  async mapChunkToHandler(request) {
    const handler = this.getRequestHandler(request.data);
    const [result, err] = await resolve(handler(request.data));

    return result
      ? { ...request, data: result }
      : { ...request, data: { ...request.data, error: err } };
  }
}
export function createWalletControllerStream() {
  const controller = new ProviderController();
  const domain = new BehaviorSubject('');

  const subscription = domain
    .pipe(filter((domain) => !!domain))
    .subscribe((domain) => {
      formatAndLog('domain added to connection', domain);
    });

  return new Duplex({
    objectMode: true,
    write(chunk, _encoding, cb) {
      if (chunk.data.method === ProviderRequest.DOMAIN_METADATA_METHOD) {
        domain.next(chunk.data.params.name);
      }

      firstValueFrom(domain.pipe(filter((domain) => !!domain)))
        .then((domain) => {
          return {
            ...chunk,
            data: {
              ...chunk.data,
              domain,
            },
          };
        })
        .then((rpcRequestWithDomain) =>
          controller.mapChunkToHandler(rpcRequestWithDomain)
        )
        .then((result) => {
          this.push(result);
        });

      cb();
    },
    read() {
      return;
    },
    destroy() {
      subscription.unsubscribe();
    },
  });
}
