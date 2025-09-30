import {
  Erc1155Token,
  Erc721Token,
  Glacier,
  Network,
} from '@avalabs/glacier-sdk';
import { singleton } from 'tsyringe';
import { wait } from '@avalabs/core-utils-sdk';

import { CommonError } from '@core/types';

import { HEADERS } from './glacierConfig';

@singleton()
export class GlacierService {
  private glacierSdkInstance = new Glacier({
    BASE: process.env.GLACIER_URL,
    HEADERS,
  });

  async getAddressEVMHistory(address: string) {
    return this.glacierSdkInstance.evmChains.listAddressChains({ address });
  }

  async getChainIdsForAddresses({
    addresses,
    network,
  }: {
    addresses: string[];
    network: Network;
  }) {
    return this.glacierSdkInstance.primaryNetwork.getChainIdsForAddresses({
      addresses: addresses.join(','),
      network,
    });
  }

  async refreshNftMetadata(address: string, chainId: string, tokenId: string) {
    const requestTimestamp = Math.floor(Date.now() / 1000);
    const maxAttempts = 10; // Amount of fetches after which we give up.

    await this.glacierSdkInstance.nfTs.reindexNft({
      address,
      chainId,
      tokenId,
    });

    let token: Erc721Token | Erc1155Token | null = null;
    let fetchCount = 0;
    let shouldPoll = true;

    do {
      await wait(2000); // Wait 2 seconds before trying to fetch refreshed data.
      fetchCount += 1;

      token = await this.glacierSdkInstance.nfTs.getTokenDetails({
        address,
        chainId,
        tokenId,
      });

      // Glacier is supposed to update "metadataLastUpdatedTimestamp" field even
      // if re-indexing fails for whatever reason, so if it is undefined, the NFT
      // was likely never indexed before. After a successful indexing, the field
      // should be populated.
      shouldPoll =
        typeof token.metadata.metadataLastUpdatedTimestamp === 'undefined' ||
        token.metadata.metadataLastUpdatedTimestamp < requestTimestamp;

      // If we reached max. attempts and NFT is still not updated,
      // throw a recognizable error.
      if (shouldPoll && fetchCount >= maxAttempts) {
        throw CommonError.RequestTimeout;
      }
    } while (shouldPoll);

    return token;
  }

  async getEvmChainsForAddress(address: string) {
    return this.glacierSdkInstance.evmChains.listAddressChains({
      address,
    });
  }
}
