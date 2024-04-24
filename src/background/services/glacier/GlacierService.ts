import {
  BlockchainId,
  Erc1155Token,
  Erc721Token,
  Glacier,
  Network,
  PrimaryNetworkTxType,
  SortOrder,
} from '@avalabs/glacier-sdk';
import { singleton } from 'tsyringe';
import { resolve, wait } from '@avalabs/utils-sdk';

import { CommonError } from '@src/utils/errors';

@singleton()
export class GlacierService {
  private glacierSdkInstance = new Glacier({ BASE: process.env.GLACIER_URL });
  private isGlacierHealthy = true;
  private supportedNetworks: string[] = [];

  private async getSupportedNetworks() {
    if (this.supportedNetworks.length) {
      return this.supportedNetworks;
    }

    try {
      const supportedNetworks =
        await this.glacierSdkInstance.evmChains.supportedChains({});
      this.supportedNetworks = supportedNetworks.chains.map(
        (chain) => chain.chainId
      );

      return this.supportedNetworks;
    } catch {
      return [];
    }
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

  async isNetworkSupported(chainId: number) {
    if (!this.isGlacierHealthy) return this.isGlacierHealthy;
    const networks = await this.getSupportedNetworks();
    return networks.includes(chainId.toString());
  }

  constructor() {
    /**
     * This is for performance, basically we just cache the health of glacier every 5 seconds and
     * go off of that instead of every request
     */
    setInterval(async () => {
      const [healthStatus, healthStatusError] = await resolve(
        this.glacierSdkInstance.healthCheck.healthCheck()
      );

      if (healthStatusError) {
        this.isGlacierHealthy = false;
        return;
      }

      const status = healthStatus?.status?.toString();
      this.isGlacierHealthy = status === 'ok' ? true : false;
    }, 5000);

    this.getSupportedNetworks().catch(() => {
      // Noop. It will be retried by .isSupportedNetwork calls upon unlocking if necessary.
    });
  }

  async getChainBalance(params: {
    blockchainId: BlockchainId;
    network: Network;
    blockTimestamp?: number;
    addresses?: string;
  }) {
    return await this.glacierSdkInstance.primaryNetworkBalances.getBalancesByAddresses(
      params
    );
  }

  async listLatestPrimaryNetworkTransactions(params: {
    blockchainId: BlockchainId;
    network: Network;
    addresses?: string;
    txTypes?: Array<PrimaryNetworkTxType>;
    startTimestamp?: number;
    endTimestamp?: number;
    pageToken?: string;
    pageSize?: number;
    sortOrder?: SortOrder;
  }) {
    return await this.glacierSdkInstance.primaryNetworkTransactions.listLatestPrimaryNetworkTransactions(
      params
    );
  }
}
