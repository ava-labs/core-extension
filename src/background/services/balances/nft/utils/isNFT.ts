import { TokenType as VMModulesTokenType } from '@avalabs/vm-module-types';

import { TokenType } from '../../models';

export function isNFT(tokenType: TokenType | VMModulesTokenType) {
  return tokenType === TokenType.ERC721 || tokenType === TokenType.ERC1155;
}
