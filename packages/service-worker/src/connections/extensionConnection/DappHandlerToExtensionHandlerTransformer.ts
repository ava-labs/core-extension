import browser from 'webextension-polyfill';

import { resolve } from '@core/utils';

import {
  DAppProviderRequest,
  JsonRpcRequestParams,
} from '@core/types/src/models';
import { DAppRequestHandler } from '../dAppConnection/DAppRequestHandler';
import { ExtensionRequestHandler } from '../models';

const decorateWithExtensionMetadata = (
  rpcCall: JsonRpcRequestParams<DAppProviderRequest, any>,
): JsonRpcRequestParams<DAppProviderRequest, any> => ({
  ...rpcCall,
  request: {
    ...rpcCall.request,
    params: rpcCall.request.params ?? [],
    site: {
      domain: browser.runtime.id,
      tabId: rpcCall.request.tabId,
      icon: browser.runtime.getManifest().icons?.['192'],
      name: browser.runtime.getManifest().name,
    },
  },
});

export class DappHandlerToExtensionHandlerTransformer {
  transform(
    handlers: DAppRequestHandler<any, any>[],
  ): ExtensionRequestHandler<any, any, any>[] {
    return handlers.flatMap((handler) => {
      return handler.methods.map<ExtensionRequestHandler<any, any, any>>(
        (method) => ({
          method,
          handle: async (
            rpcCall: JsonRpcRequestParams<DAppProviderRequest, any>,
          ) => {
            const extRequest = decorateWithExtensionMetadata(rpcCall);

            if (!extRequest.request.id) {
              return {
                ...extRequest.request,
                error: 'No request ID provided',
              };
            }

            const [result, error] = await resolve(
              handler.handleAuthenticated(extRequest), // Extension is always authenticated
            );

            if (error || 'error' in result) {
              return {
                ...extRequest.request,
                error: error ?? result.error,
              };
            }

            return {
              ...extRequest.request,
              result: result.result,
            };
          },
        }),
      );
    });
  }
}
