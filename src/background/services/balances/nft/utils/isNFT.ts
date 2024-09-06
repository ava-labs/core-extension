import {
  TokenType,
  TokenType as VMModulesTokenType,
} from '@avalabs/vm-module-types';

export function isNFT(tokenType: TokenType | VMModulesTokenType) {
  return tokenType === TokenType.ERC721 || tokenType === TokenType.ERC1155;
}
