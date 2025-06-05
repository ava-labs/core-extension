import browser from 'webextension-polyfill';

import { DAppRequestHandler, DEFERRED_RESPONSE } from '@core/types';

import { DappHandlerToExtensionHandlerTransformer } from './DappHandlerToExtensionHandlerTransformer';
import { buildRpcCall } from '@shared/tests/test-utils';

describe('src/background/connections/extensionConnection/DappHandlerToExtensionHandlerTransformer', () => {
  const transformer = new DappHandlerToExtensionHandlerTransformer();

  class MultipleMethodsHandler extends DAppRequestHandler {
    methods = ['method-1', 'method-2'] as any;

    handleAuthenticated = async (request) => {
      return {
        ...request,
      };
    };

    handleUnauthenticated = async (request) => {
      return {
        ...request,
      };
    };
  }

  class NoApprovalHandler extends DAppRequestHandler {
    methods = ['no-approval-needed'] as any;

    handleAuthenticated = async (request) => {
      return {
        ...request,
      };
    };

    handleUnauthenticated = async (request) => {
      return {
        ...request,
      };
    };
  }

  describe('when DAppRequestHandler has multiple methods configured', () => {
    it('is transformed to multiple ExtensionRequestHandlers, each handling one of the methods', () => {
      const originalHandler = new MultipleMethodsHandler();
      const handlers = transformer.transform([originalHandler]);

      expect(handlers.length).toEqual(2);
      expect(handlers[0]!.method).toEqual(originalHandler.methods[0]);
      expect(handlers[1]!.method).toEqual(originalHandler.methods[1]);
    });
  });

  describe('transformed handlers', () => {
    it('fail when no request id is provided', async () => {
      const originalHandler = new NoApprovalHandler();
      const [transformedHandler] = transformer.transform([originalHandler]);

      const request = {
        method: transformedHandler!.method,
        id: undefined,
      } as any;

      expect(await transformedHandler!.handle(buildRpcCall(request))).toEqual(
        expect.objectContaining({
          error: 'No request ID provided',
        }),
      );
    });

    it('fail when original handler throws', async () => {
      const originalHandler = new NoApprovalHandler();
      const [transformedHandler] = transformer.transform([originalHandler]);

      const error = new Error('Original handler thrown error');

      jest
        .spyOn(originalHandler, 'handleAuthenticated')
        .mockRejectedValue(error);

      const request = {
        method: transformedHandler!.method,
        id: 'some-id',
      } as any;

      expect(await transformedHandler!.handle(buildRpcCall(request))).toEqual(
        expect.objectContaining({
          error,
        }),
      );
    });

    it('fail when original handler returns an error', async () => {
      const originalHandler = new NoApprovalHandler();
      const [transformedHandler] = transformer.transform([originalHandler]);

      const error = 'Original handler returned an error';

      jest.spyOn(originalHandler, 'handleAuthenticated').mockResolvedValue({
        error,
      });

      const request = {
        method: transformedHandler!.method,
        id: 'some-id',
      } as any;

      expect(await transformedHandler!.handle(buildRpcCall(request))).toEqual(
        expect.objectContaining({
          error,
        }),
      );
    });

    it('decorate request with extension metadata and call the original .handleAuthenticated() method', async () => {
      const originalHandler = new NoApprovalHandler();
      const [transformedHandler] = transformer.transform([originalHandler]);

      jest.spyOn(originalHandler, 'handleAuthenticated');

      expect(transformedHandler!.method).toEqual(originalHandler.methods[0]);

      const request = {
        method: transformedHandler!.method,
        id: 'abcd-1234',
        params: [
          {
            chainId: 1337,
          },
        ],
      } as any;

      await transformedHandler?.handle(buildRpcCall(request));

      expect(originalHandler.handleAuthenticated).toHaveBeenCalledWith(
        expect.objectContaining({
          request: {
            ...request,
            site: {
              domain: browser.runtime.id,
              tabId: request.tabId,
              icon: browser.runtime.getManifest().icons?.['192'],
              name: browser.runtime.getManifest().name,
            },
          },
        }),
      );
    });

    it('returns the result of the original handler', async () => {
      const originalHandler = new NoApprovalHandler();
      const [transformedHandler] = transformer.transform([originalHandler]);

      const result = 'original result';

      jest.spyOn(originalHandler, 'handleAuthenticated').mockResolvedValue({
        result,
      });

      const request = {
        method: transformedHandler!.method,
        id: 'some-id',
      } as any;

      expect(await transformedHandler!.handle(buildRpcCall(request))).toEqual(
        expect.objectContaining({
          result,
        }),
      );
    });

    it('works with handlers requiring user approval', async () => {
      class ApprovalRequiredHandler extends DAppRequestHandler {
        methods = ['approval-required'] as any;

        handleAuthenticated = async (request) => {
          return {
            ...request,
          };
        };

        handleUnauthenticated = async (request) => {
          return {
            ...request,
          };
        };

        onActionApproved = async () => {};
      }

      const originalHandler = new ApprovalRequiredHandler();
      const [transformedHandler] = transformer.transform([originalHandler]);

      jest.spyOn(originalHandler, 'handleAuthenticated').mockResolvedValue({
        result: DEFERRED_RESPONSE,
      });

      const request = {
        method: transformedHandler!.method,
        id: 'some-id',
      } as any;

      expect(await transformedHandler!.handle(buildRpcCall(request))).toEqual(
        expect.objectContaining({
          result: DEFERRED_RESPONSE,
        }),
      );
    });
  });
});
