import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GlacierService } from '../../glacier/GlacierService';
import { RefreshNftMetadataHandler } from './refreshNftMetadata';

describe('background/services/balances/handlers/refreshNftMetadata.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls .refreshNftMetadata() proper params and returns the result', async () => {
    const glacierService = jest.mocked<GlacierService>({
      refreshNftMetadata: jest.fn().mockReturnValue({
        metadata: {
          metadataLastUpdatedTimestamp: 1234,
        },
      }),
    } as any);

    const handler = new RefreshNftMetadataHandler(glacierService);

    const { result } = await handler.handle({
      id: '123',
      method: ExtensionRequest.NFT_REFRESH_METADATA,
      params: ['address', 'chainId', 'tokenId'],
    });

    expect(glacierService.refreshNftMetadata).toHaveBeenCalledWith(
      'address',
      'chainId',
      'tokenId'
    );

    expect(result).toEqual({
      metadata: {
        metadataLastUpdatedTimestamp: 1234,
      },
    });
  });
});
