import { ChainId, Network } from '@avalabs/chains-sdk';
import { Covalent, GetAddressBalanceV2Item } from '@avalabs/covalent-sdk';
import { singleton } from 'tsyringe';
import { NFT, NFTAggregatorService } from './models';
import {
  convertIPFSResolver,
  getSmallImageForNFT,
} from './utils/convertIPFSResolver';

@singleton()
export class CovalentNFTService implements NFTAggregatorService {
  private key = process.env.COVALENT_API_KEY;
  isAggregatorForChain(chainId: number) {
    return [
      ChainId.AVALANCHE_MAINNET_ID,
      ChainId.AVALANCHE_TESTNET_ID,
    ].includes(chainId);
  }

  async getNFTBalances(address: string, network: Network): Promise<NFT[]> {
    const balances = await new Covalent(
      network.chainId,
      this.key
    ).getAddressBalancesV2(address, true);

    return balances.data.items.reduce((agg: NFT[], data) => {
      return data.type !== 'nft'
        ? agg
        : [...agg, this.mapCovalentNFTData(data)];
    }, []);
  }

  private mapCovalentNFTData(item: GetAddressBalanceV2Item): NFT {
    return {
      contractName: item.contract_name,
      contractTickerSymbol: item.contract_ticker_symbol,
      contractAddress: item.contract_address,
      logoUrl: item.logo_url,
      lastTransferredAt: item.last_transferred_at || '',
      balance: item.balance,
      nftData:
        item.nft_data?.map((nft) => ({
          tokenId: nft.token_id,
          tokenBalance: nft.token_balance,
          tokenUrl: nft.token_url,
          originalOwner: nft.token_url || '',
          externalData: nft.external_data && {
            name: nft.external_data.name,
            description: nft.external_data.description,
            image: convertIPFSResolver(nft.external_data.image),
            imageSmall: getSmallImageForNFT(nft.external_data.image),
            animationUrl: nft.external_data.animation_url,
            externalUrl: nft.external_data.external_url,
            owner: nft.external_data.owner,
            attributes: nft.external_data.attributes?.map((attr) => ({
              name: attr.trait_type,
              value: attr.value,
            })),
          },
          owner: nft.owner,
        })) || [],
    };
  }
}
