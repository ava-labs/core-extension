import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AvalancheSendDomainMetadataHandler } from './avalanche_sendDomainMetadata';

describe('background/services/web3/handlers/avalanche_sendDomainMetadata.ts', () => {
  it('returns the params as result', async () => {
    const handler = new AvalancheSendDomainMetadataHandler();

    const mockRequest = {
      id: 1234,
      method: DAppProviderRequest.DOMAIN_METADATA_METHOD,
      params: [{ domain: 'site.example' }],
    };

    expect(await handler.handleAuthenticated(mockRequest)).toEqual({
      ...mockRequest,
      result: [{ domain: 'site.example' }],
    });

    expect(await handler.handleUnauthenticated(mockRequest)).toEqual({
      ...mockRequest,
      result: [{ domain: 'site.example' }],
    });
  });
});
