import { TokenType } from '../../models';

export function isNFT(tokenType: TokenType) {
  return tokenType === TokenType.ERC721 || tokenType === TokenType.ERC1155;
}
