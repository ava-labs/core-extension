import BN from 'bn.js';
import { TokenType, TokenWithBalanceERC721 } from '../../balances/models';
import { NFT, NFTData } from '../../balances/nft/models';

export function mapTokenFromNFT(
  nft: NFT,
  nftItem: NFTData
): TokenWithBalanceERC721 {
  return {
    type: TokenType.ERC721,
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
