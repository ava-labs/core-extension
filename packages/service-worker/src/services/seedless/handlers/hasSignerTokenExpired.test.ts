import { ExtensionRequest } from '@core/types/src/models';
import { HasSignerTokenExpiredHandler } from './hasSignerTokenExpired';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/seedless/handlers/hasSignerTokenExpired', () => {
  it('returns true when token is stale', async () => {
    const handler = new HasSignerTokenExpiredHandler({
      hasTokenExpired: true,
    } as any);

    expect(
      await handler.handle(
        buildRpcCall({
          method: ExtensionRequest.SEEDLESS_HAS_TOKEN_EXPIRED,
          id: 'abcd-1234',
        }),
      ),
    ).toEqual(
      expect.objectContaining({
        result: true,
      }),
    );
  });

  it('returns false when token is fresh', async () => {
    const handler = new HasSignerTokenExpiredHandler({
      hasTokenExpired: false,
    } as any);

    expect(
      await handler.handle(
        buildRpcCall({
          method: ExtensionRequest.SEEDLESS_HAS_TOKEN_EXPIRED,
          id: 'abcd-1234',
        }),
      ),
    ).toEqual(
      expect.objectContaining({
        result: false,
      }),
    );
  });
});
