import type {
  Erc1155TokenBalance,
  ListErc1155BalancesResponse,
} from '@avalabs/glacier-sdk';
import { Erc721TokenBalance } from '@avalabs/glacier-sdk';

export function is1155Response(
  item,
): item is PromiseFulfilledResult<ListErc1155BalancesResponse> {
  return Object.keys(item.value).includes('erc1155TokenBalances');
}

export function isErc721TokenBalance(
  token: Erc721TokenBalance | Erc1155TokenBalance,
): token is Erc721TokenBalance {
  return token.ercType === Erc721TokenBalance.ercType.ERC_721;
}
