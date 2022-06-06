import { TokenIcon as TokenImage } from '@src/components/common/TokenImage';
import { stringToBN } from '@avalabs/avalanche-wallet-sdk';
import { APIError } from 'paraswap';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';

interface GetTokenIconProps {
  token?: TokenWithBalance;
}

export const TokenIcon = ({ token }: GetTokenIconProps) => {
  if (!token) {
    return null;
  }
  return (
    <TokenImage
      width="32px"
      height="32px"
      src={token.logoUri}
      name={token.name}
    />
  );
};

export const getTokenIcon = (token: TokenWithBalance) => {
  if (!token) {
    return null;
  }

  return (
    <TokenImage
      width="32px"
      height="32px"
      src={token.logoUri}
      name={token.name}
    />
  );
};

export const getMaxValue = (token?: TokenWithBalance, fee?: string) => {
  if (!token || !fee) {
    return;
  }

  if (token.type === TokenType.NATIVE) {
    return token.balance.sub(stringToBN(fee, 18));
  }
  return token.balance;
};

export function isAPIError(rate: any): rate is APIError {
  return typeof rate.message === 'string';
}

export const getTokenAddress = (token?: TokenWithBalance) => {
  if (!token) {
    return undefined;
  }
  return token.type === TokenType.NATIVE ? token.symbol : token.address;
};
