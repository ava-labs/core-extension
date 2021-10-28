import {
  ERC20WithBalance,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';

export function getTokenKey(token: TokenWithBalance) {
  return `${token.name}-${token.symbol}-${
    (token as ERC20WithBalance).address ?? ''
  }`;
}
