import type {
  NftTokenWithBalance,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import { TokenType } from '@avalabs/vm-module-types';

export function isNftTokenType(type: TokenType) {
  return type === TokenType.ERC721 || type === TokenType.ERC1155;
}

export function isNFT(token: TokenWithBalance): token is NftTokenWithBalance {
  return isNftTokenType(token.type);
}
