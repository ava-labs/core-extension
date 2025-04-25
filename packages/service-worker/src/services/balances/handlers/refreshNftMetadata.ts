import { injectable } from 'tsyringe';

import { Erc1155Token, Erc721Token } from '@avalabs/glacier-sdk';
import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { GlacierService } from '@/services/glacier/GlacierService';

export type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NFT_REFRESH_METADATA,
  Erc721Token | Erc1155Token,
  [address: string, chainId: string, tokenId: string]
>;

@injectable()
export class RefreshNftMetadataHandler implements HandlerType {
  method = ExtensionRequest.NFT_REFRESH_METADATA as const;

  constructor(private glacierService: GlacierService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [address, chainId, tokenId] = request.params;

    try {
      const token = await this.glacierService.refreshNftMetadata(
        address,
        chainId,
        tokenId,
      );

      return {
        ...request,
        result: token,
      };
    } catch (error: any) {
      return {
        ...request,
        error: error instanceof Error ? error.message : error.toString(),
      };
    }
  };
}
