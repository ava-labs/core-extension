import { Network } from '@avalabs/chains-sdk';

export interface NFTService {
  isAggregatorForChain(chainId: number): boolean;
  getNFTBalances(address: string, network: Network): Promise<NFT[]>;
}

export interface NFTAttribute {
  name: string;
  value: string;
}

export interface NFTData {
  tokenId: string;
  tokenBalance: null | string;
  tokenUrl: null | string;
  originalOwner: string;
  externalData: {
    name: string;
    description: string;
    image: string;
    imageSmall?: string;
    animationUrl: string | null;
    externalUrl: string | null;
    attributes: NFTAttribute[];
    owner: string | null;
  } | null;
  owner: string;
}

export interface NFT {
  contractName: string;
  contractTickerSymbol: string;
  contractAddress: string;
  logoUrl: string;
  lastTransferredAt: string;
  balance: string;
  nftData: NFTData[];
}
