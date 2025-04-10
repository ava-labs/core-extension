import { DAppProviderRequest } from 'packages/service-worker/src/connections/dAppConnection/models';
import { AvalancheSendDomainMetadataHandler } from './avalanche_sendDomainMetadata';
import { buildRpcCall } from '@src/tests/test-utils';

describe('background/services/web3/handlers/avalanche_sendDomainMetadata.ts', () => {
  it('returns the params as result', async () => {
    const handler = new AvalancheSendDomainMetadataHandler();

    const mockRequest = {
      id: '1234',
      method: DAppProviderRequest.DOMAIN_METADATA_METHOD,
      params: [{ domain: 'site.example' }],
    };

    expect(
      await handler.handleAuthenticated(buildRpcCall(mockRequest)),
    ).toEqual({
      ...mockRequest,
      result: [{ domain: 'site.example' }],
    });

    expect(
      await handler.handleUnauthenticated(buildRpcCall(mockRequest)),
    ).toEqual({
      ...mockRequest,
      result: [{ domain: 'site.example' }],
    });
  });
});
