import BN from 'bn.js';
import { NftTokenWithBalance } from '../../balances/models';
import { NFT, NFTData } from '../../balances/nft/models';

export function mapTokenFromNFT(
  nft: NFT,
  nftItem: NFTData
): NftTokenWithBalance {
  return {
    type: nft.type,
    address: nft.contractAddress,
    // balance is unused but included to conform to TokenBalanceData
    balance: new BN(0),
    decimals: 0,
    description: '',
    logoUri: nft.logoUrl,
    name: nft.contractName,
    symbol: nft.contractTickerSymbol,
    tokenId: nftItem.tokenId,
  };
}
