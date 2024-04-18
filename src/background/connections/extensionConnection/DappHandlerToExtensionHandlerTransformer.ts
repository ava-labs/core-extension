import browser from 'webextension-polyfill';

import { resolve } from '@src/utils/promiseResolver';

import { JsonRpcRequest } from '../dAppConnection/models';
import { DAppRequestHandler } from '../dAppConnection/DAppRequestHandler';
import { ExtensionConnectionMessage, ExtensionRequestHandler } from '../models';

const decorateWithExtensionMetadata = (
  request: JsonRpcRequest
): ExtensionConnectionMessage => ({
  ...request,
  id: request.id ?? '',
  params: request.params ?? [],
  site: {
    domain: browser.runtime.id,
    tabId: request.tabId,
    icon: browser.runtime.getManifest().icons?.['192'],
    name: browser.runtime.getManifest().name,
  },
});

export class DappHandlerToExtensionHandlerTransformer {
  transform(
    handlers: DAppRequestHandler[]
  ): ExtensionRequestHandler<any, any, any, any>[] {
    return handlers.flatMap((handler) => {
      return handler.methods.map<ExtensionRequestHandler<any, any, any, any>>(
        (method) => ({
          method,
          handle: async (request: JsonRpcRequest) => {
            const extRequest = decorateWithExtensionMetadata(request);

            if (!extRequest.id) {
              return {
                ...extRequest,
                error: 'No request ID provided',
              };
            }

            const [result, error] = await resolve(
              handler.handleAuthenticated(extRequest) // Extension is always authenticated
            );

            if (error || 'error' in result) {
              return {
                ...extRequest,
                error: error ?? result.error,
              };
            }

            return {
              ...extRequest,
              result: result.result,
            };
          },
        })
      );
    });
  }
}
