import {
  ExtensionRequest,
} from '@core/types';
import { GlacierService } from '@/services/glacier/GlacierService';
import { RefreshNftMetadataHandler } from './refreshNftMetadata';
import { buildRpcCall } from '@shared/tests/test-utils';

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

    const { result } = await handler.handle(
      buildRpcCall({
        id: '123',
        method: ExtensionRequest.NFT_REFRESH_METADATA,
        params: ['address', 'chainId', 'tokenId'],
      }),
    );

    expect(glacierService.refreshNftMetadata).toHaveBeenCalledWith(
      'address',
      'chainId',
      'tokenId',
    );

    expect(result).toEqual({
      metadata: {
        metadataLastUpdatedTimestamp: 1234,
      },
    });
  });
});
